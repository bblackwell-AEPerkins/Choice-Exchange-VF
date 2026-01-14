
-- Create ICHRA enrollment status enum
CREATE TYPE public.ichra_enrollment_status AS ENUM (
  'not_started',
  'in_progress', 
  'enrolled',
  'waived',
  'pending_verification'
);

-- Create employers table for ICHRA offers
CREATE TABLE public.employers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email_domain TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ICHRA offers table
CREATE TABLE public.ichra_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID NOT NULL REFERENCES public.employers(id) ON DELETE CASCADE,
  monthly_allowance NUMERIC NOT NULL,
  effective_date DATE NOT NULL,
  enrollment_start_date DATE NOT NULL,
  enrollment_end_date DATE NOT NULL,
  plan_year_start DATE NOT NULL,
  plan_year_end DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ICHRA plans catalog (mock data, real data from API based on zip)
CREATE TABLE public.ichra_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  carrier_name TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  plan_type TEXT NOT NULL, -- HMO, PPO, EPO, HDHP
  metal_tier TEXT NOT NULL, -- Bronze, Silver, Gold, Platinum
  monthly_premium NUMERIC NOT NULL,
  deductible NUMERIC NOT NULL,
  out_of_pocket_max NUMERIC NOT NULL,
  copay_primary NUMERIC,
  copay_specialist NUMERIC,
  copay_emergency NUMERIC,
  coverage_areas TEXT[] NOT NULL, -- zip code prefixes this plan covers
  features TEXT[],
  is_hsa_eligible BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ICHRA enrollments table
CREATE TABLE public.ichra_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  individual_id UUID NOT NULL REFERENCES public.individuals(id) ON DELETE CASCADE,
  ichra_offer_id UUID NOT NULL REFERENCES public.ichra_offers(id) ON DELETE CASCADE,
  status public.ichra_enrollment_status NOT NULL DEFAULT 'not_started',
  selected_plan_id UUID REFERENCES public.ichra_plans(id),
  -- Plan details form fields (for when plan comes from external source)
  external_carrier_name TEXT,
  external_plan_name TEXT,
  external_plan_type TEXT,
  external_monthly_premium NUMERIC,
  external_policy_number TEXT,
  external_effective_date DATE,
  coverage_zip_code TEXT,
  -- Waiver fields
  waiver_reason TEXT,
  waiver_date TIMESTAMP WITH TIME ZONE,
  -- Attestation
  attested_at TIMESTAMP WITH TIME ZONE,
  attested_accurate BOOLEAN DEFAULT false,
  -- Timestamps
  enrollment_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(individual_id, ichra_offer_id)
);

-- Enable RLS on all tables
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ichra_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ichra_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ichra_enrollments ENABLE ROW LEVEL SECURITY;

-- Employers policies (read-only for authenticated users)
CREATE POLICY "Anyone can view active employers"
  ON public.employers FOR SELECT
  USING (is_active = true);

-- ICHRA offers policies
CREATE POLICY "Users can view offers for their employer"
  ON public.ichra_offers FOR SELECT
  USING (is_active = true);

-- ICHRA plans policies (anyone can view active plans)
CREATE POLICY "Anyone can view active plans"
  ON public.ichra_plans FOR SELECT
  USING (is_active = true);

-- ICHRA enrollments policies
CREATE POLICY "Users can view own enrollments"
  ON public.ichra_enrollments FOR SELECT
  USING (individual_id IN (
    SELECT id FROM public.individuals WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own enrollments"
  ON public.ichra_enrollments FOR INSERT
  WITH CHECK (individual_id IN (
    SELECT id FROM public.individuals WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own enrollments"
  ON public.ichra_enrollments FOR UPDATE
  USING (individual_id IN (
    SELECT id FROM public.individuals WHERE user_id = auth.uid()
  ));

-- Create triggers for updated_at
CREATE TRIGGER update_employers_updated_at
  BEFORE UPDATE ON public.employers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ichra_offers_updated_at
  BEFORE UPDATE ON public.ichra_offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ichra_enrollments_updated_at
  BEFORE UPDATE ON public.ichra_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed sample employers
INSERT INTO public.employers (name, email_domain) VALUES
  ('Acme Corporation', 'acme.com'),
  ('TechStart Inc', 'techstart.io'),
  ('Global Solutions', 'globalsolutions.com');

-- Seed sample ICHRA offers
INSERT INTO public.ichra_offers (employer_id, monthly_allowance, effective_date, enrollment_start_date, enrollment_end_date, plan_year_start, plan_year_end)
SELECT 
  id,
  500.00,
  '2025-02-01',
  '2025-01-01',
  '2025-01-31',
  '2025-02-01',
  '2026-01-31'
FROM public.employers WHERE email_domain = 'acme.com';

INSERT INTO public.ichra_offers (employer_id, monthly_allowance, effective_date, enrollment_start_date, enrollment_end_date, plan_year_start, plan_year_end)
SELECT 
  id,
  650.00,
  '2025-02-01',
  '2025-01-01',
  '2025-01-31',
  '2025-02-01',
  '2026-01-31'
FROM public.employers WHERE email_domain = 'techstart.io';

-- Seed sample ICHRA plans (coverage_areas are zip prefixes)
INSERT INTO public.ichra_plans (carrier_name, plan_name, plan_type, metal_tier, monthly_premium, deductible, out_of_pocket_max, copay_primary, copay_specialist, copay_emergency, coverage_areas, features, is_hsa_eligible) VALUES
  ('Blue Cross Blue Shield', 'Blue Essentials Bronze', 'HMO', 'Bronze', 285.00, 7000, 8700, 40, 80, 350, ARRAY['100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130'], ARRAY['Preventive care covered 100%', 'Telemedicine included', 'Prescription drug coverage'], false),
  ('Blue Cross Blue Shield', 'Blue Choice Silver', 'PPO', 'Silver', 425.00, 4500, 7500, 30, 60, 300, ARRAY['100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130'], ARRAY['Preventive care covered 100%', 'Out-of-network coverage', 'Telemedicine included', 'Prescription drug coverage'], false),
  ('Blue Cross Blue Shield', 'Blue Premier Gold', 'PPO', 'Gold', 585.00, 2000, 6000, 20, 40, 250, ARRAY['100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130'], ARRAY['Preventive care covered 100%', 'Out-of-network coverage', 'Telemedicine included', 'Prescription drug coverage', 'Vision included'], false),
  ('Aetna', 'Aetna Bronze HDHP', 'HDHP', 'Bronze', 265.00, 7500, 8550, 0, 0, 0, ARRAY['100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '200', '201', '202', '203', '204', '205', '206', '207', '208', '209', '210'], ARRAY['HSA eligible', 'Preventive care covered 100%', 'Telemedicine included'], true),
  ('Aetna', 'Aetna Silver Select', 'EPO', 'Silver', 395.00, 5000, 7000, 35, 70, 325, ARRAY['100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '200', '201', '202', '203', '204', '205', '206', '207', '208', '209', '210'], ARRAY['Preventive care covered 100%', 'Telemedicine included', 'Prescription drug coverage'], false),
  ('Aetna', 'Aetna Gold Complete', 'PPO', 'Gold', 545.00, 2500, 5500, 25, 50, 275, ARRAY['100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '200', '201', '202', '203', '204', '205', '206', '207', '208', '209', '210'], ARRAY['Preventive care covered 100%', 'Out-of-network coverage', 'Telemedicine included', 'Prescription drug coverage'], false),
  ('UnitedHealthcare', 'UHC Bronze Basic', 'HMO', 'Bronze', 275.00, 7200, 8500, 45, 85, 375, ARRAY['300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330'], ARRAY['Preventive care covered 100%', 'Telemedicine included'], false),
  ('UnitedHealthcare', 'UHC Silver Plus', 'PPO', 'Silver', 445.00, 4000, 7000, 30, 55, 300, ARRAY['300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330'], ARRAY['Preventive care covered 100%', 'Out-of-network coverage', 'Telemedicine included', 'Prescription drug coverage'], false),
  ('UnitedHealthcare', 'UHC Gold Premium', 'PPO', 'Gold', 595.00, 1500, 5000, 15, 35, 200, ARRAY['300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330'], ARRAY['Preventive care covered 100%', 'Out-of-network coverage', 'Telemedicine included', 'Prescription drug coverage', 'Vision included', 'Dental included'], false),
  ('Cigna', 'Cigna Connect Bronze', 'EPO', 'Bronze', 295.00, 6800, 8200, 40, 75, 350, ARRAY['400', '401', '402', '403', '404', '405', '406', '407', '408', '409', '410', '411', '412', '413', '414', '415', '416', '417', '418', '419', '420', '100', '101', '102', '103', '104', '105'], ARRAY['Preventive care covered 100%', 'Telemedicine included', 'Prescription drug coverage'], false),
  ('Cigna', 'Cigna Silver Preferred', 'PPO', 'Silver', 435.00, 4200, 6800, 30, 60, 300, ARRAY['400', '401', '402', '403', '404', '405', '406', '407', '408', '409', '410', '411', '412', '413', '414', '415', '416', '417', '418', '419', '420', '100', '101', '102', '103', '104', '105'], ARRAY['Preventive care covered 100%', 'Out-of-network coverage', 'Telemedicine included', 'Prescription drug coverage'], false),
  ('Cigna', 'Cigna Gold Elite', 'PPO', 'Gold', 575.00, 2000, 5500, 20, 45, 250, ARRAY['400', '401', '402', '403', '404', '405', '406', '407', '408', '409', '410', '411', '412', '413', '414', '415', '416', '417', '418', '419', '420', '100', '101', '102', '103', '104', '105'], ARRAY['Preventive care covered 100%', 'Out-of-network coverage', 'Telemedicine included', 'Prescription drug coverage', 'Mental health coverage'], false);

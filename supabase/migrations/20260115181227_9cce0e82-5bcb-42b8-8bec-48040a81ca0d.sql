-- Add enrollment_applications table for draft enrollments
CREATE TABLE public.enrollment_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  current_step text NOT NULL DEFAULT 'intent',
  confirmation_number text UNIQUE,
  
  -- Intent
  coverage_type text,
  coverage_for text,
  enrollment_reason text,
  
  -- Personal Info (from about)
  date_of_birth date,
  legal_sex text,
  ssn_encrypted text,
  citizenship text,
  address1 text,
  address2 text,
  city text,
  state text,
  zip_code text,
  
  -- Household
  marital_status text,
  employment_status text,
  employer_name text,
  estimated_income numeric,
  
  -- Coverage
  state_of_residence text,
  desired_start_date date,
  qualifying_event_type text,
  qualifying_event_date date,
  has_documentation boolean DEFAULT false,
  has_prior_coverage boolean DEFAULT false,
  prior_coverage_end_date date,
  tobacco_use boolean DEFAULT false,
  
  -- Plan Selection
  selected_plan_id uuid REFERENCES ichra_plans(id),
  monthly_premium numeric,
  employer_contribution numeric DEFAULT 0,
  
  -- Attestations
  attested_information_accurate boolean DEFAULT false,
  attested_electronic_consent boolean DEFAULT false,
  attested_hipaa_authorization boolean DEFAULT false,
  attested_at timestamptz,
  attestation_ip_address text,
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz
);

-- Enable RLS
ALTER TABLE public.enrollment_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for enrollment_applications
CREATE POLICY "Users can view own applications"
  ON public.enrollment_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON public.enrollment_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own draft applications"
  ON public.enrollment_applications FOR UPDATE
  USING (auth.uid() = user_id AND status = 'draft');

-- Add dependents table for enrollment
CREATE TABLE public.enrollment_dependents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES enrollment_applications(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  relationship text NOT NULL,
  ssn_encrypted text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on dependents
ALTER TABLE public.enrollment_dependents ENABLE ROW LEVEL SECURITY;

-- Dependents policies (access through application ownership)
CREATE POLICY "Users can view own application dependents"
  ON public.enrollment_dependents FOR SELECT
  USING (application_id IN (
    SELECT id FROM enrollment_applications WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert dependents for own applications"
  ON public.enrollment_dependents FOR INSERT
  WITH CHECK (application_id IN (
    SELECT id FROM enrollment_applications WHERE user_id = auth.uid() AND status = 'draft'
  ));

CREATE POLICY "Users can update own dependents"
  ON public.enrollment_dependents FOR UPDATE
  USING (application_id IN (
    SELECT id FROM enrollment_applications WHERE user_id = auth.uid() AND status = 'draft'
  ));

CREATE POLICY "Users can delete own dependents"
  ON public.enrollment_dependents FOR DELETE
  USING (application_id IN (
    SELECT id FROM enrollment_applications WHERE user_id = auth.uid() AND status = 'draft'
  ));

-- Add trigger for updated_at
CREATE TRIGGER update_enrollment_applications_updated_at
  BEFORE UPDATE ON public.enrollment_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add INSERT policy for individuals table (needed to create user record)
CREATE POLICY "Users can insert own individual record"
  ON public.individuals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add UPDATE policy for individuals table
CREATE POLICY "Users can update own individual record"
  ON public.individuals FOR UPDATE
  USING (auth.uid() = user_id);

-- Add INSERT policy for addresses table
CREATE POLICY "Users can insert own addresses"
  ON public.addresses FOR INSERT
  WITH CHECK (individual_id IN (
    SELECT id FROM individuals WHERE user_id = auth.uid()
  ));

-- Add UPDATE policy for addresses table  
CREATE POLICY "Users can update own addresses"
  ON public.addresses FOR UPDATE
  USING (individual_id IN (
    SELECT id FROM individuals WHERE user_id = auth.uid()
  ));

-- Add INSERT policy for coverage_enrollments
CREATE POLICY "Users can insert own coverage enrollments"
  ON public.coverage_enrollments FOR INSERT
  WITH CHECK (individual_id IN (
    SELECT id FROM individuals WHERE user_id = auth.uid()
  ));

-- Add UPDATE policy for coverage_enrollments
CREATE POLICY "Users can update own coverage enrollments"
  ON public.coverage_enrollments FOR UPDATE
  USING (individual_id IN (
    SELECT id FROM individuals WHERE user_id = auth.uid()
  ));

-- Add INSERT policy for households
CREATE POLICY "Users can insert own household"
  ON public.households FOR INSERT
  WITH CHECK (primary_individual_id IN (
    SELECT id FROM individuals WHERE user_id = auth.uid()
  ));

-- Add UPDATE policy for households
CREATE POLICY "Users can update own household"
  ON public.households FOR UPDATE
  USING (primary_individual_id IN (
    SELECT id FROM individuals WHERE user_id = auth.uid()
  ));

-- Add INSERT policy for household_members
CREATE POLICY "Users can insert own household members"
  ON public.household_members FOR INSERT
  WITH CHECK (household_id IN (
    SELECT h.id FROM households h
    JOIN individuals i ON i.id = h.primary_individual_id
    WHERE i.user_id = auth.uid()
  ));

-- Add UPDATE policy for household_members
CREATE POLICY "Users can update own household members"
  ON public.household_members FOR UPDATE
  USING (household_id IN (
    SELECT h.id FROM households h
    JOIN individuals i ON i.id = h.primary_individual_id
    WHERE i.user_id = auth.uid()
  ));

-- Add DELETE policy for household_members
CREATE POLICY "Users can delete own household members"
  ON public.household_members FOR DELETE
  USING (household_id IN (
    SELECT h.id FROM households h
    JOIN individuals i ON i.id = h.primary_individual_id
    WHERE i.user_id = auth.uid()
  ));
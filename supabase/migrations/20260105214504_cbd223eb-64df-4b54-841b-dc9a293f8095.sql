-- Create enums
CREATE TYPE public.gender_type AS ENUM ('M', 'F', 'U');
CREATE TYPE public.relationship_type AS ENUM ('Self', 'SP', 'DEP');
CREATE TYPE public.contact_method_type AS ENUM ('Phone', 'Email');
CREATE TYPE public.enrollment_status AS ENUM ('Active', 'Terminated', 'Pending', 'COBRA');
CREATE TYPE public.maintenance_action AS ENUM ('New', 'Change', 'Termination', 'Reinstatement');

-- Create profiles table (links auth.users to the system)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Individual table
CREATE TABLE public.individuals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL UNIQUE,
  external_member_id TEXT NOT NULL,
  member_ssn TEXT,
  first_name TEXT NOT NULL,
  middle_initial TEXT,
  last_name TEXT NOT NULL,
  gender gender_type NOT NULL,
  date_of_birth DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Household table
CREATE TABLE public.households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_individual_id UUID REFERENCES public.individuals(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create HouseholdMember join table
CREATE TABLE public.household_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES public.households(id) ON DELETE CASCADE NOT NULL,
  individual_id UUID REFERENCES public.individuals(id) ON DELETE CASCADE NOT NULL,
  relationship_to_primary relationship_type NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(household_id, individual_id)
);

-- Create Address table
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  individual_id UUID REFERENCES public.individuals(id) ON DELETE CASCADE NOT NULL,
  address1 TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_primary_address BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create ContactMethod table
CREATE TABLE public.contact_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  individual_id UUID REFERENCES public.individuals(id) ON DELETE CASCADE NOT NULL,
  type contact_method_type NOT NULL,
  value TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create CoverageEnrollment table
CREATE TABLE public.coverage_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  individual_id UUID REFERENCES public.individuals(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL,
  plan_name TEXT,
  effective_date DATE NOT NULL,
  termination_date DATE,
  status enrollment_status NOT NULL DEFAULT 'Pending',
  maintenance_action maintenance_action NOT NULL DEFAULT 'New',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.individuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coverage_enrollments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Individuals policies (users can only see their own record and household members)
CREATE POLICY "Users can view own individual record" ON public.individuals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view household members" ON public.individuals
  FOR SELECT USING (
    id IN (
      SELECT hm.individual_id FROM public.household_members hm
      JOIN public.households h ON h.id = hm.household_id
      WHERE h.primary_individual_id IN (
        SELECT id FROM public.individuals WHERE user_id = auth.uid()
      )
    )
  );

-- Households policies
CREATE POLICY "Users can view own household" ON public.households
  FOR SELECT USING (
    primary_individual_id IN (
      SELECT id FROM public.individuals WHERE user_id = auth.uid()
    )
  );

-- Household members policies
CREATE POLICY "Users can view own household members" ON public.household_members
  FOR SELECT USING (
    household_id IN (
      SELECT h.id FROM public.households h
      JOIN public.individuals i ON i.id = h.primary_individual_id
      WHERE i.user_id = auth.uid()
    )
  );

-- Addresses policies
CREATE POLICY "Users can view own addresses" ON public.addresses
  FOR SELECT USING (
    individual_id IN (
      SELECT id FROM public.individuals WHERE user_id = auth.uid()
    ) OR individual_id IN (
      SELECT hm.individual_id FROM public.household_members hm
      JOIN public.households h ON h.id = hm.household_id
      JOIN public.individuals i ON i.id = h.primary_individual_id
      WHERE i.user_id = auth.uid()
    )
  );

-- Contact methods policies
CREATE POLICY "Users can view own contact methods" ON public.contact_methods
  FOR SELECT USING (
    individual_id IN (
      SELECT id FROM public.individuals WHERE user_id = auth.uid()
    ) OR individual_id IN (
      SELECT hm.individual_id FROM public.household_members hm
      JOIN public.households h ON h.id = hm.household_id
      JOIN public.individuals i ON i.id = h.primary_individual_id
      WHERE i.user_id = auth.uid()
    )
  );

-- Coverage enrollments policies
CREATE POLICY "Users can view own enrollments" ON public.coverage_enrollments
  FOR SELECT USING (
    individual_id IN (
      SELECT id FROM public.individuals WHERE user_id = auth.uid()
    ) OR individual_id IN (
      SELECT hm.individual_id FROM public.household_members hm
      JOIN public.households h ON h.id = hm.household_id
      JOIN public.individuals i ON i.id = h.primary_individual_id
      WHERE i.user_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_individuals_updated_at BEFORE UPDATE ON public.individuals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_households_updated_at BEFORE UPDATE ON public.households
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_methods_updated_at BEFORE UPDATE ON public.contact_methods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coverage_enrollments_updated_at BEFORE UPDATE ON public.coverage_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_individuals_user_id ON public.individuals(user_id);
CREATE INDEX idx_households_primary_individual ON public.households(primary_individual_id);
CREATE INDEX idx_household_members_household ON public.household_members(household_id);
CREATE INDEX idx_household_members_individual ON public.household_members(individual_id);
CREATE INDEX idx_addresses_individual ON public.addresses(individual_id);
CREATE INDEX idx_contact_methods_individual ON public.contact_methods(individual_id);
CREATE INDEX idx_coverage_enrollments_individual ON public.coverage_enrollments(individual_id);
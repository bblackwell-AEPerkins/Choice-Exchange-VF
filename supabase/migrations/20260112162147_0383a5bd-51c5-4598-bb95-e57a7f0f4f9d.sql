-- Create base events table - the foundation of all member activities
CREATE TABLE public.member_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  individual_id UUID NOT NULL,
  event_type TEXT NOT NULL, -- 'visit', 'prescription', 'appointment', 'lab_result', 'claim', 'note'
  event_category TEXT NOT NULL, -- 'medical', 'pharmacy', 'administrative', 'wellness'
  title TEXT NOT NULL,
  description TEXT,
  
  -- Event timing
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE, -- for appointments with duration
  
  -- Provider information
  provider_name TEXT,
  provider_specialty TEXT,
  facility_name TEXT,
  facility_address TEXT,
  
  -- Financial details
  billed_amount DECIMAL(10,2),
  allowed_amount DECIMAL(10,2),
  member_responsibility DECIMAL(10,2),
  plan_paid DECIMAL(10,2),
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'completed', -- 'scheduled', 'completed', 'cancelled', 'pending'
  
  -- Prescription-specific fields (nullable for non-prescription events)
  medication_name TEXT,
  dosage TEXT,
  quantity INTEGER,
  refills_remaining INTEGER,
  pharmacy_name TEXT,
  
  -- Appointment-specific fields
  appointment_type TEXT, -- 'in-person', 'telehealth', 'phone'
  confirmation_number TEXT,
  
  -- Notes and attachments
  notes TEXT,
  attachments JSONB DEFAULT '[]'::jsonb, -- array of file references
  
  -- Metadata
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT, -- 'daily', 'weekly', 'monthly', 'yearly'
  parent_event_id UUID REFERENCES public.member_events(id), -- for recurring events
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.member_events ENABLE ROW LEVEL SECURITY;

-- Users can view their own events
CREATE POLICY "Users can view own events" 
ON public.member_events 
FOR SELECT 
USING (
  individual_id IN (
    SELECT id FROM individuals WHERE user_id = auth.uid()
  ) OR 
  individual_id IN (
    SELECT hm.individual_id 
    FROM household_members hm
    JOIN households h ON h.id = hm.household_id
    JOIN individuals i ON i.id = h.primary_individual_id
    WHERE i.user_id = auth.uid()
  )
);

-- Users can insert their own events
CREATE POLICY "Users can insert own events" 
ON public.member_events 
FOR INSERT 
WITH CHECK (
  individual_id IN (
    SELECT id FROM individuals WHERE user_id = auth.uid()
  )
);

-- Users can update their own events
CREATE POLICY "Users can update own events" 
ON public.member_events 
FOR UPDATE 
USING (
  individual_id IN (
    SELECT id FROM individuals WHERE user_id = auth.uid()
  )
);

-- Create indexes for common queries
CREATE INDEX idx_member_events_individual ON public.member_events(individual_id);
CREATE INDEX idx_member_events_type ON public.member_events(event_type);
CREATE INDEX idx_member_events_date ON public.member_events(event_date DESC);
CREATE INDEX idx_member_events_status ON public.member_events(status);

-- Trigger for updated_at
CREATE TRIGGER update_member_events_updated_at
BEFORE UPDATE ON public.member_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
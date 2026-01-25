-- Create table for coach contact tracking
CREATE TABLE public.coach_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  school_name TEXT NOT NULL,
  coach_name TEXT NOT NULL,
  coach_title TEXT,
  email TEXT,
  phone TEXT,
  first_contact_date DATE,
  contact_type TEXT CHECK (contact_type IN ('email', 'phone', 'in_person', 'camp', 'other')),
  response_received BOOLEAN DEFAULT false,
  follow_up_date DATE,
  notes TEXT,
  status TEXT DEFAULT 'initial' CHECK (status IN ('initial', 'responded', 'in_conversation', 'visited', 'offer', 'committed', 'declined')),
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coach_contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own coach contacts"
ON public.coach_contacts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add coach contacts"
ON public.coach_contacts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coach contacts"
ON public.coach_contacts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own coach contacts"
ON public.coach_contacts FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_coach_contacts_updated_at
BEFORE UPDATE ON public.coach_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_coach_contacts_user_id ON public.coach_contacts(user_id);
CREATE INDEX idx_coach_contacts_status ON public.coach_contacts(status);
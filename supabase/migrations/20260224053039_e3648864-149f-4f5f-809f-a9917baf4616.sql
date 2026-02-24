
-- Create high_schools table for Georgia HS golf teams
CREATE TABLE public.high_schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text,
  state text NOT NULL DEFAULT 'GA',
  classification text NOT NULL,
  area_number integer,
  area_coordinator_name text,
  area_coordinator_school text,
  coach_name text,
  coach_email text,
  coach_phone text,
  has_boys_team boolean DEFAULT true,
  has_girls_team boolean DEFAULT true,
  website_url text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.high_schools ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
CREATE POLICY "Admins can view high schools" ON public.high_schools FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert high schools" ON public.high_schools FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update high schools" ON public.high_schools FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete high schools" ON public.high_schools FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Updated_at trigger
CREATE TRIGGER update_high_schools_updated_at BEFORE UPDATE ON public.high_schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

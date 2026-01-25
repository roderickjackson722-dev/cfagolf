-- Create table for user target school lists
CREATE TABLE public.target_schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  custom_school_name TEXT,
  category TEXT NOT NULL CHECK (category IN ('dream', 'target', 'safety')),
  notes TEXT,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.target_schools ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own target schools"
ON public.target_schools FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add target schools"
ON public.target_schools FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own target schools"
ON public.target_schools FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own target schools"
ON public.target_schools FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_target_schools_updated_at
BEFORE UPDATE ON public.target_schools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_target_schools_user_id ON public.target_schools(user_id);
CREATE INDEX idx_target_schools_category ON public.target_schools(category);
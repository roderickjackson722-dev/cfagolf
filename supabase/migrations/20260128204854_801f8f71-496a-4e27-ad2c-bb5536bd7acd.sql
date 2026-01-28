-- Create table for tracking meeting modules progress per user
CREATE TABLE public.meeting_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_number integer NOT NULL CHECK (module_number >= 0 AND module_number <= 10),
  module_title text NOT NULL,
  is_completed boolean DEFAULT false,
  completed_date timestamp with time zone,
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_number)
);

-- Enable RLS
ALTER TABLE public.meeting_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view own meeting progress"
ON public.meeting_progress
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all progress
CREATE POLICY "Admins can view all meeting progress"
ON public.meeting_progress
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can insert progress records
CREATE POLICY "Admins can insert meeting progress"
ON public.meeting_progress
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update progress records
CREATE POLICY "Admins can update meeting progress"
ON public.meeting_progress
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Admins can delete progress records
CREATE POLICY "Admins can delete meeting progress"
ON public.meeting_progress
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add updated_at trigger
CREATE TRIGGER update_meeting_progress_updated_at
  BEFORE UPDATE ON public.meeting_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
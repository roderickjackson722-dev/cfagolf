
-- Add program_type to profiles (high_school or transfer)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS program_type text NOT NULL DEFAULT 'high_school';

-- Create transfer portal entries table
CREATE TABLE public.transfer_portal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  school_name text NOT NULL,
  current_school text,
  portal_entry_date date,
  status text NOT NULL DEFAULT 'exploring',
  division text,
  coach_name text,
  coach_email text,
  scholarship_offer numeric,
  academic_fit_rating integer,
  athletic_fit_rating integer,
  overall_interest text DEFAULT 'medium',
  credits_accepted integer,
  total_credits integer,
  eligibility_years_remaining integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.transfer_portal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own portal entries" ON public.transfer_portal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add portal entries" ON public.transfer_portal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own portal entries" ON public.transfer_portal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own portal entries" ON public.transfer_portal_entries FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_transfer_portal_entries_updated_at
  BEFORE UPDATE ON public.transfer_portal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

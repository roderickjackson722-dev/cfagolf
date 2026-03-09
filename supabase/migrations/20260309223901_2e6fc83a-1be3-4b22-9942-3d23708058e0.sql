
CREATE TABLE public.wagr_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tournament_id uuid NOT NULL REFERENCES public.wagr_tournaments(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'planning',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, tournament_id)
);

ALTER TABLE public.wagr_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attendance" ON public.wagr_attendance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add attendance" ON public.wagr_attendance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own attendance" ON public.wagr_attendance FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own attendance" ON public.wagr_attendance FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_wagr_attendance_updated_at BEFORE UPDATE ON public.wagr_attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

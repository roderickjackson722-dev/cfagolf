
CREATE TABLE public.wagr_tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_name text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  country text,
  city text,
  state text,
  course_name text,
  event_type text DEFAULT 'All Ages',
  gender text DEFAULT 'Men',
  wagr_url text,
  external_url text,
  power_rating numeric,
  winner_name text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.wagr_tournaments ENABLE ROW LEVEL SECURITY;

-- Anyone can view tournaments (public data)
CREATE POLICY "Anyone can view WAGR tournaments" ON public.wagr_tournaments
  FOR SELECT USING (true);

-- Only admins can manage
CREATE POLICY "Admins can insert WAGR tournaments" ON public.wagr_tournaments
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update WAGR tournaments" ON public.wagr_tournaments
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete WAGR tournaments" ON public.wagr_tournaments
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Add updated_at trigger
CREATE TRIGGER update_wagr_tournaments_updated_at
  BEFORE UPDATE ON public.wagr_tournaments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

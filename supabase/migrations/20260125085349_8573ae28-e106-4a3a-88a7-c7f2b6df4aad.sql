-- Create tournament_results table
CREATE TABLE public.tournament_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tournament_name TEXT NOT NULL,
  tournament_date DATE NOT NULL,
  location TEXT,
  course_name TEXT,
  rounds INTEGER DEFAULT 1,
  round_scores JSONB DEFAULT '[]'::jsonb,
  total_score INTEGER,
  relative_to_par INTEGER,
  finish_position INTEGER,
  field_size INTEGER,
  tournament_type TEXT DEFAULT 'local',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tournament_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own tournament results"
  ON public.tournament_results
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add tournament results"
  ON public.tournament_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tournament results"
  ON public.tournament_results
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tournament results"
  ON public.tournament_results
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_tournament_results_updated_at
  BEFORE UPDATE ON public.tournament_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- Create scholarship_offers table
CREATE TABLE public.scholarship_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  school_name TEXT NOT NULL,
  division TEXT,
  offer_type TEXT DEFAULT 'athletic',
  tuition_cost INTEGER DEFAULT 0,
  room_board_cost INTEGER DEFAULT 0,
  books_fees INTEGER DEFAULT 0,
  athletic_scholarship INTEGER DEFAULT 0,
  academic_scholarship INTEGER DEFAULT 0,
  need_based_aid INTEGER DEFAULT 0,
  other_grants INTEGER DEFAULT 0,
  work_study INTEGER DEFAULT 0,
  loans_offered INTEGER DEFAULT 0,
  net_cost INTEGER GENERATED ALWAYS AS (
    GREATEST(0, (tuition_cost + room_board_cost + books_fees) - 
    (athletic_scholarship + academic_scholarship + need_based_aid + other_grants + work_study))
  ) STORED,
  offer_date DATE,
  decision_deadline DATE,
  status TEXT DEFAULT 'pending',
  is_favorite BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scholarship_offers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own scholarship offers"
  ON public.scholarship_offers
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add scholarship offers"
  ON public.scholarship_offers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scholarship offers"
  ON public.scholarship_offers
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own scholarship offers"
  ON public.scholarship_offers
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_scholarship_offers_updated_at
  BEFORE UPDATE ON public.scholarship_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
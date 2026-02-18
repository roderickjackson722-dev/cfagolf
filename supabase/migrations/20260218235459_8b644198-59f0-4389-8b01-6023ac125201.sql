
-- Create a table to store worksheet progress data per user
CREATE TABLE public.worksheet_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  worksheet_key text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, worksheet_key)
);

-- Enable RLS
ALTER TABLE public.worksheet_data ENABLE ROW LEVEL SECURITY;

-- Users can view their own worksheet data
CREATE POLICY "Users can view own worksheet data"
ON public.worksheet_data
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own worksheet data
CREATE POLICY "Users can insert own worksheet data"
ON public.worksheet_data
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own worksheet data
CREATE POLICY "Users can update own worksheet data"
ON public.worksheet_data
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own worksheet data
CREATE POLICY "Users can delete own worksheet data"
ON public.worksheet_data
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_worksheet_data_updated_at
BEFORE UPDATE ON public.worksheet_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add team_gender column to colleges table
ALTER TABLE public.colleges 
ADD COLUMN team_gender TEXT NOT NULL DEFAULT 'Both' 
CHECK (team_gender IN ('Men', 'Women', 'Both'));

-- Add is_hbcu column to identify HBCUs
ALTER TABLE public.colleges 
ADD COLUMN is_hbcu BOOLEAN NOT NULL DEFAULT false;
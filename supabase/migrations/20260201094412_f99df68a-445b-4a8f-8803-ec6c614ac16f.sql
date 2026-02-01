-- Drop existing check constraint on team_gender
ALTER TABLE public.colleges DROP CONSTRAINT IF EXISTS colleges_team_gender_check;

-- Add new check constraint that includes 'None'
ALTER TABLE public.colleges ADD CONSTRAINT colleges_team_gender_check 
  CHECK (team_gender IN ('Men', 'Women', 'Both', 'None'));
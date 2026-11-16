CREATE TABLE public.guidance_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  player_name TEXT NOT NULL CHECK (char_length(player_name) BETWEEN 1 AND 100),
  grade_level TEXT NOT NULL CHECK (char_length(grade_level) BETWEEN 1 AND 30),
  gpa NUMERIC(4,2) NOT NULL CHECK (gpa BETWEEN 0 AND 10),
  scoring_average NUMERIC(5,2) NOT NULL CHECK (scoring_average BETWEEN 0 AND 200),
  hbcu_profile_link TEXT NOT NULL CHECK (char_length(hbcu_profile_link) <= 500 AND hbcu_profile_link ~* '^https?://'),
  swing_video_link TEXT NOT NULL CHECK (char_length(swing_video_link) <= 500 AND swing_video_link ~* '^https?://'),
  parent_name TEXT NOT NULL CHECK (char_length(parent_name) BETWEEN 1 AND 100),
  parent_email TEXT NOT NULL CHECK (char_length(parent_email) BETWEEN 3 AND 255 AND position('@' IN parent_email) > 1),
  parent_phone TEXT NOT NULL CHECK (char_length(parent_phone) BETWEEN 7 AND 25)
);

GRANT SELECT ON public.guidance_applications TO authenticated;
GRANT ALL ON public.guidance_applications TO service_role;

ALTER TABLE public.guidance_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view guidance applications"
ON public.guidance_applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE OR REPLACE FUNCTION public.get_public_swing_profile(_user_id uuid)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  graduation_year integer,
  handicap numeric,
  high_school text,
  home_course text,
  city text,
  state text,
  avatar_url text,
  goal_division text,
  club_team text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id, p.full_name, p.graduation_year, p.handicap,
         p.high_school, p.home_course, p.city, p.state, p.avatar_url,
         p.goal_division, p.club_team
  FROM public.profiles p
  WHERE p.user_id = _user_id
    AND EXISTS (
      SELECT 1 FROM public.swing_videos sv
      WHERE sv.user_id = p.user_id AND sv.is_public = true
    );
$$;

CREATE OR REPLACE FUNCTION public.get_public_swing_golfers()
RETURNS TABLE (
  user_id uuid,
  full_name text,
  graduation_year integer,
  handicap numeric,
  high_school text,
  city text,
  state text,
  avatar_url text,
  goal_division text,
  video_count bigint,
  latest_video_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id, p.full_name, p.graduation_year, p.handicap,
         p.high_school, p.city, p.state, p.avatar_url, p.goal_division,
         COUNT(sv.id) AS video_count,
         MAX(sv.created_at) AS latest_video_at
  FROM public.profiles p
  JOIN public.swing_videos sv ON sv.user_id = p.user_id
  WHERE sv.is_public = true
  GROUP BY p.user_id, p.full_name, p.graduation_year, p.handicap,
           p.high_school, p.city, p.state, p.avatar_url, p.goal_division
  ORDER BY MAX(sv.created_at) DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_swing_profile(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_swing_golfers() TO anon, authenticated;
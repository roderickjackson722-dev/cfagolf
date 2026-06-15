DROP POLICY IF EXISTS "Public can validate active shares" ON public.document_shares;

DROP POLICY IF EXISTS "Public can validate active tokens" ON public.presentation_tokens;

CREATE OR REPLACE FUNCTION public.validate_presentation_token(_token text)
RETURNS TABLE(valid boolean, label text, expires_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT true, pt.label, pt.expires_at
  FROM public.presentation_tokens pt
  WHERE pt.token = _token
    AND pt.is_active = true
    AND (pt.expires_at IS NULL OR pt.expires_at > now())
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.validate_presentation_token(text) TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can increment click count" ON public.resource_links;

CREATE OR REPLACE FUNCTION public.increment_resource_link_click(_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.resource_links
  SET click_count = click_count + 1,
      last_clicked_at = now()
  WHERE id = _id AND is_active = true;
$$;
GRANT EXECUTE ON FUNCTION public.increment_resource_link_click(uuid) TO anon, authenticated;

REVOKE ALL ON public.players FROM anon;
GRANT SELECT (
  id, user_id, full_name, slug, graduation_year, handicap, scoring_average,
  home_course, high_school, intended_major, bio, tagline,
  hero_image_url, profile_photo_url, resume_url, social_links,
  is_active, allow_editing, created_at, updated_at, custom_domain,
  hero_overlay_opacity, hero_text_color, highlights
) ON public.players TO anon;

DROP POLICY IF EXISTS "Students can view own record" ON public.students;
CREATE POLICY "Students can view own record"
ON public.students
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
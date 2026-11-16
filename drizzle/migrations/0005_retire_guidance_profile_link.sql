ALTER TABLE public.guidance_applications DROP CONSTRAINT guidance_applications_hbcu_profile_link_check;
ALTER TABLE public.guidance_applications ADD CONSTRAINT guidance_applications_hbcu_profile_link_check CHECK (hbcu_profile_link = '' OR (char_length(hbcu_profile_link) <= 500 AND hbcu_profile_link ~* '^https?://'));
ALTER TABLE public.guidance_applications ALTER COLUMN hbcu_profile_link SET DEFAULT '';
COMMENT ON COLUMN public.guidance_applications.hbcu_profile_link IS 'DEPRECATED: application form no longer collects a profile link';
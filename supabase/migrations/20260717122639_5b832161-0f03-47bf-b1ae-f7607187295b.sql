
CREATE TABLE public.testimonial_prompt_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intro_heading text NOT NULL DEFAULT 'Not sure what to say? Here''s a quick guide',
  intro_body text NOT NULL DEFAULT 'Share what feels most authentic. A few sentences from the heart mean more than a polished script. You can type your answers, record a short video, or both.',
  guide_points jsonb NOT NULL DEFAULT '[]'::jsonb,
  privacy_note text NOT NULL DEFAULT 'For privacy, please use FIRST NAMES ONLY when referring to your student-athlete. Never share last names, school names, or coach names in your response.',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.testimonial_prompt_settings TO anon, authenticated;
GRANT ALL ON public.testimonial_prompt_settings TO service_role;

ALTER TABLE public.testimonial_prompt_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active prompt"
  ON public.testimonial_prompt_settings FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage prompt settings"
  ON public.testimonial_prompt_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_testimonial_prompt_settings_updated_at
  BEFORE UPDATE ON public.testimonial_prompt_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.testimonial_prompt_settings (guide_points) VALUES (
  '[
    "Where was your family in the recruiting journey before working with CFA? (feeling overwhelmed, unsure where to start, etc.)",
    "What specific help or clarity did College Fairway Advisors provide?",
    "Share a moment or a piece of advice from Rod that made a real difference.",
    "How does your family feel now about the recruiting process?",
    "What would you tell another parent or student-athlete who is considering CFA?",
    "Use first names only — please avoid last names, high schools, or college names."
  ]'::jsonb
);

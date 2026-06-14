
-- social_clips
CREATE TABLE public.social_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  video_url TEXT,
  thumbnail_url TEXT,
  duration INT,
  aspect_ratio TEXT NOT NULL DEFAULT '9:16',
  music_track TEXT,
  text_overlays JSONB DEFAULT '[]'::jsonb,
  generated_by TEXT,
  generation_params JSONB DEFAULT '{}'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  social_platforms TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_clips TO authenticated;
GRANT ALL ON public.social_clips TO service_role;
ALTER TABLE public.social_clips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage social clips" ON public.social_clips
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_social_clips_updated_at
  BEFORE UPDATE ON public.social_clips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- clip_templates
CREATE TABLE public.clip_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_prompt TEXT NOT NULL,
  default_duration INT NOT NULL DEFAULT 8,
  default_aspect_ratio TEXT NOT NULL DEFAULT '9:16',
  default_music TEXT,
  default_text_overlays JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clip_templates TO authenticated;
GRANT ALL ON public.clip_templates TO service_role;
ALTER TABLE public.clip_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage clip templates" ON public.clip_templates
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_clip_templates_updated_at
  BEFORE UPDATE ON public.clip_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- clip_batches
CREATE TABLE public.clip_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  clip_ids UUID[] DEFAULT ARRAY[]::UUID[],
  status TEXT NOT NULL DEFAULT 'processing',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clip_batches TO authenticated;
GRANT ALL ON public.clip_batches TO service_role;
ALTER TABLE public.clip_batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage clip batches" ON public.clip_batches
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_clip_batches_updated_at
  BEFORE UPDATE ON public.clip_batches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed Scholarship Phone Call template
INSERT INTO public.clip_templates (name, description, base_prompt, default_duration, default_aspect_ratio, default_music, default_text_overlays)
VALUES (
  'Scholarship Phone Call – Family Celebration',
  'Young female golfer receives scholarship news via phone call, celebrates with parents',
  E'Create a 5-8 second vertical video for social media.\n\nA young female golfer (late teens) in a golf polo shirt and visor is standing on a sunny golf course fairway. A man and a woman (her parents) are standing nearby watching her.\n\nHer phone rings. She answers. Her face lights up with joy. She jumps up screaming with excitement, raising her arms in the air. Her parents rush over and the family embraces in a happy group hug on the course.\n\nText overlay at the end: "Full Athletic Scholarship."\n\nWarm golden hour lighting. Realistic style. Uplifting acoustic guitar music. Happy tears and genuine joy. Beautiful green fairway and blue sky in background.',
  8,
  '9:16',
  'Uplifting acoustic guitar',
  '[{"text":"🎓 FULL ATHLETIC SCHOLARSHIP 🏌️‍♀️","position":"center","timing":"end","duration":3,"style":"bold, white with shadow"}]'::jsonb
);

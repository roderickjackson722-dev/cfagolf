
-- Hero overlay + text color
ALTER TABLE public.players
  ADD COLUMN IF NOT EXISTS hero_overlay_opacity INTEGER NOT NULL DEFAULT 40,
  ADD COLUMN IF NOT EXISTS hero_text_color TEXT NOT NULL DEFAULT 'light';

-- Upcoming tournaments
ALTER TABLE public.player_tournament_results
  ADD COLUMN IF NOT EXISTS is_upcoming BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS registration_link TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT;

-- Gallery
CREATE TABLE public.player_gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  description TEXT,
  category TEXT,
  angle TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.player_gallery_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.player_gallery_images TO authenticated;
GRANT ALL ON public.player_gallery_images TO service_role;

ALTER TABLE public.player_gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view gallery of active players"
  ON public.player_gallery_images FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.players p WHERE p.id = player_id AND p.is_active = true));

CREATE POLICY "Admins full access gallery"
  ON public.player_gallery_images FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Player owns gallery"
  ON public.player_gallery_images FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.players p WHERE p.id = player_id AND p.user_id = auth.uid() AND p.allow_editing = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.players p WHERE p.id = player_id AND p.user_id = auth.uid() AND p.allow_editing = true));

-- References
CREATE TABLE public.player_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT,
  quote TEXT NOT NULL,
  photo_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.player_references TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.player_references TO authenticated;
GRANT ALL ON public.player_references TO service_role;

ALTER TABLE public.player_references ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view refs of active players"
  ON public.player_references FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.players p WHERE p.id = player_id AND p.is_active = true));

CREATE POLICY "Admins full access refs"
  ON public.player_references FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Player owns refs"
  ON public.player_references FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.players p WHERE p.id = player_id AND p.user_id = auth.uid() AND p.allow_editing = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.players p WHERE p.id = player_id AND p.user_id = auth.uid() AND p.allow_editing = true));

-- Storage bucket for gallery
INSERT INTO storage.buckets (id, name, public) VALUES ('player-gallery', 'player-gallery', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read player-gallery"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'player-gallery');

CREATE POLICY "Authenticated upload player-gallery"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'player-gallery');

CREATE POLICY "Authenticated update player-gallery"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'player-gallery');

CREATE POLICY "Authenticated delete player-gallery"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'player-gallery');

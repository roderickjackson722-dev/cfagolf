
-- ============================================================
-- PLAYER PORTFOLIO PLATFORM
-- ============================================================

-- Players
CREATE TABLE public.players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  full_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  graduation_year integer,
  handicap numeric,
  scoring_average numeric,
  home_course text,
  high_school text,
  gpa numeric,
  sat_score integer,
  act_score integer,
  intended_major text,
  bio text,
  tagline text,
  hero_image_url text,
  profile_photo_url text,
  resume_url text,
  contact_email text,
  social_links jsonb DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  allow_editing boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_players_slug ON public.players(slug);
CREATE INDEX idx_players_user_id ON public.players(user_id);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active players"
  ON public.players FOR SELECT
  USING (is_active = true);

CREATE POLICY "Owners can view own player"
  ON public.players FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins full access players"
  ON public.players FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Students can update their own profile but only safe fields; we enforce field-level
-- restrictions in the client/edge layer. RLS keeps row ownership intact.
CREATE POLICY "Owners can update own player when allowed"
  ON public.players FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND allow_editing = true)
  WITH CHECK (auth.uid() = user_id AND allow_editing = true);

CREATE TRIGGER trg_players_updated_at
  BEFORE UPDATE ON public.players
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tournament results
CREATE TABLE public.player_tournament_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  date date NOT NULL,
  tournament_name text NOT NULL,
  course text,
  score integer,
  finish text,
  field_size integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ptr_player_id ON public.player_tournament_results(player_id);

ALTER TABLE public.player_tournament_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view tournaments of active players"
  ON public.player_tournament_results FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.players p
    WHERE p.id = player_id AND p.is_active = true
  ));

CREATE POLICY "Admins full access ptr"
  ON public.player_tournament_results FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Player owns tournaments"
  ON public.player_tournament_results FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.players p
    WHERE p.id = player_id AND p.user_id = auth.uid() AND p.allow_editing = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.players p
    WHERE p.id = player_id AND p.user_id = auth.uid() AND p.allow_editing = true
  ));

-- Videos
CREATE TABLE public.player_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  category text NOT NULL DEFAULT 'highlights',
  thumbnail_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pv_player_id ON public.player_videos(player_id);

ALTER TABLE public.player_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view videos of active players"
  ON public.player_videos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.players p
    WHERE p.id = player_id AND p.is_active = true
  ));

CREATE POLICY "Admins full access pv"
  ON public.player_videos FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Player owns videos"
  ON public.player_videos FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.players p
    WHERE p.id = player_id AND p.user_id = auth.uid() AND p.allow_editing = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.players p
    WHERE p.id = player_id AND p.user_id = auth.uid() AND p.allow_editing = true
  ));

-- Coach messages (contact form)
CREATE TABLE public.player_coach_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  coach_name text NOT NULL,
  coach_email text NOT NULL,
  coach_phone text,
  coach_college text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pcm_player_id ON public.player_coach_messages(player_id);

ALTER TABLE public.player_coach_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit coach message"
  ON public.player_coach_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins view all coach messages"
  ON public.player_coach_messages FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update coach messages"
  ON public.player_coach_messages FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Player views own coach messages"
  ON public.player_coach_messages FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.players p
    WHERE p.id = player_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Player updates own coach messages"
  ON public.player_coach_messages FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.players p
    WHERE p.id = player_id AND p.user_id = auth.uid()
  ));

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('player-images', 'player-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('player-resumes', 'player-resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY "Public read player-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'player-images');

CREATE POLICY "Public read player-resumes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'player-resumes');

-- Admin write
CREATE POLICY "Admins write player-images"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'player-images' AND has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'player-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins write player-resumes"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'player-resumes' AND has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'player-resumes' AND has_role(auth.uid(), 'admin'::app_role));

-- Players upload to their own folder (folder name = their user id)
CREATE POLICY "Player writes own player-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'player-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Player updates own player-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'player-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Player writes own player-resumes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'player-resumes'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Player updates own player-resumes"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'player-resumes'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

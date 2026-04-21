-- Add 'coach' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'coach';

-- ============================================
-- COACHES TABLE
-- ============================================
CREATE TABLE public.coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  college_name TEXT NOT NULL,
  conference TEXT,
  title TEXT,
  photo_url TEXT,
  bio TEXT,
  recruiting_preferences TEXT,
  program_overview TEXT,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_coaches_slug ON public.coaches(slug);
CREATE INDEX idx_coaches_user_id ON public.coaches(user_id);
CREATE INDEX idx_coaches_active ON public.coaches(is_active);

ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active coaches"
ON public.coaches FOR SELECT
USING (is_active = true);

CREATE POLICY "Coaches can view their own profile"
ON public.coaches FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Coaches can update their own profile"
ON public.coaches FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to coaches"
ON public.coaches FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_coaches_updated_at
BEFORE UPDATE ON public.coaches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- COACH PROFILE VIEWS
-- ============================================
CREATE TABLE public.coach_profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  viewer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewer_session_id TEXT,
  viewer_full_name TEXT,
  viewer_graduation_year INT,
  viewer_handicap NUMERIC,
  view_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dedupe per viewer per coach per day
CREATE UNIQUE INDEX idx_coach_views_unique_user_day
ON public.coach_profile_views(coach_id, viewer_user_id, view_date)
WHERE viewer_user_id IS NOT NULL;

CREATE UNIQUE INDEX idx_coach_views_unique_session_day
ON public.coach_profile_views(coach_id, viewer_session_id, view_date)
WHERE viewer_user_id IS NULL AND viewer_session_id IS NOT NULL;

CREATE INDEX idx_coach_views_coach ON public.coach_profile_views(coach_id);

ALTER TABLE public.coach_profile_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a profile view"
ON public.coach_profile_views FOR INSERT
WITH CHECK (true);

CREATE POLICY "Coaches can view their own profile views"
ON public.coach_profile_views FOR SELECT
USING (
  coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can view all profile views"
ON public.coach_profile_views FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- COACH MESSAGES (Inbox)
-- ============================================
CREATE TABLE public.coach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_coach_messages_coach ON public.coach_messages(coach_id, created_at DESC);

ALTER TABLE public.coach_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send a message to a coach"
ON public.coach_messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Coaches can view their own messages"
ON public.coach_messages FOR SELECT
USING (
  coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid())
);

CREATE POLICY "Coaches can update their own messages"
ON public.coach_messages FOR UPDATE
USING (
  coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can view all messages"
ON public.coach_messages FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- COACH FAVORITES (coach saves junior golfers)
-- ============================================
CREATE TABLE public.coach_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  golfer_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  golfer_name TEXT,
  golfer_email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (coach_id, golfer_user_id)
);

CREATE INDEX idx_coach_favorites_coach ON public.coach_favorites(coach_id);

ALTER TABLE public.coach_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches manage their own favorites"
ON public.coach_favorites FOR ALL
USING (
  coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid())
)
WITH CHECK (
  coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can view all favorites"
ON public.coach_favorites FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- COACH ACCESS REQUESTS (public sign up requests)
-- ============================================
CREATE TABLE public.coach_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  college_name TEXT NOT NULL,
  title TEXT,
  conference TEXT,
  phone TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_coach_access_requests_status ON public.coach_access_requests(status, created_at DESC);

ALTER TABLE public.coach_access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an access request"
ON public.coach_access_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all access requests"
ON public.coach_access_requests FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update access requests"
ON public.coach_access_requests FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));
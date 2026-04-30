CREATE TABLE public.swing_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Swing Video',
  video_url TEXT NOT NULL,
  video_type TEXT NOT NULL DEFAULT 'youtube',
  swing_type TEXT,
  camera_angle TEXT,
  club TEXT,
  notes TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.swing_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own swing videos"
ON public.swing_videos FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Public can view public swing videos"
ON public.swing_videos FOR SELECT
USING (is_public = true);

CREATE POLICY "Users can insert own swing videos"
ON public.swing_videos FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own swing videos"
ON public.swing_videos FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own swing videos"
ON public.swing_videos FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all swing videos"
ON public.swing_videos FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_swing_videos_updated_at
BEFORE UPDATE ON public.swing_videos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_swing_videos_user_id ON public.swing_videos(user_id);
CREATE INDEX idx_swing_videos_public ON public.swing_videos(is_public) WHERE is_public = true;
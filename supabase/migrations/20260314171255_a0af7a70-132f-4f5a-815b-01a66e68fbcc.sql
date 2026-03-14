
CREATE TABLE public.course_lesson_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id text NOT NULL UNIQUE,
  video_url text NOT NULL DEFAULT '',
  video_type text NOT NULL DEFAULT 'youtube',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.course_lesson_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lesson videos" ON public.course_lesson_videos
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage lesson videos" ON public.course_lesson_videos
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));

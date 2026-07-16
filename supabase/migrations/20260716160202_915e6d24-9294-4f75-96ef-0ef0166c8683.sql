
-- Extend testimonials table
ALTER TABLE public.testimonials
  ALTER COLUMN name DROP NOT NULL,
  ALTER COLUMN content DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS biggest_challenge TEXT,
  ADD COLUMN IF NOT EXISTS how_helped TEXT,
  ADD COLUMN IF NOT EXISTS what_valued_most TEXT,
  ADD COLUMN IF NOT EXISTS how_journey_changed TEXT,
  ADD COLUMN IF NOT EXISTS advice_to_others TEXT,
  ADD COLUMN IF NOT EXISTS additional_comments TEXT,
  ADD COLUMN IF NOT EXISTS share_first_name TEXT,
  ADD COLUMN IF NOT EXISTS share_grade_level TEXT,
  ADD COLUMN IF NOT EXISTS share_location TEXT,
  ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS video_file_path TEXT,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'form',
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS entered_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS entered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Public page policy: show is_public rows
DROP POLICY IF EXISTS "Anyone can view public testimonials" ON public.testimonials;
CREATE POLICY "Anyone can view public testimonials"
  ON public.testimonials FOR SELECT
  USING (is_public = true);

GRANT SELECT ON public.testimonials TO anon;

-- Storage policies for testimonial videos in player-gallery is messy; create bucket via tool separately.
-- We'll create a dedicated bucket named 'testimonial-videos' outside via storage tool.

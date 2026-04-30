-- Slides table
CREATE TABLE public.presentation_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  position INTEGER NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  bullets JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  is_logo_slide BOOLEAN NOT NULL DEFAULT false,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX presentation_slides_position_idx ON public.presentation_slides(position);

ALTER TABLE public.presentation_slides ENABLE ROW LEVEL SECURITY;

-- Public read (presentation viewer is public via token)
CREATE POLICY "Slides are viewable by everyone"
  ON public.presentation_slides FOR SELECT
  USING (true);

-- Admins only for writes
CREATE POLICY "Admins can insert slides"
  ON public.presentation_slides FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update slides"
  ON public.presentation_slides FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete slides"
  ON public.presentation_slides FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE TRIGGER trg_presentation_slides_updated_at
BEFORE UPDATE ON public.presentation_slides
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for slide images + logo
INSERT INTO storage.buckets (id, name, public)
VALUES ('presentation-images', 'presentation-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Presentation images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'presentation-images');

CREATE POLICY "Admins can upload presentation images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'presentation-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update presentation images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'presentation-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete presentation images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'presentation-images' AND public.has_role(auth.uid(), 'admin'));

-- Seed 20 default slides
INSERT INTO public.presentation_slides (position, title, bullets, is_logo_slide) VALUES
(1, 'Welcome — What You''ll See Inside CFA', '["A guided tour of every member tool","Built specifically for college golf recruits","Replaces $2,000+ recruiting services"]'::jsonb, true),
(2, 'Your Player Dashboard', '["Single home base for everything recruiting","Progress tracking across all 12 modules","Quick links to every tool"]'::jsonb, false),
(3, 'Recruiting Timeline Calendar', '["Interactive milestones by graduation year","Reminders for NCAA deadlines","Personalized to your year and division"]'::jsonb, false),
(4, 'College Database — Search & Filter', '["Filter by division, state, scholarships, GPA, and ranking","D1 through JUCO coverage","Real-time search with autocomplete"]'::jsonb, false),
(5, 'School Profile Page', '["Verified roster scoring averages","Cost, scholarships, and academic data","Direct links to official athletics sites"]'::jsonb, false),
(6, 'Coach Tracker — Log Communications', '["Track every email, call, and visit","Follow-up reminders so nothing slips","Status pipeline from initial → committed"]'::jsonb, false),
(7, 'Scholarship Calculator', '["Estimate net cost across multiple offers","Side-by-side comparison view","Athletic + academic + need-based aid"]'::jsonb, false),
(8, 'Swing Video Vault', '["Upload swing and tournament clips","Share single link with coaches","Organize by date and category"]'::jsonb, false),
(9, 'Academic Eligibility Tracker', '["Track NCAA core course requirements","GPA and test score monitoring","Eligibility checklist with status"]'::jsonb, false),
(10, 'Email Templates & Coach Outreach', '["Pre-written templates for every stage","Personalize with merge fields","Sent and response tracking"]'::jsonb, false),
(11, 'Program Fit Questionnaire', '["Match preferences to program style","Academic, athletic, and culture fit","Generates a target list automatically"]'::jsonb, false),
(12, 'Goal Setting & Progress Tracking', '["Set short and long-term recruiting goals","Visualize progress across modules","Coach-reviewed weekly"]'::jsonb, false),
(13, 'Tournament Schedule & Results Log', '["Plan your WAGR-counting events","Multi-round scoring with finish position","Aggregate stats coaches can verify"]'::jsonb, false),
(14, 'Document Vault', '["Transcripts, resumes, and release forms","Secure, private, share-when-ready","One source of truth"]'::jsonb, false),
(15, 'Messaging Center', '["Contact college coaches directly","Threaded inbox per program","Notifications when coaches respond"]'::jsonb, false),
(16, 'View Count Analytics', '["See which coaches viewed your profile","Identify warm leads to follow up","Daily and weekly trends"]'::jsonb, false),
(17, 'Mobile-Friendly Access', '["Full platform works on your phone","Log a coach call from the range","No app install required"]'::jsonb, false),
(18, 'Success Stories & Testimonials', '["Real CFA members committed to D1, D2, NAIA","Hear what families say","Outcomes, not promises"]'::jsonb, false),
(19, 'Next Steps — How to Enroll', '["Choose Portal ($299) or Consulting ($2,499)","Klarna available on Consulting","Start onboarding the same day"]'::jsonb, false),
(20, 'Q&A / Contact', '["contact@cfa.golf","www.cfa.golf","Book a free 15-minute call"]'::jsonb, false);

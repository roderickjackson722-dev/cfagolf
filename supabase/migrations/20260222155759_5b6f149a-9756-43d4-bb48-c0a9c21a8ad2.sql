
CREATE TABLE public.flyer_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.flyer_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view flyer content" ON public.flyer_content FOR SELECT USING (true);
CREATE POLICY "Admins can update flyer content" ON public.flyer_content FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert flyer content" ON public.flyer_content FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete flyer content" ON public.flyer_content FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed default content
INSERT INTO public.flyer_content (key, value) VALUES
  ('headline', 'College Fairway Advisors'),
  ('subheadline', 'Your Strategic Recruiting Partner for College Golf'),
  ('intro', 'Expert guidance for junior golfers and their families navigating the college golf recruiting process. We provide personalized consulting, professional tools, and direct access to college coaches and LPGA/PGA professionals.'),
  ('price', '$2,499 / Year'),
  ('price_subtitle', 'Annual Consulting Membership — Personalized College Golf Recruiting'),
  ('stat_1_value', '1,300+'),
  ('stat_1_label', 'College Programs'),
  ('stat_2_value', 'D1–NAIA'),
  ('stat_2_label', 'All Divisions'),
  ('stat_3_value', '500+'),
  ('stat_3_label', 'Families Served'),
  ('services', '[{"title":"Monthly Coaching Calls","desc":"One-on-one guidance through every phase of recruiting (12 calls)"},{"title":"LPGA & PGA Pro Webinars","desc":"Exclusive sessions with touring professionals"},{"title":"College Coach Sessions","desc":"Learn what coaches look for in recruits"},{"title":"Target School List Builder","desc":"Strategic school matching based on your profile"},{"title":"Tournament Result Log","desc":"Track competitive results for your recruiting resume"},{"title":"Coach Contact Tracker","desc":"Organize all coach communications in one place"},{"title":"Scholarship Calculator","desc":"Analyze and compare financial aid offers"},{"title":"12-Month Recruiting Timeline","desc":"Grade-specific action plans to stay on track"}]'),
  ('pillars', '[{"title":"Clarity","desc":"We simplify the recruiting process so families know exactly what to do and when."},{"title":"Advocacy","desc":"We connect you directly with college coaches and advocate for your student-athlete."},{"title":"Strategy","desc":"Every plan is customized to your academic profile, golf skills, and goals."}]'),
  ('website', 'www.cfa.golf'),
  ('email', 'info@cfa.golf'),
  ('social', '@collegefairwayadvisors');

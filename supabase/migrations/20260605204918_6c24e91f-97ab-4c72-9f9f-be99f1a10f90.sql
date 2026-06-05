
CREATE TABLE public.link_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.link_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.link_categories TO authenticated;
GRANT ALL ON public.link_categories TO service_role;

ALTER TABLE public.link_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
  ON public.link_categories FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage categories"
  ON public.link_categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_link_categories_updated_at
  BEFORE UPDATE ON public.link_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.resource_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  category TEXT,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  click_count INT NOT NULL DEFAULT 0,
  last_clicked_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.resource_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resource_links TO authenticated;
GRANT ALL ON public.resource_links TO service_role;

ALTER TABLE public.resource_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active links"
  ON public.resource_links FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can increment click count"
  ON public.resource_links FOR UPDATE
  USING (is_active = true)
  WITH CHECK (is_active = true);

CREATE POLICY "Admins manage links"
  ON public.resource_links FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_resource_links_updated_at
  BEFORE UPDATE ON public.resource_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_resource_links_category ON public.resource_links(category);
CREATE INDEX idx_resource_links_active ON public.resource_links(is_active);

-- Seed categories
INSERT INTO public.link_categories (name, description, sort_order) VALUES
  ('NCAA & Eligibility', 'NCAA registration, eligibility, and transfer info', 1),
  ('Academic Resources', 'Test prep, GPA tracking, and financial aid', 2),
  ('Golf Rankings & Tournaments', 'Junior rankings and tournament info', 3),
  ('Recruiting Platforms', 'Profile and recruiting network platforms', 4),
  ('HBCU Golf', 'Historically Black Colleges & Universities golf resources', 5),
  ('College Search & Scholarships', 'Find colleges and scholarship opportunities', 6),
  ('Additional Resources', 'Other golf organizations and information', 7);

-- Seed links
INSERT INTO public.resource_links (name, description, url, category, sort_order) VALUES
  ('NCAA Eligibility Center', 'Register for an Academic and Athletics Certification account (Division I or II)', 'https://web3.ncaa.org/ecwr3/', 'NCAA & Eligibility', 1),
  ('NCAA Guide for College-Bound Athlete', 'Complete guide to NCAA eligibility requirements', 'https://www.ncaa.org/student-athletes/future/guide-college-bound-student-athlete', 'NCAA & Eligibility', 2),
  ('NCAA Transfer Portal', 'Official information about transferring between schools', 'https://www.ncaa.org/sports/2021/2/9/transfer-portal.aspx', 'NCAA & Eligibility', 3),
  ('ACT Official Site', 'Register for ACT, send scores (NCAA code 9999)', 'https://www.act.org', 'Academic Resources', 1),
  ('SAT Official Site', 'Register for SAT, send scores (NCAA code 9999)', 'https://www.collegeboard.org', 'Academic Resources', 2),
  ('NCAA Core Course GPA Calculator', 'Track your core course progress', 'https://www.ncaa.org/sports/2014/10/20/core-course-gpa-calculator.aspx', 'Academic Resources', 3),
  ('FAFSA (Financial Aid)', 'Free Application for Federal Student Aid', 'https://studentaid.gov/h/apply-for-aid/fafsa', 'Academic Resources', 4),
  ('Junior Golf Scoreboard', 'National junior golf rankings and tournament results', 'https://www.juniorgolfscoreboard.com', 'Golf Rankings & Tournaments', 1),
  ('AJGA (American Junior Golf Association)', 'Premier junior golf tour, college coach attendance', 'https://www.ajga.org', 'Golf Rankings & Tournaments', 2),
  ('Golfweek Junior Rankings', 'National junior golf rankings', 'https://golfweek.usatoday.com/rankings/junior/', 'Golf Rankings & Tournaments', 3),
  ('World Amateur Golf Ranking (WAGR)', 'Official world rankings for amateur golfers', 'https://www.wagr.com', 'Golf Rankings & Tournaments', 4),
  ('NCSA College Recruiting', 'Free and paid recruiting profiles', 'https://www.ncsasports.org', 'Recruiting Platforms', 1),
  ('Junior Golf Hub', 'Free recruiting platform for junior golfers', 'https://www.juniorgolfhub.com', 'Recruiting Platforms', 2),
  ('FieldLevel', 'Recruiting network connecting athletes and coaches', 'https://www.fieldlevel.com', 'Recruiting Platforms', 3),
  ('HBCU Golf Foundation', 'Promoting golf at Historically Black Colleges and Universities', 'https://www.hbcugolffoundation.org', 'HBCU Golf', 1),
  ('PGA WORKS', 'Diversity initiatives in golf', 'https://www.pgaworks.com', 'HBCU Golf', 2),
  ('MEAC Golf', 'Mid-Eastern Athletic Conference golf programs', 'https://meacsports.com/sports/golf', 'HBCU Golf', 3),
  ('SWAC Golf', 'Southwestern Athletic Conference golf programs', 'https://swac.org/sports/golf', 'HBCU Golf', 4),
  ('College Board Big Future', 'Search for colleges by major, location, size', 'https://bigfuture.collegeboard.org', 'College Search & Scholarships', 1),
  ('Niche College Search', 'College reviews and rankings', 'https://www.niche.com/colleges', 'College Search & Scholarships', 2),
  ('Peterson''s College Search', 'Comprehensive college database', 'https://www.petersons.com', 'College Search & Scholarships', 3),
  ('Fastweb Scholarship Search', 'Find scholarships for college', 'https://www.fastweb.com', 'College Search & Scholarships', 4),
  ('PGA of America', 'Professional golf information and resources', 'https://www.pga.com', 'Additional Resources', 1),
  ('USGA (United States Golf Association)', 'Rules of golf, handicapping, tournaments', 'https://www.usga.org', 'Additional Resources', 2),
  ('LPGA (Ladies Professional Golf Association)', 'Women''s golf information and resources', 'https://www.lpga.com', 'Additional Resources', 3),
  ('Golf Channel College Central', 'College golf news and updates', 'https://www.golfchannel.com/college-central', 'Additional Resources', 4);

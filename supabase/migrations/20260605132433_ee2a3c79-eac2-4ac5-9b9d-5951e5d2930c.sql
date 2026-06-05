-- ============================================================
-- CONTENT LIBRARY & STUDENT MANAGEMENT SYSTEM
-- ============================================================

-- ---------- CONTENT LIBRARY ----------

CREATE TABLE public.content_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_categories TO authenticated;
GRANT ALL ON public.content_categories TO service_role;
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage content categories"
  ON public.content_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.content_categories(id) ON DELETE SET NULL,
  storage_path TEXT,
  file_url TEXT,
  file_name TEXT,
  file_type TEXT,
  file_size BIGINT,
  is_template BOOLEAN NOT NULL DEFAULT false,
  is_global BOOLEAN NOT NULL DEFAULT true,
  tags TEXT[] NOT NULL DEFAULT '{}',
  version INT NOT NULL DEFAULT 1,
  parent_template_id UUID REFERENCES public.content_items(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage content items"
  ON public.content_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_content_items_category ON public.content_items(category_id);
CREATE INDEX idx_content_items_tags ON public.content_items USING GIN(tags);

CREATE TABLE public.content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  storage_path TEXT,
  file_url TEXT,
  file_name TEXT,
  changelog TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_versions TO authenticated;
GRANT ALL ON public.content_versions TO service_role;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage content versions"
  ON public.content_versions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_content_versions_item ON public.content_versions(content_item_id);

-- ---------- STUDENT MANAGEMENT ----------

CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  graduation_year INT,
  handicap NUMERIC,
  scoring_average NUMERIC,
  high_school TEXT,
  gpa NUMERIC,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  personal_website_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage students"
  ON public.students FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_students_status ON public.students(status);
CREATE INDEX idx_students_grad_year ON public.students(graduation_year);

CREATE TABLE public.student_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  source_template_id UUID REFERENCES public.content_items(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  storage_path TEXT,
  file_url TEXT,
  file_name TEXT,
  file_type TEXT,
  file_size BIGINT,
  is_customized BOOLEAN NOT NULL DEFAULT false,
  parent_version_id UUID REFERENCES public.content_versions(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_content TO authenticated;
GRANT ALL ON public.student_content TO service_role;
ALTER TABLE public.student_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage student content"
  ON public.student_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_student_content_student ON public.student_content(student_id);

CREATE TABLE public.student_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  note_type TEXT NOT NULL DEFAULT 'general',
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_notes TO authenticated;
GRANT ALL ON public.student_notes TO service_role;
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage student notes"
  ON public.student_notes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_student_notes_student ON public.student_notes(student_id);

CREATE TABLE public.student_custom_webpages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  page_name TEXT NOT NULL,
  page_content TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_custom_webpages TO authenticated;
GRANT ALL ON public.student_custom_webpages TO service_role;
ALTER TABLE public.student_custom_webpages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage student webpages"
  ON public.student_custom_webpages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_student_webpages_student ON public.student_custom_webpages(student_id);

CREATE TABLE public.student_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_activity_log TO authenticated;
GRANT ALL ON public.student_activity_log TO service_role;
ALTER TABLE public.student_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage student activity"
  ON public.student_activity_log FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_student_activity_student ON public.student_activity_log(student_id);

-- ---------- updated_at triggers ----------
CREATE TRIGGER trg_content_categories_updated BEFORE UPDATE ON public.content_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_content_items_updated BEFORE UPDATE ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_students_updated BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_student_content_updated BEFORE UPDATE ON public.student_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_student_notes_updated BEFORE UPDATE ON public.student_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_student_webpages_updated BEFORE UPDATE ON public.student_custom_webpages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- seed default categories ----------
INSERT INTO public.content_categories (name, sort_order) VALUES
  ('Worksheets', 1),
  ('Email Templates', 2),
  ('Recruiting Timelines', 3),
  ('Player Resume Templates', 4),
  ('Course Materials', 5),
  ('Forms & Releases', 6),
  ('Other', 99);
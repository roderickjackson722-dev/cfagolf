
-- Templates
CREATE TABLE public.email_templates_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates_v2 TO authenticated;
GRANT ALL ON public.email_templates_v2 TO service_role;
ALTER TABLE public.email_templates_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage templates" ON public.email_templates_v2 FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authed view active templates" ON public.email_templates_v2 FOR SELECT TO authenticated
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'::app_role));

-- Sections
CREATE TABLE public.email_template_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.email_templates_v2(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  has_action_items BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_template_sections TO authenticated;
GRANT ALL ON public.email_template_sections TO service_role;
ALTER TABLE public.email_template_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage sections" ON public.email_template_sections FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authed view sections" ON public.email_template_sections FOR SELECT TO authenticated USING (true);

-- Action items
CREATE TABLE public.email_template_action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.email_template_sections(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  description TEXT,
  link_url TEXT,
  link_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_template_action_items TO authenticated;
GRANT ALL ON public.email_template_action_items TO service_role;
ALTER TABLE public.email_template_action_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage action items" ON public.email_template_action_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authed view action items" ON public.email_template_action_items FOR SELECT TO authenticated USING (true);

-- Variables
CREATE TABLE public.email_template_variables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.email_templates_v2(id) ON DELETE CASCADE,
  variable_name TEXT NOT NULL,
  variable_label TEXT,
  variable_type TEXT NOT NULL DEFAULT 'text',
  is_required BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_template_variables TO authenticated;
GRANT ALL ON public.email_template_variables TO service_role;
ALTER TABLE public.email_template_variables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage variables" ON public.email_template_variables FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authed view variables" ON public.email_template_variables FOR SELECT TO authenticated USING (true);

-- Outreach history
CREATE TABLE public.outreach_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.email_templates_v2(id) ON DELETE SET NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT,
  body TEXT,
  variables_used JSONB DEFAULT '{}'::jsonb,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  notes TEXT
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outreach_history TO authenticated;
GRANT ALL ON public.outreach_history TO service_role;
ALTER TABLE public.outreach_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage outreach" ON public.outreach_history FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_sections_template ON public.email_template_sections(template_id, sort_order);
CREATE INDEX idx_action_items_section ON public.email_template_action_items(section_id, sort_order);
CREATE INDEX idx_variables_template ON public.email_template_variables(template_id);
CREATE INDEX idx_outreach_student ON public.outreach_history(student_id, sent_at DESC);
CREATE INDEX idx_outreach_template ON public.outreach_history(template_id, sent_at DESC);

CREATE TRIGGER trg_email_templates_v2_updated_at BEFORE UPDATE ON public.email_templates_v2
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

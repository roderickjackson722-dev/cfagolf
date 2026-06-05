
-- TEMPLATES
CREATE TABLE public.agenda_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agenda_templates TO authenticated;
GRANT ALL ON public.agenda_templates TO service_role;
ALTER TABLE public.agenda_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth view templates" ON public.agenda_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin manage templates" ON public.agenda_templates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_agenda_templates_updated BEFORE UPDATE ON public.agenda_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.agenda_template_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.agenda_templates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  link_url TEXT,
  link_text TEXT,
  assigned_to TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  estimated_duration INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agenda_template_tasks TO authenticated;
GRANT ALL ON public.agenda_template_tasks TO service_role;
ALTER TABLE public.agenda_template_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth view template tasks" ON public.agenda_template_tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin manage template tasks" ON public.agenda_template_tasks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- STUDENT AGENDAS
CREATE TABLE public.student_agendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.agenda_templates(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  meeting_date DATE,
  meeting_type TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_agendas TO authenticated;
GRANT ALL ON public.student_agendas TO service_role;
ALTER TABLE public.student_agendas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin manage agendas" ON public.student_agendas FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "students view own agendas" ON public.student_agendas FOR SELECT TO authenticated
  USING (auth.uid() IN (SELECT s.user_id FROM public.students s WHERE s.id = student_id));
CREATE TRIGGER trg_student_agendas_updated BEFORE UPDATE ON public.student_agendas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.student_agenda_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agenda_id UUID NOT NULL REFERENCES public.student_agendas(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  link_url TEXT,
  link_text TEXT,
  assigned_to TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  sort_order INT NOT NULL DEFAULT 0,
  estimated_duration INT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_agenda_tasks TO authenticated;
GRANT ALL ON public.student_agenda_tasks TO service_role;
ALTER TABLE public.student_agenda_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin manage agenda tasks" ON public.student_agenda_tasks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "students view own agenda tasks" ON public.student_agenda_tasks FOR SELECT TO authenticated
  USING (auth.uid() IN (
    SELECT s.user_id FROM public.students s
    JOIN public.student_agendas a ON a.student_id = s.id
    WHERE a.id = agenda_id
  ));
CREATE POLICY "students update own agenda tasks" ON public.student_agenda_tasks FOR UPDATE TO authenticated
  USING (auth.uid() IN (
    SELECT s.user_id FROM public.students s
    JOIN public.student_agendas a ON a.student_id = s.id
    WHERE a.id = agenda_id
  ));
CREATE TRIGGER trg_student_agenda_tasks_updated BEFORE UPDATE ON public.student_agenda_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.student_agenda_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agenda_id UUID NOT NULL REFERENCES public.student_agendas(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.student_agenda_tasks(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_agenda_comments TO authenticated;
GRANT ALL ON public.student_agenda_comments TO service_role;
ALTER TABLE public.student_agenda_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin manage agenda comments" ON public.student_agenda_comments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "students view own agenda comments" ON public.student_agenda_comments FOR SELECT TO authenticated
  USING (auth.uid() IN (
    SELECT s.user_id FROM public.students s
    JOIN public.student_agendas a ON a.student_id = s.id
    WHERE a.id = agenda_id
  ));

-- Seed default templates
WITH t1 AS (
  INSERT INTO public.agenda_templates (name, description, is_default)
  VALUES ('Initial Strategy Call', 'Kick-off meeting to align on recruiting goals and timeline', true)
  RETURNING id
)
INSERT INTO public.agenda_template_tasks (template_id, title, description, sort_order)
SELECT id, x.title, x.description, x.so FROM t1, (VALUES
  ('Review Student Questionnaire', 'Discuss responses to the intake form', 1),
  ('Set Recruiting Goals', 'Define target divisions, schools, timeline', 2),
  ('Review Academic Standing', 'Confirm GPA, test scores, NCAA eligibility', 3),
  ('Review Tournament Schedule', 'Plan upcoming events for exposure', 4),
  ('Assign Next Steps', 'Student: Complete player profile; Parent: Gather transcripts', 5)
) AS x(title, description, so);

WITH t2 AS (
  INSERT INTO public.agenda_templates (name, description, is_default)
  VALUES ('Monthly Check-in', 'Recurring monthly progress review', true)
  RETURNING id
)
INSERT INTO public.agenda_template_tasks (template_id, title, description, sort_order)
SELECT id, x.title, x.description, x.so FROM t2, (VALUES
  ('Review Recent Tournament Results', 'Discuss scores, progress, areas for improvement', 1),
  ('Coach Outreach Update', 'Check responses, plan follow-ups', 2),
  ('Video Review', 'Analyze swing video from last month', 3),
  ('Academic Update', 'Confirm grades, test scores, upcoming tests', 4),
  ('Set Next Month''s Goals', 'Define specific, measurable targets', 5)
) AS x(title, description, so);

WITH t3 AS (
  INSERT INTO public.agenda_templates (name, description, is_default)
  VALUES ('Coach Call Preparation', 'Prepare student for an upcoming college coach call', true)
  RETURNING id
)
INSERT INTO public.agenda_template_tasks (template_id, title, description, sort_order)
SELECT id, x.title, x.description, x.so FROM t3, (VALUES
  ('Research Coach & Program', 'Review team roster, recent results, coaching philosophy', 1),
  ('Prepare Questions for Coach', 'List 5-7 questions to ask', 2),
  ('Update Player Resume', 'Ensure all stats and results are current', 3),
  ('Review Talking Points', 'Practice introducing yourself', 4),
  ('Send Confirmation Email', 'Confirm call time and format', 5)
) AS x(title, description, so);

WITH t4 AS (
  INSERT INTO public.agenda_templates (name, description, is_default)
  VALUES ('College Commitment Prep', 'Finalize commitment decision and announcement', true)
  RETURNING id
)
INSERT INTO public.agenda_template_tasks (template_id, title, description, sort_order)
SELECT id, x.title, x.description, x.so FROM t4, (VALUES
  ('Review Offer Details', 'Discuss scholarship, academic support, team role', 1),
  ('Compare Final Schools', 'Use comparison matrix', 2),
  ('Prepare Announcement', 'Draft social post, notify coaches', 3),
  ('Complete NCAA Paperwork', 'Sign National Letter of Intent', 4),
  ('Transition Planning', 'Connect with future teammates, plan move-in', 5)
) AS x(title, description, so);


CREATE TABLE IF NOT EXISTS public.student_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL UNIQUE REFERENCES public.students(id) ON DELETE CASCADE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_generated_at timestamptz,
  pdf_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_resumes TO authenticated;
GRANT ALL ON public.student_resumes TO service_role;

ALTER TABLE public.student_resumes ENABLE ROW LEVEL SECURITY;

-- Admins full access
CREATE POLICY "Admins manage all resumes"
  ON public.student_resumes
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Students can view their own resume (linked via students.user_id)
CREATE POLICY "Students view own resume"
  ON public.student_resumes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = student_resumes.student_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Students insert own resume"
  ON public.student_resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = student_resumes.student_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Students update own resume"
  ON public.student_resumes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = student_resumes.student_id AND s.user_id = auth.uid()
    )
  );

CREATE TRIGGER trg_student_resumes_updated
  BEFORE UPDATE ON public.student_resumes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

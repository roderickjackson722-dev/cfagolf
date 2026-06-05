CREATE POLICY "Admins read content-files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'content-files' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins write content-files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'content-files' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update content-files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'content-files' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete content-files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'content-files' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins read student-files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'student-files' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins write student-files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'student-files' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update student-files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'student-files' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete student-files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'student-files' AND public.has_role(auth.uid(), 'admin'::app_role));
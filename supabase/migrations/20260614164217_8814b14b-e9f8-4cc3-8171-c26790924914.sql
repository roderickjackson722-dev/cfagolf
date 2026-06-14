
CREATE POLICY "Public read free-resources"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'free-resources');

CREATE POLICY "Admins upload free-resources"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'free-resources' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update free-resources"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'free-resources' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete free-resources"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'free-resources' AND public.has_role(auth.uid(), 'admin'::app_role));


CREATE POLICY "Admins read social-clips"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'social-clips' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins insert social-clips"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'social-clips' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update social-clips"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'social-clips' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete social-clips"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'social-clips' AND public.has_role(auth.uid(), 'admin'::app_role));

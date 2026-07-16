
CREATE POLICY "Anyone can upload testimonial videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'testimonial-videos');

CREATE POLICY "Admins can read testimonial videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'testimonial-videos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete testimonial videos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'testimonial-videos' AND has_role(auth.uid(), 'admin'::app_role));

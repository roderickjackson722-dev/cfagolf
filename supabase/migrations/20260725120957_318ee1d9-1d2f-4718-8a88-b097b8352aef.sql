
CREATE POLICY "Anyone can upload testimonial images" ON storage.objects
  FOR INSERT TO public WITH CHECK (bucket_id = 'testimonial-images');
CREATE POLICY "Testimonial images are publicly readable" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'testimonial-images');
CREATE POLICY "Admins can delete testimonial images" ON storage.objects
  FOR DELETE TO public USING (bucket_id = 'testimonial-images' AND has_role(auth.uid(), 'admin'::app_role));

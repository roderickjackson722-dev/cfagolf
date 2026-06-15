CREATE POLICY "Public can read free-resources objects"
ON storage.objects FOR SELECT
USING (bucket_id = 'free-resources');
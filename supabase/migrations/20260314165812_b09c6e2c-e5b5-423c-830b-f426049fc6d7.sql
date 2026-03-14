
-- Storage bucket for toolkit files (PDFs, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('toolkit-files', 'toolkit-files', true);

-- Only admins can upload/delete, anyone authenticated with toolkit access can read
CREATE POLICY "Anyone can read toolkit files" ON storage.objects
  FOR SELECT USING (bucket_id = 'toolkit-files');

CREATE POLICY "Admins can upload toolkit files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'toolkit-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update toolkit files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'toolkit-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete toolkit files" ON storage.objects
  FOR DELETE USING (bucket_id = 'toolkit-files' AND has_role(auth.uid(), 'admin'::app_role));

-- Add file_url column to digital_products for optional downloadable file
ALTER TABLE public.digital_products ADD COLUMN file_url text;

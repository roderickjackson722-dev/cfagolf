
-- Free Resources Library tables
CREATE TABLE public.free_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  file_url TEXT,
  file_path TEXT,
  file_type TEXT DEFAULT 'PDF',
  file_size TEXT,
  thumbnail_url TEXT,
  download_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.free_resources TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.free_resources TO authenticated;
GRANT ALL ON public.free_resources TO service_role;

ALTER TABLE public.free_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active free resources"
  ON public.free_resources FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all free resources"
  ON public.free_resources FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert free resources"
  ON public.free_resources FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update free resources"
  ON public.free_resources FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete free resources"
  ON public.free_resources FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_free_resources_updated_at
  BEFORE UPDATE ON public.free_resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Download logs
CREATE TABLE public.resource_download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.free_resources(id) ON DELETE CASCADE,
  downloaded_by TEXT,
  source TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.resource_download_logs TO anon;
GRANT INSERT ON public.resource_download_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resource_download_logs TO authenticated;
GRANT ALL ON public.resource_download_logs TO service_role;

ALTER TABLE public.resource_download_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert download logs"
  ON public.resource_download_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view download logs"
  ON public.resource_download_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Atomic increment function (callable by anon for public downloads)
CREATE OR REPLACE FUNCTION public.increment_resource_download(_slug text, _source text DEFAULT 'Website', _downloaded_by text DEFAULT 'anonymous')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _resource_id uuid;
BEGIN
  UPDATE public.free_resources
  SET download_count = download_count + 1
  WHERE slug = _slug AND is_active = true
  RETURNING id INTO _resource_id;

  IF _resource_id IS NOT NULL THEN
    INSERT INTO public.resource_download_logs (resource_id, downloaded_by, source)
    VALUES (_resource_id, _downloaded_by, _source);
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_resource_download(text, text, text) TO anon, authenticated;

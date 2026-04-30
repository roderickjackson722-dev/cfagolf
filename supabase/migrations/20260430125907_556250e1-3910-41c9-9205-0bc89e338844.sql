-- Document Vault: storage bucket (private), documents table, share links

INSERT INTO storage.buckets (id, name, public)
VALUES ('member-documents', 'member-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: users access only their own folder (path prefix = user_id)
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'member-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'member-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'member-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'member-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'member-documents' AND public.has_role(auth.uid(), 'admin'));

-- member_documents table
CREATE TABLE public.member_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  title TEXT NOT NULL,
  description TEXT,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.member_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents" ON public.member_documents
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON public.member_documents
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON public.member_documents
FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON public.member_documents
FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all member documents" ON public.member_documents
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_member_documents_updated_at
BEFORE UPDATE ON public.member_documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_member_documents_user ON public.member_documents(user_id);

-- document_shares table: share-link tokens (per-doc or bundle)
CREATE TABLE public.document_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  label TEXT,
  document_ids UUID[] NOT NULL DEFAULT '{}',
  recipient_name TEXT,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  view_count INTEGER NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own shares" ON public.document_shares
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can validate active shares" ON public.document_shares
FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));
CREATE POLICY "Admins view all shares" ON public.document_shares
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_document_shares_updated_at
BEFORE UPDATE ON public.document_shares
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_document_shares_token ON public.document_shares(token);
CREATE INDEX idx_document_shares_user ON public.document_shares(user_id);

-- Security definer RPC for public share viewing (returns metadata + signed URLs handled in edge/client)
CREATE OR REPLACE FUNCTION public.get_shared_documents(_token TEXT)
RETURNS TABLE(
  share_id UUID,
  owner_name TEXT,
  label TEXT,
  document_id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  storage_path TEXT,
  file_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  expires_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id, p.full_name, s.label,
         d.id, d.title, d.description, d.category,
         d.storage_path, d.file_name, d.file_size, d.mime_type,
         s.expires_at
  FROM public.document_shares s
  JOIN public.member_documents d ON d.id = ANY(s.document_ids)
  LEFT JOIN public.profiles p ON p.user_id = s.user_id
  WHERE s.token = _token
    AND s.is_active = true
    AND (s.expires_at IS NULL OR s.expires_at > now());
$$;

-- Increment view count function
CREATE OR REPLACE FUNCTION public.increment_share_view(_token TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.document_shares
  SET view_count = view_count + 1, last_viewed_at = now()
  WHERE token = _token
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now());
END;
$$;
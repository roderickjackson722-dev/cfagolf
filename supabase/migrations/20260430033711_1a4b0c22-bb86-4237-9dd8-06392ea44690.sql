CREATE TABLE public.presentation_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  label TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_presentation_tokens_token ON public.presentation_tokens(token);

ALTER TABLE public.presentation_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage presentation tokens"
ON public.presentation_tokens
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can validate active tokens"
ON public.presentation_tokens
FOR SELECT
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE TRIGGER update_presentation_tokens_updated_at
BEFORE UPDATE ON public.presentation_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
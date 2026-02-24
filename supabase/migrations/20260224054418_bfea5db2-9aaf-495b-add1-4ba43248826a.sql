
-- Track communication history with HS coaches
CREATE TABLE public.hs_coach_outreach (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  high_school_id uuid REFERENCES public.high_schools(id) ON DELETE CASCADE NOT NULL,
  outreach_type text NOT NULL DEFAULT 'email',
  subject text,
  body text,
  status text NOT NULL DEFAULT 'sent',
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  opened_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.hs_coach_outreach ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage outreach" ON public.hs_coach_outreach FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Email templates for campaigns
CREATE TABLE public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  category text NOT NULL DEFAULT 'coach_outreach',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage templates" ON public.email_templates FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add last_contacted and contact_status to high_schools for CRM tracking
ALTER TABLE public.high_schools 
  ADD COLUMN last_contacted_at timestamp with time zone,
  ADD COLUMN contact_status text DEFAULT 'not_contacted',
  ADD COLUMN total_emails_sent integer DEFAULT 0;

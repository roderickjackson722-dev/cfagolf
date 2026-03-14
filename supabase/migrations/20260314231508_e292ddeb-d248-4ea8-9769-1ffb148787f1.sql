
CREATE TABLE public.newsletter_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_index integer NOT NULL UNIQUE CHECK (month_index >= 0 AND month_index <= 11),
  month_name text NOT NULL,
  subject text NOT NULL,
  title text NOT NULL,
  tip text NOT NULL,
  action_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage newsletter tips" ON public.newsletter_tips
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view newsletter tips" ON public.newsletter_tips
  FOR SELECT TO public
  USING (true);

CREATE TRIGGER update_newsletter_tips_updated_at
  BEFORE UPDATE ON public.newsletter_tips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

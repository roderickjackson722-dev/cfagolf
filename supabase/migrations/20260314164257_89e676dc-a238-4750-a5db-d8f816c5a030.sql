
CREATE TABLE public.digital_products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_key text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  price_cents integer NOT NULL DEFAULT 9900,
  icon_name text NOT NULL DEFAULT 'FileText',
  color text NOT NULL DEFAULT 'text-emerald-700',
  bg_color text NOT NULL DEFAULT 'bg-emerald-50',
  route text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.digital_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON public.digital_products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON public.digital_products
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.digital_products (product_key, title, subtitle, description, icon_name, color, bg_color, route, sort_order)
VALUES
  ('roadmap', 'The Recruiting Roadmap', 'Automated Recruiting Plan', 'A comprehensive step-by-step PDF guide covering how to build a highlight reel, write emails to coaches, and build a target school list.', 'FileText', 'text-emerald-700', 'bg-emerald-50', '/shop/roadmap', 0),
  ('templates', '15 Email Templates for Golf Coaches', 'Templates & Swipe Files', 'Ready-to-use email templates for initial outreach, follow-ups, video submission emails, and more. Copy, customize, and send.', 'Mail', 'text-blue-700', 'bg-blue-50', '/shop/templates', 1),
  ('resume', 'The Athlete Resume Template', 'Golf-Specific Resume', 'A professionally designed resume template built specifically for junior golfers pursuing college programs.', 'UserCircle', 'text-amber-700', 'bg-amber-50', '/shop/resume', 2),
  ('course', 'The Recruiting Huddle', 'Video Masterclass', 'A pre-recorded video course covering the complete recruiting timeline from Freshman to Senior year.', 'Video', 'text-purple-700', 'bg-purple-50', '/shop/course', 3);

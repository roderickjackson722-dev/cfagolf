
-- Create testimonials table to store submitted reviews
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can submit testimonials
CREATE POLICY "Anyone can submit testimonials"
ON public.testimonials FOR INSERT
WITH CHECK (true);

-- Admins can view all testimonials
CREATE POLICY "Admins can view all testimonials"
ON public.testimonials FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public can view approved testimonials
CREATE POLICY "Anyone can view approved testimonials"
ON public.testimonials FOR SELECT
USING (status = 'approved');

-- Admins can update testimonials
CREATE POLICY "Admins can update testimonials"
ON public.testimonials FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete testimonials
CREATE POLICY "Admins can delete testimonials"
ON public.testimonials FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


CREATE TABLE public.digital_product_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_key text NOT NULL DEFAULT 'recruiting_toolkit',
  stripe_session_id text,
  purchase_type text NOT NULL DEFAULT 'direct',
  amount_paid integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_key)
);

ALTER TABLE public.digital_product_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases" ON public.digital_product_purchases
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases" ON public.digital_product_purchases
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases" ON public.digital_product_purchases
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

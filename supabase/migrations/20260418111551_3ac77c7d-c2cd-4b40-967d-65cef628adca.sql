-- Add tracking columns to digital_product_purchases for sales reporting
ALTER TABLE public.digital_product_purchases
  ADD COLUMN IF NOT EXISTS buyer_email text,
  ADD COLUMN IF NOT EXISTS buyer_name text,
  ADD COLUMN IF NOT EXISTS referrer_path text,
  ADD COLUMN IF NOT EXISTS referrer_url text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS region text,
  ADD COLUMN IF NOT EXISTS city text;

-- Allow admins to read all purchases for the Sales tab
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'digital_product_purchases'
      AND policyname = 'Admins can view all purchases'
  ) THEN
    CREATE POLICY "Admins can view all purchases"
      ON public.digital_product_purchases
      FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;
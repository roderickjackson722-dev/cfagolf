
-- Fix promo_codes SELECT policies: change "Anyone can view active promo codes" to PERMISSIVE
-- Drop the restrictive one and recreate as permissive
DROP POLICY IF EXISTS "Anyone can view active promo codes" ON public.promo_codes;
CREATE POLICY "Anyone can view active promo codes" ON public.promo_codes
  FOR SELECT
  USING (is_active = true);

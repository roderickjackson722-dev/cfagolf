
DROP FUNCTION IF EXISTS public.increment_referral_uses(uuid);
DROP FUNCTION IF EXISTS public.increment_promo_uses(uuid);

CREATE OR REPLACE FUNCTION public.increment_referral_uses(referral_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rows_affected int;
BEGIN
  UPDATE public.referrals
  SET uses_count = uses_count + 1
  WHERE id = referral_id
    AND is_active = true
    AND (max_uses IS NULL OR uses_count < max_uses);
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_promo_uses(promo_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rows_affected int;
BEGIN
  UPDATE public.promo_codes
  SET uses_count = uses_count + 1
  WHERE id = promo_id
    AND is_active = true
    AND (max_uses IS NULL OR uses_count < max_uses);
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_referral_code(_code text)
RETURNS TABLE(discount_percent integer, is_valid boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    r.discount_percent,
    (r.is_active AND (r.max_uses IS NULL OR r.uses_count < r.max_uses))::boolean AS is_valid
  FROM public.referrals r
  WHERE upper(trim(r.referral_code)) = upper(trim(_code))
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.validate_promo_code(_code text)
RETURNS TABLE(discount_percent integer, name text, is_valid boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.discount_percent,
    p.name,
    (p.is_active AND (p.max_uses IS NULL OR p.uses_count < p.max_uses))::boolean AS is_valid
  FROM public.promo_codes p
  WHERE upper(trim(p.code)) = upper(trim(_code))
  LIMIT 1;
$$;

DROP POLICY IF EXISTS "Anyone can view active referral codes for validation" ON public.referrals;
DROP POLICY IF EXISTS "Anyone can view active referral codes" ON public.referrals;
DROP POLICY IF EXISTS "Anyone can view active promo codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Public can view active promo codes" ON public.promo_codes;

GRANT EXECUTE ON FUNCTION public.validate_referral_code(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.validate_promo_code(text) TO anon, authenticated;

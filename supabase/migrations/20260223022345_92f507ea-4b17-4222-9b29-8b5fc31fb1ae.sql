
CREATE OR REPLACE FUNCTION public.increment_promo_uses(promo_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.promo_codes
  SET uses_count = uses_count + 1
  WHERE id = promo_id;
END;
$$;

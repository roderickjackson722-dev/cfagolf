-- Create a function to increment referral uses count
CREATE OR REPLACE FUNCTION public.increment_referral_uses(referral_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.referrals
  SET uses_count = uses_count + 1
  WHERE id = referral_id;
END;
$$;
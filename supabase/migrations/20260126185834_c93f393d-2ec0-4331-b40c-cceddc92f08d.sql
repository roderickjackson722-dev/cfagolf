-- Create referrals table to track referral codes and usage
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id uuid NOT NULL,
  referral_code text NOT NULL UNIQUE,
  discount_percent integer NOT NULL DEFAULT 10,
  uses_count integer NOT NULL DEFAULT 0,
  max_uses integer DEFAULT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create referral_uses table to track who used which code
CREATE TABLE public.referral_uses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id uuid REFERENCES public.referrals(id) ON DELETE CASCADE NOT NULL,
  referred_user_id uuid NOT NULL,
  payment_amount integer NOT NULL,
  discount_applied integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_uses ENABLE ROW LEVEL SECURITY;

-- RLS policies for referrals
CREATE POLICY "Users can view own referral codes"
ON public.referrals FOR SELECT
USING (auth.uid() = referrer_user_id);

CREATE POLICY "Users can create own referral codes"
ON public.referrals FOR INSERT
WITH CHECK (auth.uid() = referrer_user_id);

CREATE POLICY "Anyone can view active referral codes for validation"
ON public.referrals FOR SELECT
USING (is_active = true);

-- RLS policies for referral_uses
CREATE POLICY "Users can view referrals they made"
ON public.referral_uses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.referrals
    WHERE referrals.id = referral_uses.referral_id
    AND referrals.referrer_user_id = auth.uid()
  )
);

CREATE POLICY "System can insert referral uses"
ON public.referral_uses FOR INSERT
WITH CHECK (true);

-- Admins can view all referrals
CREATE POLICY "Admins can view all referrals"
ON public.referrals FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all referral uses"
ON public.referral_uses FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_referrals_updated_at
BEFORE UPDATE ON public.referrals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
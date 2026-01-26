-- Drop the overly permissive policy
DROP POLICY IF EXISTS "System can insert referral uses" ON public.referral_uses;

-- Create a proper INSERT policy - only allow inserts for the user being referred
CREATE POLICY "Users can record their own referral use"
ON public.referral_uses FOR INSERT
WITH CHECK (auth.uid() = referred_user_id);
-- Add referrer rewards column
ALTER TABLE public.referrals
ADD COLUMN reward_type text DEFAULT 'none',
ADD COLUMN reward_value integer DEFAULT 0,
ADD COLUMN total_rewards_earned integer DEFAULT 0;

-- Add notification preference
ALTER TABLE public.referrals
ADD COLUMN notify_on_use boolean DEFAULT true;

-- Add referrer email tracking in referral_uses
ALTER TABLE public.referral_uses
ADD COLUMN referrer_notified boolean DEFAULT false;
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface Referral {
  id: string;
  referrer_user_id: string;
  referral_code: string;
  discount_percent: number;
  uses_count: number;
  max_uses: number | null;
  is_active: boolean;
  created_at: string;
}

interface ReferralUse {
  id: string;
  referral_id: string;
  referred_user_id: string;
  payment_amount: number;
  discount_applied: number;
  created_at: string;
}

export function useReferrals() {
  const { user } = useAuth();
  const [referral, setReferral] = useState<Referral | null>(null);
  const [referralUses, setReferralUses] = useState<ReferralUse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateReferralCode = (userId: string): string => {
    const prefix = 'CFA';
    const suffix = userId.substring(0, 6).toUpperCase();
    return `${prefix}${suffix}`;
  };

  const fetchReferral = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Try to get existing referral code
      const { data: existingReferral, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (existingReferral) {
        setReferral(existingReferral);
        
        // Fetch uses for this referral
        const { data: uses } = await supabase
          .from('referral_uses')
          .select('*')
          .eq('referral_id', existingReferral.id)
          .order('created_at', { ascending: false });
        
        setReferralUses(uses || []);
      }
    } catch (error) {
      console.error('Error fetching referral:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createReferralCode = async () => {
    if (!user) {
      toast.error('You must be logged in to create a referral code');
      return null;
    }

    try {
      const code = generateReferralCode(user.id);
      
      const { data, error } = await supabase
        .from('referrals')
        .insert({
          referrer_user_id: user.id,
          referral_code: code,
          discount_percent: 10,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          // Unique constraint - code already exists, fetch it
          await fetchReferral();
          return referral;
        }
        throw error;
      }

      setReferral(data);
      toast.success('Referral code created!');
      return data;
    } catch (error) {
      console.error('Error creating referral code:', error);
      toast.error('Failed to create referral code');
      return null;
    }
  };

  const validateReferralCode = async (code: string): Promise<{ valid: boolean; discount: number; referralId?: string }> => {
    try {
      const normalizedCode = code.toUpperCase().trim();
      
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referral_code', normalizedCode)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return { valid: false, discount: 0 };
      }

      // Check if max uses reached
      if (data.max_uses !== null && data.uses_count >= data.max_uses) {
        return { valid: false, discount: 0 };
      }

      // Don't allow self-referral
      if (user && data.referrer_user_id === user.id) {
        return { valid: false, discount: 0 };
      }

      return { valid: true, discount: data.discount_percent, referralId: data.id };
    } catch (error) {
      console.error('Error validating referral code:', error);
      return { valid: false, discount: 0 };
    }
  };

  const copyReferralLink = () => {
    if (!referral) return;
    
    const link = `${window.location.origin}/login?ref=${referral.referral_code}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied to clipboard!');
  };

  const copyReferralCode = () => {
    if (!referral) return;
    
    navigator.clipboard.writeText(referral.referral_code);
    toast.success('Referral code copied to clipboard!');
  };

  useEffect(() => {
    fetchReferral();
  }, [user]);

  const totalEarnings = referralUses.reduce((sum, use) => sum + use.discount_applied, 0);

  return {
    referral,
    referralUses,
    isLoading,
    createReferralCode,
    validateReferralCode,
    copyReferralLink,
    copyReferralCode,
    totalEarnings,
    refetch: fetchReferral,
  };
}

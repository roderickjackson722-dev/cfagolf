import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';

export function useDigitalProducts() {
  const { user, profile } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const [hasToolkitAccess, setHasToolkitAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHasToolkitAccess(false);
      setLoading(false);
      return;
    }
    checkAccess();
  }, [user, profile, isAdmin]);

  const checkAccess = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Admins always have access for testing
      if (isAdmin) {
        setHasToolkitAccess(true);
        setLoading(false);
        return;
      }

      // Check direct purchase
      const { data: purchase } = await supabase
        .from('digital_product_purchases' as any)
        .select('id')
        .eq('user_id', user.id)
        .eq('product_key', 'recruiting_toolkit')
        .maybeSingle();

      if (purchase) {
        setHasToolkitAccess(true);
        setLoading(false);
        return;
      }

      // Check if digital subscriber for 6+ months
      if (profile?.has_paid_access && (profile as any)?.program_type === 'digital') {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('created_at')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          const created = new Date(profileData.created_at);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          if (created <= sixMonthsAgo) {
            setHasToolkitAccess(true);
            setLoading(false);
            return;
          }
        }
      }

      // Consulting members get access
      if (profile?.has_paid_access && (profile as any)?.program_type === 'consulting') {
        setHasToolkitAccess(true);
        setLoading(false);
        return;
      }

      setHasToolkitAccess(false);
    } catch (err) {
      console.error('Error checking toolkit access:', err);
      setHasToolkitAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const purchaseToolkit = async (guestEmail?: string) => {
    try {
      const referrerPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
      const referrerUrl = typeof window !== 'undefined' ? window.location.href : '';
      const { data, error } = await supabase.functions.invoke('create-toolkit-checkout', {
        body: { email: guestEmail, referrerPath, referrerUrl },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Purchase error:', err);
      throw err;
    }
  };

  const verifyPurchase = async (sessionId: string) => {
    const { data, error } = await supabase.functions.invoke('verify-toolkit-purchase', {
      body: { sessionId },
    });
    if (error) throw error;
    if (data?.paid) {
      setHasToolkitAccess(true);
    }
    return data;
  };

  return { hasToolkitAccess, loading, purchaseToolkit, verifyPurchase, checkAccess };
}

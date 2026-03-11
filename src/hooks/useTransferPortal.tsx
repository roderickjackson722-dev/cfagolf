import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export type PortalStatus = 'exploring' | 'contacted' | 'applied' | 'accepted' | 'committed' | 'declined';
export type InterestLevel = 'low' | 'medium' | 'high';

export interface TransferPortalEntry {
  id: string;
  user_id: string;
  school_name: string;
  current_school: string | null;
  portal_entry_date: string | null;
  status: PortalStatus;
  division: string | null;
  coach_name: string | null;
  coach_email: string | null;
  scholarship_offer: number | null;
  academic_fit_rating: number | null;
  athletic_fit_rating: number | null;
  overall_interest: InterestLevel;
  credits_accepted: number | null;
  total_credits: number | null;
  eligibility_years_remaining: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransferPortalInput {
  school_name: string;
  current_school?: string;
  portal_entry_date?: string;
  status?: PortalStatus;
  division?: string;
  coach_name?: string;
  coach_email?: string;
  scholarship_offer?: number;
  academic_fit_rating?: number;
  athletic_fit_rating?: number;
  overall_interest?: InterestLevel;
  credits_accepted?: number;
  total_credits?: number;
  eligibility_years_remaining?: number;
  notes?: string;
}

export const useTransferPortal = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading, error } = useQuery({
    queryKey: ['transferPortal', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('transfer_portal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as unknown as TransferPortalEntry[];
    },
    enabled: !!user,
  });

  const addEntry = useMutation({
    mutationFn: async (input: TransferPortalInput) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('transfer_portal_entries')
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transferPortal'] });
      toast({ title: 'School added to portal tracker' });
    },
    onError: (err: Error) => {
      toast({ title: 'Error adding school', description: err.message, variant: 'destructive' });
    },
  });

  const updateEntry = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TransferPortalEntry> & { id: string }) => {
      const { data, error } = await supabase
        .from('transfer_portal_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transferPortal'] });
      toast({ title: 'Entry updated' });
    },
    onError: (err: Error) => {
      toast({ title: 'Error updating entry', description: err.message, variant: 'destructive' });
    },
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transfer_portal_entries')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transferPortal'] });
      toast({ title: 'Entry removed' });
    },
    onError: (err: Error) => {
      toast({ title: 'Error removing entry', description: err.message, variant: 'destructive' });
    },
  });

  return { entries, isLoading, error, addEntry, updateEntry, deleteEntry };
};

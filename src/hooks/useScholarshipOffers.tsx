import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface ScholarshipOffer {
  id: string;
  user_id: string;
  school_name: string;
  division: string | null;
  offer_type: string;
  tuition_cost: number;
  room_board_cost: number;
  books_fees: number;
  athletic_scholarship: number;
  academic_scholarship: number;
  need_based_aid: number;
  other_grants: number;
  work_study: number;
  loans_offered: number;
  net_cost: number;
  offer_date: string | null;
  decision_deadline: string | null;
  status: string;
  is_favorite: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScholarshipOfferInput {
  school_name: string;
  division?: string;
  offer_type?: string;
  tuition_cost?: number;
  room_board_cost?: number;
  books_fees?: number;
  athletic_scholarship?: number;
  academic_scholarship?: number;
  need_based_aid?: number;
  other_grants?: number;
  work_study?: number;
  loans_offered?: number;
  offer_date?: string;
  decision_deadline?: string;
  status?: string;
  is_favorite?: boolean;
  notes?: string;
}

export function useScholarshipOffers() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<ScholarshipOffer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    if (!user) {
      setOffers([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('scholarship_offers')
        .select('*')
        .eq('user_id', user.id)
        .order('net_cost', { ascending: true });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error fetching scholarship offers:', error);
      toast({
        title: "Error",
        description: "Failed to load scholarship offers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [user]);

  const addOffer = async (input: ScholarshipOfferInput) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('scholarship_offers')
        .insert({
          user_id: user.id,
          school_name: input.school_name,
          division: input.division || null,
          offer_type: input.offer_type || 'athletic',
          tuition_cost: input.tuition_cost || 0,
          room_board_cost: input.room_board_cost || 0,
          books_fees: input.books_fees || 0,
          athletic_scholarship: input.athletic_scholarship || 0,
          academic_scholarship: input.academic_scholarship || 0,
          need_based_aid: input.need_based_aid || 0,
          other_grants: input.other_grants || 0,
          work_study: input.work_study || 0,
          loans_offered: input.loans_offered || 0,
          offer_date: input.offer_date || null,
          decision_deadline: input.decision_deadline || null,
          status: input.status || 'pending',
          is_favorite: input.is_favorite || false,
          notes: input.notes || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scholarship offer added",
      });

      fetchOffers();
    } catch (error) {
      console.error('Error adding scholarship offer:', error);
      toast({
        title: "Error",
        description: "Failed to add scholarship offer",
        variant: "destructive",
      });
    }
  };

  const updateOffer = async (id: string, updates: Partial<ScholarshipOfferInput>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('scholarship_offers')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scholarship offer updated",
      });

      fetchOffers();
    } catch (error) {
      console.error('Error updating scholarship offer:', error);
      toast({
        title: "Error",
        description: "Failed to update scholarship offer",
        variant: "destructive",
      });
    }
  };

  const deleteOffer = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('scholarship_offers')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scholarship offer removed",
      });

      fetchOffers();
    } catch (error) {
      console.error('Error deleting scholarship offer:', error);
      toast({
        title: "Error",
        description: "Failed to remove scholarship offer",
        variant: "destructive",
      });
    }
  };

  // Calculate stats
  const stats = {
    totalOffers: offers.length,
    lowestNetCost: offers.length > 0 ? Math.min(...offers.map(o => o.net_cost)) : 0,
    highestNetCost: offers.length > 0 ? Math.max(...offers.map(o => o.net_cost)) : 0,
    averageNetCost: offers.length > 0 
      ? Math.round(offers.reduce((sum, o) => sum + o.net_cost, 0) / offers.length) 
      : 0,
    totalScholarships: offers.reduce((sum, o) => 
      sum + o.athletic_scholarship + o.academic_scholarship + o.need_based_aid + o.other_grants, 0),
    pendingDecisions: offers.filter(o => o.status === 'pending').length,
  };

  return {
    offers,
    loading,
    addOffer,
    updateOffer,
    deleteOffer,
    stats,
    refetch: fetchOffers,
  };
}

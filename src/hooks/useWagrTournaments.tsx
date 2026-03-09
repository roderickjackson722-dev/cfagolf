import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface WagrTournament {
  id: string;
  tournament_name: string;
  start_date: string;
  end_date: string | null;
  country: string | null;
  city: string | null;
  state: string | null;
  course_name: string | null;
  event_type: string | null;
  gender: string | null;
  wagr_url: string | null;
  external_url: string | null;
  power_rating: number | null;
  winner_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WagrTournamentInput {
  tournament_name: string;
  start_date: string;
  end_date?: string;
  country?: string;
  city?: string;
  state?: string;
  course_name?: string;
  event_type?: string;
  gender?: string;
  wagr_url?: string;
  external_url?: string;
  power_rating?: number;
  winner_name?: string;
  notes?: string;
}

interface WagrFilters {
  search: string;
  city: string;
  state: string;
  country: string;
  eventType: string;
  gender: string;
}

export function useWagrTournaments(filters?: WagrFilters) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['wagr-tournaments', filters],
    queryFn: async () => {
      let q = supabase
        .from('wagr_tournaments')
        .select('*')
        .order('start_date', { ascending: false });

      if (filters?.search) {
        q = q.ilike('tournament_name', `%${filters.search}%`);
      }
      if (filters?.city) {
        q = q.ilike('city', `%${filters.city}%`);
      }
      if (filters?.state) {
        q = q.ilike('state', `%${filters.state}%`);
      }
      if (filters?.country) {
        q = q.ilike('country', `%${filters.country}%`);
      }
      if (filters?.eventType) {
        q = q.eq('event_type', filters.eventType);
      }
      if (filters?.gender) {
        q = q.eq('gender', filters.gender);
      }

      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as WagrTournament[];
    },
  });

  const addTournament = useMutation({
    mutationFn: async (input: WagrTournamentInput) => {
      const { error } = await supabase
        .from('wagr_tournaments')
        .insert(input as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wagr-tournaments'] });
      toast({ title: 'Success', description: 'Tournament added' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to add tournament', variant: 'destructive' });
    },
  });

  const updateTournament = useMutation({
    mutationFn: async ({ id, ...updates }: WagrTournamentInput & { id: string }) => {
      const { error } = await supabase
        .from('wagr_tournaments')
        .update(updates as any)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wagr-tournaments'] });
      toast({ title: 'Success', description: 'Tournament updated' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update tournament', variant: 'destructive' });
    },
  });

  const deleteTournament = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('wagr_tournaments')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wagr-tournaments'] });
      toast({ title: 'Success', description: 'Tournament deleted' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete tournament', variant: 'destructive' });
    },
  });

  return {
    tournaments: query.data || [],
    isLoading: query.isLoading,
    addTournament,
    updateTournament,
    deleteTournament,
    refetch: query.refetch,
  };
}

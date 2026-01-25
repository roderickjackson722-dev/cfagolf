import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CampusVisit {
  id: string;
  user_id: string;
  college_id: string | null;
  custom_school_name: string | null;
  visit_date: string;
  visit_type: string | null;
  overall_rating: number | null;
  campus_rating: number | null;
  facilities_rating: number | null;
  coaching_rating: number | null;
  team_culture_rating: number | null;
  academics_rating: number | null;
  notes: string | null;
  pros: string | null;
  cons: string | null;
  questions_asked: string | null;
  follow_up_needed: boolean | null;
  photo_urls: string[];
  created_at: string;
  updated_at: string;
  // Joined college data
  college?: {
    id: string;
    name: string;
    state: string;
    division: string;
    logo_url: string | null;
  } | null;
}

export type CampusVisitInsert = Omit<CampusVisit, 'id' | 'created_at' | 'updated_at' | 'college'>;
export type CampusVisitUpdate = Partial<CampusVisitInsert>;

export function useCampusVisits() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: visits = [], isLoading, error } = useQuery({
    queryKey: ['campus-visits', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('campus_visits')
        .select(`
          *,
          college:colleges(id, name, state, division, logo_url)
        `)
        .eq('user_id', user.id)
        .order('visit_date', { ascending: false });

      if (error) throw error;
      return (data || []).map(visit => ({
        ...visit,
        photo_urls: Array.isArray(visit.photo_urls) ? visit.photo_urls : []
      })) as CampusVisit[];
    },
    enabled: !!user,
  });

  const addVisit = useMutation({
    mutationFn: async (visit: Omit<CampusVisitInsert, 'user_id'>) => {
      if (!user) throw new Error('Must be logged in');
      
      const { data, error } = await supabase
        .from('campus_visits')
        .insert({ ...visit, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campus-visits'] });
      toast({ title: 'Visit added successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error adding visit', description: error.message, variant: 'destructive' });
    },
  });

  const updateVisit = useMutation({
    mutationFn: async ({ id, ...updates }: CampusVisitUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('campus_visits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campus-visits'] });
      toast({ title: 'Visit updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating visit', description: error.message, variant: 'destructive' });
    },
  });

  const deleteVisit = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('campus_visits')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campus-visits'] });
      toast({ title: 'Visit deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting visit', description: error.message, variant: 'destructive' });
    },
  });

  const uploadPhoto = async (file: File): Promise<string> => {
    if (!user) throw new Error('Must be logged in');
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('visit-photos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('visit-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  // Compute stats
  const stats = {
    totalVisits: visits.length,
    averageOverallRating: visits.filter(v => v.overall_rating).length > 0
      ? visits.filter(v => v.overall_rating).reduce((sum, v) => sum + (v.overall_rating || 0), 0) / 
        visits.filter(v => v.overall_rating).length
      : 0,
    followUpsNeeded: visits.filter(v => v.follow_up_needed).length,
    topRatedVisit: visits.reduce((top, v) => 
      (v.overall_rating || 0) > (top?.overall_rating || 0) ? v : top, 
      visits[0] || null
    ),
  };

  return {
    visits,
    isLoading,
    error,
    stats,
    addVisit,
    updateVisit,
    deleteVisit,
    uploadPhoto,
  };
}

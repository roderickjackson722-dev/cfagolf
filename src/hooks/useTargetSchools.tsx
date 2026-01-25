import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export type TargetSchoolCategory = 'dream' | 'target' | 'safety';

export interface TargetSchool {
  id: string;
  user_id: string;
  college_id: string | null;
  custom_school_name: string | null;
  category: TargetSchoolCategory;
  notes: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
  college?: {
    id: string;
    name: string;
    state: string;
    division: string;
    logo_url: string | null;
    recruiting_scoring_avg: number | null;
  };
}

export const useTargetSchools = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: targetSchools = [], isLoading, error } = useQuery({
    queryKey: ['targetSchools', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('target_schools')
        .select(`
          *,
          college:colleges(id, name, state, division, logo_url, recruiting_scoring_avg)
        `)
        .eq('user_id', user.id)
        .order('priority', { ascending: true });

      if (error) throw error;
      return data as TargetSchool[];
    },
    enabled: !!user,
  });

  const addSchool = useMutation({
    mutationFn: async (data: {
      college_id?: string;
      custom_school_name?: string;
      category: TargetSchoolCategory;
      notes?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('target_schools').insert({
        user_id: user.id,
        college_id: data.college_id || null,
        custom_school_name: data.custom_school_name || null,
        category: data.category,
        notes: data.notes || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targetSchools'] });
      toast({ title: 'School added to your list!' });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to add school', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const updateSchool = useMutation({
    mutationFn: async (data: {
      id: string;
      category?: TargetSchoolCategory;
      notes?: string;
      priority?: number;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('target_schools')
        .update({
          category: data.category,
          notes: data.notes,
          priority: data.priority,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targetSchools'] });
      toast({ title: 'School updated!' });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to update school', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const removeSchool = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('target_schools')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targetSchools'] });
      toast({ title: 'School removed from your list' });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to remove school', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const dreamSchools = targetSchools.filter(s => s.category === 'dream');
  const matchSchools = targetSchools.filter(s => s.category === 'target');
  const safetySchools = targetSchools.filter(s => s.category === 'safety');

  return {
    targetSchools,
    dreamSchools,
    matchSchools,
    safetySchools,
    isLoading,
    error,
    addSchool,
    updateSchool,
    removeSchool,
  };
};

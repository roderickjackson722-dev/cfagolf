import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('favorites')
        .select('college_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(f => f.college_id);
    },
    enabled: !!user,
  });

  const addFavorite = useMutation({
    mutationFn: async (collegeId: string) => {
      if (!user) throw new Error('Must be logged in');
      
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, college_id: collegeId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success('Added to favorites');
    },
    onError: () => {
      toast.error('Failed to add favorite');
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (collegeId: string) => {
      if (!user) throw new Error('Must be logged in');
      
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('college_id', collegeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success('Removed from favorites');
    },
    onError: () => {
      toast.error('Failed to remove favorite');
    },
  });

  const toggleFavorite = (collegeId: string) => {
    if (favoritesQuery.data?.includes(collegeId)) {
      removeFavorite.mutate(collegeId);
    } else {
      addFavorite.mutate(collegeId);
    }
  };

  const isFavorite = (collegeId: string) => {
    return favoritesQuery.data?.includes(collegeId) ?? false;
  };

  return {
    favorites: favoritesQuery.data ?? [],
    isLoading: favoritesQuery.isLoading,
    toggleFavorite,
    isFavorite,
    isPending: addFavorite.isPending || removeFavorite.isPending,
  };
}

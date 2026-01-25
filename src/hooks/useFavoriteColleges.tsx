import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { College } from '@/types/college';

export function useFavoriteColleges() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['favorite-colleges', user?.id],
    queryFn: async (): Promise<College[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          college_id,
          colleges (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      return data
        .map((f: any) => f.colleges as College)
        .filter((c): c is College => c !== null);
    },
    enabled: !!user,
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type FlyerContentMap = Record<string, string>;

export function useFlyerContent() {
  return useQuery({
    queryKey: ['flyer-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flyer_content')
        .select('key, value');
      if (error) throw error;
      const map: FlyerContentMap = {};
      data.forEach((row: { key: string; value: string }) => { map[row.key] = row.value; });
      return map;
    },
  });
}

export function useUpdateFlyerContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: { key: string; value: string }[]) => {
      for (const u of updates) {
        const { error } = await supabase
          .from('flyer_content')
          .update({ value: u.value, updated_at: new Date().toISOString() })
          .eq('key', u.key);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['flyer-content'] });
      toast.success('Flyer content updated');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

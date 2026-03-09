import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface WagrAttendance {
  id: string;
  user_id: string;
  tournament_id: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useWagrAttendance() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['wagr-attendance', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('wagr_attendance')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      return (data || []) as WagrAttendance[];
    },
    enabled: !!user,
  });

  const toggleAttendance = useMutation({
    mutationFn: async ({ tournamentId, status }: { tournamentId: string; status?: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      // Check if already attending
      const { data: existing } = await supabase
        .from('wagr_attendance')
        .select('id')
        .eq('user_id', user.id)
        .eq('tournament_id', tournamentId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('wagr_attendance')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        return { action: 'removed' };
      } else {
        const { error } = await supabase
          .from('wagr_attendance')
          .insert({
            user_id: user.id,
            tournament_id: tournamentId,
            status: status || 'planning',
          } as any);
        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['wagr-attendance'] });
      toast({
        title: result.action === 'added' ? 'Added to schedule' : 'Removed from schedule',
        description: result.action === 'added' ? 'Tournament added to your schedule' : 'Tournament removed from your schedule',
      });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update attendance', variant: 'destructive' });
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ attendanceId, status }: { attendanceId: string; status: string }) => {
      const { error } = await supabase
        .from('wagr_attendance')
        .update({ status } as any)
        .eq('id', attendanceId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wagr-attendance'] });
    },
  });

  const attendanceMap = new Map<string, WagrAttendance>();
  (query.data || []).forEach(a => attendanceMap.set(a.tournament_id, a));

  return {
    attendance: query.data || [],
    attendanceMap,
    isLoading: query.isLoading,
    toggleAttendance,
    updateStatus,
    isAttending: (tournamentId: string) => attendanceMap.has(tournamentId),
  };
}

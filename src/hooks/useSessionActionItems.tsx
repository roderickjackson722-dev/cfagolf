import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SessionActionItem {
  id: string;
  user_id: string;
  module_number: number;
  title: string;
  is_completed: boolean;
  completed_date: string | null;
  assigned_by: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export function useSessionActionItems(userId: string | undefined, moduleNumber?: number) {
  return useQuery({
    queryKey: ['session-action-items', userId, moduleNumber],
    queryFn: async () => {
      if (!userId) return [];
      let query = supabase
        .from('session_action_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (moduleNumber !== undefined) {
        query = query.eq('module_number', moduleNumber);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SessionActionItem[];
    },
    enabled: !!userId,
  });
}

export function useAddActionItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      moduleNumber,
      title,
      dueDate,
    }: {
      userId: string;
      moduleNumber: number;
      title: string;
      dueDate?: string;
    }) => {
      const { error } = await supabase
        .from('session_action_items')
        .insert({
          user_id: userId,
          module_number: moduleNumber,
          title,
          due_date: dueDate || null,
          assigned_by: 'admin',
        });
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['session-action-items', variables.userId] });
      toast({ title: "Action Item Added" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add action item.", variant: "destructive" });
    },
  });
}

export function useToggleActionItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      isCompleted,
      userId,
    }: {
      itemId: string;
      isCompleted: boolean;
      userId: string;
    }) => {
      const { error } = await supabase
        .from('session_action_items')
        .update({
          is_completed: isCompleted,
          completed_date: isCompleted ? new Date().toISOString() : null,
        })
        .eq('id', itemId);
      if (error) throw error;
      return userId;
    },
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: ['session-action-items', userId] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update.", variant: "destructive" });
    },
  });
}

export function useDeleteActionItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, userId }: { itemId: string; userId: string }) => {
      const { error } = await supabase
        .from('session_action_items')
        .delete()
        .eq('id', itemId);
      if (error) throw error;
      return userId;
    },
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: ['session-action-items', userId] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    },
  });
}

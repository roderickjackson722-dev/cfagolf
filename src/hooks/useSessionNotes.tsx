import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SessionNote {
  id: string;
  user_id: string;
  module_number: number;
  author_id: string;
  author_role: 'admin' | 'user';
  content: string;
  created_at: string;
  updated_at: string;
}

export function useSessionNotes(userId: string | undefined, moduleNumber?: number) {
  return useQuery({
    queryKey: ['session-notes', userId, moduleNumber],
    queryFn: async () => {
      if (!userId) return [];
      let query = supabase
        .from('session_notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      
      if (moduleNumber !== undefined) {
        query = query.eq('module_number', moduleNumber);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as SessionNote[];
    },
    enabled: !!userId,
  });
}

export function useAddSessionNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      moduleNumber,
      content,
      authorRole,
    }: {
      userId: string;
      moduleNumber: number;
      content: string;
      authorRole: 'admin' | 'user';
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('session_notes')
        .insert({
          user_id: userId,
          module_number: moduleNumber,
          author_id: user.id,
          author_role: authorRole,
          content,
        });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['session-notes', variables.userId] });
      toast({ title: "Note Added", description: "Your note has been saved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save note.", variant: "destructive" });
    },
  });
}

export function useDeleteSessionNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ noteId, userId }: { noteId: string; userId: string }) => {
      const { error } = await supabase
        .from('session_notes')
        .delete()
        .eq('id', noteId);
      if (error) throw error;
      return userId;
    },
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: ['session-notes', userId] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete note.", variant: "destructive" });
    },
  });
}

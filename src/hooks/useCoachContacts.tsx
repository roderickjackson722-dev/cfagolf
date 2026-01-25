import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export type ContactType = 'email' | 'phone' | 'in_person' | 'camp' | 'other';
export type ContactStatus = 'initial' | 'responded' | 'in_conversation' | 'visited' | 'offer' | 'committed' | 'declined';

export interface CoachContact {
  id: string;
  user_id: string;
  school_name: string;
  coach_name: string;
  coach_title: string | null;
  email: string | null;
  phone: string | null;
  first_contact_date: string | null;
  contact_type: ContactType | null;
  response_received: boolean;
  follow_up_date: string | null;
  notes: string | null;
  status: ContactStatus;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface CoachContactInput {
  school_name: string;
  coach_name: string;
  coach_title?: string;
  email?: string;
  phone?: string;
  first_contact_date?: string;
  contact_type?: ContactType;
  response_received?: boolean;
  follow_up_date?: string;
  notes?: string;
  status?: ContactStatus;
}

export const useCoachContacts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ['coachContacts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('coach_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as CoachContact[];
    },
    enabled: !!user,
  });

  const addContact = useMutation({
    mutationFn: async (data: CoachContactInput) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('coach_contacts').insert({
        user_id: user.id,
        school_name: data.school_name,
        coach_name: data.coach_name,
        coach_title: data.coach_title || null,
        email: data.email || null,
        phone: data.phone || null,
        first_contact_date: data.first_contact_date || null,
        contact_type: data.contact_type || null,
        response_received: data.response_received || false,
        follow_up_date: data.follow_up_date || null,
        notes: data.notes || null,
        status: data.status || 'initial',
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coachContacts'] });
      toast({ title: 'Coach contact added!' });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to add contact', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const updateContact = useMutation({
    mutationFn: async (data: Partial<CoachContact> & { id: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { id, ...updateData } = data;
      const { error } = await supabase
        .from('coach_contacts')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coachContacts'] });
      toast({ title: 'Contact updated!' });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to update contact', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('coach_contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coachContacts'] });
      toast({ title: 'Contact removed' });
    },
    onError: (error) => {
      toast({ 
        title: 'Failed to remove contact', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  // Group contacts by status
  const contactsByStatus = {
    initial: contacts.filter(c => c.status === 'initial'),
    responded: contacts.filter(c => c.status === 'responded'),
    in_conversation: contacts.filter(c => c.status === 'in_conversation'),
    visited: contacts.filter(c => c.status === 'visited'),
    offer: contacts.filter(c => c.status === 'offer'),
    committed: contacts.filter(c => c.status === 'committed'),
    declined: contacts.filter(c => c.status === 'declined'),
  };

  // Upcoming follow-ups
  const upcomingFollowUps = contacts
    .filter(c => c.follow_up_date && new Date(c.follow_up_date) >= new Date())
    .sort((a, b) => new Date(a.follow_up_date!).getTime() - new Date(b.follow_up_date!).getTime());

  return {
    contacts,
    contactsByStatus,
    upcomingFollowUps,
    isLoading,
    error,
    addContact,
    updateContact,
    deleteContact,
  };
};

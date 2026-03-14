import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PlayerReleaseData {
  full_name: string;
  date_of_birth: string;
  graduation_year: number;
  current_school: string;
  gpa: string;
  sat_score?: string;
  act_score?: string;
  golf_achievements: string;
  player_email: string;
  player_phone: string;
  parent_name?: string;
  parent_relationship?: string;
  parent_email?: string;
  parent_phone?: string;
  auth_athletic_profile: boolean;
  auth_academic_info: boolean;
  auth_personal_info: boolean;
  auth_direct_coach_contact: boolean;
  release_marketing?: boolean;
  release_website_social?: boolean;
  release_name_achievements?: boolean;
  release_success_story?: boolean;
  ack_not_agency: boolean;
  ack_no_guarantees: boolean;
  ack_flat_fee: boolean;
  ack_no_control_third_party: boolean;
  ack_can_withdraw: boolean;
  player_signature: string;
  player_signature_date: string;
  parent_signature?: string;
  parent_signature_date?: string;
}

export function usePlayerRelease() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: release, isLoading } = useQuery({
    queryKey: ['player-release', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('player_profile_releases' as any)
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const submitRelease = useMutation({
    mutationFn: async (formData: PlayerReleaseData) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('player_profile_releases' as any)
        .insert({ ...formData, user_id: user.id } as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-release'] });
    },
  });

  return {
    release,
    isLoading,
    hasSubmittedRelease: !!release,
    submitRelease,
  };
}

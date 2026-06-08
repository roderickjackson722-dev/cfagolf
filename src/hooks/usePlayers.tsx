import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Player {
  id: string;
  user_id: string | null;
  full_name: string;
  slug: string;
  graduation_year: number | null;
  handicap: number | null;
  scoring_average: number | null;
  home_course: string | null;
  high_school: string | null;
  gpa: number | null;
  sat_score: number | null;
  act_score: number | null;
  intended_major: string | null;
  bio: string | null;
  tagline: string | null;
  hero_image_url: string | null;
  profile_photo_url: string | null;
  resume_url: string | null;
  contact_email: string | null;
  social_links: Record<string, string> | null;
  custom_domain: string | null;
  hero_overlay_opacity: number | null;
  hero_text_color: string | null;
  is_active: boolean;
  allow_editing: boolean;
  highlights: HighlightItem[] | null;
  created_at: string;
  updated_at: string;
}

export interface HighlightItem {
  text: string;
  link_text?: string;
  link_url?: string;
}

// Cast helper: Supabase generated types treat jsonb as Json which doesn't
// structurally match our typed interfaces.
const asPlayer = (d: any) => d as Player;
const asPlayers = (d: any) => (d || []) as Player[];

export interface TournamentResult {
  id: string;
  player_id: string;
  date: string;
  tournament_name: string;
  course: string | null;
  score: number | null;
  finish: string | null;
  field_size: number | null;
  notes: string | null;
  is_upcoming: boolean | null;
  registration_link: string | null;
  results_link: string | null;
  location: string | null;
  created_at: string;
}

export interface PlayerVideo {
  id: string;
  player_id: string;
  title: string;
  url: string;
  category: string;
  thumbnail_url: string | null;
  sort_order: number;
  created_at: string;
}

export function useAllPlayers() {
  return useQuery({
    queryKey: ['players', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Player[];
    },
  });
}

export function usePlayerBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['players', 'slug', slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('slug', slug!)
        .maybeSingle();
      if (error) throw error;
      return data as Player | null;
    },
  });
}

export function usePlayerById(id: string | undefined) {
  return useQuery({
    queryKey: ['players', 'id', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('players').select('*').eq('id', id!).maybeSingle();
      if (error) throw error;
      return data as Player | null;
    },
  });
}

export function useMyPlayer() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['players', 'mine', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as Player | null;
    },
  });
}

export function usePlayerTournaments(playerId: string | undefined) {
  return useQuery({
    queryKey: ['player_tournaments', playerId],
    enabled: !!playerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_tournament_results')
        .select('*')
        .eq('player_id', playerId!)
        .order('date', { ascending: false });
      if (error) throw error;
      return (data || []) as TournamentResult[];
    },
  });
}

export function usePlayerVideos(playerId: string | undefined) {
  return useQuery({
    queryKey: ['player_videos', playerId],
    enabled: !!playerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_videos')
        .select('*')
        .eq('player_id', playerId!)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as PlayerVideo[];
    },
  });
}

export function useUpsertPlayer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (player: Partial<Player> & { id?: string }) => {
      if (player.id) {
        const { data, error } = await supabase
          .from('players')
          .update(player)
          .eq('id', player.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.from('players').insert(player as any).select().single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['players'] });
    },
  });
}

export function useDeletePlayer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('players').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['players'] }),
  });
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface GalleryImage {
  id: string;
  player_id: string;
  image_url: string;
  thumbnail_url: string | null;
  title: string | null;
  description: string | null;
  category: string | null;
  angle: string | null;
  display_order: number;
  created_at: string;
}

export interface PlayerReference {
  id: string;
  player_id: string;
  name: string;
  title: string;
  company: string | null;
  quote: string;
  photo_url: string | null;
  display_order: number;
  created_at: string;
}

export function usePlayerGallery(playerId: string | undefined) {
  return useQuery({
    queryKey: ['player_gallery', playerId],
    enabled: !!playerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_gallery_images' as any)
        .select('*')
        .eq('player_id', playerId!)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as GalleryImage[];
    },
  });
}

export function usePlayerReferences(playerId: string | undefined) {
  return useQuery({
    queryKey: ['player_references', playerId],
    enabled: !!playerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_references' as any)
        .select('*')
        .eq('player_id', playerId!)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data || []) as unknown as PlayerReference[];
    },
  });
}

export function useUpsertGalleryImage(playerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (g: Partial<GalleryImage> & { image_url: string }) => {
      if (g.id) {
        const { error } = await supabase.from('player_gallery_images' as any).update(g).eq('id', g.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('player_gallery_images' as any)
          .insert({ ...g, player_id: playerId } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['player_gallery', playerId] }),
  });
}

export function useDeleteGalleryImage(playerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('player_gallery_images' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['player_gallery', playerId] }),
  });
}

export function useUpsertReference(playerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (r: Partial<PlayerReference>) => {
      if (r.id) {
        const { error } = await supabase.from('player_references' as any).update(r).eq('id', r.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('player_references' as any)
          .insert({ ...r, player_id: playerId } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['player_references', playerId] }),
  });
}

export function useDeleteReference(playerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('player_references' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['player_references', playerId] }),
  });
}

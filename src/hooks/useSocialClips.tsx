import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const sb = supabase as any;

export type TextOverlay = {
  text: string;
  position: 'top' | 'center' | 'bottom';
  timing: 'start' | 'middle' | 'end';
  duration: number;
  style?: string;
};

export type SocialClip = {
  id: string;
  title: string;
  description: string | null;
  prompt: string;
  status: 'draft' | 'generating' | 'ready' | 'published';
  video_url: string | null;
  thumbnail_url: string | null;
  duration: number | null;
  aspect_ratio: string;
  music_track: string | null;
  text_overlays: TextOverlay[];
  generated_by: string | null;
  generation_params: Record<string, any>;
  is_published: boolean;
  published_at: string | null;
  social_platforms: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ClipTemplate = {
  id: string;
  name: string;
  description: string | null;
  base_prompt: string;
  default_duration: number;
  default_aspect_ratio: string;
  default_music: string | null;
  default_text_overlays: TextOverlay[];
  is_active: boolean;
  created_at: string;
};

export function useSocialClips() {
  return useQuery({
    queryKey: ['social-clips'],
    queryFn: async (): Promise<SocialClip[]> => {
      const { data, error } = await sb
        .from('social_clips')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as SocialClip[];
    },
  });
}

export function useSocialClip(id: string | undefined) {
  return useQuery({
    queryKey: ['social-clip', id],
    enabled: !!id,
    queryFn: async (): Promise<SocialClip | null> => {
      const { data, error } = await sb
        .from('social_clips')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as SocialClip | null;
    },
  });
}

export function useClipTemplates() {
  return useQuery({
    queryKey: ['clip-templates'],
    queryFn: async (): Promise<ClipTemplate[]> => {
      const { data, error } = await sb
        .from('clip_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return (data ?? []) as ClipTemplate[];
    },
  });
}

export function useCreateClip() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: Partial<SocialClip>) => {
      const { data, error } = await sb
        .from('social_clips')
        .insert({ ...input, created_by: user?.id })
        .select()
        .single();
      if (error) throw error;
      return data as SocialClip;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['social-clips'] }),
  });
}

export function useUpdateClip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<SocialClip> & { id: string }) => {
      const { data, error } = await sb
        .from('social_clips')
        .update(patch)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as SocialClip;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['social-clips'] });
      qc.invalidateQueries({ queryKey: ['social-clip', vars.id] });
    },
  });
}

export function useDeleteClip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb.from('social_clips').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['social-clips'] }),
  });
}

// Placeholder for future AI integration (Meta AI, Runway, Pika, Kling)
// Currently just marks the clip as "ready" so admins can manually attach a video URL.
export async function generateClipPlaceholder(clipId: string) {
  const { data, error } = await sb
    .from('social_clips')
    .update({
      status: 'ready',
      generated_by: 'placeholder',
    })
    .eq('id', clipId)
    .select()
    .single();
  if (error) throw error;
  return data as SocialClip;
}

export async function getSignedClipUrl(path: string) {
  const { data, error } = await supabase.storage
    .from('social-clips')
    .createSignedUrl(path, 3600);
  if (error) throw error;
  return data.signedUrl;
}

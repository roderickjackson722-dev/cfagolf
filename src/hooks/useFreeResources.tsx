import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FreeResource {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  file_url: string | null;
  file_path: string | null;
  file_type: string | null;
  file_size: string | null;
  thumbnail_url: string | null;
  download_count: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const TABLE = 'free_resources' as any;
const LOGS = 'resource_download_logs' as any;

export function useFreeResources() {
  return useQuery({
    queryKey: ['free_resources'],
    queryFn: async (): Promise<FreeResource[]> => {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return ((data || []) as unknown) as FreeResource[];
    },
  });
}

export function useFreeResourceBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['free_resource', slug],
    enabled: !!slug,
    queryFn: async (): Promise<FreeResource | null> => {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();
      if (error) throw error;
      return ((data || null) as unknown) as FreeResource | null;
    },
  });
}

export function useSaveFreeResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<FreeResource> & { id?: string }) => {
      const { id, ...rest } = payload;
      if (id) {
        const { error } = await supabase.from(TABLE).update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(TABLE).insert(rest as any);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['free_resources'] }),
  });
}

export function useDeleteFreeResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(TABLE).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['free_resources'] }),
  });
}

export function useDownloadLogs() {
  return useQuery({
    queryKey: ['resource_download_logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(LOGS)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2000);
      if (error) throw error;
      return data || [];
    },
  });
}

export async function trackResourceDownload(slug: string, source: string = 'Website') {
  await supabase.rpc('increment_resource_download' as any, {
    _slug: slug,
    _source: source,
    _downloaded_by: 'anonymous',
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

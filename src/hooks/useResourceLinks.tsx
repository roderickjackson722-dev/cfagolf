import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ResourceLink = {
  id: string;
  name: string;
  description: string | null;
  url: string;
  category: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  click_count: number;
  last_clicked_at: string | null;
};

export type LinkCategory = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

export function useResourceLinks(adminMode = false) {
  return useQuery({
    queryKey: ['resource_links', adminMode],
    queryFn: async () => {
      let q = supabase.from('resource_links').select('*').order('category').order('sort_order');
      if (!adminMode) q = q.eq('is_active', true);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as ResourceLink[];
    },
  });
}

export function useLinkCategories(adminMode = false) {
  return useQuery({
    queryKey: ['link_categories', adminMode],
    queryFn: async () => {
      let q = supabase.from('link_categories').select('*').order('sort_order');
      if (!adminMode) q = q.eq('is_active', true);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as LinkCategory[];
    },
  });
}

export function useSaveLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (link: Partial<ResourceLink> & { id?: string }) => {
      if (link.id) {
        const { error } = await supabase.from('resource_links').update(link).eq('id', link.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('resource_links').insert(link as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resource_links'] });
      toast.success('Link saved');
    },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDeleteLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('resource_links').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resource_links'] });
      toast.success('Link deleted');
    },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useSaveCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cat: Partial<LinkCategory> & { id?: string }) => {
      if (cat.id) {
        const { error } = await supabase.from('link_categories').update(cat).eq('id', cat.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('link_categories').insert(cat as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['link_categories'] });
      toast.success('Category saved');
    },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('link_categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['link_categories'] });
      toast.success('Category deleted');
    },
    onError: (e: any) => toast.error(e.message),
  });
}

export async function trackLinkClick(link: ResourceLink) {
  try {
    await supabase.rpc('increment_resource_link_click', { _id: link.id });
  } catch (e) {
    // silent fail
  }
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type ContentCategory = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

export type ContentItem = {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  storage_path: string | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  is_template: boolean;
  is_global: boolean;
  tags: string[];
  version: number;
  parent_template_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentVersion = {
  id: string;
  content_item_id: string;
  version_number: number;
  storage_path: string | null;
  file_url: string | null;
  file_name: string | null;
  changelog: string | null;
  created_by: string | null;
  created_at: string;
};

const BUCKET = 'content-files';

export async function getContentSignedUrl(storage_path: string, expiresIn = 3600) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(storage_path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

// ---------- Categories ----------
export function useContentCategories() {
  return useQuery({
    queryKey: ['content_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_categories' as any)
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return (data || []) as unknown as ContentCategory[];
    },
  });
}

export function useSaveContentCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cat: Partial<ContentCategory> & { id?: string }) => {
      if (cat.id) {
        const { id, ...rest } = cat;
        const { error } = await supabase.from('content_categories' as any).update(rest as any).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('content_categories' as any).insert(cat as any);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content_categories'] }),
  });
}

export function useDeleteContentCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('content_categories' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content_categories'] }),
  });
}

// ---------- Items ----------
export function useContentItems() {
  return useQuery({
    queryKey: ['content_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_items' as any)
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as ContentItem[];
    },
  });
}

export function useContentItem(id?: string) {
  return useQuery({
    queryKey: ['content_item', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('content_items' as any).select('*').eq('id', id!).single();
      if (error) throw error;
      return data as unknown as ContentItem;
    },
  });
}

export function useSaveContentItem() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (
      payload: Partial<ContentItem> & { id?: string; file?: File | null }
    ) => {
      const { file, id, ...rest } = payload as any;
      let storage_path = rest.storage_path ?? null;
      let file_name = rest.file_name ?? null;
      let file_type = rest.file_type ?? null;
      let file_size = rest.file_size ?? null;

      if (file instanceof File) {
        const ext = file.name.split('.').pop() || 'bin';
        storage_path = `templates/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(storage_path, file, { upsert: false });
        if (upErr) throw upErr;
        file_name = file.name;
        file_type = ext.toLowerCase();
        file_size = file.size;

        // Version archive when replacing
        if (id) {
          const { data: existing } = await supabase.from('content_items' as any).select('*').eq('id', id).single();
          if (existing && (existing as any).storage_path) {
            await supabase.from('content_versions' as any).insert({
              content_item_id: id,
              version_number: (existing as any).version || 1,
              storage_path: (existing as any).storage_path,
              file_url: (existing as any).file_url,
              file_name: (existing as any).file_name,
              changelog: rest.changelog || null,
              created_by: user?.id ?? null,
            } as any);
            rest.version = ((existing as any).version || 1) + 1;
          }
        }
      }

      const dbPayload: any = {
        title: rest.title,
        description: rest.description ?? null,
        category_id: rest.category_id ?? null,
        is_template: !!rest.is_template,
        is_global: rest.is_global !== false,
        tags: rest.tags || [],
        storage_path,
        file_name,
        file_type,
        file_size,
      };
      if (rest.version) dbPayload.version = rest.version;
      if (!id) dbPayload.created_by = user?.id ?? null;

      if (id) {
        const { error } = await supabase.from('content_items' as any).update(dbPayload).eq('id', id);
        if (error) throw error;
        return id;
      } else {
        const { data, error } = await supabase.from('content_items' as any).insert(dbPayload).select().single();
        if (error) throw error;
        return (data as any).id;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['content_items'] });
      qc.invalidateQueries({ queryKey: ['content_item'] });
      qc.invalidateQueries({ queryKey: ['content_versions'] });
    },
  });
}

export function useDeleteContentItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: ContentItem) => {
      if (item.storage_path) {
        await supabase.storage.from(BUCKET).remove([item.storage_path]);
      }
      const { error } = await supabase.from('content_items' as any).delete().eq('id', item.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content_items'] }),
  });
}

export function useContentVersions(itemId?: string) {
  return useQuery({
    queryKey: ['content_versions', itemId],
    enabled: !!itemId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_versions' as any)
        .select('*')
        .eq('content_item_id', itemId!)
        .order('version_number', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as ContentVersion[];
    },
  });
}

// ---------- Copy template to student(s) ----------
export function useCopyTemplateToStudents() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({
      template,
      studentIds,
      overrideTitle,
    }: {
      template: ContentItem;
      studentIds: string[];
      overrideTitle?: string;
    }) => {
      for (const studentId of studentIds) {
        let newStoragePath: string | null = null;
        if (template.storage_path) {
          const ext = (template.file_name || '').split('.').pop() || 'bin';
          newStoragePath = `students/${studentId}/${crypto.randomUUID()}.${ext}`;
          // Download from content-files, re-upload into student-files
          const { data: fileBlob, error: dlErr } = await supabase.storage
            .from(BUCKET)
            .download(template.storage_path);
          if (dlErr) throw dlErr;
          const { error: upErr } = await supabase.storage
            .from('student-files')
            .upload(newStoragePath, fileBlob);
          if (upErr) throw upErr;
        }
        const { error } = await supabase.from('student_content' as any).insert({
          student_id: studentId,
          source_template_id: template.id,
          title: overrideTitle || template.title,
          description: template.description,
          storage_path: newStoragePath,
          file_name: template.file_name,
          file_type: template.file_type,
          file_size: template.file_size,
          is_customized: false,
          created_by: user?.id ?? null,
        } as any);
        if (error) throw error;
        await supabase.from('student_activity_log' as any).insert({
          student_id: studentId,
          action: 'template_copied',
          details: { template_id: template.id, title: template.title },
          performed_by: user?.id ?? null,
        } as any);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['student_content'] });
      qc.invalidateQueries({ queryKey: ['student_activity'] });
    },
  });
}

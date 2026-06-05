import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type Student = {
  id: string;
  user_id: string | null;
  full_name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  graduation_year: number | null;
  handicap: number | null;
  scoring_average: number | null;
  high_school: string | null;
  gpa: number | null;
  notes: string | null;
  status: string;
  personal_website_url: string | null;
  created_at: string;
  updated_at: string;
};

export type StudentContent = {
  id: string;
  student_id: string;
  source_template_id: string | null;
  title: string;
  description: string | null;
  storage_path: string | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  is_customized: boolean;
  created_at: string;
  updated_at: string;
};

export type StudentNote = {
  id: string;
  student_id: string;
  note_text: string;
  note_type: string;
  pinned: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type StudentWebpage = {
  id: string;
  student_id: string;
  page_name: string;
  page_content: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type StudentActivity = {
  id: string;
  student_id: string;
  action: string;
  details: any;
  performed_by: string | null;
  created_at: string;
};

const SBUCKET = 'student-files';

export async function getStudentFileSignedUrl(storage_path: string, expiresIn = 3600) {
  const { data, error } = await supabase.storage.from(SBUCKET).createSignedUrl(storage_path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ---------- Students ----------
export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students' as any)
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Student[];
    },
  });
}

export function useStudent(id?: string) {
  return useQuery({
    queryKey: ['student', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('students' as any).select('*').eq('id', id!).single();
      if (error) throw error;
      return data as unknown as Student;
    },
  });
}

export function useSaveStudent() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (s: Partial<Student> & { id?: string }) => {
      const payload: any = { ...s };
      if (!payload.slug && payload.full_name) payload.slug = slugify(payload.full_name) + '-' + Math.random().toString(36).slice(2, 6);
      delete payload.id;
      delete payload.created_at;
      delete payload.updated_at;

      if (s.id) {
        const { error } = await supabase.from('students' as any).update(payload).eq('id', s.id);
        if (error) throw error;
        return s.id;
      } else {
        payload.created_by = user?.id ?? null;
        const { data, error } = await supabase.from('students' as any).insert(payload).select().single();
        if (error) throw error;
        return (data as any).id;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      qc.invalidateQueries({ queryKey: ['student'] });
    },
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('students' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  });
}

// ---------- Student content ----------
export function useStudentContent(studentId?: string) {
  return useQuery({
    queryKey: ['student_content', studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_content' as any)
        .select('*')
        .eq('student_id', studentId!)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as StudentContent[];
    },
  });
}

export function useUploadStudentFile() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({
      studentId,
      file,
      title,
      description,
    }: {
      studentId: string;
      file: File;
      title: string;
      description?: string;
    }) => {
      const ext = file.name.split('.').pop() || 'bin';
      const path = `students/${studentId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from(SBUCKET).upload(path, file);
      if (upErr) throw upErr;
      const { error } = await supabase.from('student_content' as any).insert({
        student_id: studentId,
        title,
        description: description || null,
        storage_path: path,
        file_name: file.name,
        file_type: ext.toLowerCase(),
        file_size: file.size,
        created_by: user?.id ?? null,
      } as any);
      if (error) throw error;
      await supabase.from('student_activity_log' as any).insert({
        student_id: studentId,
        action: 'file_uploaded',
        details: { title, file_name: file.name },
        performed_by: user?.id ?? null,
      } as any);
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ['student_content', v.studentId] });
      qc.invalidateQueries({ queryKey: ['student_activity', v.studentId] });
    },
  });
}

export function useUpdateStudentContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sc: Partial<StudentContent> & { id: string }) => {
      const { id, ...rest } = sc;
      const { error } = await supabase.from('student_content' as any).update(rest as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['student_content'] }),
  });
}

export function useDeleteStudentContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sc: StudentContent) => {
      if (sc.storage_path) await supabase.storage.from(SBUCKET).remove([sc.storage_path]);
      const { error } = await supabase.from('student_content' as any).delete().eq('id', sc.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['student_content'] }),
  });
}

// ---------- Notes ----------
export function useStudentNotes(studentId?: string) {
  return useQuery({
    queryKey: ['student_notes', studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_notes' as any)
        .select('*')
        .eq('student_id', studentId!)
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as StudentNote[];
    },
  });
}

export function useSaveStudentNote() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (n: Partial<StudentNote> & { student_id: string; note_text: string }) => {
      if (n.id) {
        const { id, ...rest } = n;
        const { error } = await supabase.from('student_notes' as any).update(rest as any).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('student_notes' as any).insert({
          student_id: n.student_id,
          note_text: n.note_text,
          note_type: n.note_type || 'general',
          pinned: !!n.pinned,
          created_by: user?.id ?? null,
        } as any);
        if (error) throw error;
        await supabase.from('student_activity_log' as any).insert({
          student_id: n.student_id,
          action: 'note_added',
          details: { note_type: n.note_type || 'general' },
          performed_by: user?.id ?? null,
        } as any);
      }
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ['student_notes', v.student_id] });
      qc.invalidateQueries({ queryKey: ['student_activity', v.student_id] });
    },
  });
}

export function useDeleteStudentNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('student_notes' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['student_notes'] }),
  });
}

// ---------- Custom webpages ----------
export function useStudentWebpages(studentId?: string) {
  return useQuery({
    queryKey: ['student_webpages', studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_custom_webpages' as any)
        .select('*')
        .eq('student_id', studentId!)
        .order('sort_order');
      if (error) throw error;
      return (data || []) as unknown as StudentWebpage[];
    },
  });
}

export function useSaveStudentWebpage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: Partial<StudentWebpage> & { student_id: string; page_name: string }) => {
      if (p.id) {
        const { id, ...rest } = p;
        const { error } = await supabase.from('student_custom_webpages' as any).update(rest as any).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('student_custom_webpages' as any).insert(p as any);
        if (error) throw error;
      }
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['student_webpages', v.student_id] }),
  });
}

export function useDeleteStudentWebpage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('student_custom_webpages' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['student_webpages'] }),
  });
}

// ---------- Activity log ----------
export function useStudentActivity(studentId?: string) {
  return useQuery({
    queryKey: ['student_activity', studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_activity_log' as any)
        .select('*')
        .eq('student_id', studentId!)
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data || []) as unknown as StudentActivity[];
    },
  });
}

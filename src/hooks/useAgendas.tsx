import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type AgendaTemplate = {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type AgendaTemplateTask = {
  id: string;
  template_id: string;
  title: string;
  description: string | null;
  link_url: string | null;
  link_text: string | null;
  assigned_to: string | null;
  sort_order: number;
  estimated_duration: number | null;
};

export type StudentAgenda = {
  id: string;
  student_id: string;
  template_id: string | null;
  title: string;
  meeting_date: string | null;
  meeting_type: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type StudentAgendaTask = {
  id: string;
  agenda_id: string;
  title: string;
  description: string | null;
  link_url: string | null;
  link_text: string | null;
  assigned_to: string | null;
  status: string;
  sort_order: number;
  estimated_duration: number | null;
  completed_at: string | null;
};

export type AgendaComment = {
  id: string;
  agenda_id: string;
  task_id: string | null;
  comment: string;
  created_by: string | null;
  created_at: string;
};

// ============ Templates ============
export function useAgendaTemplates() {
  return useQuery({
    queryKey: ['agenda_templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agenda_templates' as any)
        .select('*')
        .order('name');
      if (error) throw error;
      return (data || []) as unknown as AgendaTemplate[];
    },
  });
}

export function useAgendaTemplate(id?: string) {
  return useQuery({
    queryKey: ['agenda_template', id],
    enabled: !!id,
    queryFn: async () => {
      const { data: tpl, error: e1 } = await supabase.from('agenda_templates' as any).select('*').eq('id', id!).single();
      if (e1) throw e1;
      const { data: tasks, error: e2 } = await supabase
        .from('agenda_template_tasks' as any)
        .select('*')
        .eq('template_id', id!)
        .order('sort_order');
      if (e2) throw e2;
      return { template: tpl as unknown as AgendaTemplate, tasks: (tasks || []) as unknown as AgendaTemplateTask[] };
    },
  });
}

export function useSaveAgendaTemplate() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: {
      template: Partial<AgendaTemplate> & { name: string };
      tasks: Partial<AgendaTemplateTask>[];
    }) => {
      let templateId = input.template.id;
      if (templateId) {
        const { error } = await supabase
          .from('agenda_templates' as any)
          .update({
            name: input.template.name,
            description: input.template.description ?? null,
            is_default: !!input.template.is_default,
          } as any)
          .eq('id', templateId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('agenda_templates' as any)
          .insert({
            name: input.template.name,
            description: input.template.description ?? null,
            is_default: !!input.template.is_default,
            created_by: user?.id ?? null,
          } as any)
          .select()
          .single();
        if (error) throw error;
        templateId = (data as any).id;
      }
      // Replace tasks
      await supabase.from('agenda_template_tasks' as any).delete().eq('template_id', templateId!);
      if (input.tasks.length) {
        const rows = input.tasks.map((t, i) => ({
          template_id: templateId,
          title: t.title || 'Task',
          description: t.description ?? null,
          link_url: t.link_url ?? null,
          link_text: t.link_text ?? null,
          assigned_to: t.assigned_to ?? null,
          sort_order: i,
          estimated_duration: t.estimated_duration ?? null,
        }));
        const { error } = await supabase.from('agenda_template_tasks' as any).insert(rows as any);
        if (error) throw error;
      }
      return templateId!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['agenda_templates'] });
      qc.invalidateQueries({ queryKey: ['agenda_template'] });
    },
  });
}

export function useDeleteAgendaTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('agenda_templates' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agenda_templates'] }),
  });
}

// ============ Student Agendas ============
export function useStudentAgendas(studentId?: string) {
  return useQuery({
    queryKey: ['student_agendas', studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_agendas' as any)
        .select('*')
        .eq('student_id', studentId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as StudentAgenda[];
    },
  });
}

export function useStudentAgenda(id?: string) {
  return useQuery({
    queryKey: ['student_agenda', id],
    enabled: !!id,
    queryFn: async () => {
      const { data: a, error: e1 } = await supabase.from('student_agendas' as any).select('*').eq('id', id!).single();
      if (e1) throw e1;
      const { data: tasks, error: e2 } = await supabase
        .from('student_agenda_tasks' as any)
        .select('*')
        .eq('agenda_id', id!)
        .order('sort_order');
      if (e2) throw e2;
      const { data: comments, error: e3 } = await supabase
        .from('student_agenda_comments' as any)
        .select('*')
        .eq('agenda_id', id!)
        .order('created_at');
      if (e3) throw e3;
      return {
        agenda: a as unknown as StudentAgenda,
        tasks: (tasks || []) as unknown as StudentAgendaTask[],
        comments: (comments || []) as unknown as AgendaComment[],
      };
    },
  });
}

export function useCreateAgendaFromTemplate() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({
      studentId,
      templateId,
      title,
      meeting_date,
      meeting_type,
    }: {
      studentId: string;
      templateId?: string;
      title: string;
      meeting_date?: string;
      meeting_type?: string;
    }) => {
      const { data: a, error } = await supabase
        .from('student_agendas' as any)
        .insert({
          student_id: studentId,
          template_id: templateId ?? null,
          title,
          meeting_date: meeting_date || null,
          meeting_type: meeting_type || null,
          status: 'draft',
          created_by: user?.id ?? null,
        } as any)
        .select()
        .single();
      if (error) throw error;
      const agendaId = (a as any).id;

      if (templateId) {
        const { data: tpl } = await supabase
          .from('agenda_template_tasks' as any)
          .select('*')
          .eq('template_id', templateId)
          .order('sort_order');
        const rows = (tpl || []).map((t: any, i: number) => ({
          agenda_id: agendaId,
          title: t.title,
          description: t.description,
          link_url: t.link_url,
          link_text: t.link_text,
          assigned_to: t.assigned_to,
          estimated_duration: t.estimated_duration,
          sort_order: i,
          status: 'pending',
        }));
        if (rows.length) {
          await supabase.from('student_agenda_tasks' as any).insert(rows as any);
        }
      }
      return agendaId as string;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['student_agendas', v.studentId] }),
  });
}

export function useUpdateAgenda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (a: Partial<StudentAgenda> & { id: string }) => {
      const { id, ...rest } = a;
      const { error } = await supabase.from('student_agendas' as any).update(rest as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ['student_agenda', v.id] });
      qc.invalidateQueries({ queryKey: ['student_agendas'] });
    },
  });
}

export function useDeleteAgenda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('student_agendas' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['student_agendas'] }),
  });
}

export function useSaveAgendaTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (t: Partial<StudentAgendaTask> & { agenda_id: string }) => {
      if (t.id) {
        const { id, ...rest } = t;
        const { error } = await supabase.from('student_agenda_tasks' as any).update(rest as any).eq('id', id);
        if (error) throw error;
        return id;
      } else {
        const { data, error } = await supabase.from('student_agenda_tasks' as any).insert(t as any).select().single();
        if (error) throw error;
        return (data as any).id;
      }
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['student_agenda', v.agenda_id] }),
  });
}

export function useDeleteAgendaTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string; agenda_id: string }) => {
      const { error } = await supabase.from('student_agenda_tasks' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['student_agenda', v.agenda_id] }),
  });
}

export function useAddAgendaComment() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ agenda_id, task_id, comment }: { agenda_id: string; task_id?: string; comment: string }) => {
      const { error } = await supabase.from('student_agenda_comments' as any).insert({
        agenda_id,
        task_id: task_id ?? null,
        comment,
        created_by: user?.id ?? null,
      } as any);
      if (error) throw error;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['student_agenda', v.agenda_id] }),
  });
}

// Student-facing: list own agendas via student.user_id mapping
export function useMyAgendas() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my_agendas', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data: students } = await supabase.from('students' as any).select('id, full_name').eq('user_id', user!.id);
      const ids = (students || []).map((s: any) => s.id);
      if (!ids.length) return [];
      const { data, error } = await supabase
        .from('student_agendas' as any)
        .select('*')
        .in('student_id', ids)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as StudentAgenda[];
    },
  });
}

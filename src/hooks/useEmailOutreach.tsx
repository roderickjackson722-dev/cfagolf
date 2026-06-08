import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type EmailTemplateSection = {
  id: string;
  template_id: string;
  title: string | null;
  content: string;
  sort_order: number;
  has_action_items: boolean;
};

export type EmailTemplateActionItem = {
  id: string;
  section_id: string;
  task: string;
  description: string | null;
  link_url: string | null;
  link_text: string | null;
  sort_order: number;
};

export type EmailTemplateVariable = {
  id: string;
  template_id: string;
  variable_name: string;
  variable_label: string | null;
  variable_type: string;
  is_required: boolean;
};

export type OutreachRecord = {
  id: string;
  template_id: string | null;
  student_id: string | null;
  recipient_email: string;
  recipient_name: string | null;
  subject: string | null;
  body: string | null;
  variables_used: Record<string, string> | null;
  sent_at: string;
  status: string;
  notes: string | null;
  cc: string[] | null;
  bcc: string[] | null;
};

export type FullTemplate = EmailTemplate & {
  sections: (EmailTemplateSection & { action_items: EmailTemplateActionItem[] })[];
  variables: EmailTemplateVariable[];
};

export function useEmailTemplates() {
  return useQuery({
    queryKey: ['email-templates-v2'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates_v2' as any)
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as EmailTemplate[];
    },
  });
}

export function useFullTemplate(id: string | null) {
  return useQuery({
    queryKey: ['email-template-full', id],
    enabled: !!id,
    queryFn: async (): Promise<FullTemplate | null> => {
      if (!id) return null;
      const [{ data: t }, { data: s }, { data: a }, { data: v }] = await Promise.all([
        supabase.from('email_templates_v2' as any).select('*').eq('id', id).maybeSingle(),
        supabase.from('email_template_sections' as any).select('*').eq('template_id', id).order('sort_order'),
        supabase.from('email_template_action_items' as any).select('*'),
        supabase.from('email_template_variables' as any).select('*').eq('template_id', id),
      ]);
      if (!t) return null;
      const sectionIds = new Set((s || []).map((x: any) => x.id));
      const sections = ((s || []) as any[]).map((sec: any) => ({
        ...sec,
        action_items: ((a || []) as any[])
          .filter((ai: any) => ai.section_id === sec.id)
          .sort((x: any, y: any) => x.sort_order - y.sort_order),
      }));
      return {
        ...(t as any),
        sections,
        variables: (v || []) as any,
      };
    },
  });
}

export function useSaveTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      template: Partial<EmailTemplate> & { id?: string };
      sections: (Partial<EmailTemplateSection> & { action_items: Partial<EmailTemplateActionItem>[] })[];
      variables: Partial<EmailTemplateVariable>[];
    }) => {
      let templateId = input.template.id;
      const payload = {
        name: input.template.name,
        subject: input.template.subject,
        description: input.template.description,
        category: input.template.category,
        is_active: input.template.is_active ?? true,
      };
      if (templateId) {
        const { error } = await supabase.from('email_templates_v2' as any).update(payload).eq('id', templateId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('email_templates_v2' as any).insert(payload).select('id').single();
        if (error) throw error;
        templateId = (data as any).id;
      }
      // Replace sections & variables
      await supabase.from('email_template_sections' as any).delete().eq('template_id', templateId);
      await supabase.from('email_template_variables' as any).delete().eq('template_id', templateId);

      for (let i = 0; i < input.sections.length; i++) {
        const sec = input.sections[i];
        const { data: secRow, error: secErr } = await supabase
          .from('email_template_sections' as any)
          .insert({
            template_id: templateId,
            title: sec.title || null,
            content: sec.content || '',
            sort_order: i,
            has_action_items: !!sec.has_action_items,
          })
          .select('id')
          .single();
        if (secErr) throw secErr;
        const secId = (secRow as any).id;
        if (sec.action_items?.length) {
          const rows = sec.action_items.map((ai, idx) => ({
            section_id: secId,
            task: ai.task || '',
            description: ai.description || null,
            link_url: ai.link_url || null,
            link_text: ai.link_text || null,
            sort_order: idx,
          }));
          const { error: aiErr } = await supabase.from('email_template_action_items' as any).insert(rows);
          if (aiErr) throw aiErr;
        }
      }
      if (input.variables.length) {
        const rows = input.variables.map((v) => ({
          template_id: templateId,
          variable_name: v.variable_name || '',
          variable_label: v.variable_label || null,
          variable_type: v.variable_type || 'text',
          is_required: !!v.is_required,
        }));
        await supabase.from('email_template_variables' as any).insert(rows);
      }
      return templateId!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['email-templates-v2'] });
      qc.invalidateQueries({ queryKey: ['email-template-full'] });
    },
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('email_templates_v2' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['email-templates-v2'] }),
  });
}

export function useOutreachHistory() {
  return useQuery({
    queryKey: ['outreach-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outreach_history' as any)
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data || []) as unknown as OutreachRecord[];
    },
  });
}

export function useLogOutreach() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rec: Partial<OutreachRecord>) => {
      const { error } = await supabase.from('outreach_history' as any).insert(rec as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['outreach-history'] }),
  });
}

// Variable replacement utility
export function replaceVariables(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

// Build the branded HTML email
export function renderEmailHtml(opts: {
  subject: string;
  studentName: string;
  sections: (EmailTemplateSection & { action_items: EmailTemplateActionItem[] })[];
  vars: Record<string, string>;
}): string {
  const { subject, studentName, sections, vars } = opts;
  const r = (s: string) => replaceVariables(s || '', vars);
  const year = new Date().getFullYear();

  const sectionsHtml = sections
    .map((sec) => {
      const title = sec.title ? `<h2 style="font-size:18px;font-weight:600;color:#1a3a2b;border-left:4px solid #c8a954;padding-left:12px;margin:0 0 16px 0;">${r(sec.title)}</h2>` : '';
      const content = sec.content
        ? `<p style="font-size:15px;line-height:1.6;color:#1e293b;margin:0 0 16px 0;">${r(sec.content).replace(/\n/g, '<br/>')}</p>`
        : '';
      const items = sec.has_action_items
        ? sec.action_items
            .map((ai) => {
              const link = ai.link_url
                ? `<div><a href="${r(ai.link_url)}" style="display:inline-block;font-size:14px;color:#c8a954;text-decoration:none;margin-top:4px;">🔗 ${r(ai.link_text || ai.link_url)} →</a></div>`
                : '';
              const desc = ai.description
                ? `<p style="font-size:14px;color:#475569;margin:0 0 8px 0;">${r(ai.description)}</p>`
                : '';
              return `<div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:12px;border:1px solid #e2e8f0;"><p style="font-weight:600;color:#1e293b;margin:0 0 6px 0;">☐ ${r(ai.task)}</p>${desc}${link}</div>`;
            })
            .join('')
        : '';
      return `<div style="margin-bottom:28px;">${title}${content}${items}</div>`;
    })
    .join('');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${r(subject)}</title></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
    <div style="background:linear-gradient(135deg,#1a3a2b 0%,#0d2b1c 100%);padding:32px 24px;text-align:center;">
      <div style="font-size:28px;font-weight:bold;color:#ffffff;">College Fairway <span style="color:#c8a954;">Advisors</span></div>
      <div style="font-size:14px;color:#a8c4b0;margin-top:8px;">Building Golf Careers, Funding College Dreams</div>
    </div>
    <div style="padding:32px 24px;">
      <p style="font-size:15px;color:#1e293b;margin:0 0 20px 0;">Dear ${studentName} and Family,</p>
      ${sectionsHtml}
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;"/>
      <p style="font-size:15px;color:#1e293b;margin:0;">Best regards,<br/><strong>Coach Rod</strong><br/>College Fairway Advisors</p>
    </div>
    <div style="background:#f8fafc;padding:24px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="font-size:12px;color:#64748b;margin:4px 0;">© ${year} College Fairway Advisors. All rights reserved.</p>
      <p style="font-size:12px;color:#64748b;margin:4px 0;"><a href="https://www.cfa.golf" style="color:#c8a954;text-decoration:none;">www.cfa.golf</a></p>
    </div>
  </div>
</body></html>`;
}

export function renderEmailPlainText(opts: {
  studentName: string;
  sections: (EmailTemplateSection & { action_items: EmailTemplateActionItem[] })[];
  vars: Record<string, string>;
}): string {
  const { studentName, sections, vars } = opts;
  const r = (s: string) => replaceVariables(s || '', vars);
  const lines: string[] = [`Dear ${studentName} and Family,`, ''];
  sections.forEach((sec) => {
    if (sec.title) lines.push(r(sec.title).toUpperCase(), '');
    if (sec.content) lines.push(r(sec.content), '');
    if (sec.has_action_items) {
      sec.action_items.forEach((ai) => {
        lines.push(`☐ ${r(ai.task)}`);
        if (ai.description) lines.push(`   ${r(ai.description)}`);
        if (ai.link_url) lines.push(`   ${r(ai.link_text || ai.link_url)}: ${r(ai.link_url)}`);
        lines.push('');
      });
    }
  });
  lines.push('', 'Best regards,', 'Coach Rod', 'College Fairway Advisors', 'www.cfa.golf');
  return lines.join('\n');
}

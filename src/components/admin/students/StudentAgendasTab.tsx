import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  useStudentAgendas,
  useAgendaTemplates,
  useAgendaTemplate,
  useDeleteAgenda,
  type AgendaTemplateTask,
} from '@/hooks/useAgendas';
import { useQueryClient } from '@tanstack/react-query';

const MEETING_TYPES = ['Strategy Call', 'Monthly Check-in', 'Coach Call Prep', 'College Commitment Prep', 'Custom'];

export default function StudentAgendasTab({ studentId }: { studentId: string }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: agendas, isLoading } = useStudentAgendas(studentId);
  const { data: templates } = useAgendaTemplates();
  const del = useDeleteAgenda();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [templateId, setTemplateId] = useState<string>('none');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingType, setMeetingType] = useState<string>('Strategy Call');
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);

  const { data: tplDetail } = useAgendaTemplate(templateId !== 'none' ? templateId : undefined);
  const templateTasks: AgendaTemplateTask[] = tplDetail?.tasks || [];

  // When template loads, default to all tasks selected
  useEffect(() => {
    if (tplDetail?.tasks) {
      setSelectedTaskIds(new Set(tplDetail.tasks.map((t) => t.id)));
    } else {
      setSelectedTaskIds(new Set());
    }
  }, [tplDetail]);

  const onTemplateChange = (id: string) => {
    setTemplateId(id);
    if (id !== 'none') {
      const t = templates?.find((x) => x.id === id);
      if (t && !title) setTitle(t.name);
    }
  };

  const toggleTask = (id: string) => {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const onCreate = async () => {
    if (!title.trim()) return toast({ title: 'Title required', variant: 'destructive' });
    setCreating(true);
    try {
      const { data: a, error } = await supabase
        .from('student_agendas' as any)
        .insert({
          student_id: studentId,
          template_id: templateId === 'none' ? null : templateId,
          title,
          meeting_date: meetingDate || null,
          meeting_type: meetingType || null,
          status: 'draft',
          created_by: user?.id ?? null,
        } as any)
        .select()
        .single();
      if (error) throw error;
      const agendaId = (a as any).id;

      // Copy only selected template tasks
      if (templateId !== 'none' && templateTasks.length) {
        const picked = templateTasks.filter((t) => selectedTaskIds.has(t.id));
        if (picked.length) {
          const rows = picked.map((t, i) => ({
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
          const { error: tErr } = await supabase.from('student_agenda_tasks' as any).insert(rows as any);
          if (tErr) throw tErr;
        }
      }

      qc.invalidateQueries({ queryKey: ['student_agendas', studentId] });
      toast({ title: 'Agenda created' });
      setOpen(false);
      setTitle('');
      setTemplateId('none');
      setMeetingDate('');
      navigate(`/admin/students/${studentId}/agendas/${agendaId}`);
    } catch (e: any) {
      toast({ title: 'Failed', description: e.message, variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Meeting Agendas</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link to="/admin/agenda-templates">Manage Templates</Link>
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />New Agenda
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : !agendas?.length ? (
        <div className="text-sm text-muted-foreground">No agendas yet. Create one from a template above.</div>
      ) : (
        <div className="grid gap-2">
          {agendas.map((a) => (
            <Card key={a.id}>
              <CardContent className="p-3 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-1">
                    {a.meeting_date && <span>{a.meeting_date}</span>}
                    {a.meeting_type && <span>· {a.meeting_type}</span>}
                    <Badge variant="outline" className="text-xs">{a.status}</Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/admin/students/${studentId}/agendas/${a.id}`}>
                      <ExternalLink className="w-4 h-4 mr-1" />Open & Edit
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm('Delete this agenda?')) del.mutate(a.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Meeting Agenda</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Start From Template</Label>
              <Select value={templateId} onValueChange={onTemplateChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Start from scratch —</SelectItem>
                  {(templates || []).map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. June Strategy Call" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Meeting Date</Label>
                <Input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={meetingType} onValueChange={setMeetingType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MEETING_TYPES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {templateId !== 'none' && templateTasks.length > 0 && (
              <div className="border rounded-md p-3 space-y-2 bg-muted/30">
                <div className="flex items-center justify-between">
                  <Label>Pick the items you want to include</Label>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      className="underline"
                      onClick={() => setSelectedTaskIds(new Set(templateTasks.map((t) => t.id)))}
                    >Select all</button>
                    <button
                      type="button"
                      className="underline"
                      onClick={() => setSelectedTaskIds(new Set())}
                    >Clear</button>
                  </div>
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {templateTasks.map((t) => (
                    <label key={t.id} className="flex items-start gap-2 p-2 rounded hover:bg-background cursor-pointer">
                      <Checkbox
                        checked={selectedTaskIds.has(t.id)}
                        onCheckedChange={() => toggleTask(t.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 text-sm">
                        <div className="font-medium">{t.title}</div>
                        {t.description && <div className="text-xs text-muted-foreground">{t.description}</div>}
                      </div>
                    </label>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  You can edit, reorder, and add more tasks after creating the agenda.
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onCreate} disabled={creating}>
              {creating ? 'Creating…' : 'Create & Open'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

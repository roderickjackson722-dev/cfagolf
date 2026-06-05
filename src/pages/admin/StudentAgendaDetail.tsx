import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Printer, Save, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useStudent } from '@/hooks/useStudents';
import {
  useStudentAgenda,
  useUpdateAgenda,
  useSaveAgendaTask,
  useDeleteAgendaTask,
  useAddAgendaComment,
  type StudentAgendaTask,
} from '@/hooks/useAgendas';

const TASK_STATUSES = ['pending', 'in_progress', 'completed', 'blocked'];
const ASSIGNEES = ['student', 'parent', 'coach', 'admin'];

export default function StudentAgendaDetail() {
  const { id: studentId, agendaId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: aLoad } = useIsAdmin();
  const { data: student } = useStudent(studentId);
  const { data, isLoading } = useStudentAgenda(agendaId);
  const updateAgenda = useUpdateAgenda();
  const saveTask = useSaveAgendaTask();
  const delTask = useDeleteAgendaTask();
  const addComment = useAddAgendaComment();

  const [title, setTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingType, setMeetingType] = useState('');
  const [status, setStatus] = useState('draft');
  const [notes, setNotes] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  useEffect(() => {
    if (data?.agenda) {
      setTitle(data.agenda.title);
      setMeetingDate(data.agenda.meeting_date || '');
      setMeetingType(data.agenda.meeting_type || '');
      setStatus(data.agenda.status);
      setNotes(data.agenda.notes || '');
    }
  }, [data]);

  if (loading || aLoad || isLoading) return <div className="p-8 text-center">Loading…</div>;
  if (!isAdmin) return <div className="p-8 text-center">Admin access required.</div>;
  if (!data) return <div className="p-8 text-center">Agenda not found.</div>;

  const saveAgenda = async () => {
    await updateAgenda.mutateAsync({
      id: agendaId!,
      title,
      meeting_date: meetingDate || null,
      meeting_type: meetingType || null,
      status,
      notes,
    });
    toast({ title: 'Agenda saved' });
  };

  const addTask = async () => {
    await saveTask.mutateAsync({
      agenda_id: agendaId!,
      title: 'New task',
      sort_order: data.tasks.length,
      status: 'pending',
    });
  };

  const updateTask = async (t: StudentAgendaTask, patch: Partial<StudentAgendaTask>) => {
    const next: any = { id: t.id, agenda_id: agendaId!, ...patch };
    if (patch.status === 'completed' && t.status !== 'completed') next.completed_at = new Date().toISOString();
    if (patch.status && patch.status !== 'completed') next.completed_at = null;
    await saveTask.mutateAsync(next);
  };

  return (
    <div className="min-h-screen bg-background print:bg-white">
      <div className="container mx-auto py-6 px-4 space-y-4 max-w-4xl">
        <div className="flex items-center justify-between print:hidden">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/admin/students/${studentId}?tab=agendas`}>
              <ArrowLeft className="w-4 h-4 mr-1" />Back
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-1" />Print
            </Button>
            <Button onClick={saveAgenda} disabled={updateAgenda.isPending}>
              <Save className="w-4 h-4 mr-1" />Save
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="text-sm text-muted-foreground">{student?.full_name}</div>
            <Input className="text-xl font-bold" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label>Date</Label>
                <Input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
              </div>
              <div>
                <Label>Type</Label>
                <Input value={meetingType} onChange={(e) => setMeetingType(e.target.value)} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['draft', 'scheduled', 'completed', 'cancelled'].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Tasks</h2>
            <Button size="sm" variant="outline" onClick={addTask} className="print:hidden">
              <Plus className="w-4 h-4 mr-1" />Add Task
            </Button>
          </div>
          {data.tasks.map((t) => (
            <Card key={t.id} className={t.status === 'completed' ? 'opacity-70' : ''}>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => updateTask(t, { status: t.status === 'completed' ? 'pending' : 'completed' })}
                    className="mt-1 print:hidden"
                  >
                    <CheckCircle2 className={`w-5 h-5 ${t.status === 'completed' ? 'text-green-600' : 'text-muted-foreground'}`} />
                  </button>
                  <Input
                    className="flex-1 font-medium"
                    value={t.title}
                    onChange={(e) => updateTask(t, { title: e.target.value })}
                  />
                  <Select value={t.status} onValueChange={(v) => updateTask(t, { status: v })}>
                    <SelectTrigger className="w-36 print:hidden"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TASK_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="ghost" onClick={() => delTask.mutate({ id: t.id, agenda_id: agendaId! })} className="print:hidden">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Description"
                  value={t.description || ''}
                  onChange={(e) => updateTask(t, { description: e.target.value })}
                  rows={2}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 print:hidden">
                  <Input
                    placeholder="Link URL"
                    value={t.link_url || ''}
                    onChange={(e) => updateTask(t, { link_url: e.target.value })}
                  />
                  <Input
                    placeholder="Link text"
                    value={t.link_text || ''}
                    onChange={(e) => updateTask(t, { link_text: e.target.value })}
                  />
                  <Select value={t.assigned_to || 'student'} onValueChange={(v) => updateTask(t, { assigned_to: v })}>
                    <SelectTrigger><SelectValue placeholder="Assigned to" /></SelectTrigger>
                    <SelectContent>
                      {ASSIGNEES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {t.link_url && (
                  <a
                    href={t.link_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary underline inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />{t.link_text || t.link_url}
                  </a>
                )}
                {t.assigned_to && <Badge variant="outline" className="text-xs">→ {t.assigned_to}</Badge>}
              </CardContent>
            </Card>
          ))}
          {!data.tasks.length && <div className="text-sm text-muted-foreground">No tasks yet.</div>}
        </div>

        <Card>
          <CardContent className="p-4 space-y-2">
            <Label>Meeting Notes</Label>
            <Textarea rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </CardContent>
        </Card>

        <Card className="print:hidden">
          <CardContent className="p-4 space-y-3">
            <Label>Follow-up Comments</Label>
            <div className="space-y-2">
              {data.comments.map((c) => (
                <div key={c.id} className="text-sm border-l-2 border-muted pl-3">
                  <div className="whitespace-pre-wrap">{c.comment}</div>
                  <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</div>
                </div>
              ))}
              {!data.comments.length && <div className="text-sm text-muted-foreground">No comments yet.</div>}
            </div>
            <div className="flex gap-2">
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a follow-up..." rows={2} />
              <Button
                onClick={async () => {
                  if (!comment.trim()) return;
                  await addComment.mutateAsync({ agenda_id: agendaId!, comment });
                  setComment('');
                }}
              >Post</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

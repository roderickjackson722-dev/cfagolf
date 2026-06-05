import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import {
  useStudentAgendas,
  useAgendaTemplates,
  useCreateAgendaFromTemplate,
  useDeleteAgenda,
} from '@/hooks/useAgendas';

const MEETING_TYPES = ['Strategy Call', 'Monthly Check-in', 'Coach Call Prep', 'College Commitment Prep', 'Custom'];

export default function StudentAgendasTab({ studentId }: { studentId: string }) {
  const { data: agendas, isLoading } = useStudentAgendas(studentId);
  const { data: templates } = useAgendaTemplates();
  const create = useCreateAgendaFromTemplate();
  const del = useDeleteAgenda();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [templateId, setTemplateId] = useState<string>('none');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingType, setMeetingType] = useState<string>('Strategy Call');

  const onCreate = async () => {
    if (!title.trim()) return toast({ title: 'Title required', variant: 'destructive' });
    try {
      await create.mutateAsync({
        studentId,
        templateId: templateId === 'none' ? undefined : templateId,
        title,
        meeting_date: meetingDate || undefined,
        meeting_type: meetingType,
      });
      toast({ title: 'Agenda created' });
      setOpen(false);
      setTitle('');
      setTemplateId('none');
      setMeetingDate('');
    } catch (e: any) {
      toast({ title: 'Failed', description: e.message, variant: 'destructive' });
    }
  };

  // Auto-fill title from template
  const onTemplateChange = (id: string) => {
    setTemplateId(id);
    if (id !== 'none' && !title) {
      const t = templates?.find((x) => x.id === id);
      if (t) setTitle(t.name);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Meeting Agendas</h3>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-1" />New Agenda
        </Button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : !agendas?.length ? (
        <div className="text-sm text-muted-foreground">No agendas yet.</div>
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
                      <ExternalLink className="w-4 h-4 mr-1" />Open
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Agenda</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Template (optional)</Label>
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
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onCreate} disabled={create.isPending}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

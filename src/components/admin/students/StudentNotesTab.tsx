import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pin, Trash2 } from 'lucide-react';
import { useStudentNotes, useSaveStudentNote, useDeleteStudentNote } from '@/hooks/useStudents';
import { toast } from '@/hooks/use-toast';

const TYPES = ['general', 'coaching', 'recruiting', 'academic'];

export default function StudentNotesTab({ studentId }: { studentId: string }) {
  const { data: notes = [] } = useStudentNotes(studentId);
  const save = useSaveStudentNote();
  const del = useDeleteStudentNote();

  const [text, setText] = useState('');
  const [type, setType] = useState('general');
  const [pinned, setPinned] = useState(false);
  const [filter, setFilter] = useState('all');

  const add = async () => {
    if (!text.trim()) return;
    try {
      await save.mutateAsync({ student_id: studentId, note_text: text.trim(), note_type: type, pinned });
      setText(''); setPinned(false);
      toast({ title: 'Note added' });
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    }
  };

  const filtered = filter === 'all' ? notes : notes.filter((n) => n.note_type === filter);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-3">
          <Textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a note…" />
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} /> Pin
            </label>
            <Button className="ml-auto" onClick={add} disabled={save.isPending}>Add Note</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 items-center">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">No notes.</p>}
        {filtered.map((n) => (
          <Card key={n.id}>
            <CardContent className="p-3 flex justify-between gap-3">
              <div className="flex-1">
                <div className="flex gap-2 items-center mb-1">
                  <Badge variant="outline">{n.note_type}</Badge>
                  {n.pinned && <Pin className="w-3 h-3 text-primary" />}
                  <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</span>
                </div>
                <div className="whitespace-pre-wrap text-sm">{n.note_text}</div>
              </div>
              <div className="flex flex-col gap-1">
                <Button size="sm" variant="ghost" onClick={() => save.mutate({ id: n.id, student_id: studentId, note_text: n.note_text, pinned: !n.pinned } as any)}>
                  <Pin className={`w-4 h-4 ${n.pinned ? 'text-primary' : ''}`} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { if (confirm('Delete note?')) del.mutate(n.id); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

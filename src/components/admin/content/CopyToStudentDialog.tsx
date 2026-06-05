import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useStudents } from '@/hooks/useStudents';
import { useCopyTemplateToStudents, ContentItem } from '@/hooks/useContentLibrary';
import { toast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  template: ContentItem | null;
}

export default function CopyToStudentDialog({ open, onOpenChange, template }: Props) {
  const { data: students = [] } = useStudents();
  const copy = useCopyTemplateToStudents();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [overrideTitle, setOverrideTitle] = useState('');

  const filtered = students.filter((s) => s.full_name.toLowerCase().includes(search.toLowerCase()));

  const toggle = (id: string) => {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const handleCopy = async () => {
    if (!template || selected.size === 0) return;
    try {
      await copy.mutateAsync({
        template,
        studentIds: Array.from(selected),
        overrideTitle: overrideTitle.trim() || undefined,
      });
      toast({ title: `Copied to ${selected.size} student(s)` });
      setSelected(new Set());
      setOverrideTitle('');
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: 'Copy failed', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copy "{template?.title}" to Student(s)</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Title override (optional)</Label>
            <Input value={overrideTitle} onChange={(e) => setOverrideTitle(e.target.value)} placeholder={template?.title} />
          </div>
          <Input placeholder="Search students…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="max-h-64 overflow-y-auto border rounded-md divide-y">
            {filtered.length === 0 && <div className="p-3 text-sm text-muted-foreground">No students.</div>}
            {filtered.map((s) => (
              <label key={s.id} className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer">
                <Checkbox checked={selected.has(s.id)} onCheckedChange={() => toggle(s.id)} />
                <span className="text-sm">{s.full_name}{s.graduation_year ? ` · ${s.graduation_year}` : ''}</span>
              </label>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">{selected.size} selected</div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCopy} disabled={copy.isPending || selected.size === 0}>
            {copy.isPending ? 'Copying…' : 'Copy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

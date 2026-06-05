import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSaveStudent, Student } from '@/hooks/useStudents';
import { toast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  student?: Student | null;
}

export default function StudentDialog({ open, onOpenChange, student }: Props) {
  const save = useSaveStudent();
  const [form, setForm] = useState<Partial<Student>>({});

  useEffect(() => {
    if (open) {
      setForm(
        student ?? {
          full_name: '',
          status: 'active',
        }
      );
    }
  }, [open, student]);

  const set = (k: keyof Student, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.full_name?.trim()) {
      toast({ title: 'Name required', variant: 'destructive' });
      return;
    }
    try {
      await save.mutateAsync(form);
      toast({ title: student ? 'Updated' : 'Created' });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{student ? 'Edit Student' : 'New Student'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label>Full Name *</Label>
            <Input value={form.full_name ?? ''} onChange={(e) => set('full_name', e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div>
            <Label>Graduation Year</Label>
            <Input type="number" value={form.graduation_year ?? ''} onChange={(e) => set('graduation_year', e.target.value ? parseInt(e.target.value) : null)} />
          </div>
          <div>
            <Label>High School</Label>
            <Input value={form.high_school ?? ''} onChange={(e) => set('high_school', e.target.value)} />
          </div>
          <div>
            <Label>Handicap</Label>
            <Input type="number" step="0.1" value={form.handicap ?? ''} onChange={(e) => set('handicap', e.target.value ? parseFloat(e.target.value) : null)} />
          </div>
          <div>
            <Label>Scoring Average</Label>
            <Input type="number" step="0.1" value={form.scoring_average ?? ''} onChange={(e) => set('scoring_average', e.target.value ? parseFloat(e.target.value) : null)} />
          </div>
          <div>
            <Label>GPA</Label>
            <Input type="number" step="0.01" value={form.gpa ?? ''} onChange={(e) => set('gpa', e.target.value ? parseFloat(e.target.value) : null)} />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status ?? 'active'} onValueChange={(v) => set('status', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Personal Website URL (e.g. /p/john-smith)</Label>
            <Input value={form.personal_website_url ?? ''} onChange={(e) => set('personal_website_url', e.target.value)} placeholder="https://cfa.golf/p/john-smith" />
          </div>
          <div className="col-span-2">
            <Label>Admin Notes</Label>
            <Textarea rows={3} value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

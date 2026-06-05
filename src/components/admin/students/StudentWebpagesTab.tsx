import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Trash2, Eye } from 'lucide-react';
import { useStudentWebpages, useSaveStudentWebpage, useDeleteStudentWebpage, StudentWebpage } from '@/hooks/useStudents';
import { toast } from '@/hooks/use-toast';

export default function StudentWebpagesTab({ studentId }: { studentId: string }) {
  const { data: pages = [] } = useStudentWebpages(studentId);
  const save = useSaveStudentWebpage();
  const del = useDeleteStudentWebpage();
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState<StudentWebpage | null>(null);

  const add = async () => {
    if (!name.trim()) return;
    try {
      await save.mutateAsync({
        student_id: studentId,
        page_name: name.trim(),
        page_content: content,
        sort_order: pages.length * 10,
      });
      setName(''); setContent('');
      toast({ title: 'Section added' });
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold">New Custom Section</h3>
          <div>
            <Label>Section name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="bio, stats, about-me" />
          </div>
          <div>
            <Label>Content (HTML or text)</Label>
            <Textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} className="font-mono text-xs" />
          </div>
          <Button onClick={add} disabled={save.isPending}>Add Section</Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {pages.length === 0 && <p className="text-sm text-muted-foreground">No custom sections.</p>}
        {pages.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  value={p.page_name}
                  className="flex-1 font-medium"
                  onChange={(e) => save.mutate({ id: p.id, student_id: studentId, page_name: e.target.value } as any)}
                />
                <Input
                  type="number"
                  value={p.sort_order}
                  className="w-20"
                  onChange={(e) => save.mutate({ id: p.id, student_id: studentId, page_name: p.page_name, sort_order: parseInt(e.target.value) || 0 } as any)}
                />
                <label className="flex items-center gap-1 text-xs">
                  <Switch
                    checked={p.is_active}
                    onCheckedChange={(v) => save.mutate({ id: p.id, student_id: studentId, page_name: p.page_name, is_active: v } as any)}
                  />
                  Active
                </label>
                <Button size="sm" variant="ghost" onClick={() => setPreview(preview?.id === p.id ? null : p)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Delete "${p.page_name}"?`)) del.mutate(p.id); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                rows={5}
                value={p.page_content ?? ''}
                className="font-mono text-xs"
                onChange={(e) => save.mutate({ id: p.id, student_id: studentId, page_name: p.page_name, page_content: e.target.value } as any)}
              />
              {preview?.id === p.id && (
                <div className="border rounded p-3 bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">Preview:</div>
                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: p.page_content || '' }} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

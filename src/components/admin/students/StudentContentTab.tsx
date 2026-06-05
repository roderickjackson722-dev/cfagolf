import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2, Upload, Copy, Pencil } from 'lucide-react';
import {
  useStudentContent,
  useUploadStudentFile,
  useDeleteStudentContent,
  getStudentFileSignedUrl,
  StudentContent,
} from '@/hooks/useStudents';
import { useContentItems, useCopyTemplateToStudents } from '@/hooks/useContentLibrary';
import { toast } from '@/hooks/use-toast';
import StudentContentEditDialog from './StudentContentEditDialog';

export default function StudentContentTab({ studentId }: { studentId: string }) {
  const { data: files = [] } = useStudentContent(studentId);
  const { data: items = [] } = useContentItems();
  const upload = useUploadStudentFile();
  const del = useDeleteStudentContent();
  const copy = useCopyTemplateToStudents();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState<StudentContent | null>(null);

  const templates = items.filter((it) => it.is_template && it.is_global);

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast({ title: 'File and title required', variant: 'destructive' });
      return;
    }
    try {
      await upload.mutateAsync({ studentId, file, title: title.trim(), description });
      toast({ title: 'Uploaded' });
      setFile(null); setTitle(''); setDescription('');
    } catch (e: any) {
      toast({ title: 'Upload failed', description: e.message, variant: 'destructive' });
    }
  };

  const handleDownload = async (sp: string) => {
    try {
      const url = await getStudentFileSignedUrl(sp);
      window.open(url, '_blank');
    } catch (e: any) {
      toast({ title: 'Download failed', description: e.message, variant: 'destructive' });
    }
  };

  const copyTemplateNow = async (templateId: string) => {
    const t = items.find((i) => i.id === templateId);
    if (!t) return;
    try {
      await copy.mutateAsync({ template: t, studentIds: [studentId] });
      toast({ title: `Copied "${t.title}"` });
    } catch (e: any) {
      toast({ title: 'Copy failed', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold flex items-center gap-2"><Upload className="w-4 h-4" />Upload Custom File</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="col-span-2">
              <Label>File *</Label>
              <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
          </div>
          <Button onClick={handleUpload} disabled={upload.isPending}>{upload.isPending ? 'Uploading…' : 'Upload'}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold flex items-center gap-2"><Copy className="w-4 h-4" />Copy a Template</h3>
          {templates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No global templates available.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-2">
              {templates.map((t) => (
                <div key={t.id} className="flex items-center justify-between border rounded p-2">
                  <div>
                    <div className="font-medium text-sm">{t.title}</div>
                    {t.file_name && <div className="text-xs text-muted-foreground">{t.file_name}</div>}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyTemplateNow(t.id)}>Copy</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold">Student's Files ({files.length})</h3>
          {files.length === 0 ? (
            <p className="text-sm text-muted-foreground">No files yet.</p>
          ) : (
            <div className="divide-y border rounded">
              {files.map((f) => (
                <div key={f.id} className="flex items-center justify-between p-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{f.title}</div>
                    {f.description && (
                      <div className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-3">{f.description}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {f.file_name || 'Text template'} {f.source_template_id && <Badge variant="outline" className="ml-1">From template</Badge>}
                      {f.is_customized && <Badge variant="secondary" className="ml-1">Customized</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(f)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {f.storage_path && (
                      <Button size="sm" variant="ghost" onClick={() => handleDownload(f.storage_path!)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Delete "${f.title}"?`)) del.mutate(f); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <StudentContentEditDialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        content={editing}
      />
    </div>
  );
}

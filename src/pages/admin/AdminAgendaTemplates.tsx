import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Copy, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import {
  useAgendaTemplates,
  useAgendaTemplate,
  useSaveAgendaTemplate,
  useDeleteAgendaTemplate,
  type AgendaTemplateTask,
} from '@/hooks/useAgendas';

type DraftTask = Partial<AgendaTemplateTask> & { _key: string };

function TemplateEditor({
  open,
  onOpenChange,
  templateId,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  templateId?: string;
}) {
  const { data } = useAgendaTemplate(templateId);
  const save = useSaveAgendaTemplate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [tasks, setTasks] = useState<DraftTask[]>([]);

  useEffect(() => {
    if (open) {
      setName(data?.template.name || '');
      setDescription(data?.template.description || '');
      setIsDefault(!!data?.template.is_default);
      setTasks((data?.tasks || []).map((t) => ({ ...t, _key: t.id })));
    }
  }, [open, data]);

  const addTask = () =>
    setTasks((p) => [...p, { _key: crypto.randomUUID(), title: '', description: '', sort_order: p.length }]);
  const updateTask = (k: string, patch: Partial<DraftTask>) =>
    setTasks((p) => p.map((t) => (t._key === k ? { ...t, ...patch } : t)));
  const removeTask = (k: string) => setTasks((p) => p.filter((t) => t._key !== k));
  const move = (k: string, dir: -1 | 1) => {
    setTasks((p) => {
      const idx = p.findIndex((t) => t._key === k);
      const j = idx + dir;
      if (idx < 0 || j < 0 || j >= p.length) return p;
      const next = [...p];
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  };

  const handleSave = async () => {
    if (!name.trim()) return toast({ title: 'Name required', variant: 'destructive' });
    try {
      await save.mutateAsync({
        template: { id: templateId, name, description, is_default: isDefault },
        tasks: tasks.map((t, i) => ({ ...t, sort_order: i })),
      });
      toast({ title: 'Template saved' });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{templateId ? 'Edit Template' : 'New Template'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={isDefault} onCheckedChange={(v) => setIsDefault(!!v)} />
            Default template
          </label>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Tasks</Label>
              <Button size="sm" variant="outline" onClick={addTask}>
                <Plus className="w-4 h-4 mr-1" />Add Task
              </Button>
            </div>
            {tasks.map((t, i) => (
              <Card key={t._key}>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Task title"
                      value={t.title || ''}
                      onChange={(e) => updateTask(t._key, { title: e.target.value })}
                    />
                    <Button size="sm" variant="ghost" onClick={() => move(t._key, -1)} disabled={i === 0}>↑</Button>
                    <Button size="sm" variant="ghost" onClick={() => move(t._key, 1)} disabled={i === tasks.length - 1}>↓</Button>
                    <Button size="sm" variant="ghost" onClick={() => removeTask(t._key)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Description"
                    value={t.description || ''}
                    onChange={(e) => updateTask(t._key, { description: e.target.value })}
                    rows={2}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input
                      placeholder="Link URL (optional)"
                      value={t.link_url || ''}
                      onChange={(e) => updateTask(t._key, { link_url: e.target.value })}
                    />
                    <Input
                      placeholder="Link text"
                      value={t.link_text || ''}
                      onChange={(e) => updateTask(t._key, { link_text: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Duration (min)"
                      value={t.estimated_duration ?? ''}
                      onChange={(e) =>
                        updateTask(t._key, { estimated_duration: e.target.value ? Number(e.target.value) : null })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={save.isPending}>Save Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminAgendaTemplates() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: aLoad } = useIsAdmin();
  const { data: templates, isLoading } = useAgendaTemplates();
  const del = useDeleteAgendaTemplate();
  const save = useSaveAgendaTemplate();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  if (loading || aLoad) return <div className="p-8 text-center">Loading…</div>;
  if (!isAdmin) return <div className="p-8 text-center">Admin access required.</div>;

  const openNew = () => {
    setEditingId(undefined);
    setEditorOpen(true);
  };
  const openEdit = (id: string) => {
    setEditingId(id);
    setEditorOpen(true);
  };
  const duplicate = async (id: string) => {
    const { data: tpl } = await import('@/integrations/supabase/client').then(({ supabase }) =>
      supabase.from('agenda_templates' as any).select('*').eq('id', id).single(),
    );
    const { data: tasks } = await import('@/integrations/supabase/client').then(({ supabase }) =>
      supabase.from('agenda_template_tasks' as any).select('*').eq('template_id', id).order('sort_order'),
    );
    if (!tpl) return;
    await save.mutateAsync({
      template: { name: `${(tpl as any).name} (Copy)`, description: (tpl as any).description, is_default: false },
      tasks: (tasks || []) as any,
    });
    toast({ title: 'Template duplicated' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin"><ArrowLeft className="w-4 h-4 mr-1" />Back to Admin</Link>
        </Button>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold">Agenda Templates</h1>
            <p className="text-sm text-muted-foreground">Reusable meeting agendas for student sessions.</p>
          </div>
          <Button onClick={openNew}><Plus className="w-4 h-4 mr-1" />New Template</Button>
        </div>

        {isLoading ? (
          <div>Loading templates…</div>
        ) : (
          <div className="grid gap-3">
            {(templates || []).map((t) => (
              <Card key={t.id}>
                <CardContent className="p-4 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{t.name}</div>
                      {t.is_default && <Badge variant="secondary">Default</Badge>}
                    </div>
                    {t.description && <div className="text-sm text-muted-foreground mt-1">{t.description}</div>}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(t.id)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => duplicate(t.id)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm(`Delete "${t.name}"?`)) del.mutate(t.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!templates?.length && <div className="text-sm text-muted-foreground">No templates yet.</div>}
          </div>
        )}

        <TemplateEditor open={editorOpen} onOpenChange={setEditorOpen} templateId={editingId} />
      </div>
    </div>
  );
}

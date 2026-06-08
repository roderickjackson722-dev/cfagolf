import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Copy, Send, Eye, ArrowLeft, X } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { useStudents } from '@/hooks/useStudents';
import { toast } from '@/hooks/use-toast';
import {
  useEmailTemplates,
  useFullTemplate,
  useSaveTemplate,
  useDeleteTemplate,
  useLogOutreach,
  useOutreachHistory,
  renderEmailHtml,
  renderEmailPlainText,
  replaceVariables,
  type EmailTemplateSection,
  type EmailTemplateActionItem,
  type EmailTemplateVariable,
} from '@/hooks/useEmailOutreach';
import { supabase } from '@/integrations/supabase/client';

type SectionDraft = Partial<EmailTemplateSection> & {
  action_items: Partial<EmailTemplateActionItem>[];
};

const CATEGORIES = ['NCAA', 'College Application', 'Recruiting', 'Follow-up', 'Welcome', 'Other'];

export default function EmailTemplates() {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: templates = [] } = useEmailTemplates();
  const deleteTemplate = useDeleteTemplate();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  if (loading || adminLoading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!user || !isAdmin) return <div className="min-h-screen flex items-center justify-center">Access denied</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/admin" className="text-sm text-muted-foreground hover:underline flex items-center gap-1 mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to Admin
            </Link>
            <h1 className="text-3xl font-bold">Email Templates & Outreach</h1>
            <p className="text-muted-foreground">Manage reusable templates and track outreach to families.</p>
          </div>
          <Button onClick={() => setCreating(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Template
          </Button>
        </div>

        <Tabs defaultValue="templates">
          <TabsList>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Outreach History</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No templates yet. Click "New Template" to create one.
                        </TableCell>
                      </TableRow>
                    )}
                    {templates.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>
                          <div className="font-medium">{t.name}</div>
                          <div className="text-xs text-muted-foreground">{t.subject}</div>
                        </TableCell>
                        <TableCell>{t.category && <Badge variant="secondary">{t.category}</Badge>}</TableCell>
                        <TableCell>
                          {t.is_active ? <Badge>Active</Badge> : <Badge variant="outline">Inactive</Badge>}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(t.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="outline" onClick={() => setPreviewId(t.id)}>
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingId(t.id)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" onClick={() => setSendingId(t.id)}>
                              <Send className="w-3 h-3 mr-1" /> Use
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (confirm('Delete this template?')) deleteTemplate.mutate(t.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <OutreachHistoryTable />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {(creating || editingId) && (
        <TemplateBuilderDialog
          templateId={editingId}
          onClose={() => {
            setCreating(false);
            setEditingId(null);
          }}
        />
      )}
      {sendingId && <SendTemplateDialog templateId={sendingId} onClose={() => setSendingId(null)} />}
      {previewId && <PreviewDialog templateId={previewId} onClose={() => setPreviewId(null)} />}
    </div>
  );
}

// ───────── Builder ─────────
function TemplateBuilderDialog({ templateId, onClose }: { templateId: string | null; onClose: () => void }) {
  const { data: full } = useFullTemplate(templateId);
  const save = useSaveTemplate();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Other');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sections, setSections] = useState<SectionDraft[]>([]);
  const [variables, setVariables] = useState<Partial<EmailTemplateVariable>[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load existing
  if (templateId && full && !loaded) {
    setName(full.name);
    setSubject(full.subject);
    setCategory(full.category || 'Other');
    setDescription(full.description || '');
    setIsActive(full.is_active);
    setSections(full.sections.map((s) => ({ ...s, action_items: s.action_items })));
    setVariables(full.variables);
    setLoaded(true);
  }

  const addSection = () =>
    setSections([...sections, { title: '', content: '', has_action_items: false, action_items: [] }]);
  const removeSection = (i: number) => setSections(sections.filter((_, idx) => idx !== i));
  const updateSection = (i: number, patch: Partial<SectionDraft>) =>
    setSections(sections.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const addActionItem = (i: number) =>
    updateSection(i, { action_items: [...(sections[i].action_items || []), { task: '' }] });
  const updateActionItem = (i: number, j: number, patch: Partial<EmailTemplateActionItem>) => {
    const items = [...(sections[i].action_items || [])];
    items[j] = { ...items[j], ...patch };
    updateSection(i, { action_items: items });
  };
  const removeActionItem = (i: number, j: number) =>
    updateSection(i, { action_items: (sections[i].action_items || []).filter((_, idx) => idx !== j) });

  const handleSave = async () => {
    if (!name || !subject) {
      toast({ title: 'Name and subject required', variant: 'destructive' });
      return;
    }
    try {
      await save.mutateAsync({
        template: { id: templateId || undefined, name, subject, category, description, is_active: isActive },
        sections,
        variables,
      });
      toast({ title: 'Template saved' });
      onClose();
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{templateId ? 'Edit Template' : 'New Template'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Use {{variables}} like {{student_name}}" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Active</Label>
          </div>

          {/* Variables */}
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Variables</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setVariables([...variables, { variable_name: '', variable_label: '', variable_type: 'text' }])}>
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {variables.map((v, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input placeholder="variable_name (no braces)" value={v.variable_name || ''} onChange={(e) => {
                    const next = [...variables]; next[i] = { ...next[i], variable_name: e.target.value }; setVariables(next);
                  }} />
                  <Input placeholder="Label" value={v.variable_label || ''} onChange={(e) => {
                    const next = [...variables]; next[i] = { ...next[i], variable_label: e.target.value }; setVariables(next);
                  }} />
                  <Select value={v.variable_type || 'text'} onValueChange={(val) => {
                    const next = [...variables]; next[i] = { ...next[i], variable_type: val }; setVariables(next);
                  }}>
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-1">
                    <Checkbox checked={!!v.is_required} onCheckedChange={(c) => {
                      const next = [...variables]; next[i] = { ...next[i], is_required: !!c }; setVariables(next);
                    }} />
                    <span className="text-xs">Req</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setVariables(variables.filter((_, idx) => idx !== i))}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sections */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Sections</h3>
            <Button size="sm" variant="outline" onClick={addSection}>
              <Plus className="w-3 h-3 mr-1" /> Add Section
            </Button>
          </div>
          {sections.map((sec, i) => (
            <Card key={i}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex gap-2">
                  <Input placeholder="Section title (optional)" value={sec.title || ''} onChange={(e) => updateSection(i, { title: e.target.value })} />
                  <Button size="sm" variant="ghost" onClick={() => removeSection(i)}><Trash2 className="w-3 h-3" /></Button>
                </div>
                <Textarea placeholder="Section content (supports {{variables}})" rows={3} value={sec.content || ''} onChange={(e) => updateSection(i, { content: e.target.value })} />
                <div className="flex items-center gap-2">
                  <Switch checked={!!sec.has_action_items} onCheckedChange={(c) => updateSection(i, { has_action_items: c })} />
                  <Label>Has action items</Label>
                </div>
                {sec.has_action_items && (
                  <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                    {(sec.action_items || []).map((ai, j) => (
                      <div key={j} className="space-y-1 bg-muted/30 rounded p-2">
                        <div className="flex gap-2">
                          <Input placeholder="Task" value={ai.task || ''} onChange={(e) => updateActionItem(i, j, { task: e.target.value })} />
                          <Button size="sm" variant="ghost" onClick={() => removeActionItem(i, j)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                        <Textarea placeholder="Description (optional)" rows={2} value={ai.description || ''} onChange={(e) => updateActionItem(i, j, { description: e.target.value })} />
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Link URL" value={ai.link_url || ''} onChange={(e) => updateActionItem(i, j, { link_url: e.target.value })} />
                          <Input placeholder="Link text" value={ai.link_text || ''} onChange={(e) => updateActionItem(i, j, { link_text: e.target.value })} />
                        </div>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => addActionItem(i)}>
                      <Plus className="w-3 h-3 mr-1" /> Add Action Item
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={save.isPending}>Save Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ───────── Send ─────────
function SendTemplateDialog({ templateId, onClose }: { templateId: string; onClose: () => void }) {
  const { data: full } = useFullTemplate(templateId);
  const { data: students = [] } = useStudents();
  const log = useLogOutreach();
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [vars, setVars] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [activeStudent, setActiveStudent] = useState<string | null>(null);

  if (!full) return null;

  const selectedStudents = students.filter((s) => studentIds.includes(s.id));
  const current = activeStudent ? selectedStudents.find((s) => s.id === activeStudent) : selectedStudents[0];

  const studentVars = (s: any): Record<string, string> => ({
    student_name: s?.full_name || '',
    student_email: s?.email || '',
    current_year: String(new Date().getFullYear()),
    ...vars,
  });

  const renderForStudent = (s: any) => {
    const v = studentVars(s);
    return {
      subject: replaceVariables(full.subject, v),
      html: renderEmailHtml({ subject: full.subject, studentName: s.full_name, sections: full.sections, vars: v }),
      text: renderEmailPlainText({ studentName: s.full_name, sections: full.sections, vars: v }),
    };
  };

  const handleSend = async () => {
    setSending(true);
    try {
      for (const s of selectedStudents) {
        if (!s.email) {
          toast({ title: `${s.full_name} has no email`, variant: 'destructive' });
          continue;
        }
        const v = studentVars(s);
        const rendered = renderForStudent(s);
        const { error } = await supabase.functions.invoke('send-template-email', {
          body: { to: s.email, subject: rendered.subject, html: rendered.html, text: rendered.text },
        });
        if (error) throw error;
        await log.mutateAsync({
          template_id: templateId,
          student_id: s.id,
          recipient_email: s.email,
          recipient_name: s.full_name,
          subject: rendered.subject,
          body: rendered.html,
          variables_used: v,
          status: 'sent',
        });
      }
      toast({ title: `Sent to ${selectedStudents.length} student(s)` });
      onClose();
    } catch (e: any) {
      toast({ title: 'Send failed', description: e.message, variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const handleCopy = async () => {
    if (!current) return;
    const rendered = renderForStudent(current);
    await navigator.clipboard.writeText(rendered.text);
    toast({ title: 'Plain text copied to clipboard' });
  };

  const handleCopyHtml = async () => {
    if (!current) return;
    const rendered = renderForStudent(current);
    await navigator.clipboard.writeText(rendered.html);
    toast({ title: 'HTML copied to clipboard' });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Send: {full.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <Label>Recipients</Label>
              <div className="border rounded p-2 max-h-48 overflow-y-auto space-y-1">
                {students.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={studentIds.includes(s.id)}
                      onCheckedChange={(c) =>
                        setStudentIds(c ? [...studentIds, s.id] : studentIds.filter((id) => id !== s.id))
                      }
                    />
                    <span>{s.full_name}</span>
                    <span className="text-xs text-muted-foreground">{s.email || '(no email)'}</span>
                  </label>
                ))}
              </div>
            </div>

            {full.variables.length > 0 && (
              <div className="space-y-2">
                <Label>Variables</Label>
                {full.variables.map((v) => (
                  <div key={v.id}>
                    <Label className="text-xs">{v.variable_label || v.variable_name}{v.is_required && ' *'}</Label>
                    <Input
                      value={vars[v.variable_name] || ''}
                      placeholder={`{{${v.variable_name}}}`}
                      onChange={(e) => setVars({ ...vars, [v.variable_name]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label>Preview {current && `(${current.full_name})`}</Label>
            {selectedStudents.length > 1 && (
              <Select value={activeStudent || selectedStudents[0]?.id} onValueChange={setActiveStudent}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {selectedStudents.map((s) => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
            <div className="border rounded mt-2 overflow-hidden">
              {current ? (
                <iframe
                  title="preview"
                  srcDoc={renderForStudent(current).html}
                  className="w-full h-96 bg-white"
                />
              ) : (
                <div className="p-6 text-sm text-muted-foreground text-center">Select a student to preview</div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="outline" onClick={handleCopy} disabled={!current}>
            <Copy className="w-4 h-4 mr-1" /> Copy Text
          </Button>
          <Button variant="outline" onClick={handleCopyHtml} disabled={!current}>
            <Copy className="w-4 h-4 mr-1" /> Copy HTML
          </Button>
          <Button onClick={handleSend} disabled={sending || selectedStudents.length === 0}>
            <Send className="w-4 h-4 mr-1" /> Send Now ({selectedStudents.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ───────── Preview ─────────
function PreviewDialog({ templateId, onClose }: { templateId: string; onClose: () => void }) {
  const { data: full } = useFullTemplate(templateId);
  if (!full) return null;
  const sampleVars: Record<string, string> = { student_name: 'Sample Student', current_year: String(new Date().getFullYear()) };
  full.variables.forEach((v) => { sampleVars[v.variable_name] = `[${v.variable_label || v.variable_name}]`; });
  const html = renderEmailHtml({ subject: full.subject, studentName: 'Sample Student', sections: full.sections, vars: sampleVars });
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Preview: {full.name}</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground mb-2">Subject: {replaceVariables(full.subject, sampleVars)}</div>
        <iframe title="preview" srcDoc={html} className="w-full h-[600px] bg-white border rounded" />
      </DialogContent>
    </Dialog>
  );
}

// ───────── History ─────────
function OutreachHistoryTable() {
  const { data: history = [] } = useOutreachHistory();
  const [viewId, setViewId] = useState<string | null>(null);
  const view = history.find((h: any) => h.id === viewId);

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No outreach yet</TableCell></TableRow>
            )}
            {history.map((h: any) => (
              <TableRow key={h.id}>
                <TableCell className="text-sm">{new Date(h.sent_at).toLocaleString()}</TableCell>
                <TableCell>
                  <div>{h.recipient_name}</div>
                  <div className="text-xs text-muted-foreground">{h.recipient_email}</div>
                </TableCell>
                <TableCell className="text-sm">{h.subject}</TableCell>
                <TableCell><Badge variant={h.status === 'sent' ? 'default' : 'outline'}>{h.status}</Badge></TableCell>
                <TableCell><Button size="sm" variant="outline" onClick={() => setViewId(h.id)}><Eye className="w-3 h-3" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {view && (
          <Dialog open onOpenChange={() => setViewId(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader><DialogTitle>{view.subject}</DialogTitle></DialogHeader>
              <iframe title="hist" srcDoc={view.body || ''} className="w-full h-[600px] bg-white border rounded" />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}

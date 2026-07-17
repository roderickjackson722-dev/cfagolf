import { useMemo, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Search, Edit, Trash2, Eye, Video, Copy, Share2, Mail, Settings, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const STATUSES = ['pending', 'approved', 'published', 'archived'];
const GRADES = ['', '9th', '10th', '11th', '12th', 'College'];

const emptyForm = {
  biggest_challenge: '', how_helped: '', what_valued_most: '',
  how_journey_changed: '', advice_to_others: '', additional_comments: '',
  share_first_name: '', share_grade_level: '', share_location: '',
  video_url: '', status: 'approved', is_public: false, is_featured: false,
  display_order: 0, admin_notes: '',
};

export default function AdminTestimonials() {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const qc = useQueryClient();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [publicFilter, setPublicFilter] = useState('all');
  const [editing, setEditing] = useState<any | null>(null);
  const [viewing, setViewing] = useState<any | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideForm, setGuideForm] = useState({
    id: null as string | null,
    intro_heading: '',
    intro_body: '',
    guide_points: [] as string[],
    privacy_note: '',
  });

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/testimonial` : '/testimonial';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy — please copy manually');
    }
  };

  const shareEmail = () => {
    const subject = encodeURIComponent('Share your College Fairway Advisors experience');
    const body = encodeURIComponent(
      `Hi!\n\nWe'd love to hear about your experience with College Fairway Advisors. Your story helps other families navigating the college golf recruiting journey.\n\nYou can share a written testimonial or record a short video (whichever you prefer) using this private link:\n\n${shareUrl}\n\nFor privacy, please use first names only.\n\nThank you!\nCollege Fairway Advisors\ncontact@cfa.golf`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareSms = () => {
    const body = encodeURIComponent(
      `Hi! Would you share your College Fairway Advisors experience? Written or short video — first names only for privacy. Thank you! ${shareUrl}`
    );
    window.open(`sms:?&body=${body}`);
  };

  const { data: promptRow } = useQuery({
    queryKey: ['testimonial-prompt-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonial_prompt_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });

  useEffect(() => {
    if (promptRow) {
      setGuideForm({
        id: promptRow.id,
        intro_heading: promptRow.intro_heading || '',
        intro_body: promptRow.intro_body || '',
        guide_points: Array.isArray(promptRow.guide_points) ? (promptRow.guide_points as string[]) : [],
        privacy_note: promptRow.privacy_note || '',
      });
    }
  }, [promptRow]);

  const saveGuide = useMutation({
    mutationFn: async () => {
      const payload = {
        intro_heading: guideForm.intro_heading.trim(),
        intro_body: guideForm.intro_body.trim(),
        guide_points: guideForm.guide_points.map((s) => s.trim()).filter(Boolean),
        privacy_note: guideForm.privacy_note.trim(),
        is_active: true,
      };
      if (guideForm.id) {
        const { error } = await supabase.from('testimonial_prompt_settings').update(payload).eq('id', guideForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('testimonial_prompt_settings').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimonial-prompt-settings'] });
      toast.success('Guide saved');
      setGuideOpen(false);
    },
    onError: (e: any) => toast.error(e.message || 'Save failed'),
  });

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials-v2'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials').select('*').order('submitted_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });

  const filtered = useMemo(() => {
    return rows.filter((r: any) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (sourceFilter !== 'all' && (r.source || 'form') !== sourceFilter) return false;
      if (publicFilter === 'yes' && !r.is_public) return false;
      if (publicFilter === 'no' && r.is_public) return false;
      if (search) {
        const s = search.toLowerCase();
        const hay = [r.share_first_name, r.share_location, r.content, r.name]
          .filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [rows, search, statusFilter, sourceFilter, publicFilter]);

  const patch = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { error } = await supabase.from('testimonials').update(values).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-testimonials-v2'] }); toast.success('Updated'); },
    onError: (e: any) => toast.error(e.message || 'Update failed'),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-testimonials-v2'] }); toast.success('Deleted'); },
    onError: (e: any) => toast.error(e.message || 'Delete failed'),
  });

  const saveForm = useMutation({
    mutationFn: async () => {
      const content = [
        form.biggest_challenge && `Biggest challenge: ${form.biggest_challenge}`,
        form.how_helped && `How CFA helped: ${form.how_helped}`,
        form.what_valued_most && `Valued most: ${form.what_valued_most}`,
        form.how_journey_changed && `How journey changed: ${form.how_journey_changed}`,
        form.advice_to_others && `Advice: ${form.advice_to_others}`,
        form.additional_comments && `Additional: ${form.additional_comments}`,
      ].filter(Boolean).join('\n\n');

      const row = {
        ...form,
        name: form.share_first_name || 'Anonymous',
        content: content || '(Video testimonial only)',
        is_anonymous: !form.share_first_name && !form.share_grade_level && !form.share_location,
        display_order: Number(form.display_order) || 0,
        approved_at: form.status === 'approved' ? new Date().toISOString() : null,
        published_at: form.status === 'published' ? new Date().toISOString() : null,
      };

      if (editing) {
        const { error } = await supabase.from('testimonials').update(row).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('testimonials').insert({
          ...row, source: 'manual', entered_by: user?.id, entered_at: new Date().toISOString(),
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-testimonials-v2'] });
      toast.success(editing ? 'Testimonial updated' : 'Testimonial added');
      setAddOpen(false); setEditing(null); setForm(emptyForm);
    },
    onError: (e: any) => toast.error(e.message || 'Save failed'),
  });

  const openEdit = (r: any) => {
    setEditing(r);
    setForm({ ...emptyForm, ...r, display_order: r.display_order ?? 0 });
    setAddOpen(true);
  };

  const openAdd = () => { setEditing(null); setForm(emptyForm); setAddOpen(true); };

  if (authLoading || adminLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-700',
    };
    return <Badge className={map[s] || ''}>{s}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Testimonials</h1>
            <p className="text-muted-foreground text-sm">Manage submissions from /testimonial and manually entered stories.</p>
          </div>
          <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add Manual Testimonial</Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6 grid gap-3 md:grid-cols-5">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search name, location, content…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                <SelectItem value="form">Form</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
            <Select value={publicFilter} onValueChange={setPublicFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All visibility</SelectItem>
                <SelectItem value="yes">Public</SelectItem>
                <SelectItem value="no">Private</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{filtered.length} testimonial{filtered.length === 1 ? '' : 's'}</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>First name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Public</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Video</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-xs">{format(new Date(r.submitted_at || r.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{r.share_first_name || <span className="text-muted-foreground">Anonymous</span>}</TableCell>
                      <TableCell className="text-sm">{r.share_location || '—'}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{r.source || 'form'}</Badge></TableCell>
                      <TableCell>{statusBadge(r.status)}</TableCell>
                      <TableCell><Switch checked={!!r.is_public} onCheckedChange={(v) => patch.mutate({ id: r.id, values: { is_public: v } })} /></TableCell>
                      <TableCell><Switch checked={!!r.is_featured} onCheckedChange={(v) => patch.mutate({ id: r.id, values: { is_featured: v } })} /></TableCell>
                      <TableCell>{(r.video_url || r.video_file_path) ? <Video className="w-4 h-4 text-primary" /> : '—'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => setViewing(r)}><Eye className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => openEdit(r)}><Edit className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (confirm('Delete this testimonial?')) del.mutate(r.id); }}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No testimonials match your filters.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* View dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Testimonial detail</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                {statusBadge(viewing.status)}
                <Badge variant="outline" className="capitalize">{viewing.source || 'form'}</Badge>
                {viewing.is_public && <Badge className="bg-green-100 text-green-800">Public</Badge>}
                {viewing.is_featured && <Badge className="bg-purple-100 text-purple-800">Featured</Badge>}
              </div>
              {[
                ['Biggest challenge', viewing.biggest_challenge],
                ['How CFA helped', viewing.how_helped],
                ['What they valued most', viewing.what_valued_most],
                ['How the journey changed', viewing.how_journey_changed],
                ['Advice to others', viewing.advice_to_others],
                ['Additional comments', viewing.additional_comments],
              ].map(([l, v]) => v && (
                <div key={l}><div className="font-semibold text-muted-foreground text-xs uppercase">{l}</div><p className="whitespace-pre-wrap">{v}</p></div>
              ))}
              {!viewing.biggest_challenge && viewing.content && (
                <div><div className="font-semibold text-muted-foreground text-xs uppercase">Content</div><p className="whitespace-pre-wrap">{viewing.content}</p></div>
              )}
              <hr />
              <p><strong>Name:</strong> {viewing.share_first_name || 'Anonymous'}</p>
              <p><strong>Grade:</strong> {viewing.share_grade_level || '—'}</p>
              <p><strong>Location:</strong> {viewing.share_location || '—'}</p>
              {viewing.video_url && <p><strong>Video URL:</strong> <a href={viewing.video_url} target="_blank" rel="noreferrer" className="text-primary underline">{viewing.video_url}</a></p>}
              {viewing.video_file_path && <p><strong>Video file:</strong> {viewing.video_file_path}</p>}
              {viewing.admin_notes && <p><strong>Admin notes:</strong> {viewing.admin_notes}</p>}
              <DialogFooter className="pt-4 gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => patch.mutate({ id: viewing.id, values: { status: 'approved', approved_at: new Date().toISOString() } })}>Approve</Button>
                <Button size="sm" onClick={() => patch.mutate({ id: viewing.id, values: { status: 'published', is_public: true, published_at: new Date().toISOString() } })}>Publish</Button>
                <Button size="sm" variant="outline" onClick={() => patch.mutate({ id: viewing.id, values: { status: 'archived', is_public: false } })}>Archive</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add / Edit */}
      <Dialog open={addOpen} onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditing(null); } }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit testimonial' : 'Add manual testimonial'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {[
              ['biggest_challenge', 'Biggest challenge'],
              ['how_helped', 'How CFA helped'],
              ['what_valued_most', 'Valued most'],
              ['how_journey_changed', 'How journey changed'],
              ['advice_to_others', 'Advice to others'],
              ['additional_comments', 'Additional comments'],
            ].map(([k, l]) => (
              <div key={k} className="space-y-1"><Label>{l}</Label><Textarea rows={2} value={form[k] || ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
            ))}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1"><Label>First name</Label><Input value={form.share_first_name} onChange={(e) => setForm({ ...form, share_first_name: e.target.value })} /></div>
              <div className="space-y-1">
                <Label>Grade level</Label>
                <Select value={form.share_grade_level || 'none'} onValueChange={(v) => setForm({ ...form, share_grade_level: v === 'none' ? '' : v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">—</SelectItem>
                    {GRADES.filter(Boolean).map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Location</Label><Input value={form.share_location} onChange={(e) => setForm({ ...form, share_location: e.target.value })} /></div>
            </div>
            <div className="space-y-1"><Label>Video URL</Label><Input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Display order</Label><Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} /></div>
              <div className="flex flex-col gap-2 pt-6">
                <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_public} onCheckedChange={(v) => setForm({ ...form, is_public: v })} /> Public</label>
                <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} /> Featured</label>
              </div>
            </div>
            <div className="space-y-1"><Label>Admin notes</Label><Textarea rows={2} value={form.admin_notes || ''} onChange={(e) => setForm({ ...form, admin_notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddOpen(false); setEditing(null); }}>Cancel</Button>
            <Button onClick={() => saveForm.mutate()} disabled={saveForm.isPending}>{saveForm.isPending ? 'Saving…' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

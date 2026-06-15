import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import {
  useFreeResources,
  useSaveFreeResource,
  useDeleteFreeResource,
  slugify,
  type FreeResource,
} from '@/hooks/useFreeResources';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { ArrowLeft, BarChart3, Copy, Edit, ExternalLink, Plus, Trash2, Upload, Stamp } from 'lucide-react';
import { watermarkPdf, watermarkPdfFile } from '@/lib/pdfWatermark';

const CATEGORIES = ['Timeline', 'Templates', 'Template', 'Checklist', 'Worksheet', 'Planner', 'Guide', 'Other'];
const SITE = 'https://www.cfa.golf';

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FreeResourcesAdmin() {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const navigate = useNavigate();
  const { data: resources = [], isLoading } = useFreeResources();
  const save = useSaveFreeResource();
  const del = useDeleteFreeResource();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editing, setEditing] = useState<Partial<FreeResource> | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [thumb, setThumb] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [rewatermarking, setRewatermarking] = useState(false);
  const [rewatermarkStatus, setRewatermarkStatus] = useState('');

  if (loading || roleLoading) return <div className="p-8">Loading...</div>;
  if (!user) { navigate('/login'); return null; }
  if (!isAdmin) return <div className="p-8">Access denied.</div>;

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.description || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.category || '').toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === 'all' || r.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [resources, search, categoryFilter]);

  const openNew = () => {
    setEditing({
      name: '', slug: '', description: '', category: 'Guide',
      file_type: 'PDF', is_active: true, sort_order: 0,
    });
    setFile(null);
    setThumb(null);
  };

  const openEdit = (r: FreeResource) => {
    setEditing(r);
    setFile(null);
    setThumb(null);
  };

  async function uploadTo(bucket: string, file: File, slug: string, prefix = '') {
    const ext = file.name.split('.').pop();
    const path = `${prefix}${slug}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return { path, url: data.publicUrl };
  }

  const handleSave = async () => {
    if (!editing?.name) { toast.error('Name is required'); return; }
    const slug = editing.slug || slugify(editing.name);
    setUploading(true);
    try {
      const payload: any = { ...editing, slug };
      if (file) {
        let toUpload = file;
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          try {
            toUpload = await watermarkPdfFile(file);
          } catch (err) {
            console.warn('Watermark failed, uploading original:', err);
          }
        }
        const up = await uploadTo('free-resources', toUpload, slug);
        payload.file_path = up.path;
        payload.file_url = up.url;
        payload.file_size = formatSize(toUpload.size);
        const ext = (file.name.split('.').pop() || 'PDF').toUpperCase();
        payload.file_type = ext;
      }
      if (thumb) {
        const up = await uploadTo('free-resources', thumb, slug, 'thumbs/');
        payload.thumbnail_url = up.url;
      }
      await save.mutateAsync(payload);
      toast.success('Resource saved');
      setEditing(null);
    } catch (e: any) {
      toast.error(e.message || 'Save failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (r: FreeResource) => {
    if (!confirm(`Delete "${r.name}"?`)) return;
    await del.mutateAsync(r.id);
    toast.success('Deleted');
  };

  const copyLink = (slug: string) => {
    const url = `${SITE}/resources/download/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied');
  };

  const handleRewatermarkAll = async () => {
    const pdfs = resources.filter(
      (r) => r.file_path && (r.file_type?.toUpperCase() === 'PDF' || r.file_path.toLowerCase().endsWith('.pdf'))
    );
    if (pdfs.length === 0) { toast.info('No PDFs to watermark'); return; }
    if (!confirm(`Re-watermark ${pdfs.length} PDF(s)? This will overwrite the stored files.`)) return;
    setRewatermarking(true);
    let ok = 0, fail = 0;
    try {
      for (let i = 0; i < pdfs.length; i++) {
        const r = pdfs[i];
        setRewatermarkStatus(`Processing ${i + 1}/${pdfs.length}: ${r.name}`);
        try {
          const { data: blob, error: dlErr } = await supabase.storage
            .from('free-resources').download(r.file_path!);
          if (dlErr || !blob) throw dlErr || new Error('download failed');
          const buf = await blob.arrayBuffer();
          const stamped = await watermarkPdf(buf);
          const { error: upErr } = await supabase.storage
            .from('free-resources')
            .upload(r.file_path!, new Blob([stamped as BlobPart], { type: 'application/pdf' }), {
              upsert: true,
              contentType: 'application/pdf',
            });
          if (upErr) throw upErr;
          ok++;
        } catch (e) {
          console.error('Watermark failed for', r.slug, e);
          fail++;
        }
      }
      toast.success(`Watermarked ${ok} PDF(s)${fail ? `, ${fail} failed` : ''}`);
    } finally {
      setRewatermarking(false);
      setRewatermarkStatus('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-2">
              <Link to="/admin"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Admin</Link>
            </Button>
            <h1 className="text-3xl font-bold">Free Resources Library</h1>
            <p className="text-muted-foreground">Manage downloadable resources for DM auto-replies, email, and social.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/admin/resources/stats"><BarChart3 className="w-4 h-4 mr-2" /> Stats</Link>
            </Button>
            <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" /> Add Resource</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Downloads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
              )}
              {!isLoading && filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No resources found.</TableCell></TableRow>
              )}
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">/{r.slug}</div>
                  </TableCell>
                  <TableCell>{r.category && <Badge variant="secondary">{r.category}</Badge>}</TableCell>
                  <TableCell>{r.file_type}</TableCell>
                  <TableCell className="text-right font-mono">{r.download_count}</TableCell>
                  <TableCell>
                    <Badge variant={r.is_active ? 'default' : 'outline'}>
                      {r.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => copyLink(r.slug)} title="Copy link">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" asChild title="Open">
                        <Link to={`/resources/download/${r.slug}`} target="_blank">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(r)} title="Edit">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(r)} title="Delete">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Edit Resource' : 'New Resource'}</DialogTitle>
            <DialogDescription>
              Public link: {SITE}/resources/download/{editing?.slug || slugify(editing?.name || '')}
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Name *</Label>
                <Input
                  value={editing.name || ''}
                  onChange={(e) => setEditing({
                    ...editing,
                    name: e.target.value,
                    slug: editing.id ? editing.slug : slugify(e.target.value),
                  })}
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={editing.slug || ''}
                  onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={editing.category || 'Guide'}
                  onValueChange={(v) => setEditing({ ...editing, category: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
              <div>
                <Label>File {editing.file_url && '(replace existing)'}</Label>
                <Input
                  type="file"
                  accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {editing.file_url && !file && (
                  <a href={editing.file_url} target="_blank" rel="noreferrer" className="text-xs text-primary underline">
                    Current file ({editing.file_size})
                  </a>
                )}
              </div>
              <div>
                <Label>Thumbnail (optional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumb(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={!!editing.is_active}
                  onCheckedChange={(v) => setEditing({ ...editing, is_active: v })}
                />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={editing.sort_order ?? 0}
                  onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={uploading}>
              {uploading ? <><Upload className="w-4 h-4 mr-2 animate-pulse" /> Saving...</> : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

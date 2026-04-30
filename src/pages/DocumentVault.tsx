import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  FolderLock, Upload, FileText, Trash2, Download, Share2, Copy, Check,
  Loader2, Plus, Eye, X
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

type Doc = {
  id: string;
  user_id: string;
  category: string;
  title: string;
  description: string | null;
  storage_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  created_at: string;
};

type Share = {
  id: string;
  token: string;
  label: string | null;
  document_ids: string[];
  recipient_name: string | null;
  expires_at: string | null;
  is_active: boolean;
  view_count: number;
  created_at: string;
};

const CATEGORIES = [
  { value: 'transcript', label: 'Transcript' },
  { value: 'resume', label: 'Resume / Player Profile' },
  { value: 'release', label: 'Release Form' },
  { value: 'recommendation', label: 'Recommendation Letter' },
  { value: 'test_score', label: 'Test Score Report' },
  { value: 'other', label: 'Other' },
];

const MAX_BYTES = 10 * 1024 * 1024;

function generateToken() {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function DocumentVault() {
  const { user, loading } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [shares, setShares] = useState<Share[]>([]);
  const [fetching, setFetching] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedForShare, setSelectedForShare] = useState<string[]>([]);
  const [newShareLink, setNewShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'transcript',
    file: null as File | null,
  });

  const [shareForm, setShareForm] = useState({
    label: '',
    recipient_name: '',
    expires_in_days: '30',
  });

  useEffect(() => {
    if (user) loadAll();
  }, [user]);

  async function loadAll() {
    setFetching(true);
    const [docsRes, sharesRes] = await Promise.all([
      supabase.from('member_documents').select('*').order('created_at', { ascending: false }),
      supabase.from('document_shares').select('*').order('created_at', { ascending: false }),
    ]);
    if (docsRes.data) setDocs(docsRes.data as Doc[]);
    if (sharesRes.data) setShares(sharesRes.data as Share[]);
    setFetching(false);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !form.file || !form.title.trim()) return;
    if (form.file.type !== 'application/pdf') {
      toast({ title: 'PDF only', description: 'Please upload a PDF file.', variant: 'destructive' });
      return;
    }
    if (form.file.size > MAX_BYTES) {
      toast({ title: 'File too large', description: 'Maximum file size is 10 MB.', variant: 'destructive' });
      return;
    }
    setUploading(true);
    const safeName = form.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${user.id}/${Date.now()}_${safeName}`;
    const { error: upErr } = await supabase.storage
      .from('member-documents')
      .upload(path, form.file, { contentType: 'application/pdf', upsert: false });
    if (upErr) {
      setUploading(false);
      toast({ title: 'Upload failed', description: upErr.message, variant: 'destructive' });
      return;
    }
    const { error: dbErr } = await supabase.from('member_documents').insert({
      user_id: user.id,
      title: form.title.trim(),
      description: form.description.trim() || null,
      category: form.category,
      storage_path: path,
      file_name: form.file.name,
      file_size: form.file.size,
      mime_type: 'application/pdf',
    });
    setUploading(false);
    if (dbErr) {
      toast({ title: 'Save failed', description: dbErr.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Document uploaded', description: 'Your file is securely stored.' });
    setForm({ title: '', description: '', category: 'transcript', file: null });
    setUploadOpen(false);
    loadAll();
  }

  async function handleDownload(d: Doc) {
    const { data, error } = await supabase.storage
      .from('member-documents')
      .createSignedUrl(d.storage_path, 60);
    if (error || !data) {
      toast({ title: 'Could not open', description: error?.message, variant: 'destructive' });
      return;
    }
    window.open(data.signedUrl, '_blank');
  }

  async function handleDelete(d: Doc) {
    if (!confirm(`Delete "${d.title}"? This cannot be undone.`)) return;
    await supabase.storage.from('member-documents').remove([d.storage_path]);
    const { error } = await supabase.from('member_documents').delete().eq('id', d.id);
    if (error) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Deleted' });
    loadAll();
  }

  function openShareDialog(presetIds: string[]) {
    setSelectedForShare(presetIds);
    setNewShareLink(null);
    setShareForm({ label: '', recipient_name: '', expires_in_days: '30' });
    setShareOpen(true);
  }

  async function handleCreateShare(e: React.FormEvent) {
    e.preventDefault();
    if (!user || selectedForShare.length === 0) return;
    const days = parseInt(shareForm.expires_in_days, 10);
    const expires_at = days > 0 ? new Date(Date.now() + days * 86400 * 1000).toISOString() : null;
    const token = generateToken();
    const { error } = await supabase.from('document_shares').insert({
      user_id: user.id,
      token,
      label: shareForm.label.trim() || null,
      recipient_name: shareForm.recipient_name.trim() || null,
      document_ids: selectedForShare,
      expires_at,
    });
    if (error) {
      toast({ title: 'Could not create link', description: error.message, variant: 'destructive' });
      return;
    }
    const url = `${window.location.origin}/shared/${token}`;
    setNewShareLink(url);
    loadAll();
  }

  async function revokeShare(s: Share) {
    if (!confirm('Revoke this share link?')) return;
    const { error } = await supabase.from('document_shares').update({ is_active: false }).eq('id', s.id);
    if (error) {
      toast({ title: 'Failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Link revoked' });
    loadAll();
  }

  function copyLink(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast({ title: 'Link copied' });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-start gap-3 justify-between">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FolderLock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">Document Vault</h1>
                <p className="text-muted-foreground mt-1 max-w-2xl">
                  Securely store transcripts, resumes, release forms, and recommendations.
                  Share with coaches only when you're ready — links can expire.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {docs.length > 0 && (
                <Button variant="outline" onClick={() => openShareDialog([])}>
                  <Share2 className="w-4 h-4 mr-2" /> Share Bundle
                </Button>
              )}
              <Button onClick={() => setUploadOpen(true)}>
                <Upload className="w-4 h-4 mr-2" /> Upload Document
              </Button>
            </div>
          </div>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">My Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {fetching ? (
                <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : docs.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground mb-4">No documents yet. Upload your first PDF to get started.</p>
                  <Button onClick={() => setUploadOpen(true)}><Plus className="w-4 h-4 mr-2" /> Upload your first document</Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {docs.map(d => {
                    const cat = CATEGORIES.find(c => c.value === d.category);
                    return (
                      <div key={d.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-sm truncate">{d.title}</p>
                            <Badge variant="secondary" className="text-[10px]">{cat?.label ?? d.category}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {d.file_name} · {formatSize(d.file_size)} · {new Date(d.created_at).toLocaleDateString()}
                          </p>
                          {d.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{d.description}</p>}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button size="sm" variant="ghost" onClick={() => handleDownload(d)} title="View / Download">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => openShareDialog([d.id])} title="Share">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(d)} title="Delete" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active share links */}
          {shares.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Share Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {shares.map(s => {
                  const url = `${window.location.origin}/shared/${s.token}`;
                  const expired = s.expires_at && new Date(s.expires_at) < new Date();
                  const inactive = !s.is_active || expired;
                  return (
                    <div key={s.id} className={`p-3 rounded-lg border ${inactive ? 'opacity-50 bg-muted/30' : ''}`}>
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-sm">{s.label || `${s.document_ids.length} document${s.document_ids.length === 1 ? '' : 's'}`}</p>
                            {s.recipient_name && <Badge variant="outline" className="text-[10px]">For: {s.recipient_name}</Badge>}
                            {expired && <Badge variant="destructive" className="text-[10px]">Expired</Badge>}
                            {!s.is_active && !expired && <Badge variant="secondary" className="text-[10px]">Revoked</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">{url}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {s.view_count} view{s.view_count === 1 ? '' : 's'}
                            {s.expires_at && ` · expires ${new Date(s.expires_at).toLocaleDateString()}`}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {!inactive && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => copyLink(url)}>
                                <Copy className="w-3.5 h-3.5 mr-1" /> Copy
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => revokeShare(s)} className="text-destructive">
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Junior Year Transcript" required />
            </div>
            <div>
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Notes for yourself or coaches..." />
            </div>
            <div>
              <Label>PDF File * (max 10MB)</Label>
              <Input type="file" accept="application/pdf" onChange={e => setForm(f => ({ ...f, file: e.target.files?.[0] ?? null }))} required />
              {form.file && (
                <p className="text-xs text-muted-foreground mt-1">{form.file.name} · {formatSize(form.file.size)}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={uploading || !form.file || !form.title}>
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareOpen} onOpenChange={(o) => { setShareOpen(o); if (!o) setNewShareLink(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{newShareLink ? 'Share link ready' : 'Create Share Link'}</DialogTitle>
          </DialogHeader>

          {newShareLink ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Send this link to your coach. It works without a login and expires automatically.
              </p>
              <div className="flex gap-2">
                <Input value={newShareLink} readOnly className="font-mono text-xs" />
                <Button onClick={() => copyLink(newShareLink)}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <DialogFooter>
                <Button onClick={() => setShareOpen(false)}>Done</Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={handleCreateShare} className="space-y-4">
              <div>
                <Label className="mb-2 block">Documents to include *</Label>
                <div className="border rounded-lg p-2 max-h-56 overflow-y-auto space-y-1">
                  {docs.length === 0 && <p className="text-xs text-muted-foreground p-2">Upload a document first.</p>}
                  {docs.map(d => (
                    <label key={d.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer">
                      <Checkbox
                        checked={selectedForShare.includes(d.id)}
                        onCheckedChange={(c) => {
                          setSelectedForShare(prev => c ? [...prev, d.id] : prev.filter(x => x !== d.id));
                        }}
                      />
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm truncate flex-1">{d.title}</span>
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {CATEGORIES.find(c => c.value === d.category)?.label ?? d.category}
                      </Badge>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label>Label (optional)</Label>
                <Input value={shareForm.label} onChange={e => setShareForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. Application packet for Coach Smith" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Recipient (optional)</Label>
                  <Input value={shareForm.recipient_name} onChange={e => setShareForm(f => ({ ...f, recipient_name: e.target.value }))} placeholder="Coach name" />
                </div>
                <div>
                  <Label>Expires in</Label>
                  <Select value={shareForm.expires_in_days} onValueChange={v => setShareForm(f => ({ ...f, expires_in_days: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="0">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShareOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={selectedForShare.length === 0}>
                  <Share2 className="w-4 h-4 mr-2" /> Create Link
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

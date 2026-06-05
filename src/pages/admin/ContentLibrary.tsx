import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Download, Pencil, Trash2, Copy, FolderTree } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import {
  useContentItems,
  useContentCategories,
  useDeleteContentItem,
  getContentSignedUrl,
  ContentItem,
} from '@/hooks/useContentLibrary';
import ContentItemDialog from '@/components/admin/content/ContentItemDialog';
import CopyToStudentDialog from '@/components/admin/content/CopyToStudentDialog';
import CategoriesPanel from '@/components/admin/content/CategoriesPanel';
import { toast } from '@/hooks/use-toast';

interface Props {
  embedded?: boolean;
  defaultTab?: 'library' | 'categories';
}

export default function ContentLibrary({ embedded = false, defaultTab = 'library' }: Props) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: items = [] } = useContentItems();
  const { data: cats = [] } = useContentCategories();
  const del = useDeleteContentItem();

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editItem, setEditItem] = useState<ContentItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copyTemplate, setCopyTemplate] = useState<ContentItem | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (search) {
        const q = search.toLowerCase();
        const hit =
          it.title.toLowerCase().includes(q) ||
          (it.description || '').toLowerCase().includes(q) ||
          (it.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (catFilter !== 'all' && it.category_id !== catFilter) return false;
      if (typeFilter === 'template' && !it.is_template) return false;
      if (typeFilter === 'file' && it.is_template) return false;
      return true;
    });
  }, [items, search, catFilter, typeFilter]);

  if (loading || adminLoading) return <div className="p-8 text-center">Loading…</div>;
  if (!isAdmin) return <div className="p-8 text-center">Admin access required.</div>;

  const handleDownload = async (it: ContentItem) => {
    if (!it.storage_path) return;
    try {
      const url = await getContentSignedUrl(it.storage_path);
      window.open(url, '_blank');
    } catch (e: any) {
      toast({ title: 'Download failed', description: e.message, variant: 'destructive' });
    }
  };

  const content = (
    <Tabs defaultValue={defaultTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="library">Library</TabsTrigger>
        <TabsTrigger value="categories"><FolderTree className="w-4 h-4 mr-1" />Categories</TabsTrigger>
      </TabsList>

      <TabsContent value="library" className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <Input placeholder="Search title, description, tags…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="template">Templates only</SelectItem>
              <SelectItem value="file">Files only</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => { setEditItem(null); setDialogOpen(true); }} className="ml-auto">
            <Plus className="w-4 h-4 mr-1" />Upload
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>v</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No content yet.</TableCell></TableRow>
                )}
                {filtered.map((it) => {
                  const cat = cats.find((c) => c.id === it.category_id);
                  return (
                    <TableRow key={it.id}>
                      <TableCell>
                        <div className="font-medium">{it.title}</div>
                        {it.file_name && <div className="text-xs text-muted-foreground">{it.file_name}</div>}
                      </TableCell>
                      <TableCell>{cat?.name || '—'}</TableCell>
                      <TableCell>
                        {it.is_template ? <Badge>Template</Badge> : <Badge variant="secondary">File</Badge>}
                        {!it.is_global && <Badge variant="outline" className="ml-1">Private</Badge>}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(it.tags || []).slice(0, 3).map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                        </div>
                      </TableCell>
                      <TableCell>{it.version}</TableCell>
                      <TableCell className="text-right space-x-1">
                        {it.storage_path && (
                          <Button size="sm" variant="ghost" onClick={() => handleDownload(it)}><Download className="w-4 h-4" /></Button>
                        )}
                        {it.is_template && (
                          <Button size="sm" variant="ghost" onClick={() => setCopyTemplate(it)} title="Copy to student">
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => { setEditItem(it); setDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Delete "${it.title}"?`)) del.mutate(it); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="categories">
        <CategoriesPanel />
      </TabsContent>
    </Tabs>
  );

  const inner = (
    <>
      {content}
      <ContentItemDialog open={dialogOpen} onOpenChange={setDialogOpen} item={editItem} />
      <CopyToStudentDialog open={!!copyTemplate} onOpenChange={(o) => !o && setCopyTemplate(null)} template={copyTemplate} />
    </>
  );

  if (embedded) return inner;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 space-y-4">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}><ArrowLeft className="w-4 h-4 mr-1" />Back to Admin</Button>
          <h1 className="text-2xl font-bold mt-2">Content Library</h1>
        </div>
        {inner}
      </div>
    </div>
  );
}

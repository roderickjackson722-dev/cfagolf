import { useState, useMemo } from 'react';
import { Navigate, Link as RouterLink } from 'react-router-dom';
import { Plus, Pencil, Trash2, ExternalLink, Search, FolderPlus, ArrowLeft, Eye } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import {
  useResourceLinks,
  useLinkCategories,
  useSaveLink,
  useDeleteLink,
  useSaveCategory,
  useDeleteCategory,
  trackLinkClick,
  type ResourceLink,
  type LinkCategory,
} from '@/hooks/useResourceLinks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ALL = '__ALL__';
const UNCAT = 'Uncategorized';

export default function AdminLinks() {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  const { data: links = [] } = useResourceLinks(true);
  const { data: categories = [] } = useLinkCategories(true);
  const saveLink = useSaveLink();
  const deleteLink = useDeleteLink();
  const saveCategory = useSaveCategory();
  const deleteCategory = useDeleteCategory();

  const [activeCat, setActiveCat] = useState<string>(ALL);
  const [search, setSearch] = useState('');
  const [linkDialog, setLinkDialog] = useState<{ open: boolean; link?: ResourceLink | null }>({
    open: false,
  });
  const [catDialog, setCatDialog] = useState<{ open: boolean; cat?: LinkCategory | null }>({
    open: false,
  });
  const [confirmDel, setConfirmDel] = useState<{ type: 'link' | 'cat'; id: string; name: string } | null>(
    null,
  );

  const linkCountByCat = useMemo(() => {
    const m: Record<string, number> = {};
    for (const l of links) {
      const k = l.category || UNCAT;
      m[k] = (m[k] || 0) + 1;
    }
    return m;
  }, [links]);

  const filteredLinks = useMemo(() => {
    let list = links;
    if (activeCat !== ALL) list = list.filter((l) => (l.category || UNCAT) === activeCat);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(s) ||
          (l.description || '').toLowerCase().includes(s) ||
          (l.url || '').toLowerCase().includes(s),
      );
    }
    return list;
  }, [links, activeCat, search]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Button asChild variant="ghost" size="sm">
                <RouterLink to="/admin"><ArrowLeft className="h-4 w-4 mr-1" />Admin</RouterLink>
              </Button>
            </div>
            <h1 className="text-3xl font-bold font-playfair">Links Library</h1>
            <p className="text-muted-foreground">Curated resources for student-athletes and parents</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <RouterLink to="/resources/links" target="_blank">
                <Eye className="h-4 w-4 mr-2" />Public View
              </RouterLink>
            </Button>
            <Button variant="outline" onClick={() => setCatDialog({ open: true, cat: null })}>
              <FolderPlus className="h-4 w-4 mr-2" />Add Category
            </Button>
            <Button onClick={() => setLinkDialog({ open: true, link: null })}>
              <Plus className="h-4 w-4 mr-2" />Add Link
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-1">
            <button
              onClick={() => setActiveCat(ALL)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm flex justify-between items-center transition ${
                activeCat === ALL ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <span>All Links</span>
              <Badge variant="secondary">{links.length}</Badge>
            </button>
            {categories.map((c) => (
              <div key={c.id} className="group flex items-center gap-1">
                <button
                  onClick={() => setActiveCat(c.name)}
                  className={`flex-1 text-left px-3 py-2 rounded-md text-sm flex justify-between items-center transition ${
                    activeCat === c.name ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <Badge variant="secondary">{linkCountByCat[c.name] || 0}</Badge>
                </button>
                <button
                  onClick={() => setCatDialog({ open: true, cat: c })}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded"
                  title="Edit category"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              </div>
            ))}
            {linkCountByCat[UNCAT] ? (
              <button
                onClick={() => setActiveCat(UNCAT)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm flex justify-between items-center transition ${
                  activeCat === UNCAT ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <span>Uncategorized</span>
                <Badge variant="secondary">{linkCountByCat[UNCAT]}</Badge>
              </button>
            ) : null}
          </aside>

          {/* Main */}
          <section>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search links..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {filteredLinks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No links found. Click "Add Link" to create one.
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredLinks.map((link) => (
                  <Card key={link.id} className={!link.is_active ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackLinkClick(link)}
                          className="font-semibold hover:underline flex items-center gap-1 group"
                        >
                          {link.icon && <span>{link.icon}</span>}
                          <span>{link.name}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                        </a>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => setLinkDialog({ open: true, link })}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive"
                            onClick={() => setConfirmDel({ type: 'link', id: link.id, name: link.name })}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      {link.description && (
                        <p className="text-sm text-muted-foreground mb-2">{link.description}</p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        {link.category && <Badge variant="outline">{link.category}</Badge>}
                        {!link.is_active && <Badge variant="secondary">Inactive</Badge>}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {link.click_count} clicks
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />

      <LinkDialog
        open={linkDialog.open}
        link={linkDialog.link || null}
        categories={categories}
        onOpenChange={(open) => setLinkDialog({ open, link: open ? linkDialog.link : null })}
        onSave={async (data) => {
          await saveLink.mutateAsync(data);
          setLinkDialog({ open: false });
        }}
      />

      <CategoryDialog
        open={catDialog.open}
        cat={catDialog.cat || null}
        onOpenChange={(open) => setCatDialog({ open, cat: open ? catDialog.cat : null })}
        onSave={async (data) => {
          await saveCategory.mutateAsync(data);
          setCatDialog({ open: false });
        }}
        onDelete={async (id, name) => {
          setCatDialog({ open: false });
          setConfirmDel({ type: 'cat', id, name });
        }}
      />

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {confirmDel?.type === 'cat' ? 'category' : 'link'}?</AlertDialogTitle>
            <AlertDialogDescription>
              "{confirmDel?.name}" will be permanently removed.
              {confirmDel?.type === 'cat' && linkCountByCat[confirmDel.name]
                ? ` ${linkCountByCat[confirmDel.name]} links currently use this category and will become uncategorized.`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!confirmDel) return;
                if (confirmDel.type === 'link') await deleteLink.mutateAsync(confirmDel.id);
                else await deleteCategory.mutateAsync(confirmDel.id);
                setConfirmDel(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function LinkDialog({
  open,
  link,
  categories,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  link: ResourceLink | null;
  categories: LinkCategory[];
  onOpenChange: (o: boolean) => void;
  onSave: (data: Partial<ResourceLink> & { id?: string }) => Promise<void>;
}) {
  const [form, setForm] = useState<Partial<ResourceLink>>({});

  // Reset form when dialog opens
  useMemo(() => {
    if (open) {
      setForm(
        link || {
          name: '',
          description: '',
          url: 'https://',
          category: '',
          icon: '',
          sort_order: 0,
          is_active: true,
        },
      );
    }
  }, [open, link]);

  const submit = async () => {
    if (!form.name?.trim() || !form.url?.trim()) return;
    if (!/^https?:\/\//i.test(form.url)) {
      alert('URL must start with http:// or https://');
      return;
    }
    await onSave({
      id: link?.id,
      name: form.name.trim(),
      description: form.description || null,
      url: form.url.trim(),
      category: form.category || null,
      icon: form.icon || null,
      sort_order: form.sort_order ?? 0,
      is_active: form.is_active ?? true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{link ? 'Edit Link' : 'Add Link'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Name *</Label>
            <Input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>URL *</Label>
            <Input value={form.url || ''} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Select
                value={form.category || ''}
                onValueChange={(v) => setForm({ ...form, category: v === '__none__' ? '' : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Uncategorized" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Uncategorized</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Icon (emoji)</Label>
              <Input
                value={form.icon || ''}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="🔗"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={form.sort_order ?? 0}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch
                checked={form.is_active ?? true}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
              <Label>Active</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CategoryDialog({
  open,
  cat,
  onOpenChange,
  onSave,
  onDelete,
}: {
  open: boolean;
  cat: LinkCategory | null;
  onOpenChange: (o: boolean) => void;
  onSave: (data: Partial<LinkCategory> & { id?: string }) => Promise<void>;
  onDelete: (id: string, name: string) => void;
}) {
  const [form, setForm] = useState<Partial<LinkCategory>>({});

  useMemo(() => {
    if (open) {
      setForm(cat || { name: '', description: '', sort_order: 0, is_active: true });
    }
  }, [open, cat]);

  const submit = async () => {
    if (!form.name?.trim()) return;
    await onSave({
      id: cat?.id,
      name: form.name.trim(),
      description: form.description || null,
      sort_order: form.sort_order ?? 0,
      is_active: form.is_active ?? true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{cat ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Name *</Label>
            <Input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={form.sort_order ?? 0}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch
                checked={form.is_active ?? true}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
              <Label>Active</Label>
            </div>
          </div>
        </div>
        <DialogFooter className="justify-between sm:justify-between">
          {cat ? (
            <Button variant="destructive" onClick={() => onDelete(cat.id, cat.name)}>
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

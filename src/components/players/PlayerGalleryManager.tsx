import { useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  usePlayerGallery,
  useUpsertGalleryImage,
  useDeleteGalleryImage,
  GalleryImage,
} from '@/hooks/usePlayerExtras';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const CATEGORIES = ['Driver', 'Iron', 'Wedge', 'Putting', 'Course Management', 'Other'];
const ANGLES = ['Down the Line', 'Face On', 'Other'];

export function PlayerGalleryManager({ playerId, canEdit }: { playerId: string; canEdit: boolean }) {
  const { data: images = [], isLoading } = usePlayerGallery(playerId);
  const upsert = useUpsertGalleryImage(playerId);
  const del = useDeleteGalleryImage(playerId);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<GalleryImage> | null>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${playerId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('player-gallery').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('player-gallery').getPublicUrl(path);
      setEditing((e) => ({ ...(e || {}), image_url: data.publicUrl, thumbnail_url: data.publicUrl }));
      toast.success('Uploaded');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!editing?.image_url) return toast.error('Image required');
    try {
      await upsert.mutateAsync({
        ...editing,
        image_url: editing.image_url,
        display_order: editing.display_order ?? images.length,
      } as any);
      toast.success('Saved');
      setOpen(false);
      setEditing(null);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const move = async (img: GalleryImage, dir: -1 | 1) => {
    const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((i) => i.id === img.id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    await upsert.mutateAsync({ id: img.id, image_url: img.image_url, display_order: swap.display_order });
    await upsert.mutateAsync({ id: swap.id, image_url: swap.image_url, display_order: img.display_order });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Photo gallery</CardTitle>
        {canEdit && (
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setEditing({ category: 'Driver', angle: 'Down the Line' })}>
                <Plus className="w-4 h-4 mr-1" />Add image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editing?.id ? 'Edit' : 'Add'} image</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Image *</Label>
                  <Input type="file" accept="image/*" disabled={uploading} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                  {editing?.image_url && <img src={editing.image_url} alt="" className="mt-2 max-h-48 rounded" />}
                </div>
                <div><Label>Title</Label><Input value={editing?.title || ''} onChange={(e) => setEditing({ ...editing!, title: e.target.value })} placeholder="Driver - Face On" /></div>
                <div><Label>Description</Label><Textarea value={editing?.description || ''} onChange={(e) => setEditing({ ...editing!, description: e.target.value })} placeholder="Shaft lean, good rotation" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Category</Label>
                    <Select value={editing?.category || ''} onValueChange={(v) => setEditing({ ...editing!, category: v })}>
                      <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Angle</Label>
                    <Select value={editing?.angle || ''} onValueChange={(v) => setEditing({ ...editing!, angle: v })}>
                      <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>{ANGLES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Display order</Label><Input type="number" value={editing?.display_order ?? ''} onChange={(e) => setEditing({ ...editing!, display_order: Number(e.target.value) })} /></div>
              </div>
              <Button onClick={save} disabled={!editing?.image_url}>Save</Button>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? <p>Loading…</p> : images.length === 0 ? <p className="text-muted-foreground text-center py-6">No images yet.</p> : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((img) => (
              <div key={img.id} className="border rounded-lg overflow-hidden">
                <img src={img.thumbnail_url || img.image_url} alt={img.title || ''} className="w-full aspect-square object-cover" />
                <div className="p-2 text-xs">
                  <p className="font-medium truncate">{img.title || 'Untitled'}</p>
                  <p className="text-muted-foreground">{img.category} · {img.angle}</p>
                  {canEdit && (
                    <div className="flex justify-between mt-2">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => move(img, -1)}>↑</Button>
                        <Button size="sm" variant="outline" onClick={() => move(img, 1)}>↓</Button>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => { setEditing(img); setOpen(true); }}><Pencil className="w-3 h-3" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => confirm('Delete?') && del.mutate(img.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

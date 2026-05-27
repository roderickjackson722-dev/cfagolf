import { useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  usePlayerReferences,
  useUpsertReference,
  useDeleteReference,
  PlayerReference,
} from '@/hooks/usePlayerExtras';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export function PlayerReferencesManager({ playerId, canEdit }: { playerId: string; canEdit: boolean }) {
  const { data: refs = [], isLoading } = usePlayerReferences(playerId);
  const upsert = useUpsertReference(playerId);
  const del = useDeleteReference(playerId);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<PlayerReference> | null>(null);

  const uploadPhoto = async (file: File) => {
    const ext = file.name.split('.').pop();
    const path = `${playerId}/refs/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('player-gallery').upload(path, file);
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from('player-gallery').getPublicUrl(path);
    setEditing((e) => ({ ...(e || {}), photo_url: data.publicUrl }));
  };

  const save = async () => {
    if (!editing?.name || !editing?.title || !editing?.quote) return toast.error('Name, title, quote required');
    try {
      await upsert.mutateAsync({ ...editing, display_order: editing.display_order ?? refs.length });
      toast.success('Saved');
      setOpen(false);
      setEditing(null);
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>References</CardTitle>
        {canEdit && (
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setEditing({})}><Plus className="w-4 h-4 mr-1" />Add</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editing?.id ? 'Edit' : 'Add'} reference</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Name *</Label><Input value={editing?.name || ''} onChange={(e) => setEditing({ ...editing!, name: e.target.value })} /></div>
                <div><Label>Title *</Label><Input value={editing?.title || ''} onChange={(e) => setEditing({ ...editing!, title: e.target.value })} placeholder="Head PGA Professional" /></div>
                <div><Label>Company</Label><Input value={editing?.company || ''} onChange={(e) => setEditing({ ...editing!, company: e.target.value })} placeholder="Riviera CC" /></div>
                <div><Label>Quote *</Label><Textarea rows={4} value={editing?.quote || ''} onChange={(e) => setEditing({ ...editing!, quote: e.target.value })} /></div>
                <div>
                  <Label>Photo</Label>
                  <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
                  {editing?.photo_url && <img src={editing.photo_url} alt="" className="mt-2 w-20 h-20 rounded-full object-cover" />}
                </div>
                <div><Label>Display order</Label><Input type="number" value={editing?.display_order ?? ''} onChange={(e) => setEditing({ ...editing!, display_order: Number(e.target.value) })} /></div>
              </div>
              <Button onClick={save}>Save</Button>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? <p>Loading…</p> : refs.length === 0 ? <p className="text-muted-foreground text-center py-6">No references yet.</p> : (
          <div className="space-y-3">
            {refs.map((r) => (
              <div key={r.id} className="border rounded-lg p-4 flex gap-3 items-start">
                {r.photo_url && <img src={r.photo_url} alt={r.name} className="w-14 h-14 rounded-full object-cover shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-sm text-muted-foreground">{r.title}{r.company ? ` · ${r.company}` : ''}</p>
                  <p className="mt-2 text-sm italic">"{r.quote}"</p>
                </div>
                {canEdit && (
                  <div className="flex flex-col gap-1">
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="w-3 h-3" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => confirm('Delete?') && del.mutate(r.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePlayerVideos, PlayerVideo } from '@/hooks/usePlayers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const CATEGORIES = ['Driver', 'Iron', 'Wedge', 'Putting', 'Highlights', 'Tournament'];

function getEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

function getThumbnail(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
  return null;
}

export function PlayerVideosManager({ playerId, canEdit }: { playerId: string; canEdit: boolean }) {
  const { data: videos = [], isLoading } = usePlayerVideos(playerId);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<PlayerVideo> | null>(null);
  const [playing, setPlaying] = useState<PlayerVideo | null>(null);

  const save = useMutation({
    mutationFn: async (v: Partial<PlayerVideo>) => {
      const payload = { ...v, thumbnail_url: v.thumbnail_url || (v.url ? getThumbnail(v.url) : null) };
      const { error } = await supabase.from('player_videos').insert({ ...payload, player_id: playerId } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['player_videos', playerId] });
      setOpen(false);
      setEditing(null);
      toast.success('Added');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('player_videos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['player_videos', playerId] }),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Videos</CardTitle>
        {canEdit && (
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setEditing({ category: 'Highlights' })}><Plus className="w-4 h-4 mr-1" />Add</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add video</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Title *</Label><Input value={editing?.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
                <div><Label>YouTube or Vimeo URL *</Label><Input value={editing?.url || ''} onChange={(e) => setEditing({ ...editing, url: e.target.value })} placeholder="https://youtube.com/watch?v=…" /></div>
                <div>
                  <Label>Category</Label>
                  <Select value={editing?.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => editing && save.mutate(editing)} disabled={!editing?.title || !editing?.url}>Add</Button>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? <p>Loading…</p> : videos.length === 0 ? <p className="text-muted-foreground py-6 text-center">No videos yet.</p> : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map((v) => (
              <div key={v.id} className="border rounded-lg overflow-hidden group relative">
                <button onClick={() => setPlaying(v)} className="block w-full aspect-video bg-muted relative">
                  {v.thumbnail_url ? <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Play className="w-10 h-10" /></div>}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Play className="w-12 h-12 text-white" /></div>
                </button>
                <div className="p-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{v.title}</p>
                    <p className="text-xs text-muted-foreground">{v.category}</p>
                  </div>
                  {canEdit && <Button size="sm" variant="ghost" onClick={() => confirm('Delete?') && del.mutate(v.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>}
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={!!playing} onOpenChange={(o) => !o && setPlaying(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader><DialogTitle>{playing?.title}</DialogTitle></DialogHeader>
            {playing && (
              getEmbedUrl(playing.url) ? (
                <div className="aspect-video"><iframe src={getEmbedUrl(playing.url)!} className="w-full h-full" allowFullScreen /></div>
              ) : (
                <video src={playing.url} controls className="w-full" />
              )
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

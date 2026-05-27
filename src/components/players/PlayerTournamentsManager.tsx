import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePlayerTournaments, TournamentResult } from '@/hooks/usePlayers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function PlayerTournamentsManager({ playerId, canEdit }: { playerId: string; canEdit: boolean }) {
  const { data: results = [], isLoading } = usePlayerTournaments(playerId);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<TournamentResult> | null>(null);

  const save = useMutation({
    mutationFn: async (r: Partial<TournamentResult>) => {
      if (r.id) {
        const { error } = await supabase.from('player_tournament_results').update(r).eq('id', r.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('player_tournament_results').insert({ ...r, player_id: playerId } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['player_tournaments', playerId] });
      setOpen(false);
      setEditing(null);
      toast.success('Saved');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('player_tournament_results').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['player_tournaments', playerId] }),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tournament results</CardTitle>
        {canEdit && (
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setEditing({ date: new Date().toISOString().slice(0, 10) })}>
                <Plus className="w-4 h-4 mr-1" />Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing?.id ? 'Edit' : 'Add'} result</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date *</Label><Input type="date" value={editing?.date || ''} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></div>
                <div className="col-span-2 flex items-center justify-between border rounded p-3">
                  <div>
                    <Label>Upcoming tournament</Label>
                    <p className="text-xs text-muted-foreground">Show on Schedule tab instead of Results.</p>
                  </div>
                  <Switch checked={!!editing?.is_upcoming} onCheckedChange={(v) => setEditing({ ...editing, is_upcoming: v })} />
                </div>
                <div className="col-span-2"><Label>Tournament *</Label><Input value={editing?.tournament_name || ''} onChange={(e) => setEditing({ ...editing, tournament_name: e.target.value })} /></div>
                <div className="col-span-2"><Label>Course</Label><Input value={editing?.course || ''} onChange={(e) => setEditing({ ...editing, course: e.target.value })} /></div>
                <div className="col-span-2"><Label>Location</Label><Input value={editing?.location || ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} placeholder="City, State" /></div>
                {editing?.is_upcoming ? (
                  <div className="col-span-2"><Label>Registration link</Label><Input value={editing?.registration_link || ''} onChange={(e) => setEditing({ ...editing, registration_link: e.target.value })} placeholder="https://…" /></div>
                ) : (
                  <>
                    <div><Label>Score</Label><Input type="number" value={editing?.score ?? ''} onChange={(e) => setEditing({ ...editing, score: e.target.value ? Number(e.target.value) : null })} /></div>
                    <div><Label>Finish</Label><Input value={editing?.finish || ''} onChange={(e) => setEditing({ ...editing, finish: e.target.value })} placeholder="T-5" /></div>
                    <div><Label>Field size</Label><Input type="number" value={editing?.field_size ?? ''} onChange={(e) => setEditing({ ...editing, field_size: e.target.value ? Number(e.target.value) : null })} /></div>
                  </>
                )}
                <div className="col-span-2"><Label>Notes</Label><Textarea value={editing?.notes || ''} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></div>
              </div>
              <Button onClick={() => editing && save.mutate(editing)} disabled={!editing?.date || !editing?.tournament_name}>Save</Button>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? <p>Loading…</p> : results.length === 0 ? <p className="text-muted-foreground py-6 text-center">No results yet.</p> : (
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Tournament</TableHead><TableHead>Course</TableHead><TableHead>Score</TableHead><TableHead>Finish</TableHead><TableHead>Type</TableHead>{canEdit && <TableHead></TableHead>}</TableRow></TableHeader>
            <TableBody>
              {results.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{r.tournament_name}</TableCell>
                  <TableCell>{r.course || r.location || '—'}</TableCell>
                  <TableCell>{r.score ?? '—'}</TableCell>
                  <TableCell>{r.finish || '—'}</TableCell>
                  <TableCell>{r.is_upcoming ? <Badge variant="secondary">Upcoming</Badge> : <Badge variant="outline">Result</Badge>}</TableCell>
                  {canEdit && (
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}>Edit</Button>
                      <Button size="sm" variant="ghost" onClick={() => confirm('Delete?') && del.mutate(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

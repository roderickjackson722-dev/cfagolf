import { useState } from 'react';
import { Plus, Trash2, ExternalLink, Search, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWagrTournaments, WagrTournamentInput } from '@/hooks/useWagrTournaments';
import { format } from 'date-fns';

export function AdminWagrTable() {
  const [search, setSearch] = useState('');
  const { tournaments, isLoading, addTournament, deleteTournament } = useWagrTournaments({ search, city: '', state: '', country: '', eventType: '', gender: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<WagrTournamentInput>({
    tournament_name: '',
    start_date: '',
    end_date: '',
    country: 'US',
    city: '',
    state: '',
    course_name: '',
    event_type: 'All Ages',
    gender: 'Men',
    wagr_url: '',
    external_url: '',
    power_rating: undefined,
    winner_name: '',
  });

  const handleSubmit = () => {
    if (!form.tournament_name || !form.start_date) return;
    addTournament.mutate(form);
    setDialogOpen(false);
    setForm({ tournament_name: '', start_date: '', end_date: '', country: 'US', city: '', state: '', course_name: '', event_type: 'All Ages', gender: 'Men', wagr_url: '', external_url: '', power_rating: undefined, winner_name: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search tournaments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-1" /> Add Tournament</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add WAGR Tournament</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div><Label>Tournament Name *</Label><Input value={form.tournament_name} onChange={e => setForm(f => ({ ...f, tournament_name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Start Date *</Label><Input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} /></div>
                <div><Label>End Date</Label><Input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Country</Label><Input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} /></div>
                <div><Label>State</Label><Input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} /></div>
                <div><Label>City</Label><Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
              </div>
              <div><Label>Course Name</Label><Input value={form.course_name} onChange={e => setForm(f => ({ ...f, course_name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Event Type</Label>
                  <Select value={form.event_type} onValueChange={v => setForm(f => ({ ...f, event_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['All Ages', 'Junior', 'Collegiate', 'Senior', 'MidAm', 'Pro', 'Other'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Men', 'Women', 'Both'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>WAGR URL</Label><Input value={form.wagr_url} onChange={e => setForm(f => ({ ...f, wagr_url: e.target.value }))} placeholder="https://www.wagr.com/events/..." /></div>
              <div><Label>External URL</Label><Input value={form.external_url} onChange={e => setForm(f => ({ ...f, external_url: e.target.value }))} placeholder="Tournament website" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Power Rating</Label><Input type="number" value={form.power_rating ?? ''} onChange={e => setForm(f => ({ ...f, power_rating: e.target.value ? Number(e.target.value) : undefined }))} /></div>
                <div><Label>Winner</Label><Input value={form.winner_name} onChange={e => setForm(f => ({ ...f, winner_name: e.target.value }))} /></div>
              </div>
              <Button onClick={handleSubmit} className="w-full" disabled={addTournament.isPending}>
                {addTournament.isPending ? 'Adding...' : 'Add Tournament'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tournament</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Power</TableHead>
                <TableHead>Links</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tournaments.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No tournaments found</TableCell></TableRow>
              ) : tournaments.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{t.tournament_name}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {format(new Date(t.start_date), 'MMM d, yyyy')}
                    {t.end_date && t.end_date !== t.start_date && ` - ${format(new Date(t.end_date), 'MMM d')}`}
                  </TableCell>
                  <TableCell className="text-sm">
                    {[t.city, t.state, t.country].filter(Boolean).join(', ') || '—'}
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{t.event_type}</Badge></TableCell>
                  <TableCell className="text-sm">{t.gender}</TableCell>
                  <TableCell className="text-sm">{t.power_rating ? t.power_rating.toFixed(1) : '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {t.wagr_url && <a href={t.wagr_url} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="sm"><Globe className="w-3 h-3" /></Button></a>}
                      {t.external_url && <a href={t.external_url} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="sm"><ExternalLink className="w-3 h-3" /></Button></a>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => deleteTournament.mutate(t.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Total: {tournaments.length} tournaments • Data sourced from wagr.com
      </p>
    </div>
  );
}

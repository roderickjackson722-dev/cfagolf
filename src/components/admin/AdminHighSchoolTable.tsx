import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

interface HighSchool {
  id: string;
  name: string;
  city: string | null;
  state: string;
  classification: string;
  area_number: number | null;
  area_coordinator_name: string | null;
  area_coordinator_school: string | null;
  coach_name: string | null;
  coach_email: string | null;
  coach_phone: string | null;
  has_boys_team: boolean;
  has_girls_team: boolean;
  website_url: string | null;
  notes: string | null;
}

const CLASSIFICATIONS = ['AAAAAA', 'AAAAA', 'AAAA', 'AAA', 'AA', 'A Division I', 'A Division II', 'Private'];

const emptySchool: Omit<HighSchool, 'id'> = {
  name: '', city: null, state: 'GA', classification: 'AAAA',
  area_number: null, area_coordinator_name: null, area_coordinator_school: null,
  coach_name: null, coach_email: null, coach_phone: null,
  has_boys_team: true, has_girls_team: true, website_url: null, notes: null,
};

export function AdminHighSchoolTable() {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [editingSchool, setEditingSchool] = useState<HighSchool | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<HighSchool, 'id'>>(emptySchool);
  const queryClient = useQueryClient();

  const { data: schools = [], isLoading } = useQuery({
    queryKey: ['high-schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('high_schools' as any)
        .select('*')
        .order('classification')
        .order('name');
      if (error) throw error;
      return (data || []) as unknown as HighSchool[];
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (school: Partial<HighSchool> & { id?: string }) => {
      if (school.id) {
        const { error } = await supabase
          .from('high_schools' as any)
          .update(school as any)
          .eq('id', school.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('high_schools' as any)
          .insert(school as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['high-schools'] });
      toast.success(editingSchool ? 'School updated' : 'School added');
      setEditingSchool(null);
      setIsAddOpen(false);
      setFormData(emptySchool);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('high_schools' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['high-schools'] });
      toast.success('School deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const filtered = schools.filter(s => {
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.coach_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.area_coordinator_name?.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === 'all' || s.classification === classFilter;
    return matchesSearch && matchesClass;
  });

  const handleSave = () => {
    if (!formData.name || !formData.classification) {
      toast.error('Name and classification are required');
      return;
    }
    if (editingSchool) {
      upsertMutation.mutate({ ...formData, id: editingSchool.id });
    } else {
      upsertMutation.mutate(formData);
    }
  };

  const openEdit = (school: HighSchool) => {
    setEditingSchool(school);
    setFormData({ ...school });
  };

  const SchoolForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>School Name *</Label>
          <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Classification *</Label>
          <Select value={formData.classification} onValueChange={v => setFormData(p => ({ ...p, classification: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CLASSIFICATIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>City</Label>
          <Input value={formData.city || ''} onChange={e => setFormData(p => ({ ...p, city: e.target.value || null }))} />
        </div>
        <div className="space-y-2">
          <Label>Area Number</Label>
          <Input type="number" value={formData.area_number || ''} onChange={e => setFormData(p => ({ ...p, area_number: e.target.value ? parseInt(e.target.value) : null }))} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Area Coordinator</Label>
          <Input value={formData.area_coordinator_name || ''} onChange={e => setFormData(p => ({ ...p, area_coordinator_name: e.target.value || null }))} />
        </div>
        <div className="space-y-2">
          <Label>Coordinator School</Label>
          <Input value={formData.area_coordinator_school || ''} onChange={e => setFormData(p => ({ ...p, area_coordinator_school: e.target.value || null }))} />
        </div>
      </div>
      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Golf Coach Info</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Coach Name</Label>
            <Input value={formData.coach_name || ''} onChange={e => setFormData(p => ({ ...p, coach_name: e.target.value || null }))} />
          </div>
          <div className="space-y-2">
            <Label>Coach Email</Label>
            <Input type="email" value={formData.coach_email || ''} onChange={e => setFormData(p => ({ ...p, coach_email: e.target.value || null }))} />
          </div>
          <div className="space-y-2">
            <Label>Coach Phone</Label>
            <Input value={formData.coach_phone || ''} onChange={e => setFormData(p => ({ ...p, coach_phone: e.target.value || null }))} />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Website URL</Label>
        <Input value={formData.website_url || ''} onChange={e => setFormData(p => ({ ...p, website_url: e.target.value || null }))} />
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea value={formData.notes || ''} onChange={e => setFormData(p => ({ ...p, notes: e.target.value || null }))} />
      </div>
      <Button onClick={handleSave} disabled={upsertMutation.isPending}>
        {upsertMutation.isPending ? 'Saving...' : editingSchool ? 'Update School' : 'Add School'}
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search schools, coaches..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Classifications" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classifications</SelectItem>
            {CLASSIFICATIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Dialog open={isAddOpen} onOpenChange={v => { setIsAddOpen(v); if (!v) setFormData(emptySchool); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add School</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add High School</DialogTitle></DialogHeader>
            <SchoolForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <GraduationCap className="w-4 h-4" />
        <span>{filtered.length} of {schools.length} schools</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="border rounded-lg overflow-auto max-h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School</TableHead>
                <TableHead>Classification</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Area Coordinator</TableHead>
                <TableHead>Golf Coach</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(school => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{school.classification}</Badge>
                  </TableCell>
                  <TableCell>{school.area_number || '—'}</TableCell>
                  <TableCell className="text-sm">
                    {school.area_coordinator_name ? (
                      <span>{school.area_coordinator_name}<br /><span className="text-muted-foreground text-xs">{school.area_coordinator_school}</span></span>
                    ) : '—'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {school.coach_name ? (
                      <span>{school.coach_name}{school.coach_email && <><br /><span className="text-muted-foreground text-xs">{school.coach_email}</span></>}</span>
                    ) : <span className="text-muted-foreground italic">Not set</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog onOpenChange={v => { if (!v) setEditingSchool(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(school)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        {editingSchool?.id === school.id && (
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader><DialogTitle>Edit {school.name}</DialogTitle></DialogHeader>
                            <SchoolForm />
                          </DialogContent>
                        )}
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (confirm(`Delete ${school.name}?`)) deleteMutation.mutate(school.id);
                      }}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

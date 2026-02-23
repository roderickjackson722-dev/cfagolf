import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function AdminPromoCodeTable() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newMaxUses, setNewMaxUses] = useState('');

  const { data: promoCodes = [], isLoading } = useQuery({
    queryKey: ['admin-promo-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('promo_codes').insert({
        code: newCode.toUpperCase().trim(),
        name: newName.trim(),
        discount_percent: parseInt(newDiscount),
        max_uses: newMaxUses ? parseInt(newMaxUses) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promo-codes'] });
      toast.success('Promo code created!');
      setNewCode('');
      setNewName('');
      setNewDiscount('');
      setNewMaxUses('');
      setShowForm(false);
    },
    onError: (err: any) => {
      if (err?.code === '23505') {
        toast.error('This promo code already exists');
      } else {
        toast.error('Failed to create promo code');
      }
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('promo_codes')
        .update({ is_active: !is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promo-codes'] });
      toast.success('Promo code updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('promo_codes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promo-codes'] });
      toast.success('Promo code deleted');
    },
  });

  const handleSubmit = () => {
    if (!newCode.trim() || !newName.trim() || !newDiscount) {
      toast.error('Code, name, and discount are required');
      return;
    }
    const discount = parseInt(newDiscount);
    if (isNaN(discount) || discount < 1 || discount > 100) {
      toast.error('Discount must be between 1 and 100');
      return;
    }
    addMutation.mutate();
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{promoCodes.length} promo code(s)</p>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Add Promo Code
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-lg">New Promo Code</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Code *</Label>
                <Input value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())} placeholder="e.g. SUMMER25" />
              </div>
              <div>
                <Label>Name / Description *</Label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Summer Sale - 25% Off" />
              </div>
              <div>
                <Label>Discount % *</Label>
                <Input type="number" min={1} max={100} value={newDiscount} onChange={e => setNewDiscount(e.target.value)} placeholder="e.g. 25" />
              </div>
              <div>
                <Label>Max Uses (leave blank for unlimited)</Label>
                <Input type="number" min={1} value={newMaxUses} onChange={e => setNewMaxUses(e.target.value)} placeholder="Unlimited" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={addMutation.isPending}>
                {addMutation.isPending ? 'Creating...' : 'Create Promo Code'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Uses</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promoCodes.map(promo => (
            <TableRow key={promo.id}>
              <TableCell className="font-mono font-bold">{promo.code}</TableCell>
              <TableCell>{promo.name}</TableCell>
              <TableCell>{promo.discount_percent}%</TableCell>
              <TableCell>{promo.uses_count}{promo.max_uses ? ` / ${promo.max_uses}` : ''}</TableCell>
              <TableCell>
                <Badge variant={promo.is_active ? 'default' : 'secondary'}>
                  {promo.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMutation.mutate({ id: promo.id, is_active: promo.is_active })}
                    title={promo.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {promo.is_active ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { if (confirm('Delete this promo code?')) deleteMutation.mutate(promo.id); }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {promoCodes.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No promo codes yet</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

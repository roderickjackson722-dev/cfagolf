import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Trash2, Star, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function AdminTestimonialTable() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newStatus, setNewStatus] = useState<'pending' | 'approved'>('approved');

  const addTestimonial = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('testimonials').insert({
        name: newName.trim(),
        role: newRole.trim() || null,
        content: newContent.trim(),
        status: newStatus,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success('Testimonial added successfully');
      setNewName(''); setNewRole(''); setNewContent(''); setShowForm(false);
    },
    onError: () => toast.error('Failed to add testimonial'),
  });

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('testimonials')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success(`Testimonial ${status === 'approved' ? 'approved and published' : 'rejected'}`);
    },
    onError: () => toast.error('Failed to update testimonial'),
  });

  const deleteTestimonial = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success('Testimonial deleted');
    },
    onError: () => toast.error('Failed to delete testimonial'),
  });

  const statusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success/20 text-success border-success/30"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  const pending = testimonials.filter(t => t.status === 'pending');
  const approved = testimonials.filter(t => t.status === 'approved');
  const rejected = testimonials.filter(t => t.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">Total: <strong>{testimonials.length}</strong></span>
          <span className="text-muted-foreground">Pending: <strong className="text-yellow-600">{pending.length}</strong></span>
          <span className="text-muted-foreground">Approved: <strong className="text-success">{approved.length}</strong></span>
          <span className="text-muted-foreground">Rejected: <strong className="text-destructive">{rejected.length}</strong></span>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1" /> Add Review
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Add a Customer Review</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); if (newName.trim() && newContent.trim()) addTestimonial.mutate(); else toast.error('Name and content are required.'); }} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="admin-name">Customer Name *</Label>
                  <Input id="admin-name" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g., John Smith" maxLength={100} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="admin-role">Role / Title</Label>
                  <Input id="admin-role" value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="e.g., Parent of D1 signee" maxLength={100} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="admin-content">Review Content *</Label>
                <Textarea id="admin-content" value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Enter the customer's testimonial..." rows={4} maxLength={2000} className="resize-none" />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="status" checked={newStatus === 'approved'} onChange={() => setNewStatus('approved')} /> Publish immediately
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="status" checked={newStatus === 'pending'} onChange={() => setNewStatus('pending')} /> Save as pending
                </label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={addTestimonial.isPending}>{addTestimonial.isPending ? 'Adding...' : 'Add Review'}</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {testimonials.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No testimonials submitted yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="max-w-md">Content</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="text-muted-foreground">{t.role || '—'}</TableCell>
                <TableCell className="max-w-md">
                  <p className="line-clamp-3 text-sm">{t.content}</p>
                </TableCell>
                <TableCell>{statusBadge(t.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(t.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    {t.status !== 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-success border-success/30 hover:bg-success/10"
                        onClick={() => updateStatus.mutate({ id: t.id, status: 'approved' })}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    {t.status !== 'rejected' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => updateStatus.mutate({ id: t.id, status: 'rejected' })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => deleteTestimonial.mutate(t.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

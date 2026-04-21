import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, KeyRound, Mail, Trash2, Pencil, ExternalLink, Inbox } from 'lucide-react';
import { format } from 'date-fns';

interface Coach {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  college_name: string;
  title: string | null;
  conference: string | null;
  photo_url: string | null;
  bio: string | null;
  recruiting_preferences: string | null;
  program_overview: string | null;
  is_active: boolean;
  slug: string;
  last_login_at: string | null;
  created_at: string;
}

const empty = {
  full_name: '',
  email: '',
  college_name: '',
  title: '',
  conference: '',
  photo_url: '',
  bio: '',
  recruiting_preferences: '',
  program_overview: '',
  is_active: true,
};

export function AdminCoachesTable() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Coach | null>(null);
  const [form, setForm] = useState(empty);

  const { data: coaches = [], isLoading } = useQuery({
    queryKey: ['admin-coaches'],
    queryFn: async () => {
      const { data } = await supabase
        .from('coaches')
        .select('*')
        .order('created_at', { ascending: false });
      return (data ?? []) as Coach[];
    },
  });

  const { data: requests = [] } = useQuery({
    queryKey: ['admin-coach-requests'],
    queryFn: async () => {
      const { data } = await supabase
        .from('coach_access_requests')
        .select('*')
        .order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const createCoach = useMutation({
    mutationFn: async (payload: typeof empty) => {
      const { data, error } = await supabase.functions.invoke('create-coach-account', { body: payload });
      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      toast({
        title: 'Coach created',
        description: `Welcome email sent. Temporary password: ${data?.temp_password ?? '(see email)'}`,
      });
      setCreateOpen(false);
      setForm(empty);
      qc.invalidateQueries({ queryKey: ['admin-coaches'] });
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const updateCoach = useMutation({
    mutationFn: async (c: Coach) => {
      const { error } = await supabase
        .from('coaches')
        .update({
          full_name: c.full_name,
          college_name: c.college_name,
          title: c.title,
          conference: c.conference,
          photo_url: c.photo_url,
          bio: c.bio,
          recruiting_preferences: c.recruiting_preferences,
          program_overview: c.program_overview,
          is_active: c.is_active,
        })
        .eq('id', c.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Updated' });
      setEditing(null);
      qc.invalidateQueries({ queryKey: ['admin-coaches'] });
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const sendMagic = useMutation({
    mutationFn: async (coach_id: string) => {
      const { error } = await supabase.functions.invoke('coach-magic-link', {
        body: { coach_id, mode: 'magic_link' },
      });
      if (error) throw error;
    },
    onSuccess: () => toast({ title: 'Magic link emailed' }),
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const resetPwd = useMutation({
    mutationFn: async (coach_id: string) => {
      const { data, error } = await supabase.functions.invoke('coach-magic-link', {
        body: { coach_id, mode: 'reset_password' },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => toast({ title: 'Password reset', description: `New temp password: ${data?.temp_password ?? '(see email)'}` }),
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteCoach = useMutation({
    mutationFn: async (c: Coach) => {
      // Delete coach row; auth user remains but is harmless
      const { error } = await supabase.from('coaches').delete().eq('id', c.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Deleted' });
      qc.invalidateQueries({ queryKey: ['admin-coaches'] });
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Coaches</CardTitle>
            <CardDescription>{coaches.length} active accounts</CardDescription>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-1" /> New Coach</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Create Coach Account</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><Label>Full name *</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
                  <div><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                  <div><Label>College *</Label><Input value={form.college_name} onChange={(e) => setForm({ ...form, college_name: e.target.value })} /></div>
                  <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                  <div><Label>Conference</Label><Input value={form.conference} onChange={(e) => setForm({ ...form, conference: e.target.value })} /></div>
                  <div><Label>Photo URL</Label><Input value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} /></div>
                </div>
                <div><Label>Bio</Label><Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
                <div><Label>Recruiting Preferences</Label><Textarea rows={3} value={form.recruiting_preferences} onChange={(e) => setForm({ ...form, recruiting_preferences: e.target.value })} /></div>
                <div><Label>Program Overview</Label><Textarea rows={4} value={form.program_overview} onChange={(e) => setForm({ ...form, program_overview: e.target.value })} /></div>
                <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>Active</Label></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={() => createCoach.mutate(form)} disabled={createCoach.isPending}>
                  {createCoach.isPending ? 'Creating…' : 'Create & email login'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-6 text-muted-foreground">Loading…</p>
          ) : coaches.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">No coaches yet. Click "New Coach" to add one.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coaches.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.full_name}</TableCell>
                      <TableCell>{c.college_name}</TableCell>
                      <TableCell className="text-sm">{c.email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.last_login_at ? format(new Date(c.last_login_at), 'MMM d, yyyy') : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={c.is_active ? 'default' : 'secondary'}>{c.is_active ? 'Active' : 'Inactive'}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <a href={`/coach/${c.slug}`} target="_blank" rel="noreferrer">
                          <Button size="icon" variant="ghost" title="View public profile"><ExternalLink className="w-4 h-4" /></Button>
                        </a>
                        <Button size="icon" variant="ghost" title="Edit" onClick={() => setEditing(c)}><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" title="Send magic link" onClick={() => sendMagic.mutate(c.id)}><Mail className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" title="Reset password" onClick={() => resetPwd.mutate(c.id)}><KeyRound className="w-4 h-4" /></Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Delete"
                          onClick={() => {
                            if (confirm(`Delete ${c.full_name}? This removes the coach profile.`)) deleteCoach.mutate(c);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Access Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Inbox className="w-5 h-5" /> Access Requests</CardTitle>
          <CardDescription>Coaches who requested access via the public form</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">No pending requests.</p>
          ) : (
            <div className="space-y-3">
              {requests.map((r: any) => (
                <div key={r.id} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-medium">{r.full_name} <Badge variant="secondary" className="ml-2">{r.status}</Badge></p>
                      <p className="text-sm text-muted-foreground">{r.email} · {r.college_name}{r.title ? ` · ${r.title}` : ''}</p>
                      {r.message && <p className="text-sm mt-2">{r.message}</p>}
                    </div>
                    <span className="text-xs text-muted-foreground">{format(new Date(r.created_at), 'MMM d')}</span>
                  </div>
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      setForm({
                        ...empty,
                        full_name: r.full_name,
                        email: r.email,
                        college_name: r.college_name,
                        title: r.title ?? '',
                        conference: r.conference ?? '',
                      });
                      setCreateOpen(true);
                    }}
                  >
                    Approve & create account
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Coach</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label>Full name</Label><Input value={editing.full_name} onChange={(e) => setEditing({ ...editing, full_name: e.target.value })} /></div>
                <div><Label>Email</Label><Input value={editing.email} disabled /></div>
                <div><Label>College</Label><Input value={editing.college_name} onChange={(e) => setEditing({ ...editing, college_name: e.target.value })} /></div>
                <div><Label>Title</Label><Input value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
                <div><Label>Conference</Label><Input value={editing.conference ?? ''} onChange={(e) => setEditing({ ...editing, conference: e.target.value })} /></div>
                <div><Label>Photo URL</Label><Input value={editing.photo_url ?? ''} onChange={(e) => setEditing({ ...editing, photo_url: e.target.value })} /></div>
              </div>
              <div><Label>Bio</Label><Textarea rows={3} value={editing.bio ?? ''} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} /></div>
              <div><Label>Recruiting Preferences</Label><Textarea rows={3} value={editing.recruiting_preferences ?? ''} onChange={(e) => setEditing({ ...editing, recruiting_preferences: e.target.value })} /></div>
              <div><Label>Program Overview</Label><Textarea rows={4} value={editing.program_overview ?? ''} onChange={(e) => setEditing({ ...editing, program_overview: e.target.value })} /></div>
              <div className="flex items-center gap-2"><Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} /><Label>Active</Label></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && updateCoach.mutate(editing)} disabled={updateCoach.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

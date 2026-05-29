import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { useInventoryShares, useInviteShare, useRevokeShare } from '@/hooks/useInventory';
import { toast } from '@/hooks/use-toast';

export default function InventorySharesPanel() {
  const { data: shares = [] } = useInventoryShares();
  const invite = useInviteShare();
  const revoke = useRevokeShare();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');

  const submit = () => {
    if (!email.includes('@')) { toast({ title: 'Valid email required', variant: 'destructive' }); return; }
    invite.mutate({ email, role }, {
      onSuccess: () => { setEmail(''); toast({ title: 'Invite saved', description: 'Grant the role in user settings to activate access.' }); },
      onError: (e: any) => toast({ title: 'Failed', description: e.message, variant: 'destructive' }),
    });
  };

  return (
    <Card>
      <CardHeader><CardTitle>Sharing & Access</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground">Email</label>
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="person@example.com" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Role</label>
            <Select value={role} onValueChange={(v: any) => setRole(v)}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={submit} disabled={invite.isPending}>Invite</Button>
        </div>

        <p className="text-xs text-muted-foreground">
          After inviting, assign the matching role (<code>inventory_admin</code>, <code>inventory_editor</code>, or <code>inventory_viewer</code>) to that user in your user-roles table to grant actual access.
        </p>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Invited</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shares.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">No invitations yet</TableCell></TableRow>}
              {shares.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.email}</TableCell>
                  <TableCell><Badge variant="outline">{s.role}</Badge></TableCell>
                  <TableCell className="text-xs">{new Date(s.invited_at).toLocaleDateString()}</TableCell>
                  <TableCell>{s.is_active ? <Badge>Active</Badge> : <Badge variant="secondary">Revoked</Badge>}</TableCell>
                  <TableCell>{s.is_active && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => revoke.mutate(s.id)}><Trash2 className="w-3.5 h-3.5" /></Button>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

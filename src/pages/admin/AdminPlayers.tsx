import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useAllPlayers, useDeletePlayer, useUpsertPlayer } from '@/hooks/usePlayers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const AdminPlayers = () => {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: players = [], isLoading } = useAllPlayers();
  const deletePlayer = useDeletePlayer();
  const upsert = useUpsertPlayer();

  if (loading || adminLoading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const toggleActive = async (id: string, current: boolean) => {
    await upsert.mutateAsync({ id, is_active: !current });
    toast.success(current ? 'Deactivated' : 'Activated');
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}'s player site? This cannot be undone.`)) return;
    await deletePlayer.mutateAsync(id);
    toast.success('Player deleted');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Player Portfolio Sites</h1>
            <p className="text-muted-foreground">Manage student-athlete recruiting websites at /p/&lt;slug&gt;</p>
          </div>
          <Button asChild>
            <Link to="/admin/players/new"><Plus className="w-4 h-4 mr-2" />New Player</Link>
          </Button>
        </div>

        <Card>
          <CardHeader><CardTitle>{players.length} player{players.length === 1 ? '' : 's'}</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading…</p>
            ) : players.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No players yet. Create the first one.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Grad Year</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.full_name}</TableCell>
                      <TableCell>
                        <a href={`/p/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                          /p/{p.slug} <ExternalLink className="w-3 h-3" />
                        </a>
                      </TableCell>
                      <TableCell>{p.graduation_year || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={p.is_active ? 'default' : 'secondary'}>{p.is_active ? 'Active' : 'Inactive'}</Badge>
                        {!p.allow_editing && <Badge variant="outline" className="ml-1">Editing locked</Badge>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(p.updated_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => toggleActive(p.id, p.is_active)}>
                          {p.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={`/admin/players/${p.id}/edit`}><Edit className="w-4 h-4" /></Link>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id, p.full_name)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPlayers;

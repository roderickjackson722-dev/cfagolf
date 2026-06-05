import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Pencil, Trash2, ExternalLink, FolderOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useStudents, useDeleteStudent } from '@/hooks/useStudents';
import StudentDialog from '@/components/admin/students/StudentDialog';
import { Student } from '@/hooks/useStudents';
import { toast } from '@/hooks/use-toast';

interface Props {
  embedded?: boolean;
}

export default function Students({ embedded = false }: Props) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: students = [] } = useStudents();
  const del = useDeleteStudent();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  const years = useMemo(() => Array.from(new Set(students.map((s) => s.graduation_year).filter(Boolean))).sort() as number[], [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (search && !s.full_name.toLowerCase().includes(search.toLowerCase()) && !(s.email || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (yearFilter !== 'all' && String(s.graduation_year) !== yearFilter) return false;
      return true;
    });
  }, [students, search, statusFilter, yearFilter]);

  if (loading || adminLoading) return <div className="p-8 text-center">Loading…</div>;
  if (!isAdmin) return <div className="p-8 text-center">Admin access required.</div>;

  const inner = (
    <>
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <Input placeholder="Search name or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="graduated">Graduated</SelectItem>
          </SelectContent>
        </Select>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Grad year" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All years</SelectItem>
            {years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button className="ml-auto" onClick={() => { setEditStudent(null); setOpen(true); }}>
          <Plus className="w-4 h-4 mr-1" />New Student
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Grad Year</TableHead>
                <TableHead>HCP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No students yet.</TableCell></TableRow>
              )}
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Link to={`/admin/students/${s.id}`} className="font-medium hover:underline">{s.full_name}</Link>
                    {s.email && <div className="text-xs text-muted-foreground">{s.email}</div>}
                  </TableCell>
                  <TableCell>{s.graduation_year || '—'}</TableCell>
                  <TableCell>{s.handicap ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === 'active' ? 'default' : 'secondary'}>{s.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(s.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {s.personal_website_url && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={s.personal_website_url} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4" /></a>
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => { setEditStudent(s); setOpen(true); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => {
                      if (confirm(`Delete ${s.full_name}? This removes all their files and notes.`)) {
                        del.mutate(s.id, { onSuccess: () => toast({ title: 'Student deleted' }) });
                      }
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <StudentDialog open={open} onOpenChange={setOpen} student={editStudent} />
    </>
  );

  if (embedded) return inner;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4">
        <div className="mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}><ArrowLeft className="w-4 h-4 mr-1" />Back to Admin</Button>
          <h1 className="text-2xl font-bold mt-2">Students</h1>
        </div>
        {inner}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useStudent } from '@/hooks/useStudents';
import StudentDialog from '@/components/admin/students/StudentDialog';
import StudentContentTab from '@/components/admin/students/StudentContentTab';
import StudentNotesTab from '@/components/admin/students/StudentNotesTab';
import StudentWebpagesTab from '@/components/admin/students/StudentWebpagesTab';
import StudentActivityTab from '@/components/admin/students/StudentActivityTab';

export default function StudentDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'info';
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: student, isLoading } = useStudent(id);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  if (loading || adminLoading || isLoading) return <div className="p-8 text-center">Loading…</div>;
  if (!isAdmin) return <div className="p-8 text-center">Admin access required.</div>;
  if (!student) return <div className="p-8 text-center">Student not found.</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/students')}>
          <ArrowLeft className="w-4 h-4 mr-1" />Back to Students
        </Button>

        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">{student.full_name}</h1>
            <p className="text-sm text-muted-foreground">
              {student.graduation_year ? `Class of ${student.graduation_year}` : ''}
              {student.high_school ? ` · ${student.high_school}` : ''}
            </p>
          </div>
          <div className="flex gap-2">
            {student.personal_website_url && (
              <Button variant="outline" asChild>
                <a href={student.personal_website_url} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1" />Open Site
                </a>
              </Button>
            )}
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="w-4 h-4 mr-1" />Edit
            </Button>
          </div>
        </div>

        <Tabs defaultValue="info" className="space-y-4">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="webpage">Webpage</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardContent className="p-4 grid grid-cols-2 gap-3 text-sm">
                <Field label="Email" value={student.email} />
                <Field label="Phone" value={student.phone} />
                <Field label="Graduation Year" value={student.graduation_year} />
                <Field label="High School" value={student.high_school} />
                <Field label="Handicap" value={student.handicap} />
                <Field label="Scoring Average" value={student.scoring_average} />
                <Field label="GPA" value={student.gpa} />
                <Field label="Status" value={student.status} />
                <Field label="Slug" value={student.slug} />
                <Field label="Personal Website" value={student.personal_website_url} />
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground">Admin Notes</div>
                  <div className="whitespace-pre-wrap">{student.notes || '—'}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content"><StudentContentTab studentId={student.id} /></TabsContent>
          <TabsContent value="notes"><StudentNotesTab studentId={student.id} /></TabsContent>
          <TabsContent value="webpage"><StudentWebpagesTab studentId={student.id} /></TabsContent>
          <TabsContent value="activity"><StudentActivityTab studentId={student.id} /></TabsContent>
        </Tabs>

        <StudentDialog open={editOpen} onOpenChange={setEditOpen} student={student} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div>{value ?? '—'}</div>
    </div>
  );
}

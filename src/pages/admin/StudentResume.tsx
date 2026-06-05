import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useStudent } from '@/hooks/useStudents';
import ResumeEditor from '@/components/admin/students/ResumeEditor';

export default function StudentResume() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: student, isLoading } = useStudent(id);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  if (loading || adminLoading || isLoading) return <div className="p-8 text-center">Loading…</div>;
  if (!isAdmin) return <div className="p-8 text-center">Admin access required.</div>;
  if (!student) return <div className="p-8 text-center">Student not found.</div>;

  const seed = {
    fullName: student.full_name,
    email: student.email || '',
    phone: student.phone || '',
    highSchool: student.high_school || '',
    graduationYear: student.graduation_year ? String(student.graduation_year) : '',
    gpa: student.gpa ? String(student.gpa) : '',
    handicap: student.handicap != null ? String(student.handicap) : '',
    scoringAverage: student.scoring_average != null ? String(student.scoring_average) : '',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/students/${student.id}`)}>
          <ArrowLeft className="w-4 h-4 mr-1" />Back to {student.full_name}
        </Button>
        <h1 className="text-2xl font-bold">Golf Resume — {student.full_name}</h1>
        <ResumeEditor studentId={student.id} seed={seed} />
      </div>
    </div>
  );
}

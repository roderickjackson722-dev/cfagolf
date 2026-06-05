import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ResumeEditor from '@/components/admin/students/ResumeEditor';

export default function PlayerResume() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data } = await supabase.from('students' as any).select('id').eq('user_id', user.id).maybeSingle();
      setStudentId((data as any)?.id ?? null);
      setChecking(false);
    })();
  }, [user]);

  if (loading || checking) return <div className="p-8 text-center">Loading…</div>;
  if (!studentId) return <div className="p-8 text-center">No student profile linked to your account.</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 space-y-4">
        <h1 className="text-2xl font-bold">My Golf Resume</h1>
        <ResumeEditor studentId={studentId} hideAdminFields />
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const CoachProfileEdit = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [coach, setCoach] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [pwd, setPwd] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('coaches')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setCoach(data));
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/coach/login" replace />;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from('coaches')
      .update({
        full_name: coach.full_name,
        title: coach.title,
        conference: coach.conference,
        photo_url: coach.photo_url,
        bio: coach.bio,
        recruiting_preferences: coach.recruiting_preferences,
        program_overview: coach.program_overview,
      })
      .eq('id', coach.id);
    setSaving(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Saved', description: 'Your profile has been updated.' });
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.length < 8) {
      toast({ title: 'Too short', description: 'Use at least 8 characters.', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    setPwd('');
    toast({ title: 'Password updated' });
  };

  if (!coach) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Button variant="ghost" size="sm" onClick={() => navigate('/coach/dashboard')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Updates appear immediately on your public page</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full name</Label>
                    <Input value={coach.full_name ?? ''} onChange={(e) => setCoach({ ...coach, full_name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={coach.title ?? ''} onChange={(e) => setCoach({ ...coach, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>College</Label>
                    <Input value={coach.college_name ?? ''} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Conference</Label>
                    <Input value={coach.conference ?? ''} onChange={(e) => setCoach({ ...coach, conference: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Profile photo URL</Label>
                  <Input value={coach.photo_url ?? ''} onChange={(e) => setCoach({ ...coach, photo_url: e.target.value })} placeholder="https://…" />
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea rows={4} value={coach.bio ?? ''} onChange={(e) => setCoach({ ...coach, bio: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Recruiting preferences</Label>
                  <Textarea rows={4} value={coach.recruiting_preferences ?? ''} onChange={(e) => setCoach({ ...coach, recruiting_preferences: e.target.value })} placeholder="What do you look for in a recruit?" />
                </div>
                <div className="space-y-2">
                  <Label>Program overview</Label>
                  <Textarea rows={6} value={coach.program_overview ?? ''} onChange={(e) => setCoach({ ...coach, program_overview: e.target.value })} />
                </div>
                <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePassword} className="flex gap-2">
                <Input type="password" placeholder="New password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
                <Button type="submit">Update</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoachProfileEdit;

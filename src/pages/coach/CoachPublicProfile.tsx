import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Eye, MapPin, Trophy, Mail } from 'lucide-react';

function getOrCreateSessionId(): string {
  const key = 'cfa_session_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

const CoachPublicProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [coach, setCoach] = useState<any>(null);
  const [viewCount, setViewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from('coaches')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();
      setCoach(data);
      setLoading(false);

      if (data) {
        // Log view
        await supabase.from('coach_profile_views').insert({
          coach_id: data.id,
          viewer_user_id: user?.id ?? null,
          viewer_session_id: user?.id ? null : getOrCreateSessionId(),
          viewer_full_name: profile?.full_name ?? null,
          viewer_graduation_year: (profile as any)?.graduation_year ?? null,
          viewer_handicap: (profile as any)?.handicap ?? null,
        });
        const { count } = await supabase
          .from('coach_profile_views')
          .select('*', { count: 'exact', head: true })
          .eq('coach_id', data.id);
        setViewCount(count ?? 0);
      }
    })();
  }, [slug, user?.id, profile?.full_name]);

  useEffect(() => {
    if (user && profile) {
      setForm((f) => ({
        ...f,
        name: f.name || profile.full_name || '',
        email: f.email || profile.email || '',
      }));
    }
  }, [user, profile]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coach) return;
    setSending(true);
    const { error } = await supabase.functions.invoke('send-coach-message', {
      body: {
        coach_id: coach.id,
        sender_name: form.name,
        sender_email: form.email,
        message: form.message,
        sender_user_id: user?.id ?? null,
      },
    });
    setSending(false);
    if (error) {
      toast({ title: 'Could not send', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Message sent', description: `${coach.full_name} will receive it via email.` });
    setForm({ ...form, message: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }
  if (!coach) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md text-center">
            <CardHeader>
              <CardTitle>Coach Not Found</CardTitle>
              <CardDescription>This profile doesn't exist or is inactive.</CardDescription>
            </CardHeader>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const initials = coach.full_name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={coach.photo_url ?? undefined} alt={coach.full_name} />
                  <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="font-display text-3xl font-bold">{coach.full_name}</h1>
                  {coach.title && <p className="text-lg text-muted-foreground">{coach.title}</p>}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {coach.college_name}</span>
                    {coach.conference && <Badge variant="secondary"><Trophy className="w-3 h-3 mr-1" />{coach.conference}</Badge>}
                    <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {viewCount} views</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {coach.bio && (
            <Card>
              <CardHeader><CardTitle>About</CardTitle></CardHeader>
              <CardContent><p className="whitespace-pre-wrap">{coach.bio}</p></CardContent>
            </Card>
          )}

          {coach.program_overview && (
            <Card>
              <CardHeader><CardTitle>Program Overview</CardTitle></CardHeader>
              <CardContent><p className="whitespace-pre-wrap">{coach.program_overview}</p></CardContent>
            </Card>
          )}

          {coach.recruiting_preferences && (
            <Card>
              <CardHeader><CardTitle>Recruiting Preferences</CardTitle></CardHeader>
              <CardContent><p className="whitespace-pre-wrap">{coach.recruiting_preferences}</p></CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> Contact Coach {coach.full_name.split(' ').slice(-1)[0]}</CardTitle>
              <CardDescription>Your message goes directly to the coach's inbox</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSend} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Your name</Label>
                    <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Your email</Label>
                    <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Introduce yourself, share your graduation year, scoring average, and why you're interested in this program." />
                </div>
                <Button type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoachPublicProfile;

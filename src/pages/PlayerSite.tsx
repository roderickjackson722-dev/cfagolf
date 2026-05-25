import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Instagram, Twitter, Linkedin, Youtube, FileText, ExternalLink, Play, MapPin, GraduationCap } from 'lucide-react';
import { usePlayerBySlug, usePlayerTournaments, usePlayerVideos } from '@/hooks/usePlayers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

function getEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

const PlayerSite = () => {
  const { slug } = useParams();
  const { data: player, isLoading } = usePlayerBySlug(slug);
  const { data: tournaments = [] } = usePlayerTournaments(player?.id);
  const { data: videos = [] } = usePlayerVideos(player?.id);
  const [playing, setPlaying] = useState<any>(null);
  const [contactOpen, setContactOpen] = useState(false);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!player || !player.is_active) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-8">
        <h1 className="text-4xl font-bold mb-2">Coming Soon</h1>
        <p className="text-muted-foreground">This player site isn't live yet.</p>
        <Link to="/" className="mt-6 text-primary underline">Back to College Fairway Advisors</Link>
      </div>
    );
  }

  const social = (player.social_links || {}) as Record<string, string>;
  const wins = tournaments.filter((t) => t.finish?.toLowerCase().includes('1')).length;
  const topTens = tournaments.filter((t) => {
    const n = parseInt(t.finish?.replace(/\D/g, '') || '999');
    return n <= 10;
  }).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        {player.hero_image_url ? (
          <img src={player.hero_image_url} alt={player.full_name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative container mx-auto px-4 pb-12 text-white">
          <div className="flex items-end gap-6">
            {player.profile_photo_url && (
              <img src={player.profile_photo_url} alt="" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover" />
            )}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold">{player.full_name}</h1>
              <p className="text-xl md:text-2xl mt-2 opacity-90">{player.tagline || `Class of ${player.graduation_year || ''}`}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {player.graduation_year && <Badge variant="secondary"><GraduationCap className="w-3 h-3 mr-1" />Class of {player.graduation_year}</Badge>}
                {player.high_school && <Badge variant="secondary"><MapPin className="w-3 h-3 mr-1" />{player.high_school}</Badge>}
              </div>
            </div>
          </div>
          <Button size="lg" className="mt-6" onClick={() => setContactOpen(true)}>
            <Mail className="w-4 h-4 mr-2" />Contact {player.full_name.split(' ')[0]}
          </Button>
        </div>
      </section>

      {/* Key stats */}
      <section className="border-b bg-muted/30 py-6">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <Stat label="Scoring Avg" value={player.scoring_average} />
          <Stat label="Handicap" value={player.handicap} />
          <Stat label="GPA" value={player.gpa} />
          <Stat label="Tournaments" value={tournaments.length} />
        </div>
      </section>

      {/* Tabs */}
      <section className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="about">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="tournaments">Tournament Scores</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="py-6">
            <Card><CardContent className="p-6 space-y-4">
              {player.bio ? <p className="whitespace-pre-wrap leading-relaxed">{player.bio}</p> : <p className="text-muted-foreground">Bio coming soon.</p>}
              <div className="flex gap-3 pt-4 border-t">
                {social.instagram && <SocialLink href={social.instagram} icon={<Instagram />} />}
                {social.twitter && <SocialLink href={social.twitter} icon={<Twitter />} />}
                {social.linkedin && <SocialLink href={social.linkedin} icon={<Linkedin />} />}
                {social.youtube && <SocialLink href={social.youtube} icon={<Youtube />} />}
              </div>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="resume" className="py-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card><CardContent className="p-6">
                <h3 className="font-semibold mb-3">Athletic</h3>
                <dl className="space-y-2 text-sm">
                  <Row label="Scoring Average" value={player.scoring_average} />
                  <Row label="Handicap" value={player.handicap} />
                  <Row label="Home Course" value={player.home_course} />
                  <Row label="Tournament Wins" value={wins} />
                  <Row label="Top-10 Finishes" value={topTens} />
                </dl>
              </CardContent></Card>
              <Card><CardContent className="p-6">
                <h3 className="font-semibold mb-3">Academic</h3>
                <dl className="space-y-2 text-sm">
                  <Row label="GPA" value={player.gpa} />
                  <Row label="SAT" value={player.sat_score} />
                  <Row label="ACT" value={player.act_score} />
                  <Row label="Intended Major" value={player.intended_major} />
                  <Row label="High School" value={player.high_school} />
                  <Row label="Graduation" value={player.graduation_year} />
                </dl>
              </CardContent></Card>
            </div>
            {player.resume_url && (
              <Button asChild><a href={player.resume_url} target="_blank" rel="noopener noreferrer"><FileText className="w-4 h-4 mr-2" />Download PDF Resume</a></Button>
            )}
          </TabsContent>

          <TabsContent value="tournaments" className="py-6">
            <Card><CardContent className="p-0">
              {tournaments.length === 0 ? <p className="text-muted-foreground p-8 text-center">No tournaments posted yet.</p> : (
                <Table>
                  <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Tournament</TableHead><TableHead>Course</TableHead><TableHead>Score</TableHead><TableHead>Finish</TableHead><TableHead>Field</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {tournaments.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{t.tournament_name}</TableCell>
                        <TableCell>{t.course || '—'}</TableCell>
                        <TableCell>{t.score ?? '—'}</TableCell>
                        <TableCell>{t.finish || '—'}</TableCell>
                        <TableCell>{t.field_size || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="videos" className="py-6">
            {videos.length === 0 ? <p className="text-muted-foreground p-8 text-center">No videos posted yet.</p> : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {videos.map((v) => (
                  <button key={v.id} onClick={() => setPlaying(v)} className="text-left group">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                      {v.thumbnail_url ? <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Play className="w-10 h-10" /></div>}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center"><Play className="w-12 h-12 text-white" /></div>
                    </div>
                    <p className="mt-2 font-medium text-sm">{v.title}</p>
                    <p className="text-xs text-muted-foreground">{v.category}</p>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="contact" className="py-6">
            <ContactForm playerId={player.id} playerName={player.full_name} />
          </TabsContent>
        </Tabs>
      </section>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>Recruiting site powered by <Link to="/" className="text-primary hover:underline">College Fairway Advisors</Link></p>
      </footer>

      <Dialog open={!!playing} onOpenChange={(o) => !o && setPlaying(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>{playing?.title}</DialogTitle></DialogHeader>
          {playing && (getEmbedUrl(playing.url) ? <div className="aspect-video"><iframe src={getEmbedUrl(playing.url)!} className="w-full h-full" allowFullScreen /></div> : <video src={playing.url} controls className="w-full" />)}
        </DialogContent>
      </Dialog>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Contact {player.full_name}</DialogTitle></DialogHeader>
          <ContactForm playerId={player.id} playerName={player.full_name} onSent={() => setContactOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-3xl font-bold">{value ?? '—'}</p>
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return <div className="flex justify-between border-b pb-1"><dt className="text-muted-foreground">{label}</dt><dd className="font-medium">{value ?? '—'}</dd></div>;
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">{icon}</a>;
}

function ContactForm({ playerId, playerName, onSent }: { playerId: string; playerName: string; onSent?: () => void }) {
  const [form, setForm] = useState({ coach_name: '', coach_email: '', coach_phone: '', coach_college: '', message: '' });
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (!form.coach_name || !form.coach_email || !form.message) return toast.error('Name, email, and message required');
    setSending(true);
    try {
      const { error } = await supabase.from('player_coach_messages').insert({ ...form, player_id: playerId } as any);
      if (error) throw error;
      // fire-and-forget edge fn for email notification
      supabase.functions.invoke('send-player-coach-message', { body: { ...form, player_id: playerId } }).catch(() => {});
      toast.success(`Message sent to ${playerName}!`);
      setForm({ coach_name: '', coach_email: '', coach_phone: '', coach_college: '', message: '' });
      onSent?.();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div><Label>Your name *</Label><Input value={form.coach_name} onChange={(e) => setForm({ ...form, coach_name: e.target.value })} /></div>
        <div><Label>College</Label><Input value={form.coach_college} onChange={(e) => setForm({ ...form, coach_college: e.target.value })} /></div>
        <div><Label>Email *</Label><Input type="email" value={form.coach_email} onChange={(e) => setForm({ ...form, coach_email: e.target.value })} /></div>
        <div><Label>Phone</Label><Input value={form.coach_phone} onChange={(e) => setForm({ ...form, coach_phone: e.target.value })} /></div>
      </div>
      <div><Label>Message *</Label><Textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
      <Button onClick={submit} disabled={sending} className="w-full">{sending ? 'Sending…' : 'Send message'}</Button>
    </div>
  );
}

export default PlayerSite;

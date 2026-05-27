import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ExternalLink, LogOut, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMyPlayer, useUpsertPlayer } from '@/hooks/usePlayers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PlayerTournamentsManager } from '@/components/players/PlayerTournamentsManager';
import { PlayerVideosManager } from '@/components/players/PlayerVideosManager';
import { PlayerGalleryManager } from '@/components/players/PlayerGalleryManager';
import { PlayerReferencesManager } from '@/components/players/PlayerReferencesManager';

const PlayerDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const { data: player, isLoading } = useMyPlayer();
  const upsert = useUpsertPlayer();
  const [bio, setBio] = useState('');
  const [major, setMajor] = useState('');
  const [social, setSocial] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (player) {
      setBio(player.bio || '');
      setMajor(player.intended_major || '');
      setSocial((player.social_links as any) || {});
    }
  }, [player]);

  if (loading || isLoading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!user) return <Navigate to="/player/login" replace />;

  if (!player) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">No player site linked</h1>
        <p className="text-muted-foreground mb-4">Your coach hasn't linked a player site to your account yet.</p>
        <p className="text-sm text-muted-foreground mb-6">Send your user id to your coach: <code className="bg-muted px-2 py-1 rounded">{user.id}</code></p>
        <Button variant="outline" onClick={signOut}><LogOut className="w-4 h-4 mr-2" />Sign out</Button>
      </div>
    );
  }

  const canEdit = player.allow_editing;

  const saveProfile = async () => {
    setSaving(true);
    try {
      await upsert.mutateAsync({ id: player.id, bio, intended_major: major, social_links: social });
      toast.success('Saved');
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const upload = async (file: File, bucket: string, field: 'hero_image_url' | 'profile_photo_url' | 'resume_url') => {
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    await upsert.mutateAsync({ id: player.id, [field]: data.publicUrl });
    toast.success('Uploaded');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Hi, {player.full_name.split(' ')[0]}</h1>
            <p className="text-sm text-muted-foreground">Your recruiting site dashboard</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild><a href={`/p/${player.slug}`} target="_blank" rel="noopener noreferrer">View live site <ExternalLink className="w-4 h-4 ml-2" /></a></Button>
            <Button variant="ghost" onClick={signOut}><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {!canEdit && (
          <Card className="mb-4 border-destructive/50">
            <CardContent className="p-4 flex items-center gap-3">
              <Lock className="w-5 h-5 text-destructive" />
              <p className="text-sm">Editing has been disabled by your coach. Contact them for changes.</p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="profile">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="references">References</TabsTrigger>
            <TabsTrigger value="media">Photos & Resume</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card><CardHeader><CardTitle>About you</CardTitle></CardHeader><CardContent className="space-y-4">
              <div><Label>Bio</Label><Textarea rows={5} value={bio} onChange={(e) => setBio(e.target.value)} disabled={!canEdit} /></div>
              <div><Label>Intended major</Label><Input value={major} onChange={(e) => setMajor(e.target.value)} disabled={!canEdit} /></div>
              <p className="text-xs text-muted-foreground">GPA, test scores, handicap, and scoring average are managed by your coach.</p>
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Social links</CardTitle></CardHeader><CardContent className="grid sm:grid-cols-2 gap-3">
              {['instagram', 'twitter', 'linkedin', 'youtube', 'venmo'].map((k) => (
                <div key={k}><Label className="capitalize">{k}</Label><Input value={social[k] || ''} onChange={(e) => setSocial({ ...social, [k]: e.target.value })} disabled={!canEdit} /></div>
              ))}
            </CardContent></Card>

            <Button onClick={saveProfile} disabled={!canEdit || saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
          </TabsContent>

          <TabsContent value="tournaments"><PlayerTournamentsManager playerId={player.id} canEdit={canEdit} /></TabsContent>
          <TabsContent value="videos"><PlayerVideosManager playerId={player.id} canEdit={canEdit} /></TabsContent>
          <TabsContent value="gallery"><PlayerGalleryManager playerId={player.id} canEdit={canEdit} /></TabsContent>
          <TabsContent value="references"><PlayerReferencesManager playerId={player.id} canEdit={canEdit} /></TabsContent>

          <TabsContent value="media" className="space-y-4">
            <Card><CardHeader><CardTitle>Hero image</CardTitle></CardHeader><CardContent className="space-y-3">
              {player.hero_image_url && <img src={player.hero_image_url} alt="" className="w-full max-w-md aspect-video object-cover rounded mb-3" />}
              <Input type="file" accept="image/*" disabled={!canEdit} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'player-images', 'hero_image_url')} />
              <div className="pt-2">
                <Label>Hero darkness ({player.hero_overlay_opacity ?? 40}%)</Label>
                <Slider min={0} max={90} step={5} disabled={!canEdit} value={[player.hero_overlay_opacity ?? 40]} onValueChange={async (v) => {
                  await upsert.mutateAsync({ id: player.id, hero_overlay_opacity: v[0] } as any);
                }} />
              </div>
            </CardContent></Card>
            <Card><CardHeader><CardTitle>Profile photo</CardTitle></CardHeader><CardContent>
              {player.profile_photo_url && <img src={player.profile_photo_url} alt="" className="w-32 h-32 rounded-full object-cover mb-3" />}
              <Input type="file" accept="image/*" disabled={!canEdit} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'player-images', 'profile_photo_url')} />
            </CardContent></Card>
            <Card><CardHeader><CardTitle>Resume PDF</CardTitle></CardHeader><CardContent>
              {player.resume_url && <a href={player.resume_url} target="_blank" rel="noopener noreferrer" className="text-primary underline block mb-2">View current resume</a>}
              <Input type="file" accept="application/pdf" disabled={!canEdit} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'player-resumes', 'resume_url')} />
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PlayerDashboard;

import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Upload } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { usePlayerById, useUpsertPlayer, slugify, Player } from '@/hooks/usePlayers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PlayerTournamentsManager } from '@/components/players/PlayerTournamentsManager';
import { PlayerVideosManager } from '@/components/players/PlayerVideosManager';

type Form = Partial<Player>;

const AdminPlayerEdit = () => {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: existing } = usePlayerById(id);
  const upsert = useUpsertPlayer();
  const [form, setForm] = useState<Form>({ is_active: true, allow_editing: true, social_links: {} });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) setForm(existing);
  }, [existing]);

  if (loading || adminLoading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const set = (k: keyof Player, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const setSocial = (k: string, v: string) =>
    setForm((f) => ({ ...f, social_links: { ...(f.social_links || {}), [k]: v } }));

  const handleNameBlur = () => {
    if (isNew && form.full_name && !form.slug) set('slug', slugify(form.full_name));
  };

  const uploadFile = async (file: File, bucket: string, field: keyof Player) => {
    const ext = file.name.split('.').pop();
    const path = `admin/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    set(field, data.publicUrl);
    toast.success('Uploaded');
  };

  const handleSubmit = async () => {
    if (!form.full_name || !form.slug) return toast.error('Name and slug required');
    setSaving(true);
    try {
      const saved = await upsert.mutateAsync(form);
      toast.success(isNew ? 'Player created' : 'Saved');
      if (isNew) navigate(`/admin/players/${saved.id}/edit`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild>
            <Link to="/admin/players"><ArrowLeft className="w-4 h-4 mr-2" />Back to players</Link>
          </Button>
          {!isNew && form.slug && (
            <Button variant="outline" asChild>
              <a href={`/p/${form.slug}`} target="_blank" rel="noopener noreferrer">
                Preview <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-6">{isNew ? 'New Player' : `Edit ${form.full_name}`}</h1>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="tournaments" disabled={isNew}>Tournaments</TabsTrigger>
            <TabsTrigger value="videos" disabled={isNew}>Videos</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Basic info</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div><Label>Full name *</Label><Input value={form.full_name || ''} onBlur={handleNameBlur} onChange={(e) => set('full_name', e.target.value)} /></div>
                <div><Label>Slug (URL) *</Label><Input value={form.slug || ''} onChange={(e) => set('slug', slugify(e.target.value))} /></div>
                <div><Label>Graduation year</Label><Input type="number" value={form.graduation_year || ''} onChange={(e) => set('graduation_year', e.target.value ? Number(e.target.value) : null)} /></div>
                <div><Label>Tagline</Label><Input value={form.tagline || ''} onChange={(e) => set('tagline', e.target.value)} placeholder="Committed to Competing at the Next Level" /></div>
                <div><Label>High school</Label><Input value={form.high_school || ''} onChange={(e) => set('high_school', e.target.value)} /></div>
                <div><Label>Home course</Label><Input value={form.home_course || ''} onChange={(e) => set('home_course', e.target.value)} /></div>
                <div><Label>Contact email</Label><Input type="email" value={form.contact_email || ''} onChange={(e) => set('contact_email', e.target.value)} /></div>
                <div><Label>Intended major</Label><Input value={form.intended_major || ''} onChange={(e) => set('intended_major', e.target.value)} /></div>
                <div className="md:col-span-2"><Label>Bio</Label><Textarea rows={4} value={form.bio || ''} onChange={(e) => set('bio', e.target.value)} /></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Stats (admin only)</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div><Label>Handicap</Label><Input type="number" step="0.1" value={form.handicap ?? ''} onChange={(e) => set('handicap', e.target.value ? Number(e.target.value) : null)} /></div>
                <div><Label>Scoring avg</Label><Input type="number" step="0.1" value={form.scoring_average ?? ''} onChange={(e) => set('scoring_average', e.target.value ? Number(e.target.value) : null)} /></div>
                <div><Label>GPA</Label><Input type="number" step="0.01" value={form.gpa ?? ''} onChange={(e) => set('gpa', e.target.value ? Number(e.target.value) : null)} /></div>
                <div><Label>SAT</Label><Input type="number" value={form.sat_score ?? ''} onChange={(e) => set('sat_score', e.target.value ? Number(e.target.value) : null)} /></div>
                <div><Label>ACT</Label><Input type="number" value={form.act_score ?? ''} onChange={(e) => set('act_score', e.target.value ? Number(e.target.value) : null)} /></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Photos & resume</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <UploadField label="Hero image" value={form.hero_image_url} onUpload={(f) => uploadFile(f, 'player-images', 'hero_image_url')} accept="image/*" />
                <UploadField label="Profile photo" value={form.profile_photo_url} onUpload={(f) => uploadFile(f, 'player-images', 'profile_photo_url')} accept="image/*" />
                <UploadField label="Resume PDF" value={form.resume_url} onUpload={(f) => uploadFile(f, 'player-resumes', 'resume_url')} accept="application/pdf" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Social links</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {['instagram', 'twitter', 'linkedin', 'youtube', 'venmo'].map((k) => (
                  <div key={k}>
                    <Label className="capitalize">{k}</Label>
                    <Input value={(form.social_links as any)?.[k] || ''} onChange={(e) => setSocial(k, e.target.value)} placeholder={`https://…`} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tournaments">
            {id && <PlayerTournamentsManager playerId={id} canEdit={true} />}
          </TabsContent>

          <TabsContent value="videos">
            {id && <PlayerVideosManager playerId={id} canEdit={true} />}
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader><CardTitle>Site settings</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Site active</Label>
                    <p className="text-sm text-muted-foreground">When off, the public URL shows "Coming Soon".</p>
                  </div>
                  <Switch checked={!!form.is_active} onCheckedChange={(v) => set('is_active', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow student editing</Label>
                    <p className="text-sm text-muted-foreground">When off, the student cannot self-edit.</p>
                  </div>
                  <Switch checked={!!form.allow_editing} onCheckedChange={(v) => set('allow_editing', v)} />
                </div>
                <div>
                  <Label>Custom domain</Label>
                  <Input
                    value={form.custom_domain || ''}
                    onChange={(e) => set('custom_domain', e.target.value.trim().toLowerCase() || null)}
                    placeholder="johnsmithgolf.com"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional. After saving, point the domain's A records to <code>185.158.133.1</code> and add it in Project Settings → Domains so SSL is provisioned. The site will then load at that domain.
                  </p>
                </div>
                <div>
                  <Label>Linked student account (auth user id)</Label>
                  <Input value={form.user_id || ''} onChange={(e) => set('user_id', e.target.value || null)} placeholder="auto-filled when you create an account below" />
                </div>

                {!isNew && id && (
                  <CreateStudentAccount
                    playerId={id}
                    defaultEmail={form.contact_email || ''}
                    defaultName={form.full_name || ''}
                    linkedUserId={form.user_id || null}
                    onCreated={(uid) => set('user_id', uid)}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="sticky bottom-4 mt-6 flex justify-end">
          <Button size="lg" onClick={handleSubmit} disabled={saving}>{saving ? 'Saving…' : isNew ? 'Create player' : 'Save changes'}</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

function UploadField({ label, value, onUpload, accept }: { label: string; value?: string | null; onUpload: (f: File) => void; accept: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-2 mt-1">
        <Input type="file" accept={accept} onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
        {value && <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">View</a>}
      </div>
    </div>
  );
}

function CreateStudentAccount({
  playerId,
  defaultEmail,
  defaultName,
  linkedUserId,
  onCreated,
}: {
  playerId: string;
  defaultEmail: string;
  defaultName: string;
  linkedUserId: string | null;
  onCreated: (uid: string) => void;
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(() => Math.random().toString(36).slice(-10) + 'A1!');
  const [busy, setBusy] = useState(false);

  const create = async () => {
    if (!email || !password) return toast.error('Email and password required');
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-player-account', {
        body: { email, password, full_name: defaultName, player_id: playerId },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const uid = (data as any)?.user_id;
      if (uid) {
        onCreated(uid);
        toast.success('Student account created and emailed');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to create account');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border rounded-md p-4 space-y-3 bg-muted/30">
      <div>
        <Label className="text-base">Auto-create student account</Label>
        <p className="text-sm text-muted-foreground">
          {linkedUserId
            ? 'A student account is already linked. Use this again only to (re)create or replace.'
            : 'Creates a Supabase Auth user, links it to this player, and emails the student their login.'}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>Student email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label>Temporary password</Label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
      <Button onClick={create} disabled={busy}>{busy ? 'Creating…' : 'Create & email login'}</Button>
    </div>
  );
}


export default AdminPlayerEdit;

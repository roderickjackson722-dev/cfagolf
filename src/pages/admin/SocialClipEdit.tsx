import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import {
  useSocialClip,
  useUpdateClip,
  generateClipPlaceholder,
  type TextOverlay,
} from '@/hooks/useSocialClips';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, Trash2, Upload, Sparkles, Download, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PLATFORMS = ['instagram', 'tiktok', 'facebook', 'youtube'];

export default function SocialClipEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: clip, isLoading } = useSocialClip(id);
  const update = useUpdateClip();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [music, setMusic] = useState('');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [duration, setDuration] = useState(8);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [overlays, setOverlays] = useState<TextOverlay[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!clip) return;
    setTitle(clip.title);
    setDescription(clip.description || '');
    setPrompt(clip.prompt);
    setVideoUrl(clip.video_url || '');
    setThumbnailUrl(clip.thumbnail_url || '');
    setMusic(clip.music_track || '');
    setAspectRatio(clip.aspect_ratio);
    setDuration(clip.duration || 8);
    setOverlays(clip.text_overlays || []);
    setPlatforms(clip.social_platforms || []);
    setTrimEnd(clip.duration || 8);
  }, [clip]);

  if (authLoading || adminLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!clip) return <Navigate to="/admin/social-clips" replace />;

  const handleVideoUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${clip.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('social-clips').upload(path, file, {
        upsert: true,
        contentType: file.type,
      });
      if (error) throw error;
      const { data } = await supabase.storage.from('social-clips').createSignedUrl(path, 60 * 60 * 24 * 365);
      setVideoUrl(data?.signedUrl || '');
      toast({ title: 'Video uploaded' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (extra: Record<string, any> = {}) => {
    try {
      await update.mutateAsync({
        id: clip.id,
        title,
        description: description || null,
        prompt,
        video_url: videoUrl || null,
        thumbnail_url: thumbnailUrl || null,
        music_track: music || null,
        aspect_ratio: aspectRatio,
        duration,
        text_overlays: overlays,
        social_platforms: platforms,
        ...extra,
      });
      toast({ title: 'Clip saved' });
    } catch (err: any) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' });
    }
  };

  const handleGenerate = async () => {
    try {
      await update.mutateAsync({ id: clip.id, status: 'generating' });
      await generateClipPlaceholder(clip.id);
      toast({
        title: 'Marked ready',
        description: 'Placeholder generator finished. Upload or paste a video URL.',
      });
    } catch (err: any) {
      toast({ title: 'Failed', description: err.message, variant: 'destructive' });
    }
  };

  const handlePublish = async () => {
    if (platforms.length === 0) {
      toast({ title: 'Pick at least one platform', variant: 'destructive' });
      return;
    }
    await handleSave({ is_published: true, status: 'published', published_at: new Date().toISOString() });
  };

  const addOverlay = () =>
    setOverlays((cur) => [
      ...cur,
      { text: 'New overlay', position: 'center', timing: 'middle', duration: 2, style: 'bold, white' },
    ]);

  const updateOverlay = (i: number, patch: Partial<TextOverlay>) =>
    setOverlays((cur) => cur.map((o, idx) => (idx === i ? { ...o, ...patch } : o)));

  const removeOverlay = (i: number) =>
    setOverlays((cur) => cur.filter((_, idx) => idx !== i));

  const togglePlatform = (p: string) =>
    setPlatforms((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <Button variant="ghost" onClick={() => navigate('/admin/social-clips')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to library
          </Button>

          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <h1 className="font-display text-3xl font-bold">Edit Clip</h1>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" onClick={handleGenerate} disabled={update.isPending}>
                <Sparkles className="w-4 h-4 mr-2" /> Generate (placeholder)
              </Button>
              {videoUrl && (
                <Button asChild variant="outline">
                  <a href={videoUrl} download target="_blank" rel="noreferrer">
                    <Download className="w-4 h-4 mr-2" /> Export MP4
                  </a>
                </Button>
              )}
              <Button onClick={() => handleSave()} disabled={update.isPending}>
                Save Changes
              </Button>
              <Button variant="default" onClick={handlePublish} disabled={update.isPending}>
                <Send className="w-4 h-4 mr-2" /> Mark Published
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded overflow-hidden aspect-[9/16] flex items-center justify-center">
                  {videoUrl ? (
                    <video src={videoUrl} controls className="w-full h-full object-contain" />
                  ) : (
                    <p className="text-muted-foreground text-sm">No video yet</p>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <Label>Upload video file</Label>
                  <Input
                    type="file"
                    accept="video/*"
                    disabled={uploading}
                    onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0])}
                  />
                  <Label className="pt-2 block">Or paste a video URL</Label>
                  <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://…" />
                  <Label className="pt-2 block">Thumbnail URL</Label>
                  <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://…" />
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                  <Label>Prompt</Label>
                  <Textarea rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Aspect ratio</Label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9:16">9:16</SelectItem>
                        <SelectItem value="1:1">1:1</SelectItem>
                        <SelectItem value="16:9">16:9</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Duration (s)</Label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setDuration(v);
                        setTrimEnd(Math.min(trimEnd || v, v));
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label>Music track</Label>
                  <Input value={music} onChange={(e) => setMusic(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            {/* Trim */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline (trim)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Start (s)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={duration}
                      value={trimStart}
                      onChange={(e) => setTrimStart(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>End (s)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={duration}
                      value={trimEnd}
                      onChange={(e) => setTrimEnd(Number(e.target.value))}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Trim values are saved with the clip. Final cutting happens at export time.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleSave({
                      generation_params: { ...(clip.generation_params || {}), trim_start: trimStart, trim_end: trimEnd },
                    })
                  }
                >
                  Save trim
                </Button>
              </CardContent>
            </Card>

            {/* Platforms */}
            <Card>
              <CardHeader>
                <CardTitle>Social platforms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {PLATFORMS.map((p) => (
                  <label key={p} className="flex items-center gap-2 capitalize text-sm">
                    <Checkbox checked={platforms.includes(p)} onCheckedChange={() => togglePlatform(p)} />
                    {p}
                  </label>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Overlays */}
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Text overlays</CardTitle>
              <Button size="sm" variant="outline" onClick={addOverlay}>
                <Plus className="w-4 h-4 mr-1" /> Add overlay
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {overlays.length === 0 && (
                <p className="text-sm text-muted-foreground">No overlays yet.</p>
              )}
              {overlays.map((o, i) => (
                <div key={i} className="border rounded p-3 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <Input
                      value={o.text}
                      onChange={(e) => updateOverlay(i, { text: e.target.value })}
                      placeholder="Overlay text"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeOverlay(i)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <Label className="text-xs">Position</Label>
                      <Select
                        value={o.position}
                        onValueChange={(v) => updateOverlay(i, { position: v as TextOverlay['position'] })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Timing</Label>
                      <Select
                        value={o.timing}
                        onValueChange={(v) => updateOverlay(i, { timing: v as TextOverlay['timing'] })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="start">Start</SelectItem>
                          <SelectItem value="middle">Middle</SelectItem>
                          <SelectItem value="end">End</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Duration (s)</Label>
                      <Input
                        type="number"
                        value={o.duration}
                        onChange={(e) => updateOverlay(i, { duration: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Style</Label>
                      <Input
                        value={o.style || ''}
                        onChange={(e) => updateOverlay(i, { style: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

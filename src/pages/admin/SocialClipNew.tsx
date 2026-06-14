import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useClipTemplates, useCreateClip } from '@/hooks/useSocialClips';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, ChevronDown, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function SocialClipNew() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: templates = [] } = useClipTemplates();
  const create = useCreateClip();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [duration, setDuration] = useState(8);
  const [aiService, setAiService] = useState('placeholder');
  const [quality, setQuality] = useState('standard');
  const [music, setMusic] = useState('');
  const [overlaysJson, setOverlaysJson] = useState('[]');
  const [advancedOpen, setAdvancedOpen] = useState(false);

  if (authLoading || adminLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const applyTemplate = (templateId: string) => {
    const t = templates.find((x) => x.id === templateId);
    if (!t) return;
    setTitle((prev) => prev || t.name);
    setDescription((prev) => prev || t.description || '');
    setPrompt(t.base_prompt);
    setAspectRatio(t.default_aspect_ratio);
    setDuration(t.default_duration);
    setMusic(t.default_music || '');
    setOverlaysJson(JSON.stringify(t.default_text_overlays || [], null, 2));
    toast({ title: 'Template loaded' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) {
      toast({ title: 'Title and prompt are required', variant: 'destructive' });
      return;
    }
    let overlays: any[] = [];
    try {
      overlays = JSON.parse(overlaysJson || '[]');
    } catch {
      toast({ title: 'Text overlays must be valid JSON', variant: 'destructive' });
      return;
    }
    try {
      const clip = await create.mutateAsync({
        title: title.trim(),
        description: description.trim() || null,
        prompt: prompt.trim(),
        aspect_ratio: aspectRatio,
        duration,
        music_track: music || null,
        text_overlays: overlays,
        generated_by: aiService,
        generation_params: { quality, ai_service: aiService },
        status: 'draft',
      });
      toast({ title: 'Clip created — open editor to attach a video.' });
      navigate(`/admin/social-clips/${clip.id}/edit`);
    } catch (err: any) {
      toast({ title: 'Failed to create clip', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Button variant="ghost" onClick={() => navigate('/admin/social-clips')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to library
          </Button>

          <h1 className="font-display text-3xl font-bold mb-6">New Social Clip</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Aspect Ratio</Label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9:16">9:16 (Reels / TikTok / Shorts)</SelectItem>
                        <SelectItem value="1:1">1:1 (Instagram feed)</SelectItem>
                        <SelectItem value="16:9">16:9 (YouTube)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min={5}
                      max={15}
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prompt Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {templates.length > 0 && (
                  <div>
                    <Label>Load from template</Label>
                    <Select onValueChange={applyTemplate}>
                      <SelectTrigger><SelectValue placeholder="Choose a template…" /></SelectTrigger>
                      <SelectContent>
                        {templates.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label htmlFor="prompt">Prompt *</Label>
                  <Textarea
                    id="prompt"
                    rows={10}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the video you want the AI to generate…"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer flex flex-row items-center justify-between">
                    <CardTitle>Advanced Settings</CardTitle>
                    <ChevronDown className={`w-5 h-5 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>AI Service</Label>
                        <Select value={aiService} onValueChange={setAiService}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="placeholder">Manual upload (placeholder)</SelectItem>
                            <SelectItem value="meta">Meta AI</SelectItem>
                            <SelectItem value="runway">Runway Gen-3</SelectItem>
                            <SelectItem value="pika">Pika</SelectItem>
                            <SelectItem value="kling">Kling</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Quality</Label>
                        <Select value={quality} onValueChange={setQuality}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fast">Fast</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="music">Music track</Label>
                      <Input
                        id="music"
                        value={music}
                        onChange={(e) => setMusic(e.target.value)}
                        placeholder="e.g. Uplifting acoustic guitar"
                      />
                    </div>
                    <div>
                      <Label htmlFor="overlays">Text overlays (JSON)</Label>
                      <Textarea
                        id="overlays"
                        rows={6}
                        value={overlaysJson}
                        onChange={(e) => setOverlaysJson(e.target.value)}
                        className="font-mono text-xs"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Array of {`{text, position, timing, duration, style}`}
                      </p>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/social-clips')}>
                Cancel
              </Button>
              <Button type="submit" disabled={create.isPending}>
                <Sparkles className="w-4 h-4 mr-2" />
                {create.isPending ? 'Creating…' : 'Create Clip'}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

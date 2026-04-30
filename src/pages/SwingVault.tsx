import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Plus, Trash2, Edit, Eye, EyeOff, ExternalLink, Video, Loader2, Share2, Copy, Check } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { detectProvider, getEmbedUrl, getThumbnailUrl } from "@/lib/videoEmbed";

interface SwingVideo {
  id: string;
  user_id: string;
  title: string;
  video_url: string;
  video_type: string;
  swing_type: string | null;
  camera_angle: string | null;
  club: string | null;
  notes: string | null;
  is_public: boolean;
  sort_order: number;
  created_at: string;
}

const SWING_TYPES = ["Driver", "Fairway Wood / Hybrid", "Iron", "Wedge / Pitch", "Chip", "Bunker", "Putt", "Other"];
const CAMERA_ANGLES = ["Face-On", "Down-the-Line", "Behind the Ball", "Overhead", "Other"];

const RECOMMENDED_SHOTS = [
  { swing_type: "Driver", camera_angle: "Face-On" },
  { swing_type: "Driver", camera_angle: "Down-the-Line" },
  { swing_type: "Iron", camera_angle: "Face-On" },
  { swing_type: "Iron", camera_angle: "Down-the-Line" },
  { swing_type: "Wedge / Pitch", camera_angle: "Face-On" },
  { swing_type: "Chip", camera_angle: "Down-the-Line" },
  { swing_type: "Bunker", camera_angle: "Face-On" },
  { swing_type: "Putt", camera_angle: "Overhead" },
];

export default function SwingVault() {
  const { user, loading, profile } = useAuth();
  const [videos, setVideos] = useState<SwingVideo[]>([]);
  const [fetching, setFetching] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SwingVideo | null>(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video_url: "",
    swing_type: "",
    camera_angle: "",
    club: "",
    notes: "",
    is_public: true,
  });

  useEffect(() => {
    if (user) loadVideos();
  }, [user]);

  async function loadVideos() {
    setFetching(true);
    const { data, error } = await supabase
      .from("swing_videos")
      .select("*")
      .eq("user_id", user!.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (!error && data) setVideos(data as SwingVideo[]);
    setFetching(false);
  }

  function resetForm() {
    setForm({ title: "", video_url: "", swing_type: "", camera_angle: "", club: "", notes: "", is_public: true });
    setEditing(null);
  }

  function openAdd(preset?: { swing_type?: string; camera_angle?: string }) {
    resetForm();
    if (preset) {
      setForm((f) => ({
        ...f,
        swing_type: preset.swing_type ?? "",
        camera_angle: preset.camera_angle ?? "",
        title: [preset.swing_type, preset.camera_angle].filter(Boolean).join(" — "),
      }));
    }
    setOpen(true);
  }

  function openEdit(v: SwingVideo) {
    setEditing(v);
    setForm({
      title: v.title,
      video_url: v.video_url,
      swing_type: v.swing_type ?? "",
      camera_angle: v.camera_angle ?? "",
      club: v.club ?? "",
      notes: v.notes ?? "",
      is_public: v.is_public,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.video_url.trim()) {
      toast({ title: "Video link required", description: "Paste a YouTube or Vimeo URL.", variant: "destructive" });
      return;
    }
    const provider = detectProvider(form.video_url);
    if (provider === "unknown") {
      toast({ title: "Unsupported link", description: "Please paste a YouTube or Vimeo URL.", variant: "destructive" });
      return;
    }
    const payload = {
      user_id: user!.id,
      title: form.title.trim() || "Swing Video",
      video_url: form.video_url.trim(),
      video_type: provider,
      swing_type: form.swing_type || null,
      camera_angle: form.camera_angle || null,
      club: form.club.trim() || null,
      notes: form.notes.trim() || null,
      is_public: form.is_public,
    };
    if (editing) {
      const { error } = await supabase.from("swing_videos").update(payload).eq("id", editing.id);
      if (error) return toast({ title: "Failed to update", description: error.message, variant: "destructive" });
      toast({ title: "Updated" });
    } else {
      const { error } = await supabase.from("swing_videos").insert(payload);
      if (error) return toast({ title: "Failed to add", description: error.message, variant: "destructive" });
      toast({ title: "Swing added", description: form.is_public ? "Visible to coaches in the public vault." : "Saved privately." });
    }
    setOpen(false);
    resetForm();
    loadVideos();
  }

  async function togglePublic(v: SwingVideo) {
    const { error } = await supabase.from("swing_videos").update({ is_public: !v.is_public }).eq("id", v.id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    loadVideos();
  }

  async function remove(v: SwingVideo) {
    if (!confirm(`Delete "${v.title}"?`)) return;
    const { error } = await supabase.from("swing_videos").delete().eq("id", v.id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Deleted" });
    loadVideos();
  }

  const myShareUrl = user ? `${window.location.origin}/m/swing/${user.id}` : "";

  async function copyShare() {
    await navigator.clipboard.writeText(myShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  const publicCount = videos.filter((v) => v.is_public).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Swing Vault</h1>
            <p className="text-muted-foreground">
              Upload links to your swing videos (YouTube or Vimeo). Mark them public to feature in the CFA recruiting
              gallery where college coaches can discover you.
            </p>
          </div>

          {/* Share strip */}
          <Card className="mb-6 border-primary/30 bg-primary/5">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <Share2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Your coach-share link</p>
                  <p className="text-xs text-muted-foreground break-all">{myShareUrl}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyShare}>
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Link to="/m/swing" target="_blank">
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Public Gallery
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recommended shot list */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Recommended Shot List</CardTitle>
              <CardDescription>
                Coaches want to see these angles. Tap any item to add a video for it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {RECOMMENDED_SHOTS.map((s, i) => {
                  const filled = videos.some(
                    (v) => v.swing_type === s.swing_type && v.camera_angle === s.camera_angle
                  );
                  return (
                    <button
                      key={i}
                      onClick={() => openAdd(s)}
                      className={`text-left p-3 rounded-lg border transition-colors ${
                        filled
                          ? "bg-primary/10 border-primary/40"
                          : "bg-card hover:bg-muted border-border"
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">{s.camera_angle}</div>
                      <div className="text-sm font-medium">{s.swing_type}</div>
                      {filled && <Badge variant="secondary" className="mt-1 text-[10px]">Added</Badge>}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-semibold">Your Swings</h2>
              <p className="text-sm text-muted-foreground">
                {videos.length} total · {publicCount} visible to coaches
              </p>
            </div>
            <Button onClick={() => openAdd()}>
              <Plus className="h-4 w-4 mr-1" />
              Add Swing
            </Button>
          </div>

          {fetching ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : videos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Video className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No swings uploaded yet.</p>
                <Button onClick={() => openAdd()}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add your first swing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((v) => {
                const embed = getEmbedUrl(v.video_url);
                const thumb = getThumbnailUrl(v.video_url);
                return (
                  <Card key={v.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      {embed ? (
                        <iframe
                          src={embed}
                          className="w-full h-full"
                          title={v.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : thumb ? (
                        <img src={thumb} alt={v.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Video className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-sm line-clamp-1">{v.title}</p>
                        <Badge variant={v.is_public ? "default" : "secondary"} className="text-[10px] shrink-0">
                          {v.is_public ? "Public" : "Private"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {v.swing_type && <Badge variant="outline" className="text-[10px]">{v.swing_type}</Badge>}
                        {v.camera_angle && <Badge variant="outline" className="text-[10px]">{v.camera_angle}</Badge>}
                        {v.club && <Badge variant="outline" className="text-[10px]">{v.club}</Badge>}
                      </div>
                      {v.notes && <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{v.notes}</p>}
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => togglePublic(v)} title="Toggle public">
                          {v.is_public ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => openEdit(v)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(v)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <a href={v.video_url} target="_blank" rel="noopener noreferrer" className="ml-auto">
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Swing" : "Add Swing Video"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Video URL (YouTube or Vimeo) *</Label>
              <Input
                placeholder="https://youtu.be/..."
                value={form.video_url}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                placeholder="e.g. Driver — Face-On"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Swing Type</Label>
                <Select value={form.swing_type} onValueChange={(v) => setForm({ ...form, swing_type: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {SWING_TYPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Camera Angle</Label>
                <Select value={form.camera_angle} onValueChange={(v) => setForm({ ...form, camera_angle: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {CAMERA_ANGLES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Club (optional)</Label>
              <Input
                placeholder="e.g. 7-iron, 56° wedge"
                value={form.club}
                onChange={(e) => setForm({ ...form, club: e.target.value })}
              />
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Visible to coaches</p>
                <p className="text-xs text-muted-foreground">Show in the public CFA swing gallery</p>
              </div>
              <Switch checked={form.is_public} onCheckedChange={(v) => setForm({ ...form, is_public: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save changes" : "Add swing"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

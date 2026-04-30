import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Eye, ImagePlus, Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Slide {
  id: string;
  position: number;
  title: string;
  bullets: string[];
  image_url: string | null;
  is_logo_slide: boolean;
  logo_url: string | null;
}

const BUCKET = "presentation-images";

export const AdminPresentationSlides = () => {
  const { toast } = useToast();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("presentation_slides")
      .select("*")
      .order("position", { ascending: true });
    if (error) {
      toast({ title: "Failed to load slides", description: error.message, variant: "destructive" });
    } else {
      setSlides(
        (data || []).map((s: any) => ({
          ...s,
          bullets: Array.isArray(s.bullets) ? s.bullets : [],
        })) as Slide[],
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateLocal = (id: string, patch: Partial<Slide>) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const saveSlide = async (slide: Slide) => {
    setSavingId(slide.id);
    const { error } = await supabase
      .from("presentation_slides")
      .update({
        title: slide.title,
        bullets: slide.bullets,
        image_url: slide.image_url,
        logo_url: slide.logo_url,
      })
      .eq("id", slide.id);
    setSavingId(null);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Slide saved" });
  };

  const uploadFile = async (slide: Slide, file: File, kind: "image" | "logo") => {
    setUploadingId(slide.id + kind);
    const ext = file.name.split(".").pop() || "png";
    const path = `${kind}/slide-${slide.position}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      setUploadingId(null);
      toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
      return;
    }
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const url = pub.publicUrl;
    const patch = kind === "image" ? { image_url: url } : { logo_url: url };
    const { error: updErr } = await supabase
      .from("presentation_slides")
      .update(patch)
      .eq("id", slide.id);
    setUploadingId(null);
    if (updErr) {
      toast({ title: "Update failed", description: updErr.message, variant: "destructive" });
      return;
    }
    updateLocal(slide.id, patch);
    toast({ title: kind === "logo" ? "Logo updated" : "Image updated" });
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= slides.length) return;
    const a = slides[idx];
    const b = slides[target];
    // Swap positions in two steps using a temp value to avoid unique conflict
    const temp = -1 * (Date.now() % 1000000);
    const { error: e1 } = await supabase.from("presentation_slides").update({ position: temp }).eq("id", a.id);
    if (e1) return toast({ title: "Reorder failed", description: e1.message, variant: "destructive" });
    await supabase.from("presentation_slides").update({ position: a.position }).eq("id", b.id);
    await supabase.from("presentation_slides").update({ position: b.position }).eq("id", a.id);
    load();
  };

  const addSlide = async () => {
    setAdding(true);
    const nextPos = slides.length > 0 ? Math.max(...slides.map((s) => s.position)) + 1 : 1;
    const { error } = await supabase.from("presentation_slides").insert({
      position: nextPos,
      title: "New Slide",
      bullets: [],
      is_logo_slide: false,
    });
    setAdding(false);
    if (error) {
      toast({ title: "Failed to add slide", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Slide added" });
    load();
  };

  const deleteSlide = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("presentation_slides").delete().eq("id", id);
    setDeletingId(null);
    setConfirmDeleteId(null);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    // Renumber remaining slides to keep positions sequential
    const remaining = slides.filter((s) => s.id !== id).sort((a, b) => a.position - b.position);
    for (let i = 0; i < remaining.length; i++) {
      const desired = i + 1;
      if (remaining[i].position !== desired) {
        await supabase
          .from("presentation_slides")
          .update({ position: desired })
          .eq("id", remaining[i].id);
      }
    }
    toast({ title: "Slide deleted" });
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const previewSlide = previewIdx !== null ? slides[previewIdx] : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-muted/40 p-4">
        <div className="text-sm text-muted-foreground">
          Edit the Member Tools presentation. Add or remove slides as needed — all share links update immediately after Save.
        </div>
        <Button size="sm" onClick={addSlide} disabled={adding}>
          {adding ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
          Add slide
        </Button>
      </div>

      {slides.map((slide, idx) => (
        <div key={slide.id} className="rounded-lg border bg-card p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Slide {slide.position}</Badge>
              {slide.is_logo_slide && <Badge className="bg-emerald-600 hover:bg-emerald-600">Logo slide</Badge>}
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => move(idx, -1)} disabled={idx === 0}>
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => move(idx, 1)}
                disabled={idx === slides.length - 1}
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPreviewIdx(idx)}>
                <Eye className="w-4 h-4 mr-1" /> Preview
              </Button>
              <Button size="sm" onClick={() => saveSlide(slide)} disabled={savingId === slide.id}>
                {savingId === slide.id ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                Save
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setConfirmDeleteId(slide.id)}
                disabled={deletingId === slide.id}
              >
                {deletingId === slide.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor={`t-${slide.id}`}>Title</Label>
                <Input
                  id={`t-${slide.id}`}
                  value={slide.title}
                  onChange={(e) => updateLocal(slide.id, { title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor={`b-${slide.id}`}>Bullet points (one per line)</Label>
                <Textarea
                  id={`b-${slide.id}`}
                  rows={5}
                  value={slide.bullets.join("\n")}
                  onChange={(e) =>
                    updateLocal(slide.id, {
                      bullets: e.target.value.split("\n").map((s) => s).filter((s, i, arr) => i < arr.length - 1 || s.length > 0),
                    })
                  }
                />
              </div>

              {slide.is_logo_slide && (
                <LogoUploader
                  slide={slide}
                  uploading={uploadingId === slide.id + "logo"}
                  onUpload={(f) => uploadFile(slide, f, "logo")}
                  onClear={async () => {
                    await supabase.from("presentation_slides").update({ logo_url: null }).eq("id", slide.id);
                    updateLocal(slide.id, { logo_url: null });
                  }}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Slide image / screenshot</Label>
              <div className="aspect-video rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                {slide.image_url ? (
                  <img src={slide.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-xs text-muted-foreground flex flex-col items-center gap-1">
                    <ImagePlus className="w-6 h-6" /> No image yet
                  </div>
                )}
              </div>
              <ImageUploader
                uploading={uploadingId === slide.id + "image"}
                onUpload={(f) => uploadFile(slide, f, "image")}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Preview dialog */}
      <Dialog open={previewIdx !== null} onOpenChange={(o) => !o && setPreviewIdx(null)}>
        <DialogContent className="max-w-5xl bg-slate-950 text-slate-100 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-200">
              Preview · Slide {previewSlide?.position} of {slides.length}
            </DialogTitle>
          </DialogHeader>
          {previewSlide && (
            <div className="grid md:grid-cols-2 gap-8 py-4">
              <div>
                {previewSlide.is_logo_slide && previewSlide.logo_url && (
                  <img src={previewSlide.logo_url} alt="CFA" className="h-16 mb-6 object-contain" />
                )}
                <div className="text-sm uppercase tracking-widest text-emerald-400 mb-3">
                  Slide {previewSlide.position}
                </div>
                <h2 className="text-3xl font-bold mb-5 leading-tight">{previewSlide.title}</h2>
                <ul className="space-y-2">
                  {previewSlide.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2 text-slate-200">
                      <span className="text-emerald-400">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                {previewSlide.image_url ? (
                  <img src={previewSlide.image_url} alt="" className="w-full h-auto" />
                ) : (
                  <div className="aspect-video flex items-center justify-center text-slate-500 text-sm">
                    No image
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDeleteId !== null} onOpenChange={(o) => !o && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this slide?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the slide and renumbers the remaining ones. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDeleteId && deleteSlide(confirmDeleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const ImageUploader = ({
  uploading,
  onUpload,
}: {
  uploading: boolean;
  onUpload: (f: File) => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onUpload(f);
      }}
      className={`rounded-md border-2 border-dashed p-3 text-center text-xs ${
        drag ? "border-primary bg-primary/5" : "border-muted-foreground/30"
      }`}
    >
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          if (ref.current) ref.current.value = "";
        }}
      />
      <Button
        size="sm"
        variant="outline"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="w-full"
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : (
          <Upload className="w-4 h-4 mr-1" />
        )}
        Upload or drop image
      </Button>
    </div>
  );
};

const LogoUploader = ({
  slide,
  uploading,
  onUpload,
  onClear,
}: {
  slide: Slide;
  uploading: boolean;
  onUpload: (f: File) => void;
  onClear: () => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="rounded-md border p-3 space-y-2 bg-muted/30">
      <Label>CFA Logo (shown on this slide)</Label>
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded border bg-white flex items-center justify-center overflow-hidden">
          {slide.logo_url ? (
            <img src={slide.logo_url} alt="logo" className="max-h-12 max-w-12 object-contain" />
          ) : (
            <ImagePlus className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
            if (ref.current) ref.current.value = "";
          }}
        />
        <Button size="sm" variant="outline" onClick={() => ref.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
          Upload logo
        </Button>
        {slide.logo_url && (
          <Button size="sm" variant="ghost" onClick={onClear}>
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

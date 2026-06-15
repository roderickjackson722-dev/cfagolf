import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface Slide {
  id: string;
  position: number;
  title: string;
  bullets: string[];
  image_url: string | null;
  is_logo_slide: boolean;
  logo_url: string | null;
}

const PresentationView = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "valid" | "invalid">("loading");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [idx, setIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isFs, setIsFs] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    (async () => {
      const { data, error } = await supabase.rpc("validate_presentation_token", { _token: token });
      const row = Array.isArray(data) ? data[0] : data;
      if (error || !row?.valid) {
        setStatus("invalid");
        return;
      }
      const { data: slideRows } = await supabase
        .from("presentation_slides")
        .select("*")
        .order("position", { ascending: true });
      setSlides(
        ((slideRows as any[]) || []).map((s) => ({
          ...s,
          bullets: Array.isArray(s.bullets) ? s.bullets : [],
        })) as Slide[],
      );
      setStatus("valid");
    })();
  }, [token]);

  useEffect(() => {
    if (status !== "valid") return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  useEffect(() => {
    if (status !== "valid") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIdx((i) => Math.min(i + 1, slides.length - 1));
      else if (e.key === "ArrowLeft") setIdx((i) => Math.max(i - 1, 0));
      else if (e.key === "f" || e.key === "F") toggleFs();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, slides.length]);

  useEffect(() => {
    const onFs = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFs = () => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-3">Link not found</h1>
          <p className="text-slate-400">
            This presentation link is invalid, has expired, or has been revoked.
          </p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-slate-400">No slides configured yet.</p>
      </div>
    );
  }

  const slide = slides[idx];
  const total = slides.length;

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800">
        <div className="text-sm text-slate-400">
          CFA Member Tools · Slide {idx + 1} / {total}
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> {fmt(elapsed)}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFs}
            className="text-slate-300 hover:text-white"
          >
            {isFs ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Slide */}
      <div className="flex-1 flex items-center justify-center px-8 py-8">
        <div className="w-full max-w-7xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            {slide.is_logo_slide && slide.logo_url && (
              <img
                src={slide.logo_url}
                alt="College Fairway Advisors"
                className="h-20 md:h-24 mb-6 object-contain"
              />
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{slide.title}</h1>
            <ul className="space-y-3">
              {slide.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-lg text-slate-200">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
            {slide.image_url ? (
              <img src={slide.image_url} alt={slide.title} className="w-full h-auto" />
            ) : (
              <div className="aspect-video flex items-center justify-center text-slate-500 text-sm">
                No image uploaded
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="px-6 py-3 flex items-center justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? "w-8 bg-emerald-400" : "w-3 bg-slate-700 hover:bg-slate-600"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
        <Button
          variant="outline"
          onClick={() => setIdx((i) => Math.max(i - 1, 0))}
          disabled={idx === 0}
          className="bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <div className="text-xs text-slate-500">← → arrows · F fullscreen</div>
        <Button
          onClick={() => setIdx((i) => Math.min(i + 1, total - 1))}
          disabled={idx === total - 1}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default PresentationView;

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  X,
  ExternalLink,
  Monitor,
  Mic,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useAdmin";
import {
  presentationSlides,
  TOTAL_DURATION_SEC,
} from "@/data/presentationSlides";

function formatTime(sec: number) {
  const m = Math.floor(Math.abs(sec) / 60);
  const s = Math.abs(sec) % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const PresentationMode = () => {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSlide = Math.max(
    0,
    Math.min(presentationSlides.length - 1, parseInt(searchParams.get("slide") || "0", 10) || 0),
  );

  const [slideIndex, setSlideIndex] = useState(initialSlide);
  const [elapsed, setElapsed] = useState(0); // seconds count-up from 0
  const [running, setRunning] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const intervalRef = useRef<number | null>(null);

  const slide = presentationSlides[slideIndex];

  // Persist slide index in URL
  useEffect(() => {
    setSearchParams({ slide: String(slideIndex) }, { replace: true });
  }, [slideIndex, setSearchParams]);

  // Timer
  useEffect(() => {
    if (!running) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000) as unknown as number;
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  // Auto-advance
  useEffect(() => {
    if (!autoAdvance) return;
    if (elapsed >= slide.endSec && slideIndex < presentationSlides.length - 1) {
      setSlideIndex((i) => Math.min(i + 1, presentationSlides.length - 1));
    }
  }, [elapsed, slide.endSec, slideIndex, autoAdvance]);

  const next = useCallback(() => {
    setSlideIndex((i) => Math.min(i + 1, presentationSlides.length - 1));
  }, []);
  const prev = useCallback(() => {
    setSlideIndex((i) => Math.max(i - 1, 0));
  }, []);
  const resetTimer = useCallback(() => {
    setElapsed(0);
    setRunning(true);
  }, []);
  const endPresentation = useCallback(() => {
    window.close();
    // fallback if window cannot close
    setTimeout(() => {
      window.location.href = "/admin/presentation";
    }, 100);
  }, []);

  // Jump elapsed to start of current slide when manually navigating (so indicator stays in sync)
  useEffect(() => {
    setElapsed((prev) => {
      // Only snap if we drift far from the slide window
      if (prev < slide.startSec || prev >= slide.endSec) {
        return slide.startSec;
      }
      return prev;
    });
  }, [slideIndex, slide.startSec, slide.endSec]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setRunning((r) => !r);
      } else if (e.key === "Escape") {
        e.preventDefault();
        endPresentation();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, endPresentation]);

  const progressPct = useMemo(
    () => Math.min(100, (elapsed / TOTAL_DURATION_SEC) * 100),
    [elapsed],
  );
  const overTime = elapsed > TOTAL_DURATION_SEC;
  const remaining = TOTAL_DURATION_SEC - elapsed;

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top bar: timer + slide indicator */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400">Elapsed</div>
            <div
              className={`font-mono text-4xl font-bold tabular-nums ${
                overTime ? "text-red-400" : "text-white"
              }`}
            >
              {formatTime(elapsed)}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400">Remaining</div>
            <div
              className={`font-mono text-2xl tabular-nums ${
                overTime ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {overTime ? "-" : ""}
              {formatTime(remaining)}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-slate-400">
            Slide {slideIndex + 1} of {presentationSlides.length}
          </div>
          <div className="font-mono text-lg text-amber-300">
            {slide.timeLabel} · {slide.title}
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-2 bg-slate-800 relative">
        <div
          className={`h-full transition-all ${overTime ? "bg-red-500" : "bg-emerald-500"}`}
          style={{ width: `${progressPct}%` }}
        />
        {/* slide markers */}
        {presentationSlides.map((s) => (
          <div
            key={s.index}
            className="absolute top-0 bottom-0 w-px bg-slate-600"
            style={{ left: `${(s.endSec / TOTAL_DURATION_SEC) * 100}%` }}
          />
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 px-6 md:px-12 py-8 grid md:grid-cols-3 gap-8 max-w-[1400px] w-full mx-auto">
        {/* Left: Speaker notes */}
        <section className="md:col-span-2">
          <div className="flex items-center gap-2 text-emerald-400 mb-3">
            <Mic className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider font-semibold">Speaker Notes</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">{slide.title}</h2>
          <ul className="space-y-3">
            {slide.speakerNotes.map((note, i) => (
              <li
                key={i}
                className="flex gap-3 text-lg md:text-xl text-slate-200 leading-relaxed"
              >
                <span className="text-emerald-400 font-bold mt-1">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Right: What to show + shortcut */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
            <div className="flex items-center gap-2 text-amber-300 mb-3">
              <Monitor className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider font-semibold">
                Show on Screen
              </span>
            </div>
            <p className="text-xl text-white font-semibold">{slide.showOnScreen}</p>
          </div>

          {slide.shortcutUrl && (
            <a
              href={slide.shortcutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-emerald-600 bg-emerald-600/10 hover:bg-emerald-600/20 transition-colors p-6 text-white"
            >
              <div>
                <div className="text-xs uppercase tracking-wider text-emerald-300 mb-1">
                  Quick Shortcut
                </div>
                <div className="text-lg font-semibold">{slide.shortcutLabel}</div>
              </div>
              <ExternalLink className="w-6 h-6 text-emerald-300" />
            </a>
          )}

          <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-400 space-y-1">
            <div className="font-semibold text-slate-200 mb-2">Keyboard Shortcuts</div>
            <div>→ Next slide</div>
            <div>← Previous slide</div>
            <div>Space Pause/Resume</div>
            <div>Esc End presentation</div>
            <label className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="accent-emerald-500"
              />
              <span>Auto-advance when segment ends</span>
            </label>
          </div>
        </aside>
      </main>

      {/* Bottom controls */}
      <footer className="border-t border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            disabled={slideIndex === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          <button
            onClick={next}
            disabled={slideIndex === presentationSlides.length - 1}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
          >
            {running ? (
              <>
                <Pause className="w-5 h-5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" /> Resume
              </>
            )}
          </button>
          <button
            onClick={resetTimer}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
          >
            <RotateCcw className="w-5 h-5" /> Reset Timer
          </button>
          <button
            onClick={endPresentation}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
          >
            <X className="w-5 h-5" /> End
          </button>
        </div>
      </footer>
    </div>
  );
};

export default PresentationMode;

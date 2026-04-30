import { Navigate } from "react-router-dom";
import { Play, Clock, Presentation as PresentationIcon, ListOrdered } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useAdmin";
import { presentationSlides } from "@/data/presentationSlides";

const PresentationStart = () => {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const launchPresentation = () => {
    const url = "/admin/presentation/mode?slide=0";
    const features = "width=1200,height=800,noopener,noreferrer";
    const win = window.open(url, "_blank", features);
    if (!win) {
      // popup blocked — fallback to new tab
      window.open(url, "_blank");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-2">
            <PresentationIcon className="w-8 h-8 text-primary" />
            <h1 className="font-display text-3xl font-bold">Sales Call Presentation Mode</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            A visual guide and remote control for live 15-minute Zoom sales calls.
          </p>

          <Card className="mb-8 border-primary/30">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to run a live call?</CardTitle>
              <CardDescription>
                Opens the presentation in a new window (1200×800). Use keyboard arrows to navigate.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
              <Button size="lg" onClick={launchPresentation} className="text-lg h-14 px-10">
                <Play className="w-6 h-6 mr-2" />
                Start Presentation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-primary" />
                <CardTitle>Slide Sequence</CardTitle>
              </div>
              <CardDescription>15 minutes total · 9 slides</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {presentationSlides.map((s) => (
                <div
                  key={s.index}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-[110px] text-sm font-mono text-primary">
                    <Clock className="w-4 h-4" />
                    {s.timeLabel}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{s.title}</div>
                    <div className="text-sm text-muted-foreground">{s.showOnScreen}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="mt-6 text-sm text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Keyboard shortcuts in presentation mode:</p>
            <p>→ Next slide · ← Previous slide · Space Pause/Resume timer · Esc End presentation</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PresentationStart;

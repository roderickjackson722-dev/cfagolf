import { Navigate } from 'react-router-dom';
import { Loader2, GraduationCap } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { CoreCourseTracker } from '@/components/worksheets/CoreCourseTracker';

export default function CoreCourseTrackerPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6 flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">NCAA Core Course Tracker</h1>
              <p className="text-muted-foreground mt-1">
                Map your high school courses to the 16 NCAA-approved core requirements and calculate your NCAA Core GPA.
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-8 text-center space-y-4">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Click below to open the interactive tracker. Your progress saves automatically and you can export a PDF
              copy to share with your counselor anytime.
            </p>
            <CoreCourseTracker>
              <Button size="lg">Open Core Course Tracker</Button>
            </CoreCourseTracker>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="rounded-lg border p-4 bg-muted/30">
              <p className="text-xs font-bold text-foreground mb-1">D1 Minimum</p>
              <p className="text-xs text-muted-foreground">2.300 NCAA Core GPA across 16 approved core courses.</p>
            </div>
            <div className="rounded-lg border p-4 bg-muted/30">
              <p className="text-xs font-bold text-foreground mb-1">D2 Minimum</p>
              <p className="text-xs text-muted-foreground">2.200 NCAA Core GPA across 16 approved core courses.</p>
            </div>
            <div className="rounded-lg border p-4 bg-muted/30">
              <p className="text-xs font-bold text-foreground mb-1">Tip</p>
              <p className="text-xs text-muted-foreground">Only NCAA-approved courses count — verify with your counselor.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

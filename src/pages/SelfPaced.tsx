import { Navigate, Link } from 'react-router-dom';
import { Loader2, BookOpen, ChevronRight, FileDown, GraduationCap } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useMyMeetingProgress } from '@/hooks/useMeetingProgress';
import { SELF_PACED_MODULES } from '@/data/selfPacedCourse';

const SelfPaced = () => {
  const { user, profile, hasPaidAccess, loading: authLoading } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const { data: progressData = [] } = useMyMeetingProgress();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Access: paid members or admins. Consulting + digital both qualify.
  const hasAccess = isAdmin || hasPaidAccess;
  if (!hasAccess) return <Navigate to="/pricing" replace />;

  const completedSet = new Set(
    progressData.filter((p) => p.is_completed).map((p) => p.module_number),
  );
  const completedCount = completedSet.size;
  const progressPercent = Math.round(
    (completedCount / SELF_PACED_MODULES.length) * 100,
  );

  const totalWorksheets = SELF_PACED_MODULES.reduce(
    (sum, m) => sum + m.worksheets.length,
    0,
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary" />
            </div>
            <div>
              <Badge variant="outline" className="mb-1">
                Self-Paced Course
              </Badge>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                The CFA Recruiting Course
              </h1>
            </div>
          </div>

          <p className="text-muted-foreground mb-6">
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}. The
            complete recruiting framework — 10 modules of written content, key
            takeaways, action checklists, and {totalWorksheets} downloadable
            worksheet PDFs. Work at your own pace.
          </p>

          {/* Progress */}
          <Card className="mb-8">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Course Progress
                </span>
                <span className="text-sm font-medium text-foreground">
                  {completedCount} / {SELF_PACED_MODULES.length} modules complete
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </CardContent>
          </Card>

          {/* Module List */}
          <div className="space-y-3">
            {SELF_PACED_MODULES.map((mod) => {
              const isComplete = completedSet.has(mod.moduleNumber);
              return (
                <Link
                  key={mod.slug}
                  to={`/self-paced/${mod.slug}`}
                  className="block"
                >
                  <Card className="card-hover group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isComplete
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          <span className="text-base font-bold">
                            {mod.moduleNumber === 0 ? 'i' : mod.moduleNumber}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <CardTitle className="text-base">
                              {mod.title}
                            </CardTitle>
                            {isComplete && (
                              <Badge variant="default" className="text-xs">
                                Complete
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-sm">
                            {mod.description}
                          </CardDescription>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {mod.estReadTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileDown className="w-3 h-3" />
                              {mod.worksheets.length} worksheet
                              {mod.worksheets.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-foreground transition-colors" />
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Button variant="outline" asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SelfPaced;

import { useMemo, useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import {
  Loader2,
  BookOpen,
  ChevronRight,
  FileDown,
  GraduationCap,
  Search,
  PlayCircle,
  Award,
  Eye,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useMyMeetingProgress } from '@/hooks/useMeetingProgress';
import {
  SELF_PACED_MODULES,
  type ModuleWorksheet,
  type SelfPacedModule,
} from '@/data/selfPacedCourse';
import { WorksheetPreviewDialog } from '@/components/selfpaced/WorksheetPreviewDialog';
import { CertificateDialog } from '@/components/selfpaced/CertificateDialog';

const SelfPaced = () => {
  const navigate = useNavigate();
  const { user, profile, hasPaidAccess, loading: authLoading } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const { data: progressData = [] } = useMyMeetingProgress();

  const [search, setSearch] = useState('');
  const [previewState, setPreviewState] = useState<{
    module: SelfPacedModule;
    worksheet: ModuleWorksheet;
  } | null>(null);
  const [certOpen, setCertOpen] = useState(false);

  const completedSet = useMemo(
    () => new Set(progressData.filter((p) => p.is_completed).map((p) => p.module_number)),
    [progressData],
  );
  const completedCount = completedSet.size;
  const progressPercent = Math.round(
    (completedCount / SELF_PACED_MODULES.length) * 100,
  );

  const totalWorksheets = SELF_PACED_MODULES.reduce(
    (sum, m) => sum + m.worksheets.length,
    0,
  );

  const nextIncomplete = useMemo(
    () => SELF_PACED_MODULES.find((m) => !completedSet.has(m.moduleNumber)),
    [completedSet],
  );

  const allComplete = completedCount === SELF_PACED_MODULES.length;

  // Flatten worksheets for search
  const worksheetMatches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    const results: { module: SelfPacedModule; worksheet: ModuleWorksheet }[] = [];
    for (const mod of SELF_PACED_MODULES) {
      for (const ws of mod.worksheets) {
        const hay = `${ws.title} ${ws.description}`.toLowerCase();
        if (hay.includes(q)) results.push({ module: mod, worksheet: ws });
      }
    }
    return results;
  }, [search]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  const hasAccess = isAdmin || hasPaidAccess;
  if (!hasAccess) return <Navigate to="/pricing" replace />;

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
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}. The complete recruiting
            framework — 10 modules of written content, key takeaways, action checklists, and{' '}
            {totalWorksheets} downloadable worksheet PDFs. Work at your own pace.
          </p>

          {/* Progress + Continue + Certificate */}
          <Card className="mb-6">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Course Progress</span>
                <span className="text-sm font-medium text-foreground">
                  {completedCount} / {SELF_PACED_MODULES.length} modules complete
                </span>
              </div>
              <Progress value={progressPercent} className="h-2 mb-4" />

              <div className="flex flex-wrap gap-2">
                {nextIncomplete ? (
                  <Button onClick={() => navigate(`/self-paced/${nextIncomplete.slug}`)}>
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Continue where I left off
                  </Button>
                ) : (
                  <Button onClick={() => setCertOpen(true)}>
                    <Award className="w-4 h-4 mr-1" />
                    View Completion Certificate
                  </Button>
                )}
                {allComplete && nextIncomplete && (
                  <Button variant="outline" onClick={() => setCertOpen(true)}>
                    <Award className="w-4 h-4 mr-1" /> Certificate
                  </Button>
                )}
                {!allComplete && completedCount > 0 && (
                  <Button
                    variant="outline"
                    disabled
                    title={`Finish all ${SELF_PACED_MODULES.length} modules to unlock`}
                  >
                    <Award className="w-4 h-4 mr-1" />
                    Certificate locked ({SELF_PACED_MODULES.length - completedCount} to go)
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search worksheets across all modules..."
                className="pl-9 pr-9"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {search && (
              <Card className="mt-3">
                <CardContent className="p-2">
                  {worksheetMatches.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-3">
                      No worksheets match "{search}".
                    </p>
                  ) : (
                    <ul className="divide-y">
                      {worksheetMatches.map(({ module, worksheet }) => (
                        <li
                          key={`${module.slug}-${worksheet.id}`}
                          className="flex items-center justify-between gap-3 p-3"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {worksheet.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {module.moduleNumber === 0
                                ? 'Introduction'
                                : `Module ${module.moduleNumber}`}{' '}
                              · {module.shortTitle}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setPreviewState({ module, worksheet })}
                            >
                              <Eye className="w-4 h-4 mr-1" /> Preview
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/self-paced/${module.slug}`}>Open module</Link>
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Module List */}
          <div className="space-y-3">
            {SELF_PACED_MODULES.map((mod) => {
              const isComplete = completedSet.has(mod.moduleNumber);
              return (
                <Link key={mod.slug} to={`/self-paced/${mod.slug}`} className="block">
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
                          {isComplete ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <span className="text-base font-bold">
                              {mod.moduleNumber === 0 ? 'i' : mod.moduleNumber}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <CardTitle className="text-base">{mod.title}</CardTitle>
                            {isComplete && (
                              <Badge variant="default" className="text-xs">
                                Complete
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-sm">{mod.description}</CardDescription>
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

      <WorksheetPreviewDialog
        module={previewState?.module ?? null}
        worksheet={previewState?.worksheet ?? null}
        open={!!previewState}
        onOpenChange={(o) => !o && setPreviewState(null)}
      />
      <CertificateDialog
        open={certOpen}
        onOpenChange={setCertOpen}
        fullName={profile?.full_name || user.email || 'CFA Student'}
      />
    </div>
  );
};

export default SelfPaced;

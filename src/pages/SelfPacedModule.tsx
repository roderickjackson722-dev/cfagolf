import { useState } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, FileDown, Lightbulb, ListChecks, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { SELF_PACED_MODULES, getModuleBySlug } from '@/data/selfPacedCourse';
import { downloadModuleWorksheet } from '@/lib/selfPacedWorksheets';
import { toast } from '@/hooks/use-toast';

const SelfPacedModule = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, hasPaidAccess, loading } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin && !hasPaidAccess) return <Navigate to="/pricing" replace />;

  const mod = slug ? getModuleBySlug(slug) : undefined;
  if (!mod) return <Navigate to="/self-paced" replace />;

  const idx = SELF_PACED_MODULES.findIndex((m) => m.slug === mod.slug);
  const prev = idx > 0 ? SELF_PACED_MODULES[idx - 1] : null;
  const next = idx < SELF_PACED_MODULES.length - 1 ? SELF_PACED_MODULES[idx + 1] : null;

  const handleDownload = async (worksheetId: string) => {
    const ws = mod.worksheets.find((w) => w.id === worksheetId);
    if (!ws) return;
    setDownloadingId(worksheetId);
    try {
      const ok = downloadModuleWorksheet(mod, ws);
      if (!ok) throw new Error('Worksheet not configured');
      toast({ title: 'Download started', description: `${ws.title}.pdf` });
    } catch (err) {
      toast({
        title: 'Download failed',
        description: 'Please refresh and try again.',
        variant: 'destructive',
      });
    } finally {
      setTimeout(() => setDownloadingId(null), 600);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            to="/self-paced"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to course
          </Link>

          {/* Header */}
          <div className="mb-8">
            <Badge variant="outline" className="mb-2">
              {mod.moduleNumber === 0 ? 'Introduction' : `Module ${mod.moduleNumber}`}
            </Badge>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              {mod.title}
            </h1>
            <p className="text-muted-foreground">{mod.description}</p>
            <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
              <BookOpen className="w-3 h-3" />
              <span>{mod.estReadTime} read</span>
            </div>
          </div>

          {/* Lesson */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Lesson</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mod.paragraphs.map((p, i) => (
                <p key={i} className="text-sm text-foreground leading-relaxed">
                  {p}
                </p>
              ))}
            </CardContent>
          </Card>

          {/* Key Takeaways */}
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Key Takeaways
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mod.takeaways.map((t, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Action Checklist */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-primary" />
                Action Checklist
              </CardTitle>
              <CardDescription>
                Complete these before moving to the next module.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mod.checklist.map((item, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Worksheets */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileDown className="w-5 h-5 text-primary" />
                Downloadable Worksheets
              </CardTitle>
              <CardDescription>
                Print and fill in. Each worksheet is a standalone PDF you can save and share.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {mod.worksheets.map((ws) => (
                <div
                  key={ws.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-background"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{ws.title}</p>
                    <p className="text-xs text-muted-foreground">{ws.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(ws.id)}
                    disabled={downloadingId === ws.id}
                  >
                    {downloadingId === ws.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ...
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4 mr-1" /> PDF
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Prev / Next nav */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t">
            {prev ? (
              <Button variant="outline" asChild>
                <Link to={`/self-paced/${prev.slug}`}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> {prev.shortTitle}
                </Link>
              </Button>
            ) : (
              <span />
            )}
            {next ? (
              <Button asChild>
                <Link to={`/self-paced/${next.slug}`}>
                  {next.shortTitle} <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/self-paced">Back to course</Link>
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SelfPacedModule;

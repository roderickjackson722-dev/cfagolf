import { Navigate } from 'react-router-dom';
import { Calendar, CheckCircle2, Lightbulb, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useWorksheetData } from '@/hooks/useWorksheetData';
import { RECRUITING_TIMELINE, CRITICAL_DATES } from '@/data/recruitingTimeline';

type ProgressState = Record<string, boolean>;

const RecruitingTimeline = () => {
  const { user, loading } = useAuth();
  const { data: progress, updateData, isLoading } = useWorksheetData<ProgressState>(
    'recruiting-timeline',
    {}
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  const toggle = (id: string) => {
    updateData(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // All task ids across seasons + checklists
  const allIds = RECRUITING_TIMELINE.flatMap(y => [
    ...y.seasons.flatMap(s => s.tasks.map(t => t.id)),
    ...y.checklist.map(c => c.id),
  ]);
  const completedCount = allIds.filter(id => progress[id]).length;
  const totalCount = allIds.length;
  const overallPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const yearProgress = (year: typeof RECRUITING_TIMELINE[number]) => {
    const ids = [
      ...year.seasons.flatMap(s => s.tasks.map(t => t.id)),
      ...year.checklist.map(c => c.id),
    ];
    const done = ids.filter(id => progress[id]).length;
    return { done, total: ids.length, pct: ids.length ? Math.round((done / ids.length) * 100) : 0 };
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-7 h-7 text-primary" />
              <h1 className="font-display text-3xl font-bold text-foreground">
                College Golf Recruiting Timeline
              </h1>
            </div>
            <p className="text-muted-foreground">
              A complete month-by-month roadmap from Freshman to Senior year. Check off items as you complete them — your progress is saved automatically.
            </p>
          </div>

          {/* Overall Progress */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Your Overall Progress</CardTitle>
                <Badge variant="secondary">{completedCount} / {totalCount} complete</Badge>
              </div>
              <CardDescription>Track every milestone across all four years</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={overallPct} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">{overallPct}% complete</p>

              {/* Per-year mini progress */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                {RECRUITING_TIMELINE.map(year => {
                  const yp = yearProgress(year);
                  return (
                    <div key={year.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{year.emoji} {year.grade}</span>
                        <span className="text-xs text-muted-foreground">{yp.done}/{yp.total}</span>
                      </div>
                      <Progress value={yp.pct} className="h-1.5" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Years */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <Accordion type="multiple" defaultValue={['freshman', 'sophomore', 'junior', 'senior']} className="space-y-4">
              {RECRUITING_TIMELINE.map(year => {
                const yp = yearProgress(year);
                return (
                  <AccordionItem
                    key={year.id}
                    value={year.id}
                    className="border rounded-xl bg-card px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <span className="text-2xl">{year.emoji}</span>
                        <div className="flex-1">
                          <div className="font-display font-semibold text-lg">
                            {year.year} <span className="text-muted-foreground font-normal">({year.grade})</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{year.goal}</div>
                        </div>
                        <Badge variant="outline" className="ml-2 hidden sm:inline-flex">
                          {yp.pct}%
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      {/* Seasons */}
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {year.seasons.map(season => (
                          <div key={season.season} className="rounded-lg border bg-muted/30 p-4">
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${year.color}`} />
                              {season.season}
                            </h4>
                            <ul className="space-y-2">
                              {season.tasks.map(task => (
                                <li key={task.id} className="flex items-start gap-2">
                                  <Checkbox
                                    id={task.id}
                                    checked={!!progress[task.id]}
                                    onCheckedChange={() => toggle(task.id)}
                                    className="mt-1"
                                  />
                                  <label
                                    htmlFor={task.id}
                                    className={`text-sm cursor-pointer leading-relaxed ${
                                      progress[task.id] ? 'line-through text-muted-foreground' : 'text-foreground'
                                    }`}
                                  >
                                    {task.text}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Checklist */}
                      <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 mb-4">
                        <h4 className="font-semibold flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          {year.year} Checklist
                        </h4>
                        <ul className="space-y-2">
                          {year.checklist.map(item => (
                            <li key={item.id} className="flex items-start gap-2">
                              <Checkbox
                                id={item.id}
                                checked={!!progress[item.id]}
                                onCheckedChange={() => toggle(item.id)}
                                className="mt-1"
                              />
                              <label
                                htmlFor={item.id}
                                className={`text-sm cursor-pointer leading-relaxed ${
                                  progress[item.id] ? 'line-through text-muted-foreground' : 'text-foreground'
                                }`}
                              >
                                {item.text}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pro Tip */}
                      <div className="flex items-start gap-3 rounded-lg bg-accent/30 p-3">
                        <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Pro Tip</div>
                          <div className="text-sm text-foreground">{year.proTip}</div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}

          {/* Critical Dates */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                📌 Critical Dates for Recruiting
              </CardTitle>
              <CardDescription>Key NCAA recruiting calendar milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>What Happens</TableHead>
                      <TableHead>Division</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CRITICAL_DATES.map((d, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium whitespace-nowrap">{d.date}</TableCell>
                        <TableCell>{d.event}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{d.division}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecruitingTimeline;

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useDigitalProducts } from '@/hooks/useDigitalProducts';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookOpen, ChevronDown, ChevronUp, Clock, ArrowLeft, Lightbulb, Loader2, FileDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MODULES } from '@/data/huddleLessons';
import { generateHuddleLessonPDF } from '@/lib/huddlePdf';

const RecruitingHuddle = () => {
  const { hasToolkitAccess, loading } = useDigitalProducts();
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasToolkitAccess) return <Navigate to="/toolkit" replace />;

  const totalLessons = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/toolkit" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Toolkit
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-purple-700" />
            </div>
            <div>
              <Badge variant="outline" className="mb-1">Written Masterclass</Badge>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                The Recruiting Timeline
              </h1>
            </div>
          </div>

          <p className="text-muted-foreground mb-4">
            A complete guide covering the recruiting timeline from Freshman to Senior year. {totalLessons} lessons across {MODULES.length} modules.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>~90 min total read time</span>
            <span>•</span>
            <span>{totalLessons} lessons</span>
            <span>•</span>
            <span>{MODULES.length} modules</span>
            <span>•</span>
            <Button size="sm" variant="outline" onClick={() => generateHuddleLessonPDF()}>
              <FileDown className="w-4 h-4 mr-1" /> Save All as PDF
            </Button>
          </div>

          <div className="space-y-6">
            {MODULES.map((module, modIdx) => (
              <Card key={modIdx}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {module.lessons.map((lesson, lesIdx) => {
                      const isExpanded = expandedLesson === lesson.id;
                      return (
                        <div key={lesson.id}>
                          <button
                            onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}
                            className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                              isExpanded ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-medium text-muted-foreground">{lesIdx + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground">{lesson.title}</p>
                              <p className="text-xs text-muted-foreground">{lesson.description}</p>
                            </div>
                            <span className="text-xs text-muted-foreground flex-shrink-0 mr-1">{lesson.readTime}</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                          </button>

                          {isExpanded && (
                            <div className="mt-2 ml-11 p-5 bg-muted/30 rounded-lg space-y-4">
                              {lesson.content.map((para, i) => (
                                <p key={i} className="text-sm text-foreground leading-relaxed">{para}</p>
                              ))}

                              <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                                <div className="flex items-center gap-2 mb-2">
                                  <Lightbulb className="w-4 h-4 text-primary" />
                                  <span className="text-sm font-semibold text-foreground">Key Takeaways</span>
                                </div>
                                <ul className="space-y-1">
                                  {lesson.keyTakeaways.map((t, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <span className="text-primary mt-1">•</span> {t}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="flex justify-end">
                                <Button size="sm" variant="outline" onClick={() => generateHuddleLessonPDF(lesson.id)}>
                                  <FileDown className="w-4 h-4 mr-1" /> Save Lesson as PDF
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator className="my-10" />
          <div className="text-center text-sm text-muted-foreground">
            <p>© College Fairway Advisors. For personal use only.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecruitingHuddle;

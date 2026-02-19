import { useState } from 'react';
import { CheckCircle2, Circle, BookOpen, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MEETING_MODULES, useMyMeetingProgress } from '@/hooks/useMeetingProgress';
import { format } from 'date-fns';
import { RecruitingTimelineWorksheet } from '@/components/worksheets/RecruitingTimelineWorksheet';
import { ProgramFitQuestionnaire } from '@/components/worksheets/ProgramFitQuestionnaire';
import { EligibilityChecklist } from '@/components/worksheets/EligibilityChecklist';
import { CoreCourseTracker } from '@/components/worksheets/CoreCourseTracker';
import { TestPrepWorksheet } from '@/components/worksheets/TestPrepWorksheet';

const MODULE_MATERIALS: Record<number, { topics: string[]; resources: string[] }> = {
  0: {
    topics: [
      "Welcome to College Fairway Advisors",
      "Program overview & what to expect",
      "Setting your recruiting goals and timeline",
      "How to get the most out of your coaching sessions",
    ],
    resources: [],
  },
  1: {
    topics: [
      "NCAA Division I, II, III overview",
      "NAIA & NJCAA pathways",
      "How to find your best program fit",
      "Understanding the recruiting timeline by division",
      "Key differences between scholarship levels",
    ],
    resources: [
      "Recruiting Timeline Calendar",
      "Program Fit Questionnaire",
    ],
  },
  2: {
    topics: [
      "NCAA Eligibility Center requirements",
      "Core course requirements by division",
      "GPA planning strategies",
      "SAT/ACT test prep recommendations",
      "Maintaining academic standing",
    ],
    resources: [
      "Eligibility Checklist",
      "Core Course Tracker",
      "Test Prep Resource List",
    ],
  },
  3: {
    topics: [
      "Scoring benchmarks by division level",
      "Tournament selection strategy",
      "Tracking meaningful statistics",
      "Building a competitive tournament schedule",
      "How coaches evaluate your results",
    ],
    resources: [
      "Scoring Benchmark Guide",
      "Tournament Selection Worksheet",
      "Stats Tracking Template",
    ],
  },
  4: {
    topics: [
      "Designing an effective practice plan",
      "Short game, long game, and mental game focus areas",
      "Physical fitness preparation for college golf",
      "Working with your teaching pro effectively",
      "Off-season training strategies",
    ],
    resources: [
      "Weekly Practice Plan Template",
      "Fitness Assessment Checklist",
      "Skill Development Tracker",
    ],
  },
  5: {
    topics: [
      "Building your recruiting profile/resume",
      "Creating an effective highlight video",
      "Social media dos and don'ts for recruits",
      "Online presence management",
      "Junior golf organization profiles (AJGA, etc.)",
    ],
    resources: [
      "Athlete Resume Template",
      "Video Production Guidelines",
      "Social Media Best Practices Guide",
    ],
  },
  6: {
    topics: [
      "Crafting your initial outreach email",
      "Phone call scripts and etiquette",
      "Campus visit preparation and scheduling",
      "Following up effectively with coaches",
      "Building genuine relationships with programs",
    ],
    resources: [
      "Email Templates Collection",
      "Phone Script Guide",
      "Campus Visit Prep Checklist",
    ],
  },
  7: {
    topics: [
      "Understanding athletic scholarship offers",
      "Academic aid and need-based financial aid",
      "Comparing total financial packages",
      "Negotiation strategies and best practices",
      "Making your final decision framework",
    ],
    resources: [
      "Offer Comparison Spreadsheet",
      "Financial Aid Glossary",
      "Decision Matrix Template",
    ],
  },
  8: {
    topics: [
      "Assembling your final recruiting portfolio",
      "Creating your 90-day action plan",
      "Commitment preparation and next steps",
      "National Letter of Intent process",
      "Celebrating your achievement",
    ],
    resources: [
      "Portfolio Assembly Checklist",
      "90-Day Action Plan Template",
      "NLI Process Guide",
    ],
  },
  9: {
    topics: [
      "Transitioning from recruit to college athlete",
      "What to expect your first semester",
      "Time management for student-athletes",
      "Staying connected with CFA for ongoing support",
      "Final review and celebration",
    ],
    resources: [
      "College Transition Guide",
      "Student-Athlete Time Management Planner",
    ],
  },
};

export function CoachingProgressSection() {
  const { data: progressData = [], isLoading } = useMyMeetingProgress();
  const [openModules, setOpenModules] = useState<Set<number>>(new Set());

  const getProgressForModule = (moduleNumber: number) => {
    return progressData.find((p) => p.module_number === moduleNumber);
  };

  const completedCount = progressData.filter((p) => p.is_completed).length;
  const progressPercent = Math.round((completedCount / MEETING_MODULES.length) * 100);

  const toggleModule = (moduleNumber: number) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleNumber)) {
        next.delete(moduleNumber);
      } else {
        next.add(moduleNumber);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="space-y-2 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">Your Coaching Journey</CardTitle>
          </div>
          <Badge variant={progressPercent === 100 ? 'default' : 'secondary'}>
            {completedCount}/{MEETING_MODULES.length} Complete
          </Badge>
        </div>
        <CardDescription>
          Track your one-on-one coaching sessions and access module materials
        </CardDescription>
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium text-foreground">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {MEETING_MODULES.map((module) => {
          const progress = getProgressForModule(module.moduleNumber);
          const isCompleted = progress?.is_completed || false;
          const isOpen = openModules.has(module.moduleNumber);
          const materials = MODULE_MATERIALS[module.moduleNumber];

          return (
            <Collapsible
              key={module.moduleNumber}
              open={isOpen}
              onOpenChange={() => toggleModule(module.moduleNumber)}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left hover:bg-muted/50 ${
                    isCompleted ? 'bg-primary/5 border-primary/20' : 'bg-background'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${isCompleted ? 'text-primary' : ''}`}>
                      {module.moduleNumber === 0 ? 'Intro' : `Module ${module.moduleNumber}`}: {module.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {module.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {progress?.completed_date && (
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        ✓ {format(new Date(progress.completed_date), 'MMM d, yyyy')}
                      </span>
                    )}
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {materials && (
                  <div className="ml-8 mr-3 mt-2 mb-3 p-4 rounded-lg bg-muted/30 border border-border/50 space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-primary" />
                        Topics Covered
                      </h4>
                      <ul className="space-y-1.5">
                        {materials.topics.map((topic, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-primary" />
                        Materials & Resources
                      </h4>
                      <ul className="space-y-1.5">
                        {materials.resources.map((resource, i) => {
                          // Module 1 interactive worksheets
                          if (module.moduleNumber === 1 && resource === 'Recruiting Timeline Calendar') {
                            return (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <span className="text-primary">📄</span>
                                <RecruitingTimelineWorksheet>
                                  <button className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors cursor-pointer text-left">
                                    {resource}
                                  </button>
                                </RecruitingTimelineWorksheet>
                              </li>
                            );
                          }
                          if (module.moduleNumber === 1 && resource === 'Program Fit Questionnaire') {
                            return (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <span className="text-primary">📄</span>
                                <ProgramFitQuestionnaire>
                                  <button className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors cursor-pointer text-left">
                                    {resource}
                                  </button>
                                </ProgramFitQuestionnaire>
                              </li>
                            );
                          }
                          if (module.moduleNumber === 2 && resource === 'Eligibility Checklist') {
                            return (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <span className="text-primary">📄</span>
                                <EligibilityChecklist>
                                  <button className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors cursor-pointer text-left">
                                    {resource}
                                  </button>
                                </EligibilityChecklist>
                              </li>
                            );
                          }
                          if (module.moduleNumber === 2 && resource === 'Core Course Tracker') {
                            return (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <span className="text-primary">📄</span>
                                <CoreCourseTracker>
                                  <button className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors cursor-pointer text-left">
                                    {resource}
                                  </button>
                                </CoreCourseTracker>
                              </li>
                            );
                          }
                          if (module.moduleNumber === 2 && resource === 'Test Prep Resource List') {
                            return (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <span className="text-primary">📄</span>
                                <TestPrepWorksheet>
                                  <button className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors cursor-pointer text-left">
                                    {resource}
                                  </button>
                                </TestPrepWorksheet>
                              </li>
                            );
                          }
                          return (
                            <li key={i} className="text-sm flex items-center gap-2">
                              <span className="text-primary">📄</span>
                              <a
                                href="#"
                                className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors cursor-pointer"
                                onClick={(e) => e.preventDefault()}
                              >
                                {resource}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    {progress?.admin_notes && (
                      <div className="pt-2 border-t border-border/50">
                        <h4 className="text-sm font-semibold text-foreground mb-1">Coach Notes</h4>
                        <p className="text-sm text-muted-foreground">{progress.admin_notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
}

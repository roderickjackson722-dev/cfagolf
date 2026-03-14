import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useDigitalProducts } from '@/hooks/useDigitalProducts';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Video, Play, Clock, ArrowLeft, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string; // Will be added when videos are uploaded
}

interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

const MODULES: Module[] = [
  {
    title: "Module 1: Freshman Year — Laying the Foundation",
    description: "Start your recruiting journey the right way from day one.",
    lessons: [
      { id: "1-1", title: "Understanding the College Golf Landscape", description: "NCAA divisions, NAIA, JUCO — what's right for you", duration: "12 min" },
      { id: "1-2", title: "Setting Your Recruiting Goals Early", description: "How to create a realistic timeline and target list", duration: "10 min" },
      { id: "1-3", title: "Building Your Academic Foundation", description: "GPA, test prep, and NCAA Eligibility Center registration", duration: "8 min" },
      { id: "1-4", title: "Developing Your Competitive Resume", description: "Tournaments to play and stats to track from year one", duration: "11 min" },
    ],
  },
  {
    title: "Module 2: Sophomore Year — Building Visibility",
    description: "Start getting on coaches' radar with strategic actions.",
    lessons: [
      { id: "2-1", title: "Creating Your Athlete Resume", description: "What coaches want to see and how to present it", duration: "14 min" },
      { id: "2-2", title: "Your First Highlight Reel", description: "Equipment, angles, and editing tips for a standout video", duration: "16 min" },
      { id: "2-3", title: "Introduction to Coach Outreach", description: "When, how, and who to contact", duration: "13 min" },
      { id: "2-4", title: "Camps & Showcases Strategy", description: "Which events to attend and how to maximize face time", duration: "10 min" },
    ],
  },
  {
    title: "Module 3: Junior Year — Active Recruiting",
    description: "This is the most critical year. Make every move count.",
    lessons: [
      { id: "3-1", title: "Mastering Coach Communication", description: "Email sequences, phone calls, and building relationships", duration: "15 min" },
      { id: "3-2", title: "Campus Visits Done Right", description: "Official vs. unofficial, what to look for, and questions to ask", duration: "18 min" },
      { id: "3-3", title: "Understanding Scholarship Offers", description: "Types of aid, negotiation basics, and comparing packages", duration: "14 min" },
      { id: "3-4", title: "Narrowing Your List", description: "How to evaluate fit — athletic, academic, social, and financial", duration: "12 min" },
    ],
  },
  {
    title: "Module 4: Senior Year — Commitment & Transition",
    description: "Close out your recruiting journey and prepare for college golf.",
    lessons: [
      { id: "4-1", title: "Making Your Decision", description: "Verbal commitments, NLI signing, and what happens next", duration: "11 min" },
      { id: "4-2", title: "Preparing for College Golf", description: "Physical prep, mental game, and practice planning", duration: "13 min" },
      { id: "4-3", title: "The College Transition", description: "Team dynamics, time management, and thriving as a freshman", duration: "15 min" },
      { id: "4-4", title: "Common Mistakes & How to Avoid Them", description: "Real stories and lessons learned from the recruiting trail", duration: "10 min" },
    ],
  },
];

const RecruitingHuddle = () => {
  const { hasToolkitAccess, loading } = useDigitalProducts();
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasToolkitAccess) return <Navigate to="/shop" replace />;

  const totalLessons = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/shop" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Toolkit
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center">
              <Video className="w-7 h-7 text-purple-700" />
            </div>
            <div>
              <Badge variant="outline" className="mb-1">Video Masterclass</Badge>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                The Recruiting Huddle
              </h1>
            </div>
          </div>

          <p className="text-muted-foreground mb-4">
            A complete video course covering the recruiting timeline from Freshman to Senior year. {totalLessons} lessons across {MODULES.length} modules.
          </p>

          <div className="flex items-center gap-3 mb-8 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>~3.5 hours total runtime</span>
            <span>•</span>
            <span>{totalLessons} lessons</span>
            <span>•</span>
            <span>{MODULES.length} modules</span>
          </div>

          {/* Course Modules */}
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
                      const isActive = activeLesson === lesson.id;
                      const hasVideo = !!lesson.videoUrl;
                      return (
                        <div key={lesson.id}>
                          <button
                            onClick={() => setActiveLesson(isActive ? null : lesson.id)}
                            className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                              isActive ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              {hasVideo ? (
                                <Play className="w-3.5 h-3.5 text-primary" />
                              ) : (
                                <span className="text-xs font-medium text-muted-foreground">{lesIdx + 1}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground">{lesson.title}</p>
                              <p className="text-xs text-muted-foreground">{lesson.description}</p>
                            </div>
                            <span className="text-xs text-muted-foreground flex-shrink-0">{lesson.duration}</span>
                          </button>
                          
                          {isActive && (
                            <div className="mt-2 ml-11 p-4 bg-muted/30 rounded-lg">
                              {hasVideo ? (
                                <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                                  <p className="text-white">Video Player</p>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3 text-muted-foreground">
                                  <Clock className="w-5 h-5" />
                                  <p className="text-sm">Video coming soon — check back for updates!</p>
                                </div>
                              )}
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

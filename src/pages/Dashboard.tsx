import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Target, 
  Video, 
  ClipboardList, 
  Users, 
  FileText, 
  GraduationCap, 
  Calculator, 
  Calendar,
  Database,
  Heart,
  Download,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { pdfGenerators } from '@/lib/pdfTemplates';
import { toast } from '@/hooks/use-toast';
import { ReferralCard } from '@/components/ReferralCard';
import { CoachingProgressSection } from '@/components/dashboard/CoachingProgressSection';
import { WagrTournamentBrowser } from '@/components/dashboard/WagrTournamentBrowser';

const tools = [
  {
    id: 'target-schools',
    icon: Target,
    title: "Target School List Builder",
    description: "Build your personalized college list",
    status: 'available',
    downloadable: true,
    interactive: true,
    path: '/tools/target-schools'
  },
  {
    id: 'video-specs',
    icon: Video,
    title: "Swing Video Shot List",
    description: "Create professional highlight reels",
    status: 'available',
    downloadable: true
  },
  {
    id: 'tournament-log',
    icon: ClipboardList,
    title: "Tournament Result Log",
    description: "Track your competitive results",
    status: 'available',
    downloadable: true,
    interactive: true,
    path: '/tools/tournament-log'
  },
  {
    id: 'coach-tracker',
    icon: Users,
    title: "Coach Contact Tracker",
    description: "Manage coach communications",
    status: 'available',
    downloadable: true,
    interactive: true,
    path: '/tools/coach-tracker'
  },
  {
    id: 'pre-call-prep',
    icon: FileText,
    title: "Pre-Call Question Prep",
    description: "Prepare for coach conversations",
    status: 'available',
    downloadable: true
  },
  {
    id: 'campus-visit',
    icon: GraduationCap,
    title: "Campus Visit Comparison",
    description: "Evaluate and compare visits",
    status: 'available',
    downloadable: true,
    interactive: true,
    path: '/tools/campus-visits'
  },
  {
    id: 'scholarship-calc',
    icon: Calculator,
    title: "Scholarship Offer Calculator",
    description: "Analyze offer values",
    status: 'available',
    downloadable: true,
    interactive: true,
    path: '/tools/scholarship-calculator'
  },
  {
    id: 'timeline',
    icon: Calendar,
    title: "12-Month Recruiting Timeline",
    description: "Stay on track with your timeline",
    status: 'available',
    downloadable: true
  }
];

const Dashboard = () => {
  const { user, loading, hasPaidAccess, profile } = useAuth();
  const [downloadingTool, setDownloadingTool] = useState<string | null>(null);

  const handleDownload = async (toolId: string, toolTitle: string) => {
    setDownloadingTool(toolId);
    try {
      const generator = pdfGenerators[toolId];
      if (generator) {
        generator();
        toast({
          title: "Download Started",
          description: `${toolTitle} PDF has been downloaded.`,
        });
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingTool(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!
            </h1>
            <p className="text-muted-foreground">
              Your recruiting toolkit is ready. Let's make progress today.
            </p>
          </div>

          {/* Coaching Progress - Top of Dashboard */}
          {hasPaidAccess && <CoachingProgressSection />}

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">8</p>
                  <p className="text-sm text-muted-foreground">Tools Available</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">1,500+</p>
                  <p className="text-sm text-muted-foreground">Colleges</p>
                </div>
              </CardContent>
            </Card>
            <Link to="/favorites">
              <Card className="h-full card-hover cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">View</p>
                    <p className="text-sm text-muted-foreground">Saved Schools</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/database">
              <Card className="h-full card-hover cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">Explore</p>
                    <p className="text-sm text-muted-foreground">Database</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Tools Grid */}
          <div className="mb-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Your Recruiting Tools
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tools.map((tool) => (
                <Card 
                  key={tool.id} 
                  className="card-hover group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                        <tool.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <div className="flex gap-1">
                        {'interactive' in tool && tool.interactive && (
                          <Badge variant="default" className="text-xs">
                            Interactive
                          </Badge>
                        )}
                        {tool.downloadable && (
                          <Badge variant="secondary" className="text-xs">
                            <Download className="w-3 h-3 mr-1" />
                            PDF
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-base font-semibold mt-3">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {tool.description}
                    </CardDescription>
                    <div className="flex gap-2 mt-3">
                      {'path' in tool && tool.path && (
                        <Link to={tool.path}>
                          <Button variant="default" size="sm">
                            <ChevronRight className="w-4 h-4 mr-1" />
                            Open Tool
                          </Button>
                        </Link>
                      )}
                      <Button 
                        variant={'path' in tool ? "outline" : "ghost"}
                        size="sm" 
                        className={!('path' in tool) ? "p-0 h-auto text-primary" : ""}
                        onClick={() => handleDownload(tool.id, tool.title)}
                        disabled={downloadingTool === tool.id}
                      >
                        {downloadingTool === tool.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-1" />
                            PDF
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* WAGR Tournament Finder */}
          <div className="mb-8">
            <WagrTournamentBrowser />
          </div>

          {/* Two Column Layout for Progress and Referral */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Progress Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Recruiting Progress</CardTitle>
                <CardDescription>Track your journey through the recruiting process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Profile Completion</span>
                    <span className="font-medium text-foreground">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Schools Researched</span>
                    <span className="font-medium text-foreground">0 / 20</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Coach Contacts Made</span>
                    <span className="font-medium text-foreground">0 / 10</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Referral Card */}
            <ReferralCard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

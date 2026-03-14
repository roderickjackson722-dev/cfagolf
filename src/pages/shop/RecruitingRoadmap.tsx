import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useDigitalProducts } from '@/hooks/useDigitalProducts';
import { useToolkitFileUrl } from '@/hooks/useToolkitFileUrl';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, CheckCircle, ArrowLeft, Loader2, FileDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateRecruitingRoadmapPDF } from '@/lib/pdfTemplates';

const ROADMAP_SECTIONS = [
  {
    title: "Phase 1: Self-Assessment & Research",
    items: [
      "Evaluate your current skill level honestly (handicap, scoring average, tournament results)",
      "Research NCAA divisions and understand the differences (D1, D2, D3, NAIA, JUCO)",
      "Create a list of 20-30 potential schools based on academics, location, and golf program strength",
      "Understand NCAA eligibility requirements and the Eligibility Center registration process",
    ],
  },
  {
    title: "Phase 2: Build Your Recruiting Profile",
    items: [
      "Create a comprehensive athlete resume (use the included template)",
      "Film and edit a highlight reel showcasing your swing, short game, and on-course management",
      "Set up a recruiting profile on platforms coaches actually use",
      "Gather your academic transcripts, test scores, and letters of recommendation",
    ],
  },
  {
    title: "Phase 3: Coach Outreach Strategy",
    items: [
      "Draft personalized emails to coaches (use the included 15 email templates)",
      "Follow up strategically — timing matters more than frequency",
      "Attend college camps and showcases to get face time with coaches",
      "Leverage your high school or club coach for introductions",
    ],
  },
  {
    title: "Phase 4: Campus Visits & Evaluation",
    items: [
      "Schedule unofficial and official visits to your top schools",
      "Prepare questions to ask coaches, players, and academic advisors",
      "Evaluate team culture, facilities, practice schedules, and academic support",
      "Compare financial aid packages and scholarship offers",
    ],
  },
  {
    title: "Phase 5: Decision & Commitment",
    items: [
      "Narrow your list to 3-5 serious contenders",
      "Negotiate scholarship offers and understand the full cost of attendance",
      "Make your verbal commitment and sign your National Letter of Intent",
      "Prepare for the transition to college golf with a training plan",
    ],
  },
];

const RecruitingRoadmap = () => {
  const { hasToolkitAccess, loading } = useDigitalProducts();
  const fileUrl = useToolkitFileUrl('roadmap');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasToolkitAccess) return <Navigate to="/shop" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/shop" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Toolkit
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FileText className="w-7 h-7 text-emerald-700" />
            </div>
            <div>
              <Badge variant="outline" className="mb-1">PDF Guide</Badge>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                The Recruiting Roadmap
              </h1>
            </div>
          </div>

          <p className="text-muted-foreground mb-4">
            Your complete step-by-step guide to navigating the college golf recruiting process from start to finish.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {fileUrl && (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <Button className="cfa-gradient hover:opacity-90">
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
              </a>
            )}
            <Button variant="outline" onClick={() => generateRecruitingRoadmapPDF()}>
              <FileDown className="w-4 h-4 mr-2" /> Save as PDF
            </Button>
          </div>

          <div className="space-y-6">
            {ROADMAP_SECTIONS.map((section, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-sm text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
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

export default RecruitingRoadmap;

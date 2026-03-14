import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useDigitalProducts } from '@/hooks/useDigitalProducts';
import { useToolkitFileUrl } from '@/hooks/useToolkitFileUrl';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserCircle, ArrowLeft, Loader2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const AthleteResume = () => {
  const { hasToolkitAccess, loading } = useDigitalProducts();
  const fileUrl = useToolkitFileUrl('resume');

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
            <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center">
              <UserCircle className="w-7 h-7 text-amber-700" />
            </div>
            <div>
              <Badge variant="outline" className="mb-1">Resume Template</Badge>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                The Athlete Resume Template
              </h1>
            </div>
          </div>

          <p className="text-muted-foreground mb-4">
            Follow this structure to create a professional athlete resume that college golf coaches want to see. Fill in each section with your information.
          </p>

          {fileUrl && (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="inline-block mb-8">
              <Button className="cfa-gradient hover:opacity-90">
                <Download className="w-4 h-4 mr-2" /> Download Template
              </Button>
            </a>
          )}
          </p>

          {/* Resume Template */}
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6 md:p-10">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">[YOUR FULL NAME]</h2>
                <p className="text-muted-foreground">Class of [Graduation Year]</p>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                  <span>[City, State]</span>
                  <span>•</span>
                  <span>[Phone Number]</span>
                  <span>•</span>
                  <span>[Email Address]</span>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Personal Info */}
              <section className="mb-6">
                <h3 className="font-bold text-foreground text-lg border-b border-border pb-1 mb-3">PERSONAL INFORMATION</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Date of Birth:</span> [MM/DD/YYYY]</div>
                  <div><span className="font-medium">Height:</span> [X'X"]</div>
                  <div><span className="font-medium">Weight:</span> [XXX lbs]</div>
                  <div><span className="font-medium">Dominant Hand:</span> [Right/Left]</div>
                  <div><span className="font-medium">High School:</span> [School Name]</div>
                  <div><span className="font-medium">Club/Travel Team:</span> [Team Name]</div>
                </div>
              </section>

              {/* Academic */}
              <section className="mb-6">
                <h3 className="font-bold text-foreground text-lg border-b border-border pb-1 mb-3">ACADEMIC PROFILE</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">GPA:</span> [X.XX] (Weighted/Unweighted)</div>
                  <div><span className="font-medium">SAT:</span> [Score] | <span className="font-medium">ACT:</span> [Score]</div>
                  <div className="col-span-2"><span className="font-medium">Intended Major:</span> [Major]</div>
                  <div className="col-span-2"><span className="font-medium">Honors/AP Courses:</span> [List courses]</div>
                </div>
              </section>

              {/* Golf Stats */}
              <section className="mb-6">
                <h3 className="font-bold text-foreground text-lg border-b border-border pb-1 mb-3">GOLF STATISTICS</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Current Handicap:</span> [X.X]</div>
                  <div><span className="font-medium">18-Hole Avg:</span> [XX.X]</div>
                  <div><span className="font-medium">Low 18:</span> [Score]</div>
                  <div><span className="font-medium">Low 9:</span> [Score]</div>
                  <div><span className="font-medium">Avg. Driving Distance:</span> [XXX yds]</div>
                  <div><span className="font-medium">Avg. Putts/Round:</span> [XX]</div>
                </div>
              </section>

              {/* Tournament Results */}
              <section className="mb-6">
                <h3 className="font-bold text-foreground text-lg border-b border-border pb-1 mb-3">NOTABLE TOURNAMENT RESULTS</h3>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-[1fr_auto_auto] gap-4 font-medium text-muted-foreground border-b border-border/50 pb-1">
                    <span>Tournament</span>
                    <span>Score</span>
                    <span>Finish</span>
                  </div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-4 text-foreground">
                      <span>[Tournament Name — Date]</span>
                      <span>[Score]</span>
                      <span>[T-Xth / XXX players]</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Achievements */}
              <section className="mb-6">
                <h3 className="font-bold text-foreground text-lg border-b border-border pb-1 mb-3">AWARDS & ACHIEVEMENTS</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>[All-Region / All-State / All-Conference honors]</li>
                  <li>[Junior Tour rankings or titles]</li>
                  <li>[Academic awards: Honor Roll, NHS, etc.]</li>
                  <li>[Community service or leadership roles]</li>
                </ul>
              </section>

              {/* References */}
              <section>
                <h3 className="font-bold text-foreground text-lg border-b border-border pb-1 mb-3">REFERENCES</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">[Coach/Instructor Name]</p>
                    <p className="text-muted-foreground">[Title] — [Organization] | [Phone] | [Email]</p>
                  </div>
                  <div>
                    <p className="font-medium">[Teacher/Counselor Name]</p>
                    <p className="text-muted-foreground">[Title] — [School] | [Phone] | [Email]</p>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>

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

export default AthleteResume;

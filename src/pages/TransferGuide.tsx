import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ChevronLeft, BookOpen, AlertTriangle, Calendar, GraduationCap, ClipboardList, Building, MessageSquare, ExternalLink, HelpCircle, CheckSquare } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useWorksheetData } from '@/hooks/useWorksheetData';
import { PaywallGate } from '@/components/PaywallGate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

const CHECKLIST_ITEMS = [
  "Confirm transfer window dates for your sport",
  "Research target schools (academics + athletics)",
  "Talk to current coach about decision",
  "Understand scholarship implications",
  "Prepare written notice for compliance office",
  "Enter portal during correct window",
  "Update recruiting profile and swing video",
  "Prepare questions for coaches",
  "Schedule campus visits",
  "Apply to new school",
  "Verify credit transfer",
  "Complete FAFSA",
  "Confirm eligibility with new school",
];

const FAQ_ITEMS = [
  { q: "Can you talk to coaches before entering the portal?", a: "No. That's tampering and can result in penalties for both the coach and the athlete." },
  { q: "Can your coach see you're in the portal?", a: "Yes. They're notified immediately when you enter." },
  { q: "Can you enter any time?", a: "No. Must enter during sport-specific windows. Golf windows for 2026: Men's May 13–Jun 11, Women's May 6–Jun 4." },
  { q: "Can you play immediately after transferring?", a: "Yes, as of 2026, if you're academically eligible and entered during the official window." },
  { q: "What if you miss the window?", a: "Must wait until the next window — this could significantly affect your recruiting timing." },
  { q: "Can multiple transfers happen?", a: "Yes. The 2026 rule change allows unlimited transfers with immediate eligibility, as long as academic requirements are met." },
];

const TransferGuide = () => {
  const { user, loading, hasPaidAccess } = useAuth();
  const { data: checklistData, updateData: updateChecklist } = useWorksheetData<Record<string, boolean>>('transfer_checklist', {});

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!hasPaidAccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4"><PaywallGate /></div>
        </main>
        <Footer />
      </div>
    );
  }

  const toggleCheckItem = (idx: number) => {
    updateChecklist((prev: Record<string, boolean>) => ({
      ...prev,
      [String(idx)]: !prev[String(idx)],
    }));
  };

  const completedCount = CHECKLIST_ITEMS.filter((_, i) => checklistData[String(i)]).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon"><ChevronLeft className="w-5 h-5" /></Button>
            </Link>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-primary" />
                Transfer Portal Guide
              </h1>
              <p className="text-muted-foreground">Complete reference for NCAA transfer rules, windows, and process</p>
            </div>
          </div>

          <Accordion type="multiple" defaultValue={["portal-overview"]} className="space-y-4">

            {/* PART 1: What is the Transfer Portal */}
            <AccordionItem value="portal-overview" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0 font-mono">1</Badge>
                  <span className="font-semibold text-left">What is the NCAA Transfer Portal?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-3 text-sm text-muted-foreground">
                <p>The NCAA Transfer Portal is an online database where college athletes declare their intent to transfer and become eligible to be contacted by coaches from other schools.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><span className="text-primary">•</span>Launched in 2018 to streamline the transfer process</li>
                  <li className="flex items-start gap-2"><span className="text-primary">•</span>Athletes must enter during specific sport-by-sport windows</li>
                  <li className="flex items-start gap-2"><span className="text-primary">•</span>Once in the portal, coaches from other schools can legally initiate contact</li>
                  <li className="flex items-start gap-2"><span className="text-primary">•</span>Entering the portal does <strong className="text-foreground">not</strong> guarantee a scholarship at another school</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* PART 2: 2026 Rule Changes */}
            <AccordionItem value="rule-changes" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0 font-mono">2</Badge>
                  <span className="font-semibold text-left">2026 Transfer Rule Changes — Immediate Eligibility</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4 text-sm text-muted-foreground">
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="pt-4">
                    <p className="font-semibold text-foreground mb-2">🔹 Major Update (Feb 2026)</p>
                    <p>NCAA athletes are now <strong className="text-foreground">immediately eligible to play</strong> no matter how many times they transfer — as long as they meet academic requirements.</p>
                  </CardContent>
                </Card>
                <div>
                  <p className="font-semibold text-foreground mb-2">Requirements for Immediate Eligibility:</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><span className="text-primary">✓</span>Must be academically eligible at previous school</li>
                    <li className="flex items-start gap-2"><span className="text-primary">✓</span>Not subject to any disciplinary suspension or dismissal</li>
                    <li className="flex items-start gap-2"><span className="text-primary">✓</span>Must meet progress-toward-degree requirements</li>
                  </ul>
                </div>
                <p><strong className="text-foreground">Transfer windows still apply</strong> for undergraduate athletes. Graduate students can already transfer multiple times and enter outside windows while maintaining immediate eligibility.</p>
              </AccordionContent>
            </AccordionItem>

            {/* PART 3: Transfer Windows */}
            <AccordionItem value="windows" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0 font-mono">3</Badge>
                  <span className="font-semibold text-left">2025-2026 Golf Transfer Windows</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4 text-sm">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sport</TableHead>
                        <TableHead>Window Opens</TableHead>
                        <TableHead>Window Closes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Men's Golf</TableCell>
                        <TableCell>May 13, 2026</TableCell>
                        <TableCell>June 11, 2026</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Women's Golf</TableCell>
                        <TableCell>May 6, 2026</TableCell>
                        <TableCell>June 4, 2026</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* PART 4: Special Windows */}
            <AccordionItem value="special-windows" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0 font-mono">4</Badge>
                  <span className="font-semibold text-left">Special Transfer Windows</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground mb-2">Coaching Change Window</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>A 15-day window opens five days after a new head coach is hired or publicly announced</li>
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>If no coach is announced within 30 days of departure, a 15-day window opens</li>
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>Only available after the regular transfer window opens through January 2</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Playoff/Championship Extensions</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>Football: Players on CFP national championship teams get an additional 5-day window (Jan 20-24, 2026)</li>
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>Basketball: Windows open the day after national championship games</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* PART 5: JUCO Rules */}
            <AccordionItem value="juco" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0 font-mono">5</Badge>
                  <span className="font-semibold text-left">JUCO Transfer Rules</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground mb-2">JUCO → NCAA Division I/II</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>Must determine qualifier, non-qualifier, or academic redshirt status — affects eligibility</li>
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>GPA of <strong className="text-foreground">2.5 or higher</strong> required</li>
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>Must register with the NCAA Eligibility Center</li>
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>Can transfer after one year, but consider academic readiness and financial aid implications</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">JUCO → NAIA</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>No residency requirement (unless previously at a four-year school without competing at JUCO — then need written release)</li>
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>Must register with NAIA Eligibility Center</li>
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>Must have completed 24 semester / 36 quarter hours in last two semesters/three quarters</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">JUCO → JUCO</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>Simpler process — apply with transcripts and ID</li>
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>Check how transfer affects remaining NCAA/NAIA eligibility</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* PART 6: D3 Rules */}
            <AccordionItem value="d3" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0 font-mono">6</Badge>
                  <span className="font-semibold text-left">Division III Transfer Rules</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground mb-2">From another D3:</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><span className="text-primary">1.</span>Complete NCAA DIII Self-Release Form and send to new school's AD/compliance, OR</li>
                    <li className="flex items-start gap-2"><span className="text-primary">2.</span>Complete Notification of Transfer and have name added to portal</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">From D1 or D2:</p>
                  <p>Complete Notification of Transfer and have name added to portal by current compliance officer</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">From NAIA:</p>
                  <p>Request permission-to-contact letter from athletic department and send to new school</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">From JUCO:</p>
                  <p>Contact head coach directly — no formal documentation required before contact</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* PART 7: Step-by-Step Process */}
            <AccordionItem value="process" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="shrink-0 font-mono">7</Badge>
                  <span className="font-semibold text-left">Step-by-Step Transfer Process</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-5 text-sm text-muted-foreground">
                {/* Step 1 */}
                <div>
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2"><Badge className="bg-primary/10 text-primary">Step 1</Badge> Decision & Research</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><span className="text-primary">✅</span>Be absolutely certain about transferring</li>
                    <li className="flex items-start gap-2"><span className="text-primary">✅</span>Research potential schools academically and athletically</li>
                    <li className="flex items-start gap-2"><span className="text-primary">✅</span>Understand that your current scholarship may not be guaranteed if you return</li>
                  </ul>
                </div>
                {/* Step 2 */}
                <div>
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2"><Badge className="bg-primary/10 text-primary">Step 2</Badge> Talk to Your Current Coach</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><span className="text-primary">✅</span>Have an honest conversation before entering the portal — your scholarship/roster spot could be affected immediately</li>
                    <li className="flex items-start gap-2"><span className="text-primary">✅</span>Understand your school's policies on scholarship retention</li>
                  </ul>
                </div>
                {/* Step 3 */}
                <div>
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2"><Badge className="bg-primary/10 text-primary">Step 3</Badge> Enter the Transfer Portal</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><span className="text-primary">✅</span>Provide written notice to your college's designated administrator (compliance office or coach)</li>
                    <li className="flex items-start gap-2"><span className="text-primary">✅</span>Your school has 48 hours to enter your name into the portal</li>
                    <li className="flex items-start gap-2"><span className="text-primary">✅</span>Once listed, coaches from other schools can legally contact you</li>
                  </ul>
                </div>
                {/* Step 4 */}
                <div>
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2"><Badge className="bg-primary/10 text-primary">Step 4</Badge> Communication with New Coaches</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><span className="text-primary">✅</span>Once in portal, you can be contacted by and reach out to other coaches</li>
                  </ul>
                  <Card className="mt-2 border-destructive/30 bg-destructive/5">
                    <CardContent className="pt-3 pb-3 text-xs">
                      <p className="text-destructive font-medium">⚠️ Coaches cannot discuss transfer opportunities with athletes not in the portal — tampering violations can result.</p>
                    </CardContent>
                  </Card>
                </div>
                {/* Step 5 */}
                <div>
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2"><Badge className="bg-primary/10 text-primary">Step 5</Badge> Ask the Right Questions</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <p className="font-medium text-foreground text-xs mb-1">Academics</p>
                      <ul className="space-y-1 text-xs">
                        <li>• What GPA is required for transfer students?</li>
                        <li>• How do credits transfer?</li>
                        <li>• Can I balance a difficult major with team responsibilities?</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-xs mb-1">Athletics</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Where do you see me fitting on the team?</li>
                        <li>• What are offseason expectations?</li>
                        <li>• How can my experience help the team?</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-xs mb-1">Team Culture</p>
                      <ul className="space-y-1 text-xs">
                        <li>• What does your team do outside of sports?</li>
                        <li>• Have transfer students faced challenges fitting in?</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-xs mb-1">Financial Aid</p>
                      <ul className="space-y-1 text-xs">
                        <li>• What does it take to earn a scholarship?</li>
                        <li>• What happens if I'm injured?</li>
                        <li>• Are work-study jobs available?</li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* Step 6 */}
                <div>
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2"><Badge className="bg-primary/10 text-primary">Step 6</Badge> Campus Visit</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><span className="text-primary">✅</span>Connect with coaching staff to find a good visit date</li>
                    <li className="flex items-start gap-2"><span className="text-primary">✅</span>Visit before making a final decision</li>
                    <li className="flex items-start gap-2"><span className="text-primary">✅</span>Use visit to confirm fit</li>
                  </ul>
                </div>
                {/* Step 7 */}
                <div>
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2"><Badge className="bg-primary/10 text-primary">Step 7</Badge> Apply & Enroll</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><span className="text-primary">✅</span>Submit transfer application</li>
                    <li className="flex items-start gap-2"><span className="text-primary">✅</span>Request official transcript from current institution</li>
                    <li className="flex items-start gap-2"><span className="text-primary">✅</span>Complete FAFSA</li>
                    <li className="flex items-start gap-2"><span className="text-primary">✅</span>Send any required transfer documents</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* PART 8: Critical Warnings */}
            <AccordionItem value="warnings" className="border rounded-lg border-destructive/30 px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                  <span className="font-semibold text-left">Critical Rules & Warnings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4 text-sm text-muted-foreground">
                <Card className="border-destructive/30 bg-destructive/5">
                  <CardContent className="pt-4 space-y-4">
                    <div>
                      <p className="font-semibold text-foreground mb-1">⚠️ Entering the Portal is a One-Way Street</p>
                      <ul className="space-y-1">
                        <li>• Your current school is not obligated to keep your scholarship or roster spot</li>
                        <li>• Your coach can see immediately that you've entered</li>
                        <li>• If you decide to stay, your scholarship could be at risk</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">⚠️ Mid-Year Transfer Restrictions</p>
                      <p>Basketball: Midyear transfers are not eligible to play at a second school if they enrolled at an NCAA school during the first academic term — regardless of whether they competed</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">⚠️ Graduate Transfer Changes</p>
                      <p>Graduate transfers are now subject to the same January 2-16 window as other athletes (previously could enter anytime)</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">⚠️ What If You Don't Get Picked Up?</p>
                      <p>You can return to your current school, but they are not obligated to keep your scholarship or roster spot</p>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/tools/transfer-portal">
              <Button variant="outline" className="rounded-full">Transfer Portal Tracker →</Button>
            </Link>
            <Link to="/tools/campus-visits">
              <Button variant="outline" className="rounded-full">Campus Visits →</Button>
            </Link>
            <Link to="/tools/scholarship-calculator">
              <Button variant="outline" className="rounded-full">Scholarship Calculator →</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TransferGuide;

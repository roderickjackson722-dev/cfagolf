import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { useWorksheetData } from '@/hooks/useWorksheetData';

interface ScheduleDay {
  day: string;
  practiceTime: string;
  studyWindow1: string;
  studyWindow2: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
  targetDate: string;
  notes: string;
}

interface ScoreEntry {
  testDate: string;
  testType: string;
  readingWriting: string;
  math: string;
  composite: string;
  superscore: string;
}

interface ResourceEntry {
  resource: string;
  cost: string;
  startDate: string;
  completionDate: string;
  notes: string;
}

interface TestPrepData {
  studentName: string;
  graduationYear: string;
  targetSATDate: string;
  targetACTDate: string;
  schedule: ScheduleDay[];
  checklist: ChecklistItem[];
  scores: ScoreEntry[];
  resources: ResourceEntry[];
  notes: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DEFAULT_DATA: TestPrepData = {
  studentName: '',
  graduationYear: '',
  targetSATDate: '',
  targetACTDate: '',
  schedule: DAYS.map(day => ({ day, practiceTime: '', studyWindow1: '', studyWindow2: '' })),
  checklist: [
    { id: 'c1', text: 'Take a full diagnostic test (timed)', done: false, targetDate: '', notes: '' },
    { id: 'c2', text: 'Set target score based on college requirements', done: false, targetDate: '', notes: '' },
    { id: 'c3', text: 'Create weekly study schedule using template', done: false, targetDate: '', notes: '' },
    { id: 'c4', text: 'Register for first test', done: false, targetDate: '', notes: '' },
    { id: 'c5', text: 'Complete first round of content review', done: false, targetDate: '', notes: '' },
    { id: 'c6', text: 'Take first full practice test', done: false, targetDate: '', notes: '' },
    { id: 'c7', text: 'Review mistakes and adjust study plan', done: false, targetDate: '', notes: '' },
    { id: 'c8', text: 'Take second full practice test', done: false, targetDate: '', notes: '' },
    { id: 'c9', text: 'Register for second test date (if needed)', done: false, targetDate: '', notes: '' },
    { id: 'c10', text: 'Final review and test-day preparation', done: false, targetDate: '', notes: '' },
    { id: 'c11', text: 'Send scores to colleges/NCAA (if required)', done: false, targetDate: '', notes: '' },
  ],
  scores: Array.from({ length: 4 }, () => ({ testDate: '', testType: '', readingWriting: '', math: '', composite: '', superscore: '' })),
  resources: [
    { resource: 'Khan Academy SAT Prep', cost: 'FREE', startDate: '', completionDate: '', notes: '' },
    { resource: 'Official Practice Tests', cost: 'FREE', startDate: '', completionDate: '', notes: '' },
    { resource: '', cost: '', startDate: '', completionDate: '', notes: '' },
    { resource: '', cost: '', startDate: '', completionDate: '', notes: '' },
  ],
  notes: '',
};

export function TestPrepWorksheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data, updateData: setData } = useWorksheetData<TestPrepData>('test-prep-worksheet', DEFAULT_DATA);

  const updateField = <K extends keyof TestPrepData>(key: K, value: TestPrepData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const completedChecklist = data.checklist.filter(c => c.done).length;

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const pw = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Test Prep Resource List', pw / 2, y, { align: 'center' });
    y += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('College Fairway Advisors', pw / 2, y, { align: 'center' });
    y += 10;

    doc.text(`Student: ${data.studentName}   Grad Year: ${data.graduationYear}`, 14, y);
    y += 5;
    doc.text(`Target SAT: ${data.targetSATDate}   Target ACT: ${data.targetACTDate}`, 14, y);
    y += 10;

    // Study Schedule
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Weekly Study Schedule', 14, y);
    y += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    data.schedule.forEach(day => {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(`${day.day}: Practice ${day.practiceTime || '___'} | Study 1: ${day.studyWindow1 || '___'} | Study 2: ${day.studyWindow2 || '___'}`, 18, y);
      y += 4;
    });
    y += 5;

    // Checklist
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Test Prep Checklist', 14, y);
    y += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    data.checklist.forEach(item => {
      if (y > 275) { doc.addPage(); y = 20; }
      const check = item.done ? '☑' : '☐';
      const dateStr = item.targetDate ? ` [${item.targetDate}]` : '';
      doc.text(`${check} ${item.text}${dateStr}`, 18, y);
      y += 4;
    });
    y += 5;

    // Scores
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Score Tracker', 14, y);
    y += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    data.scores.forEach(s => {
      if (!s.testDate && !s.composite) return;
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(`${s.testDate} | ${s.testType} | R/W: ${s.readingWriting} | Math: ${s.math} | Composite: ${s.composite} | Super: ${s.superscore}`, 18, y);
      y += 4;
    });

    doc.save('CFA-Test-Prep-Resource-List.pdf');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">Test Prep Resource List</DialogTitle>
            <Button size="sm" variant="outline" onClick={downloadPDF} className="gap-1.5">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {completedChecklist}/{data.checklist.length} checklist items complete
          </p>
        </DialogHeader>
        <ScrollArea className="h-[70vh] px-6 pb-6">
          <div className="space-y-6">
            {/* Student Info */}
            <div className="rounded-lg border p-4 bg-muted/30 space-y-3">
              <h3 className="font-bold text-sm">Student Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Student Name</label><Input value={data.studentName} onChange={e => updateField('studentName', e.target.value)} className="h-8 text-sm" /></div>
                <div><label className="text-xs text-muted-foreground">Graduation Year</label><Input value={data.graduationYear} onChange={e => updateField('graduationYear', e.target.value)} className="h-8 text-sm" /></div>
                <div><label className="text-xs text-muted-foreground">Target SAT Date</label><Input value={data.targetSATDate} onChange={e => updateField('targetSATDate', e.target.value)} className="h-8 text-sm" /></div>
                <div><label className="text-xs text-muted-foreground">Target ACT Date</label><Input value={data.targetACTDate} onChange={e => updateField('targetACTDate', e.target.value)} className="h-8 text-sm" /></div>
              </div>
            </div>

            {/* NCAA Update */}
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <h4 className="font-semibold text-sm mb-1">⚠️ Important NCAA Update</h4>
              <p className="text-xs text-muted-foreground">As of January 2023, NCAA D1 and D2 no longer require SAT/ACT for initial eligibility. However, many colleges still require scores for admission and academic scholarships.</p>
            </div>

            {/* Athlete's Approach */}
            <div className="rounded-lg border p-4">
              <h3 className="font-bold text-sm mb-2">The Athlete's Approach to Test Prep</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ['Consistent practice', 'Short, regular study sessions beat cramming'],
                  ['Film review', 'Review mistakes after every practice set'],
                  ['Skill drills', 'Focus on weak areas, not what you already know'],
                  ['Game simulation', 'Take full-length, timed practice tests'],
                  ['Recovery', 'Rest and sleep are essential for retention'],
                ].map(([principle, app], i) => (
                  <div key={i} className="flex gap-2">
                    <span className="font-medium text-primary whitespace-nowrap">{principle}:</span>
                    <span className="text-muted-foreground">{app}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Free Resources */}
            <div className="rounded-lg border p-4">
              <h3 className="font-bold text-sm mb-2">Free Official Resources</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span>Official SAT Practice</span><a href="https://www.khanacademy.org/sat" target="_blank" className="text-primary underline">khanacademy.org/sat</a></div>
                <div className="flex justify-between"><span>Official ACT Practice</span><a href="https://www.act.org" target="_blank" className="text-primary underline">act.org</a></div>
                <div className="flex justify-between"><span>College Board (SAT)</span><a href="https://www.collegeboard.org" target="_blank" className="text-primary underline">collegeboard.org</a></div>
                <div className="flex justify-between"><span>NCAA Eligibility Center</span><a href="https://www.eligibilitycenter.org" target="_blank" className="text-primary underline">eligibilitycenter.org</a></div>
              </div>
            </div>

            {/* Study Schedule */}
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-bold text-sm">Weekly Study Schedule (Time-Blocking)</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground">
                  <span>Day</span><span>Practice/Game Time</span><span>Study Window 1 (20-30 min)</span><span>Study Window 2 (30-45 min)</span>
                </div>
                {data.schedule.map((day, idx) => (
                  <div key={day.day} className="grid grid-cols-4 gap-2 items-center">
                    <span className="text-sm font-medium">{day.day}</span>
                    <Input value={day.practiceTime} onChange={e => {
                      setData(prev => { const n = structuredClone(prev); n.schedule[idx].practiceTime = e.target.value; return n; });
                    }} placeholder="e.g. 3:30-5:30pm" className="h-7 text-xs" />
                    <Input value={day.studyWindow1} onChange={e => {
                      setData(prev => { const n = structuredClone(prev); n.schedule[idx].studyWindow1 = e.target.value; return n; });
                    }} placeholder="e.g. 6:30-7:00pm" className="h-7 text-xs" />
                    <Input value={day.studyWindow2} onChange={e => {
                      setData(prev => { const n = structuredClone(prev); n.schedule[idx].studyWindow2 = e.target.value; return n; });
                    }} placeholder="e.g. 7:30-8:15pm" className="h-7 text-xs" />
                  </div>
                ))}
              </div>
            </div>

            {/* Energy Framework */}
            <div className="rounded-lg border p-4">
              <h3 className="font-bold text-sm mb-2">Energy-Based Study Framework</h3>
              <div className="space-y-2 text-xs">
                <div className="flex gap-3"><span className="font-medium text-green-600 w-28">High Energy</span><span className="text-muted-foreground">New concepts, complex math, timed sections (45-60 min)</span></div>
                <div className="flex gap-3"><span className="font-medium text-amber-600 w-28">Medium Energy</span><span className="text-muted-foreground">Practice questions, grammar drills, strategy review (30-45 min)</span></div>
                <div className="flex gap-3"><span className="font-medium text-red-600 w-28">Low Energy</span><span className="text-muted-foreground">Flashcards, vocabulary, reviewing mistakes (15-25 min)</span></div>
              </div>
            </div>

            {/* Checklist */}
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-bold text-sm">Test Prep Checklist</h3>
              <div className="space-y-2">
                {data.checklist.map((item, idx) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <Checkbox checked={item.done} onCheckedChange={() => {
                      setData(prev => { const n = structuredClone(prev); n.checklist[idx].done = !n.checklist[idx].done; return n; });
                    }} className="mt-0.5" />
                    <span className={`text-sm flex-1 ${item.done ? 'line-through text-muted-foreground' : ''}`}>{item.text}</span>
                    <Input value={item.targetDate} onChange={e => {
                      setData(prev => { const n = structuredClone(prev); n.checklist[idx].targetDate = e.target.value; return n; });
                    }} placeholder="Target date" className="w-28 h-7 text-xs" />
                  </div>
                ))}
              </div>
            </div>

            {/* Test Day Prep */}
            <div className="rounded-lg border p-4">
              <h3 className="font-bold text-sm mb-2">Test Day Preparation</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-semibold mb-1">The Night Before</p>
                  <ul className="space-y-0.5 text-muted-foreground">
                    <li>• Lay out clothes (layers recommended)</li>
                    <li>• Pack: admission ticket, photo ID, calculator, snacks, water</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">The Morning Of</p>
                  <ul className="space-y-0.5 text-muted-foreground">
                    <li>• Set two alarms, get 8+ hours sleep</li>
                    <li>• Eat protein-rich breakfast</li>
                    <li>• Arrive 30 min early</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">During the Test</p>
                  <ul className="space-y-0.5 text-muted-foreground">
                    <li>• Pace yourself — wear a watch</li>
                    <li>• Answer easier questions first</li>
                    <li>• Breathe and reset between sections</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Resource Tracker */}
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-bold text-sm">Resource Tracker</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground">
                  <span>Resource</span><span>Cost</span><span>Start Date</span><span>Completion</span><span>Notes</span>
                </div>
                {data.resources.map((r, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-2">
                    <Input value={r.resource} onChange={e => {
                      setData(prev => { const n = structuredClone(prev); n.resources[idx].resource = e.target.value; return n; });
                    }} placeholder="Resource" className="h-7 text-xs" />
                    <Input value={r.cost} onChange={e => {
                      setData(prev => { const n = structuredClone(prev); n.resources[idx].cost = e.target.value; return n; });
                    }} placeholder="Cost" className="h-7 text-xs" />
                    <Input value={r.startDate} onChange={e => {
                      setData(prev => { const n = structuredClone(prev); n.resources[idx].startDate = e.target.value; return n; });
                    }} placeholder="Start" className="h-7 text-xs" />
                    <Input value={r.completionDate} onChange={e => {
                      setData(prev => { const n = structuredClone(prev); n.resources[idx].completionDate = e.target.value; return n; });
                    }} placeholder="Complete" className="h-7 text-xs" />
                    <Input value={r.notes} onChange={e => {
                      setData(prev => { const n = structuredClone(prev); n.resources[idx].notes = e.target.value; return n; });
                    }} placeholder="Notes" className="h-7 text-xs" />
                  </div>
                ))}
              </div>
            </div>

            {/* Score Tracker */}
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-bold text-sm">Score Tracker</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground">
                  <span>Test Date</span><span>Test Type</span><span>Reading/Writing</span><span>Math</span><span>Composite</span><span>Superscore</span>
                </div>
                {data.scores.map((s, idx) => (
                  <div key={idx} className="grid grid-cols-6 gap-2">
                    <Input value={s.testDate} onChange={e => {
                      setData(prev => { const n = structuredClone(prev); n.scores[idx].testDate = e.target.value; return n; });
                    }} placeholder="Date" className="h-7 text-xs" />
                    <Input value={s.testType} onChange={e => {
                      setData(prev => { const n = structuredClone(prev); n.scores[idx].testType = e.target.value; return n; });
                    }} placeholder="SAT/ACT" className="h-7 text-xs" />
                    <Input value={s.readingWriting} onChange={e => {
                      setData(prev => { const n = structuredClone(prev); n.scores[idx].readingWriting = e.target.value; return n; });
                    }} placeholder="R/W" className="h-7 text-xs" />
                    <Input value={s.math} onChange={e => {
                      setData(prev => { const n = structuredClone(prev); n.scores[idx].math = e.target.value; return n; });
                    }} placeholder="Math" className="h-7 text-xs" />
                    <Input value={s.composite} onChange={e => {
                      setData(prev => { const n = structuredClone(prev); n.scores[idx].composite = e.target.value; return n; });
                    }} placeholder="Total" className="h-7 text-xs" />
                    <Input value={s.superscore} onChange={e => {
                      setData(prev => { const n = structuredClone(prev); n.scores[idx].superscore = e.target.value; return n; });
                    }} placeholder="Super" className="h-7 text-xs" />
                  </div>
                ))}
              </div>
            </div>

            {/* Expert Tips */}
            <div className="rounded-lg border p-4">
              <h3 className="font-bold text-sm mb-2">Quick Tips from the Experts</h3>
              <div className="space-y-2 text-xs text-muted-foreground italic">
                <p>"Effective test prep isn't about cramming: it's about consistent, incremental effort over time." — Scott Webster, Clayborne Education</p>
                <p>"Use your extracurriculars as test prep fuel—team sports build time management, focus under pressure, and recovery routines that transfer directly to test performance." — Sparkl</p>
                <p>"Taking multiple full-length, realistic practice tests is essential for building stamina and reducing test-day anxiety." — Achievable</p>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-medium text-muted-foreground">Additional Notes</label>
              <Textarea value={data.notes} onChange={e => updateField('notes', e.target.value)} placeholder="Add your notes here..." className="mt-1 text-sm min-h-[60px]" />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

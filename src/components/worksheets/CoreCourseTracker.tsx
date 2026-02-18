import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { useWorksheetData } from '@/hooks/useWorksheetData';

const GRADE_POINTS: Record<string, number> = {
  'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0.0,
};

const SUBJECTS = ['English', 'Math', 'Science', 'Social Science', 'Foreign Language', 'Other Core'];

interface CourseEntry {
  courseName: string;
  subject: string;
  letterGrade: string;
  creditUnits: number;
}

interface VerificationItem {
  text: string;
  done: boolean;
}

interface CoreCourseData {
  studentName: string;
  graduationYear: string;
  highSchool: string;
  ncaaId: string;
  courses: CourseEntry[];
  verification: VerificationItem[];
  counselorSignature: string;
  counselorDate: string;
  studentSignature: string;
  studentDate: string;
  actionPlan: string;
  notes: string;
}

const DEFAULT_DATA: CoreCourseData = {
  studentName: '',
  graduationYear: '',
  highSchool: '',
  ncaaId: '',
  courses: Array.from({ length: 16 }, () => ({
    courseName: '',
    subject: '',
    letterGrade: '',
    creditUnits: 1.0,
  })),
  verification: [
    { text: 'I have confirmed all listed courses are NCAA-approved core courses', done: false },
    { text: 'I have used the correct grade conversion for all courses', done: false },
    { text: 'My counselor has reviewed my core course list', done: false },
  ],
  counselorSignature: '',
  counselorDate: '',
  studentSignature: '',
  studentDate: '',
  actionPlan: '',
  notes: '',
};

export function CoreCourseTracker({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data, updateData: setData } = useWorksheetData<CoreCourseData>('core-course-tracker', DEFAULT_DATA);

  const updateField = <K extends keyof CoreCourseData>(key: K, value: CoreCourseData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const updateCourse = (idx: number, field: keyof CourseEntry, value: string | number) => {
    setData(prev => {
      const next = structuredClone(prev);
      (next.courses[idx] as any)[field] = value;
      return next;
    });
  };

  const { totalQualityPoints, totalUnits, ncaaGPA } = useMemo(() => {
    let qp = 0;
    let units = 0;
    data.courses.forEach(c => {
      if (c.letterGrade && GRADE_POINTS[c.letterGrade] !== undefined) {
        const gp = GRADE_POINTS[c.letterGrade];
        qp += gp * c.creditUnits;
        units += c.creditUnits;
      }
    });
    return { totalQualityPoints: qp, totalUnits: units, ncaaGPA: units > 0 ? (qp / units) : 0 };
  }, [data.courses]);

  const filledCourses = data.courses.filter(c => c.courseName.trim()).length;
  const d1Eligible = ncaaGPA >= 2.3;
  const d2Eligible = ncaaGPA >= 2.2;

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const pw = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('NCAA Core Course Tracker', pw / 2, y, { align: 'center' });
    y += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('College Fairway Advisors', pw / 2, y, { align: 'center' });
    y += 10;

    doc.text(`Student: ${data.studentName}   Grad Year: ${data.graduationYear}`, 14, y);
    y += 5;
    doc.text(`High School: ${data.highSchool}   NCAA ID: ${data.ncaaId}`, 14, y);
    y += 10;

    // Grade conversion chart
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('NCAA Grade Conversion Chart', 14, y);
    y += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    Object.entries(GRADE_POINTS).forEach(([grade, pts]) => {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(`${grade}: ${pts.toFixed(3)}`, 18, y);
      y += 3.5;
    });
    y += 5;

    // Courses
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Core Course GPA Calculator', 14, y);
    y += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    data.courses.forEach((c, i) => {
      if (!c.courseName.trim()) return;
      if (y > 275) { doc.addPage(); y = 20; }
      const gp = GRADE_POINTS[c.letterGrade] ?? 0;
      const quality = gp * c.creditUnits;
      doc.text(`${i + 1}. ${c.courseName} | ${c.subject} | ${c.letterGrade} (${gp.toFixed(1)}) | ${c.creditUnits} units | QP: ${quality.toFixed(1)}`, 18, y);
      y += 4;
    });

    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`NCAA Core GPA: ${ncaaGPA.toFixed(3)}`, 14, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(`D1 Eligible (2.300 min): ${d1Eligible ? 'YES' : 'NO'}   |   D2 Eligible (2.200 min): ${d2Eligible ? 'YES' : 'NO'}`, 14, y);

    if (data.actionPlan) {
      y += 10;
      doc.setFont('helvetica', 'italic');
      doc.text(`Action Plan: ${data.actionPlan}`, 14, y);
    }

    doc.save('CFA-Core-Course-Tracker.pdf');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">NCAA Core Course Tracker</DialogTitle>
            <Button size="sm" variant="outline" onClick={downloadPDF} className="gap-1.5">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {filledCourses}/16 courses entered — NCAA Core GPA: <span className="font-semibold text-foreground">{ncaaGPA.toFixed(3)}</span>
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
                <div><label className="text-xs text-muted-foreground">High School</label><Input value={data.highSchool} onChange={e => updateField('highSchool', e.target.value)} className="h-8 text-sm" /></div>
                <div><label className="text-xs text-muted-foreground">NCAA ID</label><Input value={data.ncaaId} onChange={e => updateField('ncaaId', e.target.value)} className="h-8 text-sm" /></div>
              </div>
            </div>

            {/* Grade Conversion Chart */}
            <div className="rounded-lg border p-4">
              <h3 className="font-bold text-sm mb-2">NCAA Grade Conversion Chart</h3>
              <div className="grid grid-cols-4 gap-x-4 gap-y-1 text-xs">
                {Object.entries(GRADE_POINTS).map(([grade, pts]) => (
                  <div key={grade} className="flex justify-between">
                    <span className="text-muted-foreground">{grade}</span>
                    <span className="font-medium">{pts.toFixed(3)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground space-y-0.5">
                <p>• Only approved core courses count toward NCAA GPA</p>
                <p>• Weighted grades are NOT used — only unweighted grades</p>
                <p>• Retaking a course: the higher grade may count</p>
              </div>
            </div>

            {/* Courses */}
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-bold text-sm">Core Course GPA Calculator</h3>
              <div className="space-y-2">
                {data.courses.map((c, idx) => {
                  const gp = GRADE_POINTS[c.letterGrade] ?? 0;
                  const quality = gp * c.creditUnits;
                  return (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <span className="text-xs text-muted-foreground col-span-1">#{idx + 1}</span>
                      <Input value={c.courseName} onChange={e => updateCourse(idx, 'courseName', e.target.value)} placeholder="Course name" className="h-7 text-xs col-span-3" />
                      <Select value={c.subject} onValueChange={v => updateCourse(idx, 'subject', v)}>
                        <SelectTrigger className="h-7 text-xs col-span-2"><SelectValue placeholder="Subject" /></SelectTrigger>
                        <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                      <Select value={c.letterGrade} onValueChange={v => updateCourse(idx, 'letterGrade', v)}>
                        <SelectTrigger className="h-7 text-xs col-span-2"><SelectValue placeholder="Grade" /></SelectTrigger>
                        <SelectContent>{Object.keys(GRADE_POINTS).map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                      </Select>
                      <span className="text-xs text-muted-foreground col-span-1 text-center">{gp.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground col-span-1 text-center">1.0</span>
                      <span className="text-xs font-medium col-span-2 text-center">{c.letterGrade ? quality.toFixed(1) : '—'}</span>
                    </div>
                  );
                })}
              </div>

              {/* GPA Calculation */}
              <div className="border-t pt-3 mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Quality Points:</span>
                  <span className="font-semibold">{totalQualityPoints.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Core Units:</span>
                  <span className="font-semibold">{totalUnits.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t pt-2">
                  <span>YOUR NCAA CORE GPA:</span>
                  <span className={ncaaGPA >= 2.3 ? 'text-green-600' : ncaaGPA >= 2.2 ? 'text-amber-600' : 'text-red-600'}>{ncaaGPA.toFixed(3)}</span>
                </div>
              </div>

              {/* Eligibility Check */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className={`rounded-lg border p-3 text-center ${d1Eligible ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  <p className="text-xs text-muted-foreground">NCAA Division I (min 2.300)</p>
                  <p className={`font-bold text-sm ${d1Eligible ? 'text-green-600' : 'text-red-600'}`}>{d1Eligible ? '✓ ELIGIBLE' : '✗ NOT YET ELIGIBLE'}</p>
                </div>
                <div className={`rounded-lg border p-3 text-center ${d2Eligible ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  <p className="text-xs text-muted-foreground">NCAA Division II (min 2.200)</p>
                  <p className={`font-bold text-sm ${d2Eligible ? 'text-green-600' : 'text-red-600'}`}>{d2Eligible ? '✓ ELIGIBLE' : '✗ NOT YET ELIGIBLE'}</p>
                </div>
              </div>
            </div>

            {/* Verification */}
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-bold text-sm">Course Verification</h3>
              {data.verification.map((v, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Checkbox checked={v.done} onCheckedChange={() => {
                    setData(prev => {
                      const next = structuredClone(prev);
                      next.verification[idx].done = !next.verification[idx].done;
                      return next;
                    });
                  }} />
                  <span className="text-sm">{v.text}</span>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div><label className="text-xs text-muted-foreground">Counselor Signature</label><Input value={data.counselorSignature} onChange={e => updateField('counselorSignature', e.target.value)} className="h-7 text-xs" /></div>
                <div><label className="text-xs text-muted-foreground">Date</label><Input value={data.counselorDate} onChange={e => updateField('counselorDate', e.target.value)} className="h-7 text-xs" /></div>
                <div><label className="text-xs text-muted-foreground">Student Signature</label><Input value={data.studentSignature} onChange={e => updateField('studentSignature', e.target.value)} className="h-7 text-xs" /></div>
                <div><label className="text-xs text-muted-foreground">Date</label><Input value={data.studentDate} onChange={e => updateField('studentDate', e.target.value)} className="h-7 text-xs" /></div>
              </div>
            </div>

            {/* Action Plan */}
            <div className="rounded-lg border p-4 space-y-2">
              <h3 className="font-bold text-sm">Action Plan</h3>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Based on my NCAA Core GPA, I will:</p>
              </div>
              <Select value={data.actionPlan} onValueChange={v => updateField('actionPlan', v)}>
                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select your plan" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="continue">Continue with current academic plan</SelectItem>
                  <SelectItem value="improve">Focus on improving grades in upcoming core courses</SelectItem>
                  <SelectItem value="counselor">Meet with my counselor to discuss academic support</SelectItem>
                </SelectContent>
              </Select>
              <Textarea value={data.notes} onChange={e => updateField('notes', e.target.value)} placeholder="Additional notes..." className="mt-2 text-sm min-h-[60px]" />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

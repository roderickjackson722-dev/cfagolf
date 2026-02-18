import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface TaskItem {
  id: string;
  text: string;
  done: boolean;
  targetDate: string;
  notes: string;
}

interface CoreCourseEntry {
  subject: string;
  courses: string[];
  d1Required: string;
  d2Required: string;
  complete: boolean;
}

interface AmateurismQuestion {
  question: string;
  answer: 'yes' | 'no' | '';
}

interface EligibilityData {
  studentName: string;
  graduationYear: string;
  highSchool: string;
  ncaaId: string;
  targetDivision: string;
  coreCourses: CoreCourseEntry[];
  tenSevenTracker: { courseName: string; subject: string; grade: string; termCompleted: string; meetsTenSeven: boolean }[];
  tenSevenTotalBefore: string;
  tenSevenEMSTotal: string;
  freshmanTasks: TaskItem[];
  sophomoreTasks: TaskItem[];
  juniorTasks: TaskItem[];
  seniorTasks: TaskItem[];
  amateurism: AmateurismQuestion[];
  amateurismDeadlines: { division: string; deadline: string; targetDate: string; done: boolean }[];
  contacts: { label: string; name: string; email: string }[];
  finalStatus: { certReceived: string; academicStatus: string; amateurStatus: string; ncaaIdFinal: string; certDate: string };
  notes: string;
}

const DEFAULT_DATA: EligibilityData = {
  studentName: '',
  graduationYear: '',
  highSchool: '',
  ncaaId: '',
  targetDivision: '',
  coreCourses: [
    { subject: 'English', d1Required: '4 years', d2Required: '3 years', courses: ['', '', '', ''], complete: false },
    { subject: 'Math (Algebra I or higher)', d1Required: '3 years', d2Required: '2 years', courses: ['', '', ''], complete: false },
    { subject: 'Natural/Physical Science', d1Required: '2 years', d2Required: '2 years', courses: ['', ''], complete: false },
    { subject: 'Additional English/Math/Science', d1Required: '1 year', d2Required: '2 years', courses: ['', ''], complete: false },
    { subject: 'Social Science', d1Required: '2 years', d2Required: '2 years', courses: ['', ''], complete: false },
    { subject: 'Additional Core (foreign language, philosophy, etc.)', d1Required: '4 years', d2Required: '5 years', courses: ['', '', '', '', ''], complete: false },
  ],
  tenSevenTracker: Array.from({ length: 10 }, () => ({ courseName: '', subject: '', grade: '', termCompleted: '', meetsTenSeven: false })),
  tenSevenTotalBefore: '',
  tenSevenEMSTotal: '',
  freshmanTasks: [
    { id: 'f1', text: "Download high school's list of NCAA-approved core courses", done: false, targetDate: '', notes: 'Visit: www.eligibilitycenter.org' },
    { id: 'f2', text: 'Review NCAA core course requirements with counselor', done: false, targetDate: '', notes: '' },
    { id: 'f3', text: 'Create a free NCAA Profile Page account', done: false, targetDate: '', notes: '' },
    { id: 'f4', text: 'Confirm taking at least one approved core course in English, Math, Science, and Social Studies', done: false, targetDate: '', notes: '' },
  ],
  sophomoreTasks: [
    { id: 's1', text: 'Review transcript with counselor to ensure on track for 16 core courses', done: false, targetDate: '', notes: '' },
    { id: 's2', text: 'Continue taking approved core courses in all required areas', done: false, targetDate: '', notes: '' },
  ],
  juniorTasks: [
    { id: 'j1', text: 'Create NCAA Certification Account ($100 U.S. / $160 international)', done: false, targetDate: '', notes: '' },
    { id: 'j2', text: 'Have counselor send current transcript to NCAA Eligibility Center', done: false, targetDate: '', notes: '' },
    { id: 'j3', text: 'Review transcript using core course calculator with counselor', done: false, targetDate: '', notes: '' },
    { id: 'j4', text: 'Ensure on track to complete 10 core courses by end of junior year (D1)', done: false, targetDate: '', notes: '' },
    { id: 'j5', text: 'Ensure 7 of those 10 courses are in English, Math, or Science (D1)', done: false, targetDate: '', notes: '' },
  ],
  seniorTasks: [
    { id: 'sr1', text: 'Review final core course plan with counselor', done: false, targetDate: '', notes: '' },
    { id: 'sr2', text: 'Confirm all 16 core courses will be completed by graduation', done: false, targetDate: '', notes: '' },
    { id: 'sr3', text: 'OPTIONAL: Retake ACT/SAT if needed for admissions', done: false, targetDate: '', notes: '' },
    { id: 'sr4', text: 'Complete Amateurism Questionnaire in NCAA Certification Account', done: false, targetDate: '', notes: '' },
    { id: 'sr5', text: 'APRIL 1 (or later): Request final Amateurism Certification (Fall enrollment)', done: false, targetDate: '', notes: '' },
    { id: 'sr6', text: 'OCTOBER 1 (or later): Request final Amateurism Certification (Winter/Spring)', done: false, targetDate: '', notes: '' },
    { id: 'sr7', text: 'Have counselor send final transcript with proof of graduation to NCAA', done: false, targetDate: '', notes: '' },
  ],
  amateurism: [
    { question: 'Have you ever signed a contract with a professional team?', answer: '' },
    { question: 'Have you ever received prize money exceeding expenses?', answer: '' },
    { question: 'Have you ever used an agent or advisor?', answer: '' },
    { question: 'Have you ever participated in professional tryouts?', answer: '' },
  ],
  amateurismDeadlines: [
    { division: 'D1/D2 Fall Enrollment', deadline: 'On or after April 1 of senior year', targetDate: '', done: false },
    { division: 'D1/D2 Winter/Spring Enrollment', deadline: 'On or after October 1 of senior year', targetDate: '', done: false },
    { division: 'D3 Only', deadline: 'Before enrollment (amateurism only)', targetDate: '', done: false },
  ],
  contacts: [
    { label: 'My High School Counselor', name: '', email: '' },
    { label: 'My CFA Advisor', name: '', email: '' },
  ],
  finalStatus: { certReceived: '', academicStatus: '', amateurStatus: '', ncaaIdFinal: '', certDate: '' },
  notes: '',
};

const STORAGE_KEY = 'cfa-eligibility-checklist';

function TaskSection({ title, tasks, onToggle, onUpdate }: {
  title: string;
  tasks: TaskItem[];
  onToggle: (idx: number) => void;
  onUpdate: (idx: number, field: 'targetDate' | 'notes', value: string) => void;
}) {
  return (
    <div className="mb-4">
      <h4 className="font-semibold text-sm text-primary mb-2">{title}</h4>
      <div className="space-y-2">
        {tasks.map((task, i) => (
          <div key={task.id} className="flex items-start gap-2">
            <Checkbox checked={task.done} onCheckedChange={() => onToggle(i)} className="mt-0.5" />
            <span className={`text-sm flex-1 ${task.done ? 'line-through text-muted-foreground' : ''}`}>{task.text}</span>
            <Input type="text" placeholder="Target date" value={task.targetDate} onChange={e => onUpdate(i, 'targetDate', e.target.value)} className="w-28 h-7 text-xs" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function EligibilityChecklist({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<EligibilityData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_DATA;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateField = <K extends keyof EligibilityData>(key: K, value: EligibilityData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const updateCoreCourse = (idx: number, courseIdx: number, value: string) => {
    setData(prev => {
      const next = structuredClone(prev);
      next.coreCourses[idx].courses[courseIdx] = value;
      return next;
    });
  };

  const toggleCoreCourseComplete = (idx: number) => {
    setData(prev => {
      const next = structuredClone(prev);
      next.coreCourses[idx].complete = !next.coreCourses[idx].complete;
      return next;
    });
  };

  const updateTenSeven = (idx: number, field: string, value: string | boolean) => {
    setData(prev => {
      const next = structuredClone(prev);
      (next.tenSevenTracker[idx] as any)[field] = value;
      return next;
    });
  };

  const makeTaskHandlers = (key: 'freshmanTasks' | 'sophomoreTasks' | 'juniorTasks' | 'seniorTasks') => ({
    onToggle: (idx: number) => {
      setData(prev => {
        const next = structuredClone(prev);
        next[key][idx].done = !next[key][idx].done;
        return next;
      });
    },
    onUpdate: (idx: number, field: 'targetDate' | 'notes', value: string) => {
      setData(prev => {
        const next = structuredClone(prev);
        next[key][idx][field] = value;
        return next;
      });
    },
  });

  const completedCoreCourses = data.coreCourses.filter(c => c.complete).length;

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const pw = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('NCAA Eligibility Checklist', pw / 2, y, { align: 'center' });
    y += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('College Fairway Advisors', pw / 2, y, { align: 'center' });
    y += 10;

    doc.setFontSize(10);
    doc.text(`Student: ${data.studentName}   Grad Year: ${data.graduationYear}`, 14, y);
    y += 5;
    doc.text(`High School: ${data.highSchool}   NCAA ID: ${data.ncaaId}   Division: ${data.targetDivision}`, 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Part 1: 16 Core Course Requirement', 14, y);
    y += 7;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    data.coreCourses.forEach(cc => {
      if (y > 265) { doc.addPage(); y = 20; }
      const check = cc.complete ? '☑' : '☐';
      doc.text(`${check} ${cc.subject} (D1: ${cc.d1Required}, D2: ${cc.d2Required})`, 18, y);
      y += 4;
      const filledCourses = cc.courses.filter(c => c.trim());
      if (filledCourses.length) {
        doc.text(`   Courses: ${filledCourses.join(', ')}`, 22, y);
        y += 4;
      }
      y += 2;
    });

    // Timeline tasks
    const taskSections = [
      { title: 'Freshman Year Tasks', tasks: data.freshmanTasks },
      { title: 'Sophomore Year Tasks', tasks: data.sophomoreTasks },
      { title: 'Junior Year Tasks', tasks: data.juniorTasks },
      { title: 'Senior Year Tasks', tasks: data.seniorTasks },
    ];

    taskSections.forEach(section => {
      if (y > 250) { doc.addPage(); y = 20; }
      y += 4;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(section.title, 14, y);
      y += 6;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      section.tasks.forEach(task => {
        if (y > 275) { doc.addPage(); y = 20; }
        const check = task.done ? '☑' : '☐';
        const dateStr = task.targetDate ? ` [${task.targetDate}]` : '';
        const lines = doc.splitTextToSize(`${check} ${task.text}${dateStr}`, pw - 40);
        doc.text(lines, 18, y);
        y += lines.length * 4 + 1;
      });
    });

    // Amateurism
    if (y > 250) { doc.addPage(); y = 20; }
    y += 4;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Amateurism Status', 14, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    data.amateurism.forEach(q => {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(`${q.question}: ${q.answer ? q.answer.toUpperCase() : '___'}`, 18, y);
      y += 5;
    });

    // Final Status
    if (y > 250) { doc.addPage(); y = 20; }
    y += 4;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Final Eligibility Status', 14, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Certification Received: ${data.finalStatus.certReceived || '___'}`, 18, y); y += 5;
    doc.text(`Academic Status: ${data.finalStatus.academicStatus || '___'}`, 18, y); y += 5;
    doc.text(`Amateurism Status: ${data.finalStatus.amateurStatus || '___'}`, 18, y); y += 5;
    doc.text(`NCAA ID: ${data.finalStatus.ncaaIdFinal || '___'}`, 18, y); y += 5;
    doc.text(`Certification Date: ${data.finalStatus.certDate || '___'}`, 18, y);

    doc.save('CFA-NCAA-Eligibility-Checklist.pdf');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">NCAA Eligibility Checklist</DialogTitle>
            <Button size="sm" variant="outline" onClick={downloadPDF} className="gap-1.5">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Track your NCAA eligibility progress across all requirements
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
              <div>
                <label className="text-xs text-muted-foreground">Target Division</label>
                <Select value={data.targetDivision} onValueChange={v => updateField('targetDivision', v)}>
                  <SelectTrigger className="h-8 text-sm w-40"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="D1">D1</SelectItem>
                    <SelectItem value="D2">D2</SelectItem>
                    <SelectItem value="D3">D3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* NCAA Update */}
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <h4 className="font-semibold text-sm mb-1">⚠️ Important NCAA Update</h4>
              <p className="text-xs text-muted-foreground">As of January 2023, NCAA D1 and D2 no longer require SAT/ACT scores for initial eligibility. However, many colleges still require test scores for admission and academic scholarships.</p>
            </div>

            {/* Part 1: Core Courses */}
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-bold text-sm">Part 1: The 16 Core Course Requirement ({completedCoreCourses}/{data.coreCourses.length} areas complete)</h3>
              {data.coreCourses.map((cc, idx) => (
                <div key={idx} className="border rounded-lg p-3 bg-muted/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox checked={cc.complete} onCheckedChange={() => toggleCoreCourseComplete(idx)} />
                    <span className="font-medium text-sm">{cc.subject}</span>
                    <span className="text-xs text-muted-foreground ml-auto">D1: {cc.d1Required} | D2: {cc.d2Required}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 ml-6">
                    {cc.courses.map((course, ci) => (
                      <Input key={ci} value={course} onChange={e => updateCoreCourse(idx, ci, e.target.value)} placeholder={`Course ${ci + 1}`} className="h-7 text-xs" />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Part 2: 10/7 Rule */}
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-bold text-sm">Part 2: The "10/7" Rule (D1 Only)</h3>
              <p className="text-xs text-muted-foreground">Complete 10 of 16 core courses before senior year. 7 must be in English, Math, or Science.</p>
              <div className="space-y-2">
                {data.tenSevenTracker.map((entry, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-2 items-center">
                    <span className="text-xs text-muted-foreground">#{idx + 1}</span>
                    <Input value={entry.courseName} onChange={e => updateTenSeven(idx, 'courseName', e.target.value)} placeholder="Course" className="h-7 text-xs" />
                    <Input value={entry.subject} onChange={e => updateTenSeven(idx, 'subject', e.target.value)} placeholder="Subject" className="h-7 text-xs" />
                    <Input value={entry.grade} onChange={e => updateTenSeven(idx, 'grade', e.target.value)} placeholder="Grade" className="h-7 text-xs" />
                    <Input value={entry.termCompleted} onChange={e => updateTenSeven(idx, 'termCompleted', e.target.value)} placeholder="Term" className="h-7 text-xs" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div><label className="text-xs text-muted-foreground">Total before senior year: ___ / 10</label><Input value={data.tenSevenTotalBefore} onChange={e => updateField('tenSevenTotalBefore', e.target.value)} className="h-7 text-xs w-20" /></div>
                <div><label className="text-xs text-muted-foreground">English/Math/Science in group: ___ / 7</label><Input value={data.tenSevenEMSTotal} onChange={e => updateField('tenSevenEMSTotal', e.target.value)} className="h-7 text-xs w-20" /></div>
              </div>
            </div>

            {/* Part 3: Registration Timeline */}
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-bold text-sm">Part 3: NCAA Registration Timeline</h3>
              <TaskSection title="Freshman Year (9th Grade)" tasks={data.freshmanTasks} {...makeTaskHandlers('freshmanTasks')} />
              <TaskSection title="Sophomore Year (10th Grade)" tasks={data.sophomoreTasks} {...makeTaskHandlers('sophomoreTasks')} />
              <TaskSection title="Junior Year (11th Grade) — CRITICAL YEAR!" tasks={data.juniorTasks} {...makeTaskHandlers('juniorTasks')} />
              <TaskSection title="Senior Year (12th Grade)" tasks={data.seniorTasks} {...makeTaskHandlers('seniorTasks')} />
            </div>

            {/* Part 4: What Counts */}
            <div className="rounded-lg border p-4">
              <h3 className="font-bold text-sm mb-2">Part 4: What Counts as a Core Course?</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-semibold text-green-600 mb-1">✓ YES — These Count</p>
                  <ul className="space-y-0.5 text-muted-foreground">
                    <li>• English 1-4, American Literature, Creative Writing</li>
                    <li>• Algebra 1-3, Geometry, Statistics</li>
                    <li>• Biology, Chemistry, Physics</li>
                    <li>• American History, Civics, Government</li>
                    <li>• Spanish 1-4, French, Latin</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-red-600 mb-1">✗ NO — These Do NOT Count</p>
                  <ul className="space-y-0.5 text-muted-foreground">
                    <li>• Driver Education, Typing</li>
                    <li>• Art, Music, Physical Education</li>
                    <li>• Welding, Vocational Classes</li>
                    <li>• Personal Finance, Consumer Education</li>
                    <li>• Classes labeled "Basic," "Essential," or "Fundamental"</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Part 5: Amateurism */}
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-bold text-sm">Part 5: Amateurism Status</h3>
              {data.amateurism.map((q, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm flex-1">{q.question}</span>
                  <Select value={q.answer} onValueChange={v => {
                    setData(prev => {
                      const next = structuredClone(prev);
                      next.amateurism[idx].answer = v as 'yes' | 'no';
                      return next;
                    });
                  }}>
                    <SelectTrigger className="w-24 h-7 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">YES</SelectItem>
                      <SelectItem value="no">NO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <h4 className="font-semibold text-xs mt-3">Certification Deadlines</h4>
              {data.amateurismDeadlines.map((d, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <Checkbox checked={d.done} onCheckedChange={() => {
                    setData(prev => {
                      const next = structuredClone(prev);
                      next.amateurismDeadlines[idx].done = !next.amateurismDeadlines[idx].done;
                      return next;
                    });
                  }} />
                  <span className="flex-1">{d.division}: {d.deadline}</span>
                  <Input value={d.targetDate} onChange={e => {
                    setData(prev => {
                      const next = structuredClone(prev);
                      next.amateurismDeadlines[idx].targetDate = e.target.value;
                      return next;
                    });
                  }} placeholder="My date" className="w-28 h-7 text-xs" />
                </div>
              ))}
            </div>

            {/* Part 6: Contacts */}
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-bold text-sm">Part 6: Resources & Contacts</h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>NCAA Eligibility Center: <a href="https://www.eligibilitycenter.org" target="_blank" className="text-primary underline">www.eligibilitycenter.org</a></p>
                <p>NCAA Customer Service: 317-917-6222</p>
              </div>
              {data.contacts.map((c, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2">
                  <span className="text-xs text-muted-foreground self-center">{c.label}</span>
                  <Input value={c.name} onChange={e => {
                    setData(prev => { const n = structuredClone(prev); n.contacts[idx].name = e.target.value; return n; });
                  }} placeholder="Name" className="h-7 text-xs" />
                  <Input value={c.email} onChange={e => {
                    setData(prev => { const n = structuredClone(prev); n.contacts[idx].email = e.target.value; return n; });
                  }} placeholder="Email" className="h-7 text-xs" />
                </div>
              ))}
            </div>

            {/* Part 7: Final Status */}
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-bold text-sm">Part 7: Final Eligibility Status</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Certification Received?</label>
                  <Select value={data.finalStatus.certReceived} onValueChange={v => updateField('finalStatus', { ...data.finalStatus, certReceived: v })}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">YES</SelectItem>
                      <SelectItem value="no">NO</SelectItem>
                      <SelectItem value="pending">PENDING</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><label className="text-xs text-muted-foreground">Academic Status</label>
                  <Select value={data.finalStatus.academicStatus} onValueChange={v => updateField('finalStatus', { ...data.finalStatus, academicStatus: v })}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qualifier">Qualifier</SelectItem>
                      <SelectItem value="redshirt">Academic Redshirt</SelectItem>
                      <SelectItem value="non-qualifier">Non-Qualifier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><label className="text-xs text-muted-foreground">Amateurism Status</label>
                  <Select value={data.finalStatus.amateurStatus} onValueChange={v => updateField('finalStatus', { ...data.finalStatus, amateurStatus: v })}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="certified">Certified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><label className="text-xs text-muted-foreground">NCAA ID</label><Input value={data.finalStatus.ncaaIdFinal} onChange={e => updateField('finalStatus', { ...data.finalStatus, ncaaIdFinal: e.target.value })} className="h-7 text-xs" /></div>
                <div><label className="text-xs text-muted-foreground">Certification Date</label><Input value={data.finalStatus.certDate} onChange={e => updateField('finalStatus', { ...data.finalStatus, certDate: e.target.value })} className="h-7 text-xs" /></div>
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

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { useWorksheetData } from '@/hooks/useWorksheetData';

interface TimelineTask {
  id: string;
  text: string;
  done: boolean;
  targetDate: string;
}

interface YearData {
  year: string;
  grade: string;
  color: string;
  seasons: {
    name: string;
    tasks: TimelineTask[];
  }[];
  notes: string;
}

const DEFAULT_DATA: YearData[] = [
  {
    year: 'FRESHMAN YEAR',
    grade: '9th Grade',
    color: 'bg-blue-500/10 border-blue-500/30',
    seasons: [
      {
        name: 'Fall',
        tasks: [
          { id: 'f1-1', text: 'Begin tracking all tournament scores in a spreadsheet', done: false, targetDate: '' },
          { id: 'f1-2', text: 'Create a list of 20-30 colleges of interest (academic focus)', done: false, targetDate: '' },
          { id: 'f1-3', text: 'Open a recruiting profile on Junior Golf Hub or NCSA', done: false, targetDate: '' },
          { id: 'f1-4', text: 'Discuss with parents realistic budget for recruiting travel', done: false, targetDate: '' },
        ],
      },
      {
        name: 'Spring',
        tasks: [
          { id: 'f1-5', text: 'Play in first local/regional junior tournaments', done: false, targetDate: '' },
          { id: 'f1-6', text: 'Record basic swing video (driver, irons, wedge, putter)', done: false, targetDate: '' },
          { id: 'f1-7', text: 'Meet with high school counselor to confirm NCAA core courses', done: false, targetDate: '' },
          { id: 'f1-8', text: 'Begin building academic resume (GPA focus: 3.0+ recommended)', done: false, targetDate: '' },
        ],
      },
      {
        name: 'Summer',
        tasks: [
          { id: 'f1-9', text: 'Compete in 3-5 junior tournaments', done: false, targetDate: '' },
          { id: 'f1-10', text: 'Attend a college golf camp (great for early exposure)', done: false, targetDate: '' },
        ],
      },
    ],
    notes: '',
  },
  {
    year: 'SOPHOMORE YEAR',
    grade: '10th Grade',
    color: 'bg-green-500/10 border-green-500/30',
    seasons: [
      {
        name: 'Fall',
        tasks: [
          { id: 's1-1', text: 'Compile tournament results from freshman year into a resume', done: false, targetDate: '' },
          { id: 's1-2', text: 'Research tournament schedules for higher-visibility events', done: false, targetDate: '' },
          { id: 's1-3', text: 'Create a "target school" list (expand to 40-50 schools)', done: false, targetDate: '' },
          { id: 's1-4', text: 'Follow target coaches on social media', done: false, targetDate: '' },
        ],
      },
      {
        name: 'Winter',
        tasks: [
          { id: 's1-5', text: 'Update swing video with current mechanics', done: false, targetDate: '' },
          { id: 's1-6', text: 'Research academic requirements for target schools', done: false, targetDate: '' },
          { id: 's1-7', text: 'Begin building contact list (coach emails, recruiting coordinators)', done: false, targetDate: '' },
        ],
      },
      {
        name: 'Spring',
        tasks: [
          { id: 's1-8', text: 'Take PSAT (preliminary SAT)', done: false, targetDate: '' },
          { id: 's1-9', text: 'Compete in tournaments; track scoring averages', done: false, targetDate: '' },
          { id: 's1-10', text: 'Update online profile with spring results', done: false, targetDate: '' },
          { id: 's1-11', text: 'Research AJGA, HJGT, or other national tour events for summer', done: false, targetDate: '' },
        ],
      },
      {
        name: 'Summer',
        tasks: [
          { id: 's1-12', text: 'JUNE 15: NCAA D1/D2 CONTACT PERIOD OPENS!', done: false, targetDate: '' },
          { id: 's1-13', text: 'Send introductory emails to coaches at target schools', done: false, targetDate: '' },
          { id: 's1-14', text: 'Compete in 4-6 tournaments (mix of local/regional/national)', done: false, targetDate: '' },
          { id: 's1-15', text: 'Update coaches after each tournament (every 3-4 rounds)', done: false, targetDate: '' },
          { id: 's1-16', text: 'Register for NCAA Eligibility Center (recommended)', done: false, targetDate: '' },
        ],
      },
    ],
    notes: '',
  },
  {
    year: 'JUNIOR YEAR',
    grade: '11th Grade',
    color: 'bg-orange-500/10 border-orange-500/30',
    seasons: [
      {
        name: 'Fall',
        tasks: [
          { id: 'j1-1', text: 'Send fall season tournament schedule to target coaches', done: false, targetDate: '' },
          { id: 'j1-2', text: 'Compete in fall tournaments; log all scores', done: false, targetDate: '' },
          { id: 'j1-3', text: 'Update coaches with results (48 hours after events)', done: false, targetDate: '' },
          { id: 'j1-4', text: 'Narrow target school list to 25-35 realistic fits', done: false, targetDate: '' },
          { id: 'j1-5', text: 'Take official campus tours (unofficial visits)', done: false, targetDate: '' },
        ],
      },
      {
        name: 'Winter',
        tasks: [
          { id: 'j1-6', text: 'Update swing video with launch monitor data if available', done: false, targetDate: '' },
          { id: 'j1-7', text: 'Take SAT/ACT (aim for target school averages)', done: false, targetDate: '' },
          { id: 'j1-8', text: 'Complete NCAA Eligibility Center registration', done: false, targetDate: '' },
          { id: 'j1-9', text: 'Research scholarship opportunities (academic + athletic)', done: false, targetDate: '' },
        ],
      },
      {
        name: 'Spring',
        tasks: [
          { id: 'j1-10', text: 'Update all profiles with latest scores and academics', done: false, targetDate: '' },
          { id: 'j1-11', text: 'Schedule official visits with top target schools', done: false, targetDate: '' },
          { id: 'j1-12', text: 'Compete in high-visibility spring tournaments', done: false, targetDate: '' },
          { id: 'j1-13', text: 'Send monthly updates to coaches', done: false, targetDate: '' },
          { id: 'j1-14', text: 'Continue narrowing school list (15-20 schools)', done: false, targetDate: '' },
        ],
      },
      {
        name: 'Summer',
        tasks: [
          { id: 'j1-15', text: 'Peak tournament season—compete in ranked events', done: false, targetDate: '' },
          { id: 'j1-16', text: 'Update all coaches after each tournament', done: false, targetDate: '' },
          { id: 'j1-17', text: 'Begin receiving verbal offers (if applicable)', done: false, targetDate: '' },
          { id: 'j1-18', text: 'Visit finalist schools (official/unofficial visits)', done: false, targetDate: '' },
          { id: 'j1-19', text: 'Discuss scholarship offers with parents and advisors', done: false, targetDate: '' },
        ],
      },
    ],
    notes: '',
  },
  {
    year: 'SENIOR YEAR',
    grade: '12th Grade',
    color: 'bg-red-500/10 border-red-500/30',
    seasons: [
      {
        name: 'Fall',
        tasks: [
          { id: 'sr1-1', text: 'Finalize target school list (5-10 top choices)', done: false, targetDate: '' },
          { id: 'sr1-2', text: 'Complete all official visits', done: false, targetDate: '' },
          { id: 'sr1-3', text: 'NOVEMBER: EARLY SIGNING PERIOD OPENS', done: false, targetDate: 'Nov 12' },
          { id: 'sr1-4', text: 'Sign National Letter of Intent / Athletic Aid Agreement', done: false, targetDate: '' },
          { id: 'sr1-5', text: 'Announce commitment (with coach permission)', done: false, targetDate: '' },
          { id: 'sr1-6', text: 'Complete all college applications', done: false, targetDate: '' },
        ],
      },
      {
        name: 'Winter',
        tasks: [
          { id: 'sr1-7', text: 'Submit final transcripts to NCAA Eligibility Center', done: false, targetDate: '' },
          { id: 'sr1-8', text: 'Confirm scholarship/financial aid paperwork', done: false, targetDate: '' },
          { id: 'sr1-9', text: 'Connect with future teammates (group chats, etc.)', done: false, targetDate: '' },
          { id: 'sr1-10', text: 'Begin preparing for college golf (fitness, practice plan)', done: false, targetDate: '' },
        ],
      },
      {
        name: 'Spring',
        tasks: [
          { id: 'sr1-11', text: 'Graduate from high school!', done: false, targetDate: '' },
          { id: 'sr1-12', text: 'Finalize enrollment documents', done: false, targetDate: '' },
          { id: 'sr1-13', text: 'AUGUST 1: FINAL SIGNING DEADLINE', done: false, targetDate: 'Aug 1' },
          { id: 'sr1-14', text: 'Move-in and start college golf journey!', done: false, targetDate: '' },
        ],
      },
    ],
    notes: '',
  },
];



export function RecruitingTimelineWorksheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data, updateData, isLoading } = useWorksheetData<YearData[]>('recruiting-timeline', DEFAULT_DATA);

  const toggleTask = (yearIdx: number, seasonIdx: number, taskIdx: number) => {
    updateData(prev => {
      const next = structuredClone(prev);
      next[yearIdx].seasons[seasonIdx].tasks[taskIdx].done = !next[yearIdx].seasons[seasonIdx].tasks[taskIdx].done;
      return next;
    });
  };

  const setTargetDate = (yearIdx: number, seasonIdx: number, taskIdx: number, value: string) => {
    updateData(prev => {
      const next = structuredClone(prev);
      next[yearIdx].seasons[seasonIdx].tasks[taskIdx].targetDate = value;
      return next;
    });
  };

  const setNotes = (yearIdx: number, value: string) => {
    updateData(prev => {
      const next = structuredClone(prev);
      next[yearIdx].notes = value;
      return next;
    });
  };

  const totalTasks = data.reduce((sum, y) => sum + y.seasons.reduce((s, se) => s + se.tasks.length, 0), 0);
  const doneTasks = data.reduce((sum, y) => sum + y.seasons.reduce((s, se) => s + se.tasks.filter(t => t.done).length, 0), 0);

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('College Golf Recruiting Timeline Calendar', pageWidth / 2, y, { align: 'center' });
    y += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('College Fairway Advisors', pageWidth / 2, y, { align: 'center' });
    y += 10;

    data.forEach(yearData => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(`${yearData.year} (${yearData.grade})`, 14, y);
      y += 7;

      yearData.seasons.forEach(season => {
        if (y > 265) { doc.addPage(); y = 20; }
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(season.name, 18, y);
        y += 5;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        season.tasks.forEach(task => {
          if (y > 275) { doc.addPage(); y = 20; }
          const check = task.done ? '☑' : '☐';
          const dateStr = task.targetDate ? ` [${task.targetDate}]` : '';
          const line = `${check} ${task.text}${dateStr}`;
          const lines = doc.splitTextToSize(line, pageWidth - 40);
          doc.text(lines, 22, y);
          y += lines.length * 4 + 1;
        });
        y += 2;
      });

      if (yearData.notes) {
        if (y > 265) { doc.addPage(); y = 20; }
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text(`Notes: ${yearData.notes}`, 18, y);
        y += 8;
      }
      y += 4;
    });

    doc.save('CFA-Recruiting-Timeline-Calendar.pdf');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">Recruiting Timeline Calendar</DialogTitle>
            <Button size="sm" variant="outline" onClick={downloadPDF} className="gap-1.5">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {doneTasks}/{totalTasks} tasks completed — Track your recruiting journey from 9th through 12th grade
          </p>
        </DialogHeader>
        <ScrollArea className="h-[70vh] px-6 pb-6">
          <div className="space-y-6">
            {data.map((yearData, yi) => (
              <div key={yi} className={`rounded-lg border p-4 ${yearData.color}`}>
                <h3 className="font-bold text-base mb-3">
                  {yearData.year} ({yearData.grade})
                </h3>
                {yearData.seasons.map((season, si) => (
                  <div key={si} className="mb-4">
                    <h4 className="font-semibold text-sm text-primary mb-2">{season.name}</h4>
                    <div className="space-y-2">
                      {season.tasks.map((task, ti) => (
                        <div key={task.id} className="flex items-start gap-2">
                          <Checkbox
                            checked={task.done}
                            onCheckedChange={() => toggleTask(yi, si, ti)}
                            className="mt-0.5"
                          />
                          <span className={`text-sm flex-1 ${task.done ? 'line-through text-muted-foreground' : ''}`}>
                            {task.text}
                          </span>
                          <Input
                            type="text"
                            placeholder="Target date"
                            value={task.targetDate}
                            onChange={e => setTargetDate(yi, si, ti, e.target.value)}
                            className="w-28 h-7 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mt-3">
                  <label className="text-xs font-medium text-muted-foreground">{yearData.year} Notes</label>
                  <Textarea
                    placeholder="Add your notes here..."
                    value={yearData.notes}
                    onChange={e => setNotes(yi, e.target.value)}
                    className="mt-1 text-sm min-h-[60px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

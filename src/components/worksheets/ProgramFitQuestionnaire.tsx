import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { useWorksheetData } from '@/hooks/useWorksheetData';

interface Question {
  id: number;
  text: string;
  answer: string;
  rating: number;
}

interface Section {
  title: string;
  weight: string;
  maxScore: number;
  questions: Question[];
  notes: string;
}

interface ReflectionData {
  answers: string[];
  recommendation: string;
  finalNotes: string;
}

const DEFAULT_SECTIONS: Section[] = [
  {
    title: 'PART 1: ACADEMIC FIT',
    weight: '30% of Total Fit Score',
    maxScore: 40,
    notes: '',
    questions: [
      { id: 1, text: 'Does this school offer my intended major or academic program of interest?', answer: '', rating: 0 },
      { id: 2, text: 'What is the average GPA of admitted students? Does my GPA align?', answer: '', rating: 0 },
      { id: 3, text: 'What are the average SAT/ACT scores? Do my scores (or projected scores) align?', answer: '', rating: 0 },
      { id: 4, text: 'What is the student-to-faculty ratio? Do I prefer smaller or larger classes?', answer: '', rating: 0 },
      { id: 5, text: 'What academic support resources are available for student-athletes (tutoring, study halls, academic advisors)?', answer: '', rating: 0 },
      { id: 6, text: 'What is the graduation rate for student-athletes on the golf team?', answer: '', rating: 0 },
      { id: 7, text: 'Are there majors in my field of interest that accommodate practice/competition schedules?', answer: '', rating: 0 },
      { id: 8, text: 'How flexible are professors with travel schedules for tournaments?', answer: '', rating: 0 },
    ],
  },
  {
    title: 'PART 2: GOLF PROGRAM FIT',
    weight: '40% of Total Fit Score',
    maxScore: 60,
    notes: '',
    questions: [
      { id: 9, text: "What is the team's average scoring average? How does my scoring average compare?", answer: '', rating: 0 },
      { id: 10, text: 'Where would my scoring average rank on this team (top 3, top 5, travel squad, developmental)?', answer: '', rating: 0 },
      { id: 11, text: 'What tournaments does the team play in annually? Are they competitive at a level I desire?', answer: '', rating: 0 },
      { id: 12, text: 'What practice facilities are available (course access, practice range, short game area, indoor facilities)?', answer: '', rating: 0 },
      { id: 13, text: "What is the coaching staff's background, philosophy, and coaching style?", answer: '', rating: 0 },
      { id: 14, text: 'How does the coach communicate with players (daily, weekly, player-led, coach-led)?', answer: '', rating: 0 },
      { id: 15, text: "What is the team's practice schedule like (daily hours, morning/afternoon, year-round)?", answer: '', rating: 0 },
      { id: 16, text: 'How many players on the roster? Is the team large or small?', answer: '', rating: 0 },
      { id: 17, text: 'What is the player development philosophy (swing changes, fitness, mental game support)?', answer: '', rating: 0 },
      { id: 18, text: 'Where do players live (on-campus, off-campus, team housing)?', answer: '', rating: 0 },
      { id: 19, text: "What is the team's travel schedule like (how many overnight trips, travel accommodations)?", answer: '', rating: 0 },
      { id: 20, text: 'Does the program have a strength coach or fitness facilities dedicated to golfers?', answer: '', rating: 0 },
    ],
  },
  {
    title: 'PART 3: CAMPUS & CULTURE FIT',
    weight: '20% of Total Fit Score',
    maxScore: 50,
    notes: '',
    questions: [
      { id: 21, text: 'Where is the school located (urban, suburban, rural)? Does that setting appeal to me?', answer: '', rating: 0 },
      { id: 22, text: 'How far is the school from home? Is that distance comfortable for me and my family?', answer: '', rating: 0 },
      { id: 23, text: 'What is the campus size? Do I prefer a small, medium, or large campus?', answer: '', rating: 0 },
      { id: 24, text: 'What is the overall student body vibe (competitive, collaborative, social, studious)?', answer: '', rating: 0 },
      { id: 25, text: 'What is the team culture like (close-knit, individual-focused, social, intense)?', answer: '', rating: 0 },
      { id: 26, text: 'Did I connect well with the current players during my visit or communication?', answer: '', rating: 0 },
      { id: 27, text: 'What social activities are available on campus and in the surrounding community?', answer: '', rating: 0 },
      { id: 28, text: 'What dining options are available? Is nutrition for athletes prioritized?', answer: '', rating: 0 },
      { id: 29, text: 'What is the housing situation for freshmen? For upperclassmen?', answer: '', rating: 0 },
      { id: 30, text: 'Can I see myself being happy here for four years, even on days when golf isn\'t going well?', answer: '', rating: 0 },
    ],
  },
  {
    title: 'PART 4: FINANCIAL FIT',
    weight: '10% of Total Fit Score',
    maxScore: 30,
    notes: '',
    questions: [
      { id: 31, text: 'What is the total annual cost of attendance (tuition, room, board, fees)?', answer: '', rating: 0 },
      { id: 32, text: 'What type of athletic scholarship (if any) is being offered? Percentage?', answer: '', rating: 0 },
      { id: 33, text: 'What academic scholarships might I qualify for based on GPA/test scores?', answer: '', rating: 0 },
      { id: 34, text: 'Are there additional costs for golf (travel, equipment, uniforms) that I must cover?', answer: '', rating: 0 },
      { id: 35, text: 'What financial aid paperwork is required (FAFSA, CSS Profile, deadlines)?', answer: '', rating: 0 },
      { id: 36, text: 'Does the program offer summer school opportunities or housing?', answer: '', rating: 0 },
    ],
  },
];

const REFLECTION_QUESTIONS = [
  'How did I feel when I stepped on campus? (Excited? Nervous? Uncomfortable?)',
  'Did the coach seem genuinely interested in me as both a player and a person?',
  'How did the current team members treat me? Were they welcoming?',
  'Could I imagine myself practicing here every day? Eating in the dining hall? Living in the dorms?',
  'What was my favorite part of the visit?',
  'What was my least favorite part of the visit?',
  'If I received an offer today, would I say yes? Why or why not?',
];

interface ProgramFitData {
  sections: Section[];
  schoolName: string;
  reflection: ReflectionData;
}

const DEFAULT_PF_DATA: ProgramFitData = {
  sections: DEFAULT_SECTIONS,
  schoolName: '',
  reflection: { answers: REFLECTION_QUESTIONS.map(() => ''), recommendation: '', finalNotes: '' },
};

export function ProgramFitQuestionnaire({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: pfData, updateData } = useWorksheetData<ProgramFitData>('program-fit-questionnaire', DEFAULT_PF_DATA);

  const { sections, schoolName, reflection } = pfData;

  const setSections = (updater: (prev: Section[]) => Section[]) => {
    updateData(prev => ({ ...prev, sections: updater(prev.sections) }));
  };
  const setSchoolName = (value: string) => {
    updateData(prev => ({ ...prev, schoolName: value }));
  };
  const setReflection = (updater: ReflectionData | ((prev: ReflectionData) => ReflectionData)) => {
    updateData(prev => ({
      ...prev,
      reflection: typeof updater === 'function' ? updater(prev.reflection) : updater,
    }));
  };

  const updateAnswer = (sectionIdx: number, questionIdx: number, value: string) => {
    setSections(prev => {
      const next = structuredClone(prev);
      next[sectionIdx].questions[questionIdx].answer = value;
      return next;
    });
  };

  const updateRating = (sectionIdx: number, questionIdx: number, value: number) => {
    setSections(prev => {
      const next = structuredClone(prev);
      next[sectionIdx].questions[questionIdx].rating = value;
      return next;
    });
  };

  const updateNotes = (sectionIdx: number, value: string) => {
    setSections(prev => {
      const next = structuredClone(prev);
      next[sectionIdx].notes = value;
      return next;
    });
  };

  const scores = useMemo(() => {
    return sections.map(s => s.questions.reduce((sum, q) => sum + q.rating, 0));
  }, [sections]);

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const maxTotal = 180;

  const getRecommendation = (score: number) => {
    if (score >= 150) return { label: 'ELITE FIT', color: 'text-green-600', desc: 'This program aligns strongly across all categories. Top target school.' };
    if (score >= 120) return { label: 'STRONG FIT', color: 'text-blue-600', desc: 'Solid alignment with some minor areas to explore further. High priority.' };
    if (score >= 90) return { label: 'MODERATE FIT', color: 'text-yellow-600', desc: 'Some good aspects but significant gaps in key areas. Consider carefully.' };
    return { label: 'WEAK FIT', color: 'text-red-600', desc: 'Misalignment in multiple categories. Likely not the right school.' };
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const pw = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Program Fit Questionnaire', pw / 2, y, { align: 'center' });
    y += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('College Fairway Advisors', pw / 2, y, { align: 'center' });
    y += 4;
    if (schoolName) {
      doc.text(`School: ${schoolName}`, pw / 2, y, { align: 'center' });
    }
    y += 10;

    sections.forEach((section, si) => {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${section.title} (${section.weight})`, 14, y);
      y += 7;

      section.questions.forEach(q => {
        if (y > 265) { doc.addPage(); y = 20; }
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        const qLines = doc.splitTextToSize(`${q.id}. ${q.text}`, pw - 30);
        doc.text(qLines, 18, y);
        y += qLines.length * 4;
        doc.setFont('helvetica', 'normal');
        doc.text(`Answer: ${q.answer || '—'}`, 22, y);
        y += 4;
        doc.text(`Rating: ${q.rating}/5`, 22, y);
        y += 5;
      });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${section.title.replace('PART ', '').replace(/^\d+: /, '')} Score: ${scores[si]} / ${section.maxScore}`, 18, y);
      y += 4;
      if (section.notes) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.text(`Notes: ${section.notes}`, 18, y);
        y += 6;
      }
      y += 4;
    });

    // Summary
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SCORING SUMMARY', 14, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const rec = getRecommendation(totalScore);
    doc.text(`Total Fit Score: ${totalScore} / ${maxTotal}`, 18, y); y += 5;
    doc.text(`Recommendation: ${rec.label} — ${rec.desc}`, 18, y); y += 10;

    // Reflections
    if (reflection.answers.some(a => a)) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('POST-VISIT REFLECTION', 14, y);
      y += 7;
      REFLECTION_QUESTIONS.forEach((q, i) => {
        if (y > 265) { doc.addPage(); y = 20; }
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`${i + 1}. ${q}`, 18, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        const aLines = doc.splitTextToSize(reflection.answers[i] || '—', pw - 40);
        doc.text(aLines, 22, y);
        y += aLines.length * 4 + 2;
      });
    }

    doc.save(`CFA-Program-Fit-${schoolName || 'Questionnaire'}.pdf`);
  };

  const rec = getRecommendation(totalScore);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">Program Fit Questionnaire</DialogTitle>
            <Button size="sm" variant="outline" onClick={downloadPDF} className="gap-1.5">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Input
              placeholder="Enter school name..."
              value={schoolName}
              onChange={e => setSchoolName(e.target.value)}
              className="max-w-xs h-8 text-sm"
            />
            <span className={`text-sm font-semibold ${rec.color}`}>
              Score: {totalScore}/{maxTotal} — {rec.label}
            </span>
          </div>
        </DialogHeader>
        <ScrollArea className="h-[68vh] px-6 pb-6">
          <div className="space-y-6">
            {sections.map((section, si) => (
              <div key={si} className="rounded-lg border p-4 bg-muted/20">
                <h3 className="font-bold text-sm mb-1">{section.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{section.weight} · Score: {scores[si]}/{section.maxScore}</p>
                <div className="space-y-4">
                  {section.questions.map((q, qi) => (
                    <div key={q.id} className="space-y-1.5">
                      <label className="text-sm font-medium">
                        {q.id}. {q.text}
                      </label>
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Your answer..."
                          value={q.answer}
                          onChange={e => updateAnswer(si, qi, e.target.value)}
                          className="text-sm min-h-[50px] flex-1"
                        />
                        <div className="w-20 shrink-0">
                          <Select
                            value={q.rating ? String(q.rating) : ''}
                            onValueChange={v => updateRating(si, qi, Number(v))}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Rate" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map(n => (
                                <SelectItem key={n} value={String(n)}>{n}/5</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="text-xs font-medium text-muted-foreground">Section Notes</label>
                  <Textarea
                    placeholder="Add notes..."
                    value={section.notes}
                    onChange={e => updateNotes(si, e.target.value)}
                    className="mt-1 text-sm min-h-[50px]"
                  />
                </div>
              </div>
            ))}

            {/* Reflection Section */}
            <div className="rounded-lg border p-4 bg-muted/20">
              <h3 className="font-bold text-sm mb-3">POST-VISIT REFLECTION QUESTIONS</h3>
              <div className="space-y-3">
                {REFLECTION_QUESTIONS.map((q, i) => (
                  <div key={i} className="space-y-1">
                    <label className="text-sm font-medium">{i + 1}. {q}</label>
                    <Textarea
                      placeholder="Your reflection..."
                      value={reflection.answers[i]}
                      onChange={e => {
                        const next = { ...reflection, answers: [...reflection.answers] };
                        next.answers[i] = e.target.value;
                        setReflection(next);
                      }}
                      className="text-sm min-h-[50px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Final Recommendation */}
            <div className="rounded-lg border p-4 bg-muted/20">
              <h3 className="font-bold text-sm mb-3">FINAL RECOMMENDATION</h3>
              <Select
                value={reflection.recommendation}
                onValueChange={v => setReflection(prev => ({ ...prev, recommendation: v }))}
              >
                <SelectTrigger className="mb-3">
                  <SelectValue placeholder="Select your recommendation..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top-target">☐ Top Target: Excellent fit. Pursue aggressively.</SelectItem>
                  <SelectItem value="strong-candidate">☐ Strong Candidate: Good fit. Continue communication.</SelectItem>
                  <SelectItem value="backup">☐ Backup Option: Acceptable but not ideal.</SelectItem>
                  <SelectItem value="remove">☐ Remove from List: Not the right fit.</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Final notes & rationale..."
                value={reflection.finalNotes}
                onChange={e => setReflection(prev => ({ ...prev, finalNotes: e.target.value }))}
                className="text-sm min-h-[60px]"
              />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

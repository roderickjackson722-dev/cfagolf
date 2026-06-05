import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, Download, Save, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  EMPTY_RESUME,
  ResumeData,
  computeSummary,
  useSaveStudentResume,
  useStudentResume,
} from '@/hooks/useStudentResume';
import { downloadResumePdf } from '@/lib/golfResumePdf';

type Props = {
  studentId: string;
  hideAdminFields?: boolean;
  seed?: Partial<ResumeData>;
};

export default function ResumeEditor({ studentId, hideAdminFields, seed }: Props) {
  const { data: row, isLoading } = useStudentResume(studentId);
  const save = useSaveStudentResume();
  const [r, setR] = useState<ResumeData>(EMPTY_RESUME);

  useEffect(() => {
    if (row?.data) {
      setR({ ...EMPTY_RESUME, ...(row.data as any) });
    } else if (seed) {
      setR({ ...EMPTY_RESUME, ...seed });
    }
  }, [row, seed]);

  // auto-calc summary
  const autoSummary = useMemo(() => computeSummary(r.tournamentResults), [r.tournamentResults]);
  useEffect(() => {
    setR(prev => ({ ...prev, tournamentSummary: autoSummary }));
  }, [autoSummary.totalTournaments, autoSummary.wins, autoSummary.top5Finishes, autoSummary.top10Finishes, autoSummary.avgLast10Scores]);

  const set = <K extends keyof ResumeData>(k: K, v: ResumeData[K]) => setR(p => ({ ...p, [k]: v }));

  const onSave = async () => {
    try {
      await save.mutateAsync({ studentId, data: r });
      toast({ title: 'Resume saved' });
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    }
  };
  const onDownload = () => downloadResumePdf(r);
  const onReset = () => {
    if (confirm('Reset all resume fields?')) setR(EMPTY_RESUME);
  };

  if (isLoading) return <div className="p-4 text-sm text-muted-foreground">Loading resume…</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 sticky top-0 bg-background py-2 z-10 border-b">
        <Button onClick={onSave} disabled={save.isPending}>
          <Save className="w-4 h-4 mr-1" />{save.isPending ? 'Saving…' : 'Save Resume'}
        </Button>
        <Button variant="secondary" onClick={onDownload}>
          <Download className="w-4 h-4 mr-1" />Download PDF
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RefreshCw className="w-4 h-4 mr-1" />Reset
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['header', 'academic', 'athletic', 'results']}>
        <AccordionItem value="header">
          <AccordionTrigger>Header & Contact Info</AccordionTrigger>
          <AccordionContent>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Full Name" value={r.fullName} onChange={v => set('fullName', v)} />
              <Field label="City, State" value={r.cityState} onChange={v => set('cityState', v)} />
              <Field label="Phone" value={r.phone} onChange={v => set('phone', v)} />
              <Field label="Email" value={r.email} onChange={v => set('email', v)} />
              <Field label="Junior Golf Scoreboard Link" value={r.jgsLink} onChange={v => set('jgsLink', v)} className="md:col-span-2" />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="academic">
          <AccordionTrigger>Academic Profile</AccordionTrigger>
          <AccordionContent>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="High School" value={r.highSchool} onChange={v => set('highSchool', v)} />
              <Field label="High School City, State" value={r.highSchoolCityState} onChange={v => set('highSchoolCityState', v)} />
              <Field label="Graduation Year" value={r.graduationYear} onChange={v => set('graduationYear', v)} />
              <Field label="GPA" value={r.gpa} onChange={v => set('gpa', v)} />
              <Field label="SAT" value={r.sat} onChange={v => set('sat', v)} />
              <Field label="ACT" value={r.act} onChange={v => set('act', v)} />
              <Field label="NCAA ID" value={r.ncaaId} onChange={v => set('ncaaId', v)} />
              <Field label="Intended Major" value={r.intendedMajor} onChange={v => set('intendedMajor', v)} />
              <div className="md:col-span-2">
                <Label>AP / Honors Courses</Label>
                <Textarea value={r.apHonorsCourses} onChange={e => set('apHonorsCourses', e.target.value)} rows={2} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="athletic">
          <AccordionTrigger>Athletic Profile</AccordionTrigger>
          <AccordionContent>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Scoring Average (18)" value={r.scoringAverage} onChange={v => set('scoringAverage', v)} />
              <Field label="Scoring Average (9)" value={r.scoringAverage9} onChange={v => set('scoringAverage9', v)} />
              <Field label="Handicap Index" value={r.handicap} onChange={v => set('handicap', v)} />
              <Field label="Driving Distance" value={r.drivingDistance} onChange={v => set('drivingDistance', v)} />
              <Field label="Fairways Hit %" value={r.fairwaysHitPercent} onChange={v => set('fairwaysHitPercent', v)} />
              <Field label="GIR %" value={r.greensInRegPercent} onChange={v => set('greensInRegPercent', v)} />
              <Field label="Putts / Round" value={r.puttsPerRound} onChange={v => set('puttsPerRound', v)} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="results">
          <AccordionTrigger>Tournament Results</AccordionTrigger>
          <AccordionContent>
            <RowEditor
              rows={r.tournamentResults}
              columns={[
                { key: 'tournament', label: 'Tournament' },
                { key: 'date', label: 'Date' },
                { key: 'score', label: 'Score' },
                { key: 'finish', label: 'Finish' },
                { key: 'fieldSize', label: 'Field Size' },
              ]}
              onChange={rows => set('tournamentResults', rows as any)}
              empty={{ tournament: '', date: '', score: '', finish: '', fieldSize: '' }}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="summary">
          <AccordionTrigger>Tournament Summary (auto)</AccordionTrigger>
          <AccordionContent>
            <div className="grid md:grid-cols-5 gap-3 text-sm">
              <Stat label="Total" value={r.tournamentSummary.totalTournaments} />
              <Stat label="Wins" value={r.tournamentSummary.wins} />
              <Stat label="Top 5" value={r.tournamentSummary.top5Finishes} />
              <Stat label="Top 10" value={r.tournamentSummary.top10Finishes} />
              <Stat label="Avg Last 10" value={r.tournamentSummary.avgLast10Scores} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="upcoming">
          <AccordionTrigger>Upcoming Schedule</AccordionTrigger>
          <AccordionContent>
            <RowEditor
              rows={r.upcomingSchedule}
              columns={[
                { key: 'eventName', label: 'Event' },
                { key: 'course', label: 'Course' },
                { key: 'cityState', label: 'City, State' },
                { key: 'date', label: 'Date' },
              ]}
              onChange={rows => set('upcomingSchedule', rows as any)}
              empty={{ eventName: '', course: '', cityState: '', date: '' }}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="videos">
          <AccordionTrigger>Video Links</AccordionTrigger>
          <AccordionContent>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Highlight Reel URL" value={r.videoLinks.highlightReel} onChange={v => set('videoLinks', { ...r.videoLinks, highlightReel: v })} />
              <Field label="Swing Video URL" value={r.videoLinks.swingVideo} onChange={v => set('videoLinks', { ...r.videoLinks, swingVideo: v })} />
              <Field label="Course Management URL" value={r.videoLinks.courseManagement} onChange={v => set('videoLinks', { ...r.videoLinks, courseManagement: v })} />
              <Field label="Short Game URL" value={r.videoLinks.shortGame} onChange={v => set('videoLinks', { ...r.videoLinks, shortGame: v })} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="references">
          <AccordionTrigger>References</AccordionTrigger>
          <AccordionContent>
            <RowEditor
              rows={r.references}
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'title', label: 'Title' },
                { key: 'phone', label: 'Phone' },
                { key: 'email', label: 'Email' },
              ]}
              onChange={rows => set('references', rows as any)}
              empty={{ name: '', title: '', phone: '', email: '' }}
              maxRows={4}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="additional">
          <AccordionTrigger>Additional Information</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div><Label>Awards & Honors</Label><Textarea rows={3} value={r.awardsHonors} onChange={e => set('awardsHonors', e.target.value)} /></div>
              <div><Label>Community Service / Volunteering</Label><Textarea rows={3} value={r.communityService} onChange={e => set('communityService', e.target.value)} /></div>
              <div><Label>Other Sports / Extracurriculars</Label><Textarea rows={3} value={r.extracurriculars} onChange={e => set('extracurriculars', e.target.value)} /></div>
              <div><Label>Why I Want to Play College Golf (100–200 words)</Label><Textarea rows={5} value={r.personalStatement} onChange={e => set('personalStatement', e.target.value)} /></div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {!hideAdminFields && (
          <AccordionItem value="coach">
            <AccordionTrigger>Coach Notes (admin-only, not on PDF)</AccordionTrigger>
            <AccordionContent>
              <Textarea rows={5} value={r.coachNotes} onChange={e => set('coachNotes', e.target.value)} placeholder="Internal notes, versions sent to coaches, etc." />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      <Card>
        <CardHeader><CardTitle className="text-base">Preview</CardTitle></CardHeader>
        <CardContent>
          <ResumePreview r={r} />
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value, onChange, className }: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <Input value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-semibold">{value || '—'}</div>
    </div>
  );
}

function RowEditor<T extends Record<string, string>>({
  rows, columns, onChange, empty, maxRows,
}: {
  rows: T[];
  columns: { key: keyof T & string; label: string }[];
  onChange: (rows: T[]) => void;
  empty: T;
  maxRows?: number;
}) {
  const update = (i: number, k: keyof T, v: string) => {
    const next = rows.map((r, idx) => (idx === i ? { ...r, [k]: v } : r));
    onChange(next);
  };
  const add = () => onChange([...rows, { ...empty }]);
  const del = (i: number) => onChange(rows.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="grid gap-2 items-end" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr) auto` }}>
          {columns.map(c => (
            <div key={c.key}>
              <Label className="text-xs">{c.label}</Label>
              <Input value={row[c.key] || ''} onChange={e => update(i, c.key, e.target.value)} />
            </div>
          ))}
          <Button variant="ghost" size="icon" onClick={() => del(i)}><Trash2 className="w-4 h-4" /></Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add} disabled={maxRows ? rows.length >= maxRows : false}>
        <Plus className="w-4 h-4 mr-1" />Add Row
      </Button>
    </div>
  );
}

function ResumePreview({ r }: { r: ResumeData }) {
  return (
    <div className="bg-white text-black p-6 rounded border font-serif text-[12px] leading-snug max-h-[600px] overflow-auto">
      <div className="text-center">
        <div className="text-2xl font-bold">{r.fullName || 'Student Name'}</div>
        <div className="text-xs mt-1">{[r.cityState, r.phone, r.email].filter(Boolean).join('  |  ')}</div>
        {r.jgsLink && <div className="text-xs text-blue-700 underline">{r.jgsLink}</div>}
      </div>
      <hr className="my-3" />

      <Section title="Academic Profile">
        <Grid>
          <KV k="High School" v={[r.highSchool, r.highSchoolCityState].filter(Boolean).join(', ')} />
          <KV k="Graduation" v={r.graduationYear} />
          <KV k="GPA" v={r.gpa} />
          <KV k="SAT / ACT" v={[r.sat && `SAT ${r.sat}`, r.act && `ACT ${r.act}`].filter(Boolean).join(' · ')} />
          <KV k="NCAA ID" v={r.ncaaId} />
          <KV k="Intended Major" v={r.intendedMajor} />
        </Grid>
        {r.apHonorsCourses && <div className="mt-1"><b>AP/Honors:</b> {r.apHonorsCourses}</div>}
      </Section>

      <Section title="Athletic Profile">
        <Grid>
          <KV k="Scoring Avg (18)" v={r.scoringAverage} />
          <KV k="Scoring Avg (9)" v={r.scoringAverage9} />
          <KV k="Handicap" v={r.handicap} />
          <KV k="Driving Distance" v={r.drivingDistance} />
          <KV k="Fairways %" v={r.fairwaysHitPercent} />
          <KV k="GIR %" v={r.greensInRegPercent} />
          <KV k="Putts/Round" v={r.puttsPerRound} />
        </Grid>
      </Section>

      {r.tournamentResults.length > 0 && (
        <Section title="Key Tournament Results">
          <table className="w-full border-collapse">
            <thead><tr className="bg-gray-100">{['Tournament','Date','Score','Finish','Field'].map(h => <th key={h} className="border p-1 text-left">{h}</th>)}</tr></thead>
            <tbody>
              {r.tournamentResults.map((t, i) => (
                <tr key={i}>
                  <td className="border p-1">{t.tournament}</td>
                  <td className="border p-1">{t.date}</td>
                  <td className="border p-1">{t.score}</td>
                  <td className="border p-1">{t.finish}</td>
                  <td className="border p-1">{t.fieldSize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {(r.tournamentSummary.totalTournaments || r.tournamentSummary.wins) && (
        <Section title="Tournament Summary">
          <Grid>
            <KV k="Total" v={r.tournamentSummary.totalTournaments} />
            <KV k="Wins" v={r.tournamentSummary.wins} />
            <KV k="Top 5" v={r.tournamentSummary.top5Finishes} />
            <KV k="Top 10" v={r.tournamentSummary.top10Finishes} />
            <KV k="Avg Last 10" v={r.tournamentSummary.avgLast10Scores} />
          </Grid>
        </Section>
      )}

      {r.upcomingSchedule.length > 0 && (
        <Section title="Upcoming Schedule">
          <table className="w-full border-collapse">
            <thead><tr className="bg-gray-100">{['Event','Course','Location','Date'].map(h => <th key={h} className="border p-1 text-left">{h}</th>)}</tr></thead>
            <tbody>{r.upcomingSchedule.map((u, i) => (
              <tr key={i}><td className="border p-1">{u.eventName}</td><td className="border p-1">{u.course}</td><td className="border p-1">{u.cityState}</td><td className="border p-1">{u.date}</td></tr>
            ))}</tbody>
          </table>
        </Section>
      )}

      {(r.videoLinks.highlightReel || r.videoLinks.swingVideo || r.videoLinks.courseManagement || r.videoLinks.shortGame) && (
        <Section title="Video Links">
          {[['Highlight Reel', r.videoLinks.highlightReel],['Swing Video', r.videoLinks.swingVideo],['Course Management', r.videoLinks.courseManagement],['Short Game', r.videoLinks.shortGame]].filter(([,u])=>u).map(([l,u]) => (
            <div key={l}><b>{l}:</b> <a className="text-blue-700 underline break-all" href={u} target="_blank" rel="noreferrer">{u}</a></div>
          ))}
        </Section>
      )}

      {r.references.length > 0 && (
        <Section title="References">
          <table className="w-full border-collapse">
            <thead><tr className="bg-gray-100">{['Name','Title','Phone','Email'].map(h => <th key={h} className="border p-1 text-left">{h}</th>)}</tr></thead>
            <tbody>{r.references.map((rf, i) => (
              <tr key={i}><td className="border p-1">{rf.name}</td><td className="border p-1">{rf.title}</td><td className="border p-1">{rf.phone}</td><td className="border p-1">{rf.email}</td></tr>
            ))}</tbody>
          </table>
        </Section>
      )}

      {r.awardsHonors && <Section title="Awards & Honors"><p className="whitespace-pre-wrap">{r.awardsHonors}</p></Section>}
      {r.communityService && <Section title="Community Service"><p className="whitespace-pre-wrap">{r.communityService}</p></Section>}
      {r.extracurriculars && <Section title="Extracurriculars"><p className="whitespace-pre-wrap">{r.extracurriculars}</p></Section>}
      {r.personalStatement && <Section title="Why I Want to Play College Golf"><p className="whitespace-pre-wrap">{r.personalStatement}</p></Section>}

      <div className="text-center text-[10px] italic text-gray-500 mt-4 border-t pt-2">College Fairway Advisors · www.cfa.golf</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <div className="font-bold uppercase tracking-wide border-b border-black/60 pb-0.5 mb-1">{title}</div>
      {children}
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">{children}</div>;
}
function KV({ k, v }: { k: string; v?: string }) {
  return <div><b>{k}:</b> {v || '—'}</div>;
}

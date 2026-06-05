import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type ResumeTournamentResult = {
  tournament: string;
  date: string;
  score: string;
  finish: string;
  fieldSize: string;
};

export type ResumeUpcoming = {
  eventName: string;
  course: string;
  cityState: string;
  date: string;
};

export type ResumeReference = {
  name: string;
  title: string;
  phone: string;
  email: string;
};

export type ResumeData = {
  fullName: string;
  cityState: string;
  phone: string;
  email: string;
  jgsLink: string;
  highSchool: string;
  highSchoolCityState: string;
  graduationYear: string;
  gpa: string;
  sat: string;
  act: string;
  ncaaId: string;
  intendedMajor: string;
  apHonorsCourses: string;
  scoringAverage: string;
  scoringAverage9: string;
  handicap: string;
  drivingDistance: string;
  fairwaysHitPercent: string;
  greensInRegPercent: string;
  puttsPerRound: string;
  tournamentResults: ResumeTournamentResult[];
  tournamentSummary: {
    totalTournaments: string;
    top10Finishes: string;
    top5Finishes: string;
    wins: string;
    avgLast10Scores: string;
  };
  upcomingSchedule: ResumeUpcoming[];
  videoLinks: {
    highlightReel: string;
    swingVideo: string;
    courseManagement: string;
    shortGame: string;
  };
  references: ResumeReference[];
  communityService: string;
  awardsHonors: string;
  extracurriculars: string;
  personalStatement: string;
  coachNotes: string;
};

export const EMPTY_RESUME: ResumeData = {
  fullName: '',
  cityState: '',
  phone: '',
  email: '',
  jgsLink: '',
  highSchool: '',
  highSchoolCityState: '',
  graduationYear: '',
  gpa: '',
  sat: '',
  act: '',
  ncaaId: '',
  intendedMajor: '',
  apHonorsCourses: '',
  scoringAverage: '',
  scoringAverage9: '',
  handicap: '',
  drivingDistance: '',
  fairwaysHitPercent: '',
  greensInRegPercent: '',
  puttsPerRound: '',
  tournamentResults: [],
  tournamentSummary: {
    totalTournaments: '',
    top10Finishes: '',
    top5Finishes: '',
    wins: '',
    avgLast10Scores: '',
  },
  upcomingSchedule: [],
  videoLinks: { highlightReel: '', swingVideo: '', courseManagement: '', shortGame: '' },
  references: [],
  communityService: '',
  awardsHonors: '',
  extracurriculars: '',
  personalStatement: '',
  coachNotes: '',
};

export function useStudentResume(studentId?: string) {
  return useQuery({
    queryKey: ['student_resume', studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_resumes' as any)
        .select('*')
        .eq('student_id', studentId!)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });
}

export function useSaveStudentResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ studentId, data }: { studentId: string; data: ResumeData }) => {
      const { error } = await supabase
        .from('student_resumes' as any)
        .upsert({ student_id: studentId, data, updated_at: new Date().toISOString() } as any, {
          onConflict: 'student_id',
        });
      if (error) throw error;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['student_resume', v.studentId] }),
  });
}

export function computeSummary(results: ResumeTournamentResult[]) {
  const total = results.length;
  const parseFinish = (f: string): number | null => {
    const m = f.match(/\d+/);
    return m ? parseInt(m[0], 10) : null;
  };
  let top10 = 0, top5 = 0, wins = 0;
  for (const r of results) {
    const pos = parseFinish(r.finish);
    if (pos === null) continue;
    if (pos <= 10) top10++;
    if (pos <= 5) top5++;
    if (pos === 1) wins++;
  }
  const sorted = [...results].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const last10 = sorted.slice(0, 10);
  const nums = last10.map(r => parseFloat(r.score)).filter(n => !isNaN(n));
  const avg = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1) : '';
  return {
    totalTournaments: String(total),
    top10Finishes: String(top10),
    top5Finishes: String(top5),
    wins: String(wins),
    avgLast10Scores: avg,
  };
}

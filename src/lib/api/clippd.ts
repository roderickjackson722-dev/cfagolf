import { supabase } from '@/integrations/supabase/client';

export type Division = 'D1' | 'D2' | 'D3' | 'NAIA' | 'JUCO' | 'JUCO2';
export type Gender = 'Men' | 'Women';

export interface ClippdTeam {
  rank: number;
  name: string;
  logoUrl: string | null;
  division: string;
  gender: string;
}

export interface ImportResult {
  success: boolean;
  dryRun?: boolean;
  division: string;
  gender: string;
  teamsFound: number;
  imported?: number;
  updated?: number;
  errors?: string[];
  teams?: ClippdTeam[];
  error?: string;
}

export const clippdApi = {
  async importTeams(
    division: Division,
    gender: Gender,
    dryRun = true
  ): Promise<ImportResult> {
    const { data, error } = await supabase.functions.invoke('import-clippd-data', {
      body: { division, gender, dryRun },
    });

    if (error) {
      return { 
        success: false, 
        error: error.message,
        division,
        gender,
        teamsFound: 0,
      };
    }

    return data;
  },

  getDivisions(): { value: Division; label: string }[] {
    return [
      { value: 'D1', label: 'NCAA Division I' },
      { value: 'D2', label: 'NCAA Division II' },
      { value: 'D3', label: 'NCAA Division III' },
      { value: 'NAIA', label: 'NAIA' },
      { value: 'JUCO', label: 'NJCAA Division I' },
      { value: 'JUCO2', label: 'NJCAA Division II' },
    ];
  },

  getGenders(): { value: Gender; label: string }[] {
    return [
      { value: 'Men', label: "Men's Teams" },
      { value: 'Women', label: "Women's Teams" },
    ];
  },
};

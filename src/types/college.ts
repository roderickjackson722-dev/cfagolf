export type Division = 'D1' | 'D2' | 'D3' | 'NAIA' | 'JUCO';
export type SchoolSize = 'Small' | 'Medium' | 'Large' | 'Very Large';
export type TeamGender = 'Men' | 'Women' | 'Both' | 'None';

export interface College {
  id: string;
  name: string;
  state: string;
  division: Division;
  conference: string | null;
  school_size: SchoolSize;
  golf_national_ranking: number | null;
  scholarships_available: number | null;
  recruiting_scoring_avg: number | null;
  min_act_score: number | null;
  min_sat_score: number | null;
  number_of_students: number | null;
  out_of_state_cost: number | null;
  website_url: string | null;
  logo_url: string | null;
  team_gender: TeamGender;
  is_hbcu: boolean;
  created_at: string;
  updated_at: string;
}

export interface CollegeFilters {
  search: string;
  divisions: Division[];
  states: string[];
  schoolSizes: SchoolSize[];
  teamGenders: TeamGender[];
  hbcuOnly: boolean;
  maxRanking: number | null;
  minScholarships: number | null;
  maxScoringAvg: number | null;
  maxActScore: number | null;
  maxSatScore: number | null;
  maxCost: number | null;
}

export const DIVISIONS: Division[] = ['D1', 'D2', 'D3', 'NAIA', 'JUCO'];
export const SCHOOL_SIZES: SchoolSize[] = ['Small', 'Medium', 'Large', 'Very Large'];
export const TEAM_GENDERS: TeamGender[] = ['Men', 'Women', 'Both', 'None'];

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

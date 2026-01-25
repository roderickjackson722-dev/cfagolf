import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { College, CollegeFilters } from '@/types/college';

export function useColleges(filters: CollegeFilters) {
  return useQuery({
    queryKey: ['colleges', filters],
    queryFn: async () => {
      let query = supabase.from('colleges').select('*');

      // Apply search filter
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      // Apply division filter
      if (filters.divisions.length > 0) {
        query = query.in('division', filters.divisions);
      }

      // Apply state filter
      if (filters.states.length > 0) {
        query = query.in('state', filters.states);
      }

      // Apply school size filter
      if (filters.schoolSizes.length > 0) {
        query = query.in('school_size', filters.schoolSizes);
      }

      // Apply team gender filter
      if (filters.teamGenders.length > 0) {
        query = query.in('team_gender', filters.teamGenders);
      }

      // Apply HBCU filter
      if (filters.hbcuOnly) {
        query = query.eq('is_hbcu', true);
      }

      // Apply ranking filter
      if (filters.maxRanking) {
        query = query.lte('golf_national_ranking', filters.maxRanking);
      }

      // Apply scholarships filter
      if (filters.minScholarships) {
        query = query.gte('scholarships_available', filters.minScholarships);
      }

      // Apply scoring average filter
      if (filters.maxScoringAvg) {
        query = query.lte('recruiting_scoring_avg', filters.maxScoringAvg);
      }

      // Apply ACT score filter
      if (filters.maxActScore) {
        query = query.lte('min_act_score', filters.maxActScore);
      }

      // Apply SAT score filter
      if (filters.maxSatScore) {
        query = query.lte('min_sat_score', filters.maxSatScore);
      }

      // Apply cost filter
      if (filters.maxCost) {
        query = query.lte('out_of_state_cost', filters.maxCost);
      }

      const { data, error } = await query.order('golf_national_ranking', { ascending: true, nullsFirst: false });

      if (error) throw error;
      return data as College[];
    },
  });
}

export function useAllColleges() {
  return useQuery({
    queryKey: ['all-colleges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colleges')
        .select('id, name, state, division, logo_url, recruiting_scoring_avg')
        .order('name', { ascending: true });
      if (error) throw error;
      return data as Pick<College, 'id' | 'name' | 'state' | 'division' | 'logo_url' | 'recruiting_scoring_avg'>[];
    },
  });
}

export function useCollegeStats() {
  return useQuery({
    queryKey: ['college-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.from('colleges').select('division, state');
      if (error) throw error;

      const divisionCounts: Record<string, number> = {};
      const stateCounts: Record<string, number> = {};

      data.forEach((college) => {
        divisionCounts[college.division] = (divisionCounts[college.division] || 0) + 1;
        stateCounts[college.state] = (stateCounts[college.state] || 0) + 1;
      });

      return { divisionCounts, stateCounts, total: data.length };
    },
  });
}

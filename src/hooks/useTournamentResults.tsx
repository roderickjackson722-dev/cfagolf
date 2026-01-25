import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface RoundScore {
  round: number;
  score: number;
  par?: number;
}

export interface TournamentResult {
  id: string;
  user_id: string;
  tournament_name: string;
  tournament_date: string;
  location: string | null;
  course_name: string | null;
  rounds: number;
  round_scores: RoundScore[];
  total_score: number | null;
  relative_to_par: number | null;
  finish_position: number | null;
  field_size: number | null;
  tournament_type: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TournamentResultInput {
  tournament_name: string;
  tournament_date: string;
  location?: string;
  course_name?: string;
  rounds?: number;
  round_scores?: RoundScore[];
  total_score?: number;
  relative_to_par?: number;
  finish_position?: number;
  field_size?: number;
  tournament_type?: string;
  notes?: string;
}

export function useTournamentResults() {
  const { user } = useAuth();
  const [results, setResults] = useState<TournamentResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    if (!user) {
      setResults([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tournament_results')
        .select('*')
        .eq('user_id', user.id)
        .order('tournament_date', { ascending: false });

      if (error) throw error;
      
      // Parse round_scores from JSON
      const parsedResults = (data || []).map(result => ({
        ...result,
        round_scores: Array.isArray(result.round_scores) 
          ? (result.round_scores as unknown as RoundScore[])
          : []
      }));
      
      setResults(parsedResults);
    } catch (error) {
      console.error('Error fetching tournament results:', error);
      toast({
        title: "Error",
        description: "Failed to load tournament results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [user]);

  const addResult = async (input: TournamentResultInput) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tournament_results')
        .insert({
          user_id: user.id,
          tournament_name: input.tournament_name,
          tournament_date: input.tournament_date,
          location: input.location || null,
          course_name: input.course_name || null,
          rounds: input.rounds || 1,
          round_scores: JSON.parse(JSON.stringify(input.round_scores || [])),
          total_score: input.total_score || null,
          relative_to_par: input.relative_to_par || null,
          finish_position: input.finish_position || null,
          field_size: input.field_size || null,
          tournament_type: input.tournament_type || 'local',
          notes: input.notes || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tournament result added successfully",
      });

      fetchResults();
    } catch (error) {
      console.error('Error adding tournament result:', error);
      toast({
        title: "Error",
        description: "Failed to add tournament result",
        variant: "destructive",
      });
    }
  };

  const updateResult = async (id: string, updates: Partial<TournamentResultInput>) => {
    if (!user) return;

    try {
      // Convert round_scores to JSON-compatible format
      const dbUpdates = {
        ...updates,
        round_scores: updates.round_scores 
          ? JSON.parse(JSON.stringify(updates.round_scores)) 
          : undefined,
      };
      
      const { error } = await supabase
        .from('tournament_results')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tournament result updated successfully",
      });

      fetchResults();
    } catch (error) {
      console.error('Error updating tournament result:', error);
      toast({
        title: "Error",
        description: "Failed to update tournament result",
        variant: "destructive",
      });
    }
  };

  const deleteResult = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tournament_results')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tournament result deleted",
      });

      fetchResults();
    } catch (error) {
      console.error('Error deleting tournament result:', error);
      toast({
        title: "Error",
        description: "Failed to delete tournament result",
        variant: "destructive",
      });
    }
  };

  // Calculate stats
  const stats = {
    totalTournaments: results.length,
    averageScore: results.length > 0 && results.some(r => r.total_score)
      ? Math.round(results.filter(r => r.total_score).reduce((sum, r) => sum + (r.total_score || 0), 0) / results.filter(r => r.total_score).length)
      : null,
    bestFinish: results.length > 0 && results.some(r => r.finish_position)
      ? Math.min(...results.filter(r => r.finish_position).map(r => r.finish_position!))
      : null,
    topTenFinishes: results.filter(r => r.finish_position && r.finish_position <= 10).length,
    wins: results.filter(r => r.finish_position === 1).length,
  };

  return {
    results,
    loading,
    addResult,
    updateResult,
    deleteResult,
    stats,
    refetch: fetchResults,
  };
}

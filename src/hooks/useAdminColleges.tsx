import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { College, Division, SchoolSize, TeamGender } from '@/types/college';

interface CollegeFormData {
  name: string;
  state: string;
  division: Division;
  conference: string | null;
  school_size: SchoolSize;
  team_gender: TeamGender;
  is_hbcu: boolean;
  golf_national_ranking: number | null;
  min_act_score: number | null;
  min_sat_score: number | null;
  number_of_students: number | null;
  out_of_state_cost: number | null;
  website_url: string | null;
  logo_url: string | null;
}

export function useCreateCollege() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CollegeFormData) => {
      const { data: result, error } = await supabase
        .from('colleges')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      queryClient.invalidateQueries({ queryKey: ['all-colleges'] });
      toast({ title: 'Success', description: 'College created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateCollege() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CollegeFormData> }) => {
      const { data: result, error } = await supabase
        .from('colleges')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      queryClient.invalidateQueries({ queryKey: ['all-colleges'] });
      toast({ title: 'Success', description: 'College updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteCollege() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('colleges')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
      queryClient.invalidateQueries({ queryKey: ['all-colleges'] });
      toast({ title: 'Success', description: 'College deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUploadCollegeLogo() {
  return useMutation({
    mutationFn: async ({ file, collegeId }: { file: File; collegeId: string }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${collegeId}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('college-logos')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('college-logos')
        .getPublicUrl(filePath);
      
      return publicUrl;
    },
    onError: (error: Error) => {
      toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
    },
  });
}

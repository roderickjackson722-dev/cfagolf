import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface MeetingModule {
  moduleNumber: number;
  title: string;
  description: string;
  pageNumber?: string;
}

export const MEETING_MODULES: MeetingModule[] = [
  {
    moduleNumber: 0,
    title: "Introduction: Onboarding Call",
    description: "Welcome to College Fairway Advisors - Program overview and goal setting",
  },
  {
    moduleNumber: 1,
    title: "College Golf Landscape & Recruiting Basics",
    description: "NCAA/NAIA/NJCAA overview, finding program fit, recruiting timeline",
    pageNumber: "pg. 2",
  },
  {
    moduleNumber: 2,
    title: "Academic Readiness & Compliance",
    description: "Eligibility requirements, GPA planning, test prep strategies",
    pageNumber: "pg. 6",
  },
  {
    moduleNumber: 3,
    title: "Performance Metrics & Tournament Strategy",
    description: "Scoring benchmarks, tournament selection, stats tracking",
    pageNumber: "pg. 11",
  },
  {
    moduleNumber: 4,
    title: "Training & Player Development Templates",
    description: "Practice planning, skill development, fitness preparation",
    pageNumber: "pg. 15",
  },
  {
    moduleNumber: 5,
    title: "Athlete Brand, Resume & Video Portfolio",
    description: "Building your recruiting profile, video guidelines, online presence",
    pageNumber: "pg. 19",
  },
  {
    moduleNumber: 6,
    title: "Coach Outreach & Networking",
    description: "Email templates, phone scripts, campus visit preparation",
    pageNumber: "pg. 23",
  },
  {
    moduleNumber: 7,
    title: "Financial Aid, Offers & Decisions",
    description: "Understanding offers, comparing packages, negotiation strategies",
    pageNumber: "pg. 27",
  },
  {
    moduleNumber: 8,
    title: "Capstone — Recruiting Portfolio & 90-Day Action Plan",
    description: "Final portfolio assembly, action roadmap, commitment prep",
    pageNumber: "pg. 31",
  },
  {
    moduleNumber: 9,
    title: "Conclusion: Get Ready For College Golf",
    description: "Transition planning, final preparations, ongoing support",
  },
];

export interface MeetingProgress {
  id: string;
  user_id: string;
  module_number: number;
  module_title: string;
  is_completed: boolean;
  completed_date: string | null;
  admin_notes: string | null;
  session_date: string | null;
  session_duration_minutes: number | null;
  meet_link: string | null;
  next_agenda: string | null;
  created_at: string;
  updated_at: string;
}

// Hook to get meeting progress for a specific user (admin use)
export function useUserMeetingProgress(userId: string | undefined) {
  return useQuery({
    queryKey: ['meeting-progress', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('meeting_progress')
        .select('*')
        .eq('user_id', userId)
        .order('module_number', { ascending: true });

      if (error) throw error;
      return data as MeetingProgress[];
    },
    enabled: !!userId,
  });
}

// Hook to get current user's own meeting progress
export function useMyMeetingProgress() {
  return useQuery({
    queryKey: ['my-meeting-progress'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('meeting_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('module_number', { ascending: true });

      if (error) throw error;
      return data as MeetingProgress[];
    },
  });
}

// Hook to update or create meeting progress (admin only)
export function useUpdateMeetingProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      moduleNumber,
      isCompleted,
      adminNotes,
    }: {
      userId: string;
      moduleNumber: number;
      isCompleted: boolean;
      adminNotes?: string;
    }) => {
      const module = MEETING_MODULES.find(m => m.moduleNumber === moduleNumber);
      if (!module) throw new Error('Invalid module number');

      const { data: existing } = await supabase
        .from('meeting_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('module_number', moduleNumber)
        .single();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('meeting_progress')
          .update({
            is_completed: isCompleted,
            completed_date: isCompleted ? new Date().toISOString() : null,
            admin_notes: adminNotes,
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('meeting_progress')
          .insert({
            user_id: userId,
            module_number: moduleNumber,
            module_title: module.title,
            is_completed: isCompleted,
            completed_date: isCompleted ? new Date().toISOString() : null,
            admin_notes: adminNotes,
          });

        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meeting-progress', variables.userId] });
      toast({
        title: "Progress Updated",
        description: "Meeting progress has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating meeting progress:', error);
    },
  });
}

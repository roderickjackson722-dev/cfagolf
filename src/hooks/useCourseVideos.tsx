import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type LessonVideo = {
  lesson_id: string;
  video_url: string;
  video_type: string;
};

/** Extract YouTube video ID from various URL formats */
const extractYouTubeId = (input: string): string | null => {
  if (!input) return null;
  // Already a plain ID (11 chars, no slashes)
  if (/^[\w-]{11}$/.test(input.trim())) return input.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = input.match(p);
    if (m) return m[1];
  }
  return null;
};

/** Extract Vimeo video ID */
const extractVimeoId = (input: string): string | null => {
  if (!input) return null;
  if (/^\d+$/.test(input.trim())) return input.trim();
  const m = input.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
};

export const getEmbedUrl = (video: LessonVideo): string | null => {
  if (video.video_type === 'youtube') {
    const id = extractYouTubeId(video.video_url);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (video.video_type === 'vimeo') {
    const id = extractVimeoId(video.video_url);
    return id ? `https://player.vimeo.com/video/${id}?dnt=1` : null;
  }
  return null;
};

export const useCourseVideos = () => {
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['course-lesson-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_lesson_videos')
        .select('lesson_id, video_url, video_type');
      if (error) throw error;
      return data as LessonVideo[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const videoMap = Object.fromEntries(
    videos.filter(v => v.video_url).map(v => [v.lesson_id, v])
  );

  return { videoMap, isLoading };
};

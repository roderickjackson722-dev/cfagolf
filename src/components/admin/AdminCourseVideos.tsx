import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Loader2, Video, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const MODULES = [
  {
    title: "Module 1: Freshman Year",
    lessons: [
      { id: "1-1", title: "Understanding the College Golf Landscape" },
      { id: "1-2", title: "Setting Your Recruiting Goals Early" },
      { id: "1-3", title: "Building Your Academic Foundation" },
      { id: "1-4", title: "Developing Your Competitive Resume" },
    ],
  },
  {
    title: "Module 2: Sophomore Year",
    lessons: [
      { id: "2-1", title: "Creating Your Athlete Resume" },
      { id: "2-2", title: "Your First Highlight Reel" },
      { id: "2-3", title: "Introduction to Coach Outreach" },
      { id: "2-4", title: "Camps & Showcases Strategy" },
    ],
  },
  {
    title: "Module 3: Junior Year",
    lessons: [
      { id: "3-1", title: "Mastering Coach Communication" },
      { id: "3-2", title: "Campus Visits Done Right" },
      { id: "3-3", title: "Understanding Scholarship Offers" },
      { id: "3-4", title: "Narrowing Your List" },
    ],
  },
  {
    title: "Module 4: Senior Year",
    lessons: [
      { id: "4-1", title: "Making Your Decision" },
      { id: "4-2", title: "Preparing for College Golf" },
      { id: "4-3", title: "The College Transition" },
      { id: "4-4", title: "Common Mistakes & How to Avoid Them" },
    ],
  },
];

type LessonVideo = {
  id: string;
  lesson_id: string;
  video_url: string;
  video_type: string;
};

export const AdminCourseVideos = () => {
  const queryClient = useQueryClient();
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState('youtube');

  const { data: lessonVideos = [], isLoading } = useQuery({
    queryKey: ['admin-course-lesson-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_lesson_videos')
        .select('*');
      if (error) throw error;
      return data as LessonVideo[];
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async ({ lessonId, url, type }: { lessonId: string; url: string; type: string }) => {
      const { error } = await supabase
        .from('course_lesson_videos')
        .upsert({
          lesson_id: lessonId,
          video_url: url.trim(),
          video_type: type,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'lesson_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-course-lesson-videos'] });
      queryClient.invalidateQueries({ queryKey: ['course-lesson-videos'] });
      setEditingLesson(null);
      setVideoUrl('');
      toast.success('Video URL saved');
    },
    onError: () => toast.error('Failed to save video URL'),
  });

  const videoMap = Object.fromEntries(lessonVideos.map(v => [v.lesson_id, v]));
  const totalWithVideos = lessonVideos.filter(v => v.video_url).length;
  const totalLessons = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);

  const startEditing = (lessonId: string) => {
    const existing = videoMap[lessonId];
    setEditingLesson(lessonId);
    setVideoUrl(existing?.video_url || '');
    setVideoType(existing?.video_type || 'youtube');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <Video className="w-8 h-8 text-purple-600" />
          <div>
            <p className="text-2xl font-bold">{totalWithVideos} / {totalLessons}</p>
            <p className="text-xs text-muted-foreground">Lessons with videos</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {MODULES.map((module) => (
          <Card key={module.title}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{module.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {module.lessons.map((lesson) => {
                const hasVideo = !!videoMap[lesson.id]?.video_url;
                const isEditing = editingLesson === lesson.id;

                return (
                  <div key={lesson.id} className="space-y-2">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      {hasVideo ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{lesson.id}: {lesson.title}</p>
                        {hasVideo && !isEditing && (
                          <p className="text-xs text-muted-foreground truncate">{videoMap[lesson.id].video_url}</p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => startEditing(lesson.id)}>
                        {hasVideo ? 'Edit' : 'Add Video'}
                      </Button>
                    </div>

                    {isEditing && (
                      <div className="ml-7 p-3 bg-muted/30 rounded-lg space-y-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Video Type</Label>
                          <Select value={videoType} onValueChange={setVideoType}>
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="youtube">YouTube</SelectItem>
                              <SelectItem value="vimeo">Vimeo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">
                            {videoType === 'youtube' ? 'YouTube URL or Video ID' : 'Vimeo URL or Video ID'}
                          </Label>
                          <Input
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder={videoType === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://vimeo.com/123456789'}
                            className="h-8 text-sm"
                          />
                          <p className="text-xs text-muted-foreground">
                            Paste the full URL or just the video ID. Use unlisted videos for paid content.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => upsertMutation.mutate({ lessonId: lesson.id, url: videoUrl, type: videoType })}
                            disabled={upsertMutation.isPending || !videoUrl.trim()}
                          >
                            {upsertMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingLesson(null)}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

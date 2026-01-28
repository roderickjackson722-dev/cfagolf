import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, BookOpen, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  MEETING_MODULES, 
  useUserMeetingProgress, 
  useUpdateMeetingProgress,
  type MeetingProgress 
} from '@/hooks/useMeetingProgress';
import { format } from 'date-fns';

interface MeetingProgressTrackerProps {
  userId: string;
  userName?: string;
}

export function MeetingProgressTracker({ userId, userName }: MeetingProgressTrackerProps) {
  const { data: progressData = [], isLoading } = useUserMeetingProgress(userId);
  const updateProgress = useUpdateMeetingProgress();
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [localNotes, setLocalNotes] = useState<Record<number, string>>({});

  // Initialize local notes from progress data
  useEffect(() => {
    const notes: Record<number, string> = {};
    progressData.forEach((p) => {
      notes[p.module_number] = p.admin_notes || '';
    });
    setLocalNotes(notes);
  }, [progressData]);

  const getProgressForModule = (moduleNumber: number): MeetingProgress | undefined => {
    return progressData.find((p) => p.module_number === moduleNumber);
  };

  const handleCheckChange = (moduleNumber: number, checked: boolean) => {
    updateProgress.mutate({
      userId,
      moduleNumber,
      isCompleted: checked,
      adminNotes: localNotes[moduleNumber],
    });
  };

  const handleSaveNotes = (moduleNumber: number) => {
    const progress = getProgressForModule(moduleNumber);
    updateProgress.mutate({
      userId,
      moduleNumber,
      isCompleted: progress?.is_completed || false,
      adminNotes: localNotes[moduleNumber],
    });
  };

  const completedCount = progressData.filter((p) => p.is_completed).length;
  const progressPercent = Math.round((completedCount / MEETING_MODULES.length) * 100);

  // Find the next incomplete module
  const nextModule = MEETING_MODULES.find(
    (m) => !getProgressForModule(m.moduleNumber)?.is_completed
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Meeting Progress</CardTitle>
          </div>
          <Badge variant={progressPercent === 100 ? "default" : "secondary"}>
            {completedCount}/{MEETING_MODULES.length} Complete
          </Badge>
        </div>
        <CardDescription>
          {userName ? `Track ${userName}'s coaching sessions` : 'Track coaching session progress'}
        </CardDescription>
        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {progressPercent}% complete
            {nextModule && ` • Next: ${nextModule.title}`}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {MEETING_MODULES.map((module) => {
          const progress = getProgressForModule(module.moduleNumber);
          const isCompleted = progress?.is_completed || false;
          const isExpanded = expandedModule === module.moduleNumber;

          return (
            <Collapsible 
              key={module.moduleNumber}
              open={isExpanded}
              onOpenChange={(open) => setExpandedModule(open ? module.moduleNumber : null)}
            >
              <div className={`border rounded-lg transition-colors ${isCompleted ? 'bg-primary/5 border-primary/20' : 'bg-background'}`}>
                <div className="flex items-center gap-3 p-3">
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={(checked) => handleCheckChange(module.moduleNumber, !!checked)}
                    disabled={updateProgress.isPending}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <span className={`font-medium text-sm truncate ${isCompleted ? 'text-primary' : ''}`}>
                        {module.moduleNumber === 0 ? 'Intro' : `Module ${module.moduleNumber}`}: {module.title}
                      </span>
                    </div>
                    {progress?.completed_date && (
                      <p className="text-xs text-muted-foreground ml-6">
                        Completed {format(new Date(progress.completed_date), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                  {module.pageNumber && (
                    <Badge variant="outline" className="text-xs shrink-0">
                      {module.pageNumber}
                    </Badge>
                  )}
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="px-3 pb-3 pt-1 space-y-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Meeting Notes</label>
                      <Textarea
                        placeholder="Add notes from this session..."
                        value={localNotes[module.moduleNumber] || ''}
                        onChange={(e) => setLocalNotes({
                          ...localNotes,
                          [module.moduleNumber]: e.target.value,
                        })}
                        className="min-h-[80px]"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSaveNotes(module.moduleNumber)}
                        disabled={updateProgress.isPending}
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save Notes
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
}

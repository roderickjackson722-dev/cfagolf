import { CheckCircle2, Circle, BookOpen, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MEETING_MODULES, useMyMeetingProgress } from '@/hooks/useMeetingProgress';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

export function MeetingProgressCard() {
  const { hasPaidAccess } = useAuth();
  const { data: progressData = [], isLoading } = useMyMeetingProgress();

  const getProgressForModule = (moduleNumber: number) => {
    return progressData.find((p) => p.module_number === moduleNumber);
  };

  const completedCount = progressData.filter((p) => p.is_completed).length;
  const progressPercent = Math.round((completedCount / MEETING_MODULES.length) * 100);

  // Find the next incomplete module
  const nextModule = MEETING_MODULES.find(
    (m) => !getProgressForModule(m.moduleNumber)?.is_completed
  );

  if (!hasPaidAccess) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center p-6">
            <Lock className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="font-medium">Available for Members</p>
            <p className="text-sm text-muted-foreground">
              Upgrade to track your coaching progress
            </p>
          </div>
        </div>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <CardTitle>Coaching Progress</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="opacity-50">
          <div className="space-y-2">
            {MEETING_MODULES.slice(0, 3).map((module) => (
              <div key={module.moduleNumber} className="flex items-center gap-2 p-2 rounded border">
                <Circle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{module.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

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
            <CardTitle>Coaching Progress</CardTitle>
          </div>
          <Badge variant={progressPercent === 100 ? "default" : "secondary"}>
            {completedCount}/{MEETING_MODULES.length} Complete
          </Badge>
        </div>
        <CardDescription>
          Your one-on-one coaching session milestones
        </CardDescription>
        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {nextModule && (
            <p className="text-xs text-muted-foreground mt-1">
              Next up: {nextModule.title}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {MEETING_MODULES.map((module) => {
          const progress = getProgressForModule(module.moduleNumber);
          const isCompleted = progress?.is_completed || false;

          return (
            <div
              key={module.moduleNumber}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                isCompleted ? 'bg-primary/5 border-primary/20' : 'bg-background'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${isCompleted ? 'text-primary' : ''}`}>
                  {module.moduleNumber === 0 ? 'Intro' : `Module ${module.moduleNumber}`}: {module.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {module.description}
                </p>
                {progress?.completed_date && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ✓ Completed {format(new Date(progress.completed_date), 'MMM d, yyyy')}
                  </p>
                )}
              </div>
              {module.pageNumber && (
                <Badge variant="outline" className="text-xs shrink-0">
                  {module.pageNumber}
                </Badge>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

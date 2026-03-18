import { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, BookOpen, ChevronDown, ChevronUp, Save, 
  MessageSquare, ListChecks, Plus, Trash2, Calendar, Clock, Video, Link as LinkIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { 
  MEETING_MODULES, 
  useUserMeetingProgress, 
  useUpdateMeetingProgress,
  type MeetingProgress 
} from '@/hooks/useMeetingProgress';
import { useSessionNotes, useAddSessionNote, useDeleteSessionNote } from '@/hooks/useSessionNotes';
import { useSessionActionItems, useAddActionItem, useDeleteActionItem } from '@/hooks/useSessionActionItems';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MeetingProgressTrackerProps {
  userId: string;
  userName?: string;
}

export function MeetingProgressTracker({ userId, userName }: MeetingProgressTrackerProps) {
  const { data: progressData = [], isLoading } = useUserMeetingProgress(userId);
  const updateProgress = useUpdateMeetingProgress();
  const { data: allNotes = [] } = useSessionNotes(userId);
  const { data: allActionItems = [] } = useSessionActionItems(userId);
  const addNote = useAddSessionNote();
  const deleteNote = useDeleteSessionNote();
  const addActionItem = useAddActionItem();
  const deleteActionItem = useDeleteActionItem();

  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [localNotes, setLocalNotes] = useState<Record<number, string>>({});
  const [newSessionNote, setNewSessionNote] = useState<Record<number, string>>({});
  const [newActionTitle, setNewActionTitle] = useState<Record<number, string>>({});
  const [newActionDue, setNewActionDue] = useState<Record<number, string>>({});
  const [sessionDetails, setSessionDetails] = useState<Record<number, {
    sessionDate: string;
    duration: string;
    meetLink: string;
    nextAgenda: string;
  }>>({});

  useEffect(() => {
    const notes: Record<number, string> = {};
    const details: Record<number, any> = {};
    progressData.forEach((p) => {
      notes[p.module_number] = p.admin_notes || '';
      details[p.module_number] = {
        sessionDate: p.session_date ? p.session_date.slice(0, 16) : '',
        duration: p.session_duration_minutes?.toString() || '',
        meetLink: p.meet_link || '',
        nextAgenda: p.next_agenda || '',
      };
    });
    setLocalNotes(notes);
    setSessionDetails(details);
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

  const handleSaveAll = async (moduleNumber: number) => {
    const progress = getProgressForModule(moduleNumber);
    const details = sessionDetails[moduleNumber] || {};
    
    // First save via existing mutation
    updateProgress.mutate({
      userId,
      moduleNumber,
      isCompleted: progress?.is_completed || false,
      adminNotes: localNotes[moduleNumber],
    });

    // Then update session details directly
    if (progress?.id) {
      const { error } = await supabase
        .from('meeting_progress')
        .update({
          session_date: details.sessionDate ? new Date(details.sessionDate).toISOString() : null,
          session_duration_minutes: details.duration ? parseInt(details.duration) : null,
          meet_link: details.meetLink || null,
          next_agenda: details.nextAgenda || null,
        })
        .eq('id', progress.id);
      
      if (error) {
        toast({ title: "Error", description: "Failed to save session details.", variant: "destructive" });
      }
    }
  };

  const handleAddNote = (moduleNumber: number) => {
    const content = newSessionNote[moduleNumber]?.trim();
    if (!content) return;
    addNote.mutate({ userId, moduleNumber, content, authorRole: 'admin' });
    setNewSessionNote({ ...newSessionNote, [moduleNumber]: '' });
  };

  const handleAddAction = (moduleNumber: number) => {
    const title = newActionTitle[moduleNumber]?.trim();
    if (!title) return;
    addActionItem.mutate({
      userId,
      moduleNumber,
      title,
      dueDate: newActionDue[moduleNumber] || undefined,
    });
    setNewActionTitle({ ...newActionTitle, [moduleNumber]: '' });
    setNewActionDue({ ...newActionDue, [moduleNumber]: '' });
  };

  const completedCount = progressData.filter((p) => p.is_completed).length;
  const progressPercent = Math.round((completedCount / MEETING_MODULES.length) * 100);
  const nextModule = MEETING_MODULES.find(
    (m) => !getProgressForModule(m.moduleNumber)?.is_completed
  );
  const totalActionItems = allActionItems.length;
  const completedActionItems = allActionItems.filter(i => i.is_completed).length;

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
            <CardTitle className="text-lg">Coaching Sessions</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant={progressPercent === 100 ? "default" : "secondary"}>
              {completedCount}/{MEETING_MODULES.length} Sessions
            </Badge>
            {totalActionItems > 0 && (
              <Badge variant="outline">
                <ListChecks className="w-3 h-3 mr-1" />
                {completedActionItems}/{totalActionItems} Tasks
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>
          {userName ? `Manage ${userName}'s coaching sessions` : 'Manage coaching session progress'}
        </CardDescription>
        <div className="mt-3">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
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
          const moduleNotes = allNotes.filter(n => n.module_number === module.moduleNumber);
          const moduleActions = allActionItems.filter(a => a.module_number === module.moduleNumber);
          const details = sessionDetails[module.moduleNumber] || { sessionDate: '', duration: '', meetLink: '', nextAgenda: '' };

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
                    {progress?.session_date && (
                      <p className="text-xs text-muted-foreground ml-6">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {format(new Date(progress.session_date), 'MMM d, yyyy h:mm a')}
                        {progress.session_duration_minutes && ` • ${progress.session_duration_minutes} min`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {moduleNotes.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <MessageSquare className="w-3 h-3 mr-1" />{moduleNotes.length}
                      </Badge>
                    )}
                    {moduleActions.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <ListChecks className="w-3 h-3 mr-1" />
                        {moduleActions.filter(a => a.is_completed).length}/{moduleActions.length}
                      </Badge>
                    )}
                    {module.pageNumber && (
                      <Badge variant="outline" className="text-xs">{module.pageNumber}</Badge>
                    )}
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent>
                  <div className="px-3 pb-3 pt-1 space-y-4 border-t">
                    <p className="text-sm text-muted-foreground">{module.description}</p>

                    {/* Session Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Session Date & Time
                        </Label>
                        <Input
                          type="datetime-local"
                          value={details.sessionDate}
                          onChange={(e) => setSessionDetails({
                            ...sessionDetails,
                            [module.moduleNumber]: { ...details, sessionDate: e.target.value },
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Duration (min)
                        </Label>
                        <Input
                          type="number"
                          placeholder="60"
                          value={details.duration}
                          onChange={(e) => setSessionDetails({
                            ...sessionDetails,
                            [module.moduleNumber]: { ...details, duration: e.target.value },
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-xs flex items-center gap-1">
                          <Video className="w-3 h-3" /> Google Meet Link
                        </Label>
                        <Input
                          type="url"
                          placeholder="https://meet.google.com/..."
                          value={details.meetLink}
                          onChange={(e) => setSessionDetails({
                            ...sessionDetails,
                            [module.moduleNumber]: { ...details, meetLink: e.target.value },
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Next Session Agenda */}
                    <div>
                      <Label className="text-xs">📋 Session Agenda (visible to student)</Label>
                      <Textarea
                        placeholder="What topics will be covered in this session..."
                        value={details.nextAgenda}
                        onChange={(e) => setSessionDetails({
                          ...sessionDetails,
                          [module.moduleNumber]: { ...details, nextAgenda: e.target.value },
                        })}
                        className="min-h-[60px] mt-1"
                      />
                    </div>

                    <Separator />

                    {/* Admin Notes (private) */}
                    <div>
                      <Label className="text-xs">🔒 Admin Notes (private)</Label>
                      <Textarea
                        placeholder="Private notes about this session..."
                        value={localNotes[module.moduleNumber] || ''}
                        onChange={(e) => setLocalNotes({
                          ...localNotes,
                          [module.moduleNumber]: e.target.value,
                        })}
                        className="min-h-[60px] mt-1"
                      />
                    </div>

                    <Button size="sm" onClick={() => handleSaveAll(module.moduleNumber)} disabled={updateProgress.isPending}>
                      <Save className="w-3 h-3 mr-1" /> Save All Changes
                    </Button>

                    <Separator />

                    {/* Action Items */}
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-1">
                        <ListChecks className="w-4 h-4" /> Homework / Action Items
                      </p>
                      <div className="space-y-2 mb-3">
                        {moduleActions.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 p-2 rounded border">
                            <Checkbox checked={item.is_completed} disabled />
                            <span className={`text-sm flex-1 ${item.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                              {item.title}
                            </span>
                            {item.due_date && (
                              <span className="text-xs text-muted-foreground">
                                Due {format(new Date(item.due_date), 'MMM d')}
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => deleteActionItem.mutate({ itemId: item.id, userId })}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add homework item..."
                          value={newActionTitle[module.moduleNumber] || ''}
                          onChange={(e) => setNewActionTitle({ ...newActionTitle, [module.moduleNumber]: e.target.value })}
                          className="flex-1"
                        />
                        <Input
                          type="date"
                          value={newActionDue[module.moduleNumber] || ''}
                          onChange={(e) => setNewActionDue({ ...newActionDue, [module.moduleNumber]: e.target.value })}
                          className="w-36"
                        />
                        <Button
                          size="sm"
                          disabled={!newActionTitle[module.moduleNumber]?.trim()}
                          onClick={() => handleAddAction(module.moduleNumber)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Shared Notes */}
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" /> Shared Session Notes
                      </p>
                      <div className="space-y-2 mb-3">
                        {moduleNotes.map((note) => (
                          <div
                            key={note.id}
                            className={`p-3 rounded-lg text-sm ${
                              note.author_role === 'admin' ? 'bg-primary/5 border border-primary/10' : 'bg-muted border'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant={note.author_role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                                {note.author_role === 'admin' ? '🏌️ Coach' : `📝 ${userName || 'Student'}`}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(note.created_at), 'MMM d, h:mm a')}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => deleteNote.mutate({ noteId: note.id, userId })}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="whitespace-pre-wrap">{note.content}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Add a shared note..."
                          value={newSessionNote[module.moduleNumber] || ''}
                          onChange={(e) => setNewSessionNote({ ...newSessionNote, [module.moduleNumber]: e.target.value })}
                          className="min-h-[60px]"
                        />
                        <Button
                          size="sm"
                          className="shrink-0 self-end"
                          disabled={!newSessionNote[module.moduleNumber]?.trim()}
                          onClick={() => handleAddNote(module.moduleNumber)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
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

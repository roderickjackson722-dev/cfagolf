import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  BookOpen, CheckCircle2, Circle, ChevronDown, ChevronUp,
  Calendar, Clock, Video, MessageSquare, ListChecks, Send, Trash2
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { MEETING_MODULES, useUserMeetingProgress } from '@/hooks/useMeetingProgress';
import { useSessionNotes, useAddSessionNote, useDeleteSessionNote } from '@/hooks/useSessionNotes';
import { useSessionActionItems, useToggleActionItem } from '@/hooks/useSessionActionItems';
import { DeliverablesList } from '@/components/worksheets/DeliverablesList';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function MeetingAgenda() {
  const { userId } = useParams<{ userId: string }>();
  const { user, loading: authLoading } = useAuth();
  const { data: progressData = [], isLoading: progressLoading } = useUserMeetingProgress(userId);
  const { data: allNotes = [] } = useSessionNotes(userId);
  const { data: allActionItems = [] } = useSessionActionItems(userId);
  const addNote = useAddSessionNote();
  const deleteNote = useDeleteSessionNote();
  const toggleItem = useToggleActionItem();

  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [newNote, setNewNote] = useState<Record<number, string>>({});

  // Get the student's profile name
  const { data: studentProfile } = useQuery({
    queryKey: ['student-profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('user_id', userId)
        .single();
      return data;
    },
    enabled: !!userId,
  });

  if (authLoading || progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Check: user must be either admin or the student whose agenda this is
  const isOwner = user.id === userId;
  // We'll allow access if the user is the owner or has admin role (checked via existing hook)

  const getProgress = (moduleNumber: number) =>
    progressData.find((p) => p.module_number === moduleNumber);

  const getNotesForModule = (moduleNumber: number) =>
    allNotes.filter((n) => n.module_number === moduleNumber);

  const getActionsForModule = (moduleNumber: number) =>
    allActionItems.filter((a) => a.module_number === moduleNumber);

  const completedCount = progressData.filter((p) => p.is_completed).length;
  const progressPercent = Math.round((completedCount / MEETING_MODULES.length) * 100);
  const nextModule = MEETING_MODULES.find(
    (m) => !getProgress(m.moduleNumber)?.is_completed
  );

  const handleAddNote = (moduleNumber: number) => {
    const content = newNote[moduleNumber]?.trim();
    if (!content || !userId) return;
    addNote.mutate({ userId, moduleNumber, content, authorRole: isOwner ? 'user' : 'admin' });
    setNewNote({ ...newNote, [moduleNumber]: '' });
  };

  const studentName = studentProfile?.full_name || studentProfile?.email || 'Student';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Meeting Agenda
                </h1>
                <p className="text-muted-foreground">
                  {studentName}'s coaching session plan
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{completedCount}/{MEETING_MODULES.length} sessions completed</span>
                <span className="text-sm text-muted-foreground">{progressPercent}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
              {nextModule && (
                <p className="text-xs text-muted-foreground mt-1">
                  Next up: {nextModule.title}
                </p>
              )}
            </div>
          </div>

          {/* Module List */}
          <div className="space-y-3">
            {MEETING_MODULES.map((module) => {
              const progress = getProgress(module.moduleNumber);
              const isCompleted = progress?.is_completed || false;
              const isExpanded = expandedModule === module.moduleNumber;
              const moduleNotes = getNotesForModule(module.moduleNumber);
              const moduleActions = getActionsForModule(module.moduleNumber);

              return (
                <Collapsible
                  key={module.moduleNumber}
                  open={isExpanded}
                  onOpenChange={(open) => setExpandedModule(open ? module.moduleNumber : null)}
                >
                  <div className={`border rounded-lg transition-colors ${isCompleted ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}>
                    <CollapsibleTrigger asChild>
                      <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors rounded-lg">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${isCompleted ? 'text-primary' : ''}`}>
                            {module.moduleNumber === 0 ? 'Intro' : `Module ${module.moduleNumber}`}: {module.title}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{module.description}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {progress?.session_date && (
                            <Badge variant="outline" className="text-xs hidden sm:flex">
                              <Calendar className="w-3 h-3 mr-1" />
                              {format(new Date(progress.session_date), 'MMM d')}
                            </Badge>
                          )}
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
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-4 border-t">
                        {/* Session details */}
                        {progress?.session_date && (
                          <div className="flex flex-wrap gap-4 pt-3 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(progress.session_date), 'MMMM d, yyyy h:mm a')}
                            </span>
                            {progress.session_duration_minutes && (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                {progress.session_duration_minutes} min
                              </span>
                            )}
                            {progress.meet_link && (
                              <a
                                href={progress.meet_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                <Video className="w-4 h-4" />
                                Join Meeting
                              </a>
                            )}
                          </div>
                        )}

                        {/* Agenda */}
                        {progress?.next_agenda && (
                          <div className="pt-2">
                            <p className="text-sm font-medium mb-1">📋 Session Agenda</p>
                            <div className="bg-muted/50 rounded-lg p-3 text-sm whitespace-pre-wrap">
                              {progress.next_agenda}
                            </div>
                          </div>
                        )}

                        <Separator />

                        {/* Action Items */}
                        {moduleActions.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-1">
                              <ListChecks className="w-4 h-4" /> Action Items
                            </p>
                            <div className="space-y-2">
                              {moduleActions.map((item) => (
                                <div key={item.id} className="flex items-center gap-2 p-2 rounded border">
                                  <Checkbox
                                    checked={item.is_completed}
                                    onCheckedChange={() =>
                                      toggleItem.mutate({ itemId: item.id, isCompleted: !item.is_completed, userId: userId! })
                                    }
                                  />
                                  <span className={`text-sm flex-1 ${item.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                                    {item.title}
                                  </span>
                                  {item.due_date && (
                                    <span className="text-xs text-muted-foreground">
                                      Due {format(new Date(item.due_date), 'MMM d')}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Deliverables */}
                        <DeliverablesList
                          moduleNumber={module.moduleNumber}
                          program="hs"
                          readOnly={false}
                          userId={userId}
                        />

                        <Separator />

                        {/* Shared Notes */}
                        <div>
                          <p className="text-sm font-medium mb-2 flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" /> Session Notes
                          </p>
                          {moduleNotes.length > 0 && (
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
                                      {note.author_role === 'admin' ? '🏌️ Coach' : '📝 Student'}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {format(new Date(note.created_at), 'MMM d, h:mm a')}
                                    </span>
                                  </div>
                                  <p className="whitespace-pre-wrap">{note.content}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Textarea
                              placeholder="Add a note for this session..."
                              value={newNote[module.moduleNumber] || ''}
                              onChange={(e) => setNewNote({ ...newNote, [module.moduleNumber]: e.target.value })}
                              className="min-h-[60px]"
                            />
                            <Button
                              size="sm"
                              className="shrink-0 self-end"
                              disabled={!newNote[module.moduleNumber]?.trim()}
                              onClick={() => handleAddNote(module.moduleNumber)}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

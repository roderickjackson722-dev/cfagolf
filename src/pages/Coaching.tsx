import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  BookOpen, CheckCircle2, Circle, MessageSquare, ListChecks, 
  Calendar, Clock, Video, ChevronDown, ChevronUp, Send, Trash2
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
import { DeliverablesList } from '@/components/worksheets/DeliverablesList';
import { MEETING_MODULES, useMyMeetingProgress } from '@/hooks/useMeetingProgress';
import { useSessionNotes, useAddSessionNote, useDeleteSessionNote } from '@/hooks/useSessionNotes';
import { useSessionActionItems, useToggleActionItem } from '@/hooks/useSessionActionItems';
import { format } from 'date-fns';

export default function Coaching() {
  const { user, hasPaidAccess, loading } = useAuth();
  const { data: progressData = [], isLoading: progressLoading } = useMyMeetingProgress();
  const { data: allNotes = [] } = useSessionNotes(user?.id);
  const { data: allActionItems = [] } = useSessionActionItems(user?.id);
  const addNote = useAddSessionNote();
  const deleteNote = useDeleteSessionNote();
  const toggleItem = useToggleActionItem();

  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [newNote, setNewNote] = useState<Record<number, string>>({});

  if (loading || progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!hasPaidAccess) return <Navigate to="/pricing" replace />;

  const getProgress = (moduleNumber: number) =>
    progressData.find((p) => p.module_number === moduleNumber);
  
  const getNotesForModule = (moduleNumber: number) =>
    allNotes.filter((n) => n.module_number === moduleNumber);
  
  const getItemsForModule = (moduleNumber: number) =>
    allActionItems.filter((i) => i.module_number === moduleNumber);

  const completedCount = progressData.filter((p) => p.is_completed).length;
  const progressPercent = Math.round((completedCount / MEETING_MODULES.length) * 100);
  const nextModule = MEETING_MODULES.find((m) => !getProgress(m.moduleNumber)?.is_completed);
  
  const pendingActionItems = allActionItems.filter((i) => !i.is_completed);
  const upcomingSession = progressData
    .filter((p) => p.session_date && new Date(p.session_date) > new Date())
    .sort((a, b) => new Date(a.session_date!).getTime() - new Date(b.session_date!).getTime())[0];

  const handleAddNote = (moduleNumber: number) => {
    const content = newNote[moduleNumber]?.trim();
    if (!content || !user) return;
    addNote.mutate({
      userId: user.id,
      moduleNumber,
      content,
      authorRole: 'user',
    });
    setNewNote({ ...newNote, [moduleNumber]: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">My Coaching Sessions</h1>
            <p className="text-muted-foreground text-sm">
              Track your progress, review notes, and prepare for upcoming sessions
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{completedCount}/{MEETING_MODULES.length}</div>
              <p className="text-xs text-muted-foreground">Sessions Complete</p>
              <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{pendingActionItems.length}</div>
              <p className="text-xs text-muted-foreground">Pending Action Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {upcomingSession ? (
                <>
                  <div className="text-sm font-bold text-primary">
                    {format(new Date(upcomingSession.session_date!), 'MMM d, yyyy')}
                  </div>
                  <p className="text-xs text-muted-foreground">Next Session</p>
                  {upcomingSession.meet_link && (
                    <a
                      href={upcomingSession.meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                    >
                      <Video className="w-3 h-3" /> Join Meeting
                    </a>
                  )}
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-muted-foreground">—</div>
                  <p className="text-xs text-muted-foreground">No upcoming session</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pending Action Items Summary */}
        {pendingActionItems.length > 0 && (
          <Card className="mb-6 border-amber-200 bg-amber-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-amber-600" />
                Your To-Do List
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingActionItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded border bg-background">
                  <Checkbox
                    checked={false}
                    onCheckedChange={() =>
                      toggleItem.mutate({ itemId: item.id, isCompleted: true, userId: user!.id })
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Module {item.module_number}
                      {item.due_date && ` • Due ${format(new Date(item.due_date), 'MMM d')}`}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Module List */}
        <div className="space-y-3">
          {MEETING_MODULES.map((module) => {
            const progress = getProgress(module.moduleNumber);
            const isCompleted = progress?.is_completed || false;
            const isExpanded = expandedModule === module.moduleNumber;
            const notes = getNotesForModule(module.moduleNumber);
            const actionItems = getItemsForModule(module.moduleNumber);

            return (
              <Collapsible
                key={module.moduleNumber}
                open={isExpanded}
                onOpenChange={(open) => setExpandedModule(open ? module.moduleNumber : null)}
              >
                <div className={`border rounded-lg transition-colors ${isCompleted ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}>
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors rounded-lg">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${isCompleted ? 'text-primary' : ''}`}>
                          {module.moduleNumber === 0 ? 'Intro' : `Module ${module.moduleNumber}`}: {module.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{module.description}</p>
                        {progress?.session_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {format(new Date(progress.session_date), 'MMM d, yyyy')}
                            {progress.session_duration_minutes && (
                              <span className="ml-2">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {progress.session_duration_minutes} min
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {notes.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <MessageSquare className="w-3 h-3 mr-1" />{notes.length}
                          </Badge>
                        )}
                        {actionItems.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <ListChecks className="w-3 h-3 mr-1" />
                            {actionItems.filter(i => i.is_completed).length}/{actionItems.length}
                          </Badge>
                        )}
                        {module.pageNumber && (
                          <Badge variant="outline" className="text-xs">{module.pageNumber}</Badge>
                        )}
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-4 border-t pt-4">
                      {/* Next Session Agenda */}
                      {progress?.next_agenda && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-xs font-semibold text-blue-700 mb-1">📋 Session Agenda</p>
                          <p className="text-sm text-blue-900 whitespace-pre-wrap">{progress.next_agenda}</p>
                        </div>
                      )}

                      {/* Meet Link */}
                      {progress?.meet_link && !isCompleted && (
                        <a
                          href={progress.meet_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
                        >
                          <Video className="w-4 h-4" /> Join Google Meet
                        </a>
                      )}

                      {/* Action Items */}
                      {actionItems.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2 flex items-center gap-1">
                            <ListChecks className="w-4 h-4" /> Action Items
                          </p>
                          <div className="space-y-2">
                            {actionItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-3 p-2 rounded border">
                                <Checkbox
                                  checked={item.is_completed}
                                  onCheckedChange={(checked) =>
                                    toggleItem.mutate({ itemId: item.id, isCompleted: !!checked, userId: user!.id })
                                  }
                                />
                                <div className="flex-1">
                                  <p className={`text-sm ${item.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                                    {item.title}
                                  </p>
                                  {item.due_date && (
                                    <p className="text-xs text-muted-foreground">
                                      Due {format(new Date(item.due_date), 'MMM d, yyyy')}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Deliverables */}
                      <DeliverablesList
                        moduleNumber={module.moduleNumber}
                        program="hs"
                      />

                      {/* Shared Notes */}
                      <div>
                        <p className="text-sm font-medium mb-2 flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" /> Session Notes
                        </p>
                        {notes.length === 0 && (
                          <p className="text-xs text-muted-foreground italic">No notes yet for this session.</p>
                        )}
                        <div className="space-y-2 mb-3">
                          {notes.map((note) => (
                            <div
                              key={note.id}
                              className={`p-3 rounded-lg text-sm ${
                                note.author_role === 'admin'
                                  ? 'bg-primary/5 border border-primary/10'
                                  : 'bg-muted border'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <Badge variant={note.author_role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                                  {note.author_role === 'admin' ? '🏌️ Coach Rod' : '📝 You'}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(note.created_at), 'MMM d, h:mm a')}
                                  </span>
                                  {note.author_role === 'user' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => deleteNote.mutate({ noteId: note.id, userId: user!.id })}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <p className="whitespace-pre-wrap">{note.content}</p>
                            </div>
                          ))}
                        </div>

                        {/* Add note */}
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Add a note or question..."
                            value={newNote[module.moduleNumber] || ''}
                            onChange={(e) => setNewNote({ ...newNote, [module.moduleNumber]: e.target.value })}
                            className="min-h-[60px]"
                          />
                          <Button
                            size="sm"
                            className="shrink-0 self-end"
                            disabled={!newNote[module.moduleNumber]?.trim() || addNote.isPending}
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
      </main>
      <Footer />
    </div>
  );
}

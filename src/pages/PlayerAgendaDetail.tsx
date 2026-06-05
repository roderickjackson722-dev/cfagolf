import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useStudentAgenda, useSaveAgendaTask } from '@/hooks/useAgendas';

export default function PlayerAgendaDetail() {
  const { agendaId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data, isLoading } = useStudentAgenda(agendaId);
  const saveTask = useSaveAgendaTask();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  if (loading || isLoading) return <div className="p-8 text-center">Loading…</div>;
  if (!data) return <div className="p-8 text-center">Agenda not found.</div>;

  const toggle = (t: any) =>
    saveTask.mutate({
      id: t.id,
      agenda_id: agendaId!,
      status: t.status === 'completed' ? 'pending' : 'completed',
      completed_at: t.status === 'completed' ? null : new Date().toISOString(),
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 max-w-3xl space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/player/agendas"><ArrowLeft className="w-4 h-4 mr-1" />Back</Link>
        </Button>
        <Card>
          <CardContent className="p-4 space-y-2">
            <h1 className="text-xl font-bold">{data.agenda.title}</h1>
            <div className="text-sm text-muted-foreground flex gap-2">
              {data.agenda.meeting_date && <span>{data.agenda.meeting_date}</span>}
              {data.agenda.meeting_type && <span>· {data.agenda.meeting_type}</span>}
              <Badge variant="outline">{data.agenda.status}</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {data.tasks.map((t) => (
            <Card key={t.id} className={t.status === 'completed' ? 'opacity-70' : ''}>
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <button onClick={() => toggle(t)}>
                    <CheckCircle2 className={`w-5 h-5 ${t.status === 'completed' ? 'text-green-600' : 'text-muted-foreground'}`} />
                  </button>
                  <div className="flex-1">
                    <div className="font-medium">{t.title}</div>
                    {t.description && <div className="text-sm text-muted-foreground whitespace-pre-wrap">{t.description}</div>}
                    {t.link_url && (
                      <a href={t.link_url} target="_blank" rel="noreferrer" className="text-sm text-primary underline inline-flex items-center gap-1 mt-1">
                        <ExternalLink className="w-3 h-3" />{t.link_text || t.link_url}
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {data.agenda.notes && (
          <Card>
            <CardContent className="p-4">
              <div className="font-semibold mb-1">Meeting Notes</div>
              <div className="text-sm whitespace-pre-wrap">{data.agenda.notes}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

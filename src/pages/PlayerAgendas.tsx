import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useMyAgendas } from '@/hooks/useAgendas';

export default function PlayerAgendas() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: agendas, isLoading } = useMyAgendas();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  if (loading || isLoading) return <div className="p-8 text-center">Loading…</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold">My Meeting Agendas</h1>
        {!agendas?.length ? (
          <div className="text-sm text-muted-foreground">No agendas yet.</div>
        ) : (
          <div className="grid gap-2">
            {agendas.map((a) => (
              <Card key={a.id}>
                <CardContent className="p-3">
                  <Link to={`/player/agendas/${a.id}`} className="block">
                    <div className="font-medium">{a.title}</div>
                    <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-1">
                      {a.meeting_date && <span>{a.meeting_date}</span>}
                      {a.meeting_type && <span>· {a.meeting_type}</span>}
                      <Badge variant="outline" className="text-xs">{a.status}</Badge>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useFreeResources, useDownloadLogs } from '@/hooks/useFreeResources';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download } from 'lucide-react';

function downloadCSV(rows: Record<string, any>[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? '')).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function FreeResourcesStats() {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const navigate = useNavigate();
  const { data: resources = [] } = useFreeResources();
  const { data: logs = [] } = useDownloadLogs();

  if (loading || roleLoading) return <div className="p-8">Loading...</div>;
  if (!user) { navigate('/login'); return null; }
  if (!isAdmin) return <div className="p-8">Access denied.</div>;

  const totalDownloads = resources.reduce((a, r) => a + (r.download_count || 0), 0);

  const bySource = useMemo(() => {
    const m: Record<string, number> = {};
    logs.forEach((l: any) => {
      const s = l.source || 'Unknown';
      m[s] = (m[s] || 0) + 1;
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [logs]);

  const byDay = useMemo(() => {
    const m: Record<string, number> = {};
    logs.forEach((l: any) => {
      const d = new Date(l.created_at).toISOString().slice(0, 10);
      m[d] = (m[d] || 0) + 1;
    });
    return Object.entries(m).sort((a, b) => a[0].localeCompare(b[0])).slice(-30);
  }, [logs]);

  const maxDay = Math.max(1, ...byDay.map(([, v]) => v));

  const topResources = [...resources]
    .sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-2">
              <Link to="/admin/resources"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Resources</Link>
            </Button>
            <h1 className="text-3xl font-bold">Download Stats</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => downloadCSV(
              logs.map((l: any) => {
                const r = resources.find((x) => x.id === l.resource_id);
                return {
                  date: l.created_at,
                  resource: r?.name || l.resource_id,
                  slug: r?.slug || '',
                  source: l.source,
                  downloaded_by: l.downloaded_by,
                };
              }),
              `resource-downloads-${new Date().toISOString().slice(0, 10)}.csv`,
            )}
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Total Downloads</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">{totalDownloads}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Resources</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">{resources.length}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Logged Events</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">{logs.length}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Downloads — Last 30 Days</CardTitle></CardHeader>
          <CardContent>
            {byDay.length === 0 ? (
              <p className="text-muted-foreground text-sm">No download events yet.</p>
            ) : (
              <div className="flex items-end gap-1 h-40">
                {byDay.map(([d, v]) => (
                  <div key={d} className="flex-1 flex flex-col items-center justify-end" title={`${d}: ${v}`}>
                    <div className="w-full bg-primary/70 rounded-t" style={{ height: `${(v / maxDay) * 100}%` }} />
                    <div className="text-[9px] text-muted-foreground mt-1 rotate-45 origin-left">{d.slice(5)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle>Top Resources</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {topResources.map((r) => (
                  <li key={r.id} className="flex justify-between text-sm border-b py-1">
                    <span>{r.name}</span>
                    <span className="font-mono">{r.download_count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Downloads by Source</CardTitle></CardHeader>
            <CardContent>
              {bySource.length === 0 ? (
                <p className="text-muted-foreground text-sm">No events yet.</p>
              ) : (
                <ul className="space-y-2">
                  {bySource.map(([s, v]) => (
                    <li key={s} className="flex justify-between text-sm border-b py-1">
                      <span>{s}</span><span className="font-mono">{v}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Loader2, FileText, Download, Search, User as UserIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAllProfiles } from '@/hooks/useAdminUsers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type MemberDoc = {
  id: string;
  category: string;
  title: string;
  file_name: string;
  file_size: number;
  storage_path: string;
  created_at: string;
};

type SwingVideo = {
  id: string;
  title: string;
  video_url: string;
  swing_type: string | null;
  club: string | null;
  created_at: string;
};

type WorksheetRow = {
  id: string;
  worksheet_key: string;
  data: any;
  updated_at: string;
};

type CountRow = { count: number };

const formatBytes = (b: number) => {
  if (!b) return '0 B';
  const u = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return `${(b / Math.pow(1024, i)).toFixed(1)} ${u[i]}`;
};

export function AdminMemberContent() {
  const { data: profiles = [], isLoading: profilesLoading } = useAllProfiles();
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter(
      (p) =>
        p.email?.toLowerCase().includes(q) ||
        p.full_name?.toLowerCase().includes(q),
    );
  }, [profiles, search]);

  const selected = profiles.find((p) => p.user_id === selectedUserId) || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-4">
      {/* Member list */}
      <Card className="lg:max-h-[75vh] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Select a member</CardTitle>
          <div className="relative mt-2">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email"
              className="pl-8 h-9"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-1 pt-0">
          {profilesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No members</p>
          ) : (
            filtered.map((p) => (
              <button
                key={p.user_id}
                onClick={() => setSelectedUserId(p.user_id)}
                className={`w-full text-left p-2 rounded-md transition-colors ${
                  selectedUserId === p.user_id
                    ? 'bg-primary/10 border border-primary/30'
                    : 'hover:bg-muted/50 border border-transparent'
                }`}
              >
                <p className="text-sm font-medium truncate">
                  {p.full_name || '(no name)'}
                </p>
                <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                {p.has_paid_access && (
                  <Badge variant="secondary" className="mt-1 text-[10px] h-4">
                    Paid
                  </Badge>
                )}
              </button>
            ))
          )}
        </CardContent>
      </Card>

      {/* Member detail */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-primary" />
            {selected
              ? `${selected.full_name || selected.email} — saved content`
              : 'Choose a member to view their files & saved data'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selected ? (
            <MemberContentTabs userId={selected.user_id} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a member from the list to see all documents, worksheets, swing videos, target
              schools, coach contacts, tournament results, campus visits, scholarship offers, and
              referrals.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MemberContentTabs({ userId }: { userId: string }) {
  const [docs, setDocs] = useState<MemberDoc[]>([]);
  const [swings, setSwings] = useState<SwingVideo[]>([]);
  const [worksheets, setWorksheets] = useState<WorksheetRow[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const tables = [
        'target_schools',
        'coach_contacts',
        'tournament_results',
        'campus_visits',
        'scholarship_offers',
        'recruiting_milestones',
        'transfer_portal_entries',
        'favorites',
        'wagr_attendance',
        'session_notes',
        'session_action_items',
      ] as const;

      const [d, s, w, ...rest] = await Promise.all([
        supabase
          .from('member_documents')
          .select('id,category,title,file_name,file_size,storage_path,created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('swing_videos')
          .select('id,title,video_url,swing_type,club,created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('worksheet_data')
          .select('id,worksheet_key,data,updated_at')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false }),
        ...tables.map((t) =>
          supabase.from(t as any).select('id', { count: 'exact', head: true }).eq('user_id', userId),
        ),
      ]);

      if (cancelled) return;
      setDocs((d.data as MemberDoc[]) || []);
      setSwings((s.data as SwingVideo[]) || []);
      setWorksheets((w.data as WorksheetRow[]) || []);
      const c: Record<string, number> = {};
      tables.forEach((t, i) => {
        c[t] = rest[i].count ?? 0;
      });
      setCounts(c);
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const downloadDoc = async (doc: MemberDoc) => {
    try {
      const { data, error } = await supabase.storage
        .from('member-documents')
        .createSignedUrl(doc.storage_path, 60);
      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="documents">
      <TabsList className="flex flex-wrap h-auto">
        <TabsTrigger value="documents">Documents ({docs.length})</TabsTrigger>
        <TabsTrigger value="worksheets">Worksheets ({worksheets.length})</TabsTrigger>
        <TabsTrigger value="swing">Swing Videos ({swings.length})</TabsTrigger>
        <TabsTrigger value="activity">Tools Activity</TabsTrigger>
      </TabsList>

      <TabsContent value="documents" className="mt-4">
        {docs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents uploaded.</p>
        ) : (
          <div className="space-y-2">
            {docs.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between p-3 rounded-md border bg-background"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{d.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {d.file_name} • {formatBytes(d.file_size)} •{' '}
                      <Badge variant="outline" className="text-[10px] h-4 ml-1">
                        {d.category}
                      </Badge>{' '}
                      • {format(new Date(d.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => downloadDoc(d)}>
                  <Download className="w-3.5 h-3.5 mr-1" /> Open
                </Button>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="worksheets" className="mt-4">
        {worksheets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No worksheets saved.</p>
        ) : (
          <div className="space-y-2">
            {worksheets.map((w) => (
              <details
                key={w.id}
                className="rounded-md border bg-background p-3 text-sm group"
              >
                <summary className="cursor-pointer flex items-center justify-between">
                  <span className="font-medium">{w.worksheet_key}</span>
                  <span className="text-xs text-muted-foreground">
                    Updated {format(new Date(w.updated_at), 'MMM d, yyyy')}
                  </span>
                </summary>
                <pre className="mt-3 text-xs bg-muted/50 p-2 rounded overflow-x-auto max-h-64">
                  {JSON.stringify(w.data, null, 2)}
                </pre>
              </details>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="swing" className="mt-4">
        {swings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No swing videos uploaded.</p>
        ) : (
          <div className="space-y-2">
            {swings.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-md border bg-background"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{s.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {[s.swing_type, s.club].filter(Boolean).join(' • ') || '—'} •{' '}
                    {format(new Date(s.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <a href={s.video_url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">
                    Watch
                  </Button>
                </a>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="activity" className="mt-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(counts).map(([key, count]) => (
            <div key={key} className="p-3 rounded-md border bg-background">
              <p className="text-xs text-muted-foreground capitalize">
                {key.replace(/_/g, ' ')}
              </p>
              <p className="text-2xl font-semibold text-foreground">{count}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Counts of records the member has saved across recruiting tools.
        </p>
      </TabsContent>
    </Tabs>
  );
}

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Pencil, Globe, RefreshCcw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useStudent } from '@/hooks/useStudents';
import { useUpsertPlayer, slugify, type Player } from '@/hooks/usePlayers';
import { toast } from 'sonner';

interface Props {
  studentId: string;
}

function useMatchedPlayer(studentId: string) {
  const { data: student } = useStudent(studentId);
  return useQuery({
    queryKey: ['student-matched-player', studentId, student?.slug, student?.full_name, student?.email],
    enabled: !!student,
    queryFn: async () => {
      // Try slug first
      if (student?.slug) {
        const { data } = await supabase.from('players').select('*').eq('slug', student.slug).maybeSingle();
        if (data) return data as unknown as Player;
      }
      if (student?.email) {
        const { data } = await supabase.from('players').select('*').eq('contact_email', student.email).maybeSingle();
        if (data) return data as unknown as Player;
      }
      if (student?.full_name) {
        const { data } = await supabase.from('players').select('*').ilike('full_name', student.full_name).maybeSingle();
        if (data) return data as unknown as Player;
      }
      return null;
    },
  });
}

export default function StudentWebsiteTab({ studentId }: Props) {
  const qc = useQueryClient();
  const { data: student } = useStudent(studentId);
  const { data: player, isLoading, refetch } = useMatchedPlayer(studentId);
  const upsert = useUpsertPlayer();
  const [iframeKey, setIframeKey] = useState(0);

  const siteUrl = useMemo(() => (player ? `/p/${player.slug}` : null), [player]);

  const createSite = async () => {
    if (!student) return;
    try {
      const baseSlug = student.slug || slugify(student.full_name);
      const newPlayer = await upsert.mutateAsync({
        full_name: student.full_name,
        slug: baseSlug,
        graduation_year: student.graduation_year,
        handicap: student.handicap,
        scoring_average: student.scoring_average,
        high_school: student.high_school,
        gpa: student.gpa,
        contact_email: student.email,
        is_active: true,
        allow_editing: true,
      } as any);
      toast.success('Personal website created');
      await qc.invalidateQueries({ queryKey: ['student-matched-player', studentId] });
      // Also save the URL onto the student record so it shows in header
      await supabase
        .from('students' as any)
        .update({ personal_website_url: `${window.location.origin}/p/${(newPlayer as any).slug}` })
        .eq('id', studentId);
      qc.invalidateQueries({ queryKey: ['student', studentId] });
    } catch (e: any) {
      toast.error(e.message || 'Could not create site');
    }
  };

  if (isLoading) return <div className="p-6 text-center text-sm text-muted-foreground">Loading website…</div>;

  if (!player) {
    return (
      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <h3 className="font-semibold">No personal website yet</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            This student doesn't have a recruiting site connected. Create one to start editing the live page that
            college coaches will see.
          </p>
          <Button onClick={createSite} disabled={upsert.isPending}>
            <Plus className="w-4 h-4 mr-1" />
            {upsert.isPending ? 'Creating…' : 'Create Personal Website'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <h3 className="font-semibold">{player.full_name}'s Recruiting Site</h3>
              <Badge variant={player.is_active ? 'default' : 'secondary'}>
                {player.is_active ? 'Live' : 'Hidden'}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">/p/{player.slug}</div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setIframeKey((k) => k + 1)}>
              <RefreshCcw className="w-4 h-4 mr-1" />Refresh
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={siteUrl!} target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />Open Live Site
              </a>
            </Button>
            <Button size="sm" asChild>
              <Link to={`/admin/players/${player.id}/edit`}>
                <Pencil className="w-4 h-4 mr-1" />Edit Website
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-2">
          <div className="text-xs text-muted-foreground px-2 py-1">Live preview · changes appear immediately after saving in Edit Website</div>
          <iframe
            key={iframeKey}
            src={siteUrl!}
            title="Personal website preview"
            className="w-full h-[70vh] rounded border bg-background"
          />
        </CardContent>
      </Card>
    </div>
  );
}

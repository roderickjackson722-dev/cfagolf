import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, ImageDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const STATE_MAP: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma',
  OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  PR: 'Puerto Rico', VI: 'U.S. Virgin Islands', GU: 'Guam',
};

export function AdminDatabaseCleanup() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [running, setRunning] = useState<null | 'state' | 'logos'>(null);
  const [statusMsg, setStatusMsg] = useState('');

  const { data: stats, refetch } = useQuery({
    queryKey: ['db-cleanup-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colleges')
        .select('state, logo_url, logo_needs_manual, website_url')
        .limit(2000);
      if (error) throw error;
      const abbrCount = data.filter((c) => c.state && c.state.length === 2).length;
      const noLogo = data.filter((c) => !c.logo_url).length;
      const needsManual = data.filter((c) => c.logo_needs_manual).length;
      const fetchable = data.filter((c) => !c.logo_url && !c.logo_needs_manual && c.website_url).length;
      return { total: data.length, abbrCount, noLogo, needsManual, fetchable };
    },
  });

  const handleNormalizeStates = async () => {
    setRunning('state');
    try {
      const { data: rows, error } = await supabase
        .from('colleges')
        .select('id, state')
        .limit(2000);
      if (error) throw error;

      const updates = rows
        .filter((r) => r.state && r.state.length === 2 && STATE_MAP[r.state.toUpperCase()])
        .map((r) => ({ id: r.id, state: STATE_MAP[r.state.toUpperCase()] }));

      const unmapped = rows.filter(
        (r) => r.state && r.state.length === 2 && !STATE_MAP[r.state.toUpperCase()]
      );

      let updated = 0;
      for (const u of updates) {
        const { error: updErr } = await supabase
          .from('colleges')
          .update({ state: u.state })
          .eq('id', u.id);
        if (!updErr) updated++;
      }

      toast({
        title: 'State Normalization Complete',
        description: `Updated ${updated} records. ${unmapped.length} unmapped.${
          unmapped.length ? ' Check console for list.' : ''
        }`,
      });
      if (unmapped.length) {
        console.log('Unmapped state entries:', unmapped);
      }
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to normalize',
        variant: 'destructive',
      });
    } finally {
      setRunning(null);
    }
  };

  const handleFetchLogos = async () => {
    setRunning('logos');
    setStatusMsg('Starting...');
    let totalSucceeded = 0;
    let totalFailed = 0;
    try {
      while (true) {
        setStatusMsg(`Processed ${totalSucceeded} so far...`);
        const { data, error } = await supabase.functions.invoke('fetch-college-logos', {
          body: { batchSize: 30, offset: 0 },
        });
        if (error) throw error;
        if (!data.success) throw new Error(data.error);
        totalSucceeded += data.succeeded;
        totalFailed += data.failed;
        if (data.processed === 0 || data.remaining === 0) break;
      }
      toast({
        title: 'Logo Cleanup Complete',
        description: `Fetched ${totalSucceeded} logos. ${totalFailed} flagged for manual review.`,
      });
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed',
        variant: 'destructive',
      });
    } finally {
      setRunning(null);
      setStatusMsg('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Cleanup Tools</CardTitle>
        <CardDescription>
          Normalize state names and backfill missing college logos in bulk.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg border p-3">
            <div className="text-2xl font-bold">{stats?.total ?? '—'}</div>
            <div className="text-xs text-muted-foreground">Total colleges</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-2xl font-bold text-amber-600">{stats?.abbrCount ?? '—'}</div>
            <div className="text-xs text-muted-foreground">Abbreviated states</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-2xl font-bold text-amber-600">{stats?.fetchable ?? '—'}</div>
            <div className="text-xs text-muted-foreground">Logos fetchable</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-2xl font-bold text-destructive">{stats?.needsManual ?? '—'}</div>
            <div className="text-xs text-muted-foreground">Manual logos needed</div>
          </div>
        </div>

        {/* State normalization */}
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold">Normalize State Names</h3>
              <p className="text-sm text-muted-foreground">
                Convert 2-letter abbreviations (CA, NY, TX) to full names (California, New York,
                Texas). Skips records already using full names.
              </p>
            </div>
          </div>
          <Button
            onClick={handleNormalizeStates}
            disabled={running !== null || stats?.abbrCount === 0}
          >
            {running === 'state' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Normalizing...
              </>
            ) : stats?.abbrCount === 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                All states normalized
              </>
            ) : (
              `Normalize ${stats?.abbrCount ?? 0} records`
            )}
          </Button>
        </div>

        {/* Logo backfill */}
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-start gap-3">
            <ImageDown className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold">Backfill Missing Logos</h3>
              <p className="text-sm text-muted-foreground">
                Tries Clearbit + Google favicon for each school's domain. Flags unfindable schools
                with <Badge variant="outline" className="ml-1">Needs manual</Badge> so you can fix
                them later. Schools with valid logos are never modified.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleFetchLogos} disabled={running !== null || stats?.fetchable === 0}>
              {running === 'logos' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {statusMsg || 'Fetching...'}
                </>
              ) : stats?.fetchable === 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  All available logos fetched
                </>
              ) : (
                `Fetch ${stats?.fetchable ?? 0} logos`
              )}
            </Button>
            {stats && stats.needsManual > 0 && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                {stats.needsManual} require manual upload
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, Eye, Search, FileText, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type Release = {
  id: string;
  user_id: string;
  full_name: string;
  date_of_birth: string;
  graduation_year: number;
  current_school: string;
  gpa: string;
  sat_score: string | null;
  act_score: string | null;
  golf_achievements: string;
  player_email: string;
  player_phone: string;
  parent_name: string | null;
  parent_relationship: string | null;
  parent_email: string | null;
  parent_phone: string | null;
  auth_athletic_profile: boolean;
  auth_academic_info: boolean;
  auth_personal_info: boolean;
  auth_direct_coach_contact: boolean;
  release_marketing: boolean | null;
  release_website_social: boolean | null;
  release_name_achievements: boolean | null;
  release_success_story: boolean | null;
  ack_not_agency: boolean;
  ack_no_guarantees: boolean;
  ack_flat_fee: boolean;
  ack_no_control_third_party: boolean;
  ack_can_withdraw: boolean;
  player_signature: string;
  player_signature_date: string;
  parent_signature: string | null;
  parent_signature_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  submitted: 'default',
  active: 'default',
  withdrawn: 'destructive',
  archived: 'secondary',
};

export function AdminReleasesTable() {
  const { toast } = useToast();
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Release | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReleases = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('player_profile_releases')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(2000);
    if (error) {
      toast({ title: 'Failed to load releases', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }
    setReleases((data ?? []) as Release[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchReleases();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return releases;
    return releases.filter((r) =>
      [r.full_name, r.player_email, r.parent_email, r.current_school, r.status]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    );
  }, [releases, search]);

  const updateStatus = async (release: Release, newStatus: string) => {
    setUpdatingId(release.id);
    const { error } = await supabase
      .from('player_profile_releases')
      .update({ status: newStatus })
      .eq('id', release.id);
    setUpdatingId(null);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Status updated', description: `${release.full_name} → ${newStatus}` });
    setReleases((prev) =>
      prev.map((r) => (r.id === release.id ? { ...r, status: newStatus } : r))
    );
    if (selected?.id === release.id) {
      setSelected({ ...release, status: newStatus });
    }
  };

  const exportCsv = () => {
    if (filtered.length === 0) {
      toast({ title: 'Nothing to export' });
      return;
    }
    const headers = [
      'submitted_at',
      'status',
      'full_name',
      'date_of_birth',
      'graduation_year',
      'current_school',
      'gpa',
      'sat_score',
      'act_score',
      'player_email',
      'player_phone',
      'parent_name',
      'parent_relationship',
      'parent_email',
      'parent_phone',
      'auth_athletic_profile',
      'auth_academic_info',
      'auth_personal_info',
      'auth_direct_coach_contact',
      'release_marketing',
      'release_website_social',
      'release_name_achievements',
      'release_success_story',
      'player_signature',
      'player_signature_date',
      'parent_signature',
      'parent_signature_date',
    ];
    const escape = (v: unknown) => {
      if (v === null || v === undefined) return '';
      const s = String(v).replace(/"/g, '""');
      return `"${s}"`;
    };
    const rows = filtered.map((r) =>
      headers
        .map((h) => {
          if (h === 'submitted_at') return escape(r.created_at);
          return escape((r as unknown as Record<string, unknown>)[h]);
        })
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `player-releases-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Export complete', description: `${filtered.length} record(s) downloaded.` });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or school"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={fetchReleases} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        <div className="text-sm text-muted-foreground ml-auto">
          {filtered.length} of {releases.length} release{releases.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Grad</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Loading…
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No releases found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.full_name}</TableCell>
                  <TableCell className="text-sm">{r.player_email}</TableCell>
                  <TableCell className="text-sm">{r.current_school}</TableCell>
                  <TableCell>{r.graduation_year}</TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(r.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANTS[r.status] ?? 'outline'}>{r.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(r)}>
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Player Profile Release — {selected.full_name}
                </DialogTitle>
                <DialogDescription>
                  Submitted {format(new Date(selected.created_at), 'PPP')} • Status:{' '}
                  <Badge variant={STATUS_VARIANTS[selected.status] ?? 'outline'}>
                    {selected.status}
                  </Badge>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 text-sm">
                <Section title="Player Information">
                  <Field label="Full Name" value={selected.full_name} />
                  <Field label="Date of Birth" value={selected.date_of_birth} />
                  <Field label="Graduation Year" value={selected.graduation_year} />
                  <Field label="Current School" value={selected.current_school} />
                  <Field label="GPA" value={selected.gpa} />
                  <Field label="SAT" value={selected.sat_score || '—'} />
                  <Field label="ACT" value={selected.act_score || '—'} />
                  <Field label="Email" value={selected.player_email} />
                  <Field label="Phone" value={selected.player_phone} />
                </Section>

                <Section title="Parent / Guardian">
                  <Field label="Name" value={selected.parent_name || '—'} />
                  <Field label="Relationship" value={selected.parent_relationship || '—'} />
                  <Field label="Email" value={selected.parent_email || '—'} />
                  <Field label="Phone" value={selected.parent_phone || '—'} />
                </Section>

                <Section title="Golf Achievements">
                  <p className="whitespace-pre-wrap col-span-2 text-foreground/80">
                    {selected.golf_achievements}
                  </p>
                </Section>

                <Section title="Authorizations">
                  <Check label="Athletic profile" value={selected.auth_athletic_profile} />
                  <Check label="Academic info" value={selected.auth_academic_info} />
                  <Check label="Personal info" value={selected.auth_personal_info} />
                  <Check label="Direct coach contact" value={selected.auth_direct_coach_contact} />
                </Section>

                <Section title="Marketing Releases">
                  <Check label="Marketing materials" value={!!selected.release_marketing} />
                  <Check label="Website / social" value={!!selected.release_website_social} />
                  <Check label="Name & achievements" value={!!selected.release_name_achievements} />
                  <Check label="Success story" value={!!selected.release_success_story} />
                </Section>

                <Section title="Acknowledgements">
                  <Check label="Not an agency" value={selected.ack_not_agency} />
                  <Check label="No guarantees" value={selected.ack_no_guarantees} />
                  <Check label="Flat fee" value={selected.ack_flat_fee} />
                  <Check label="No control over third parties" value={selected.ack_no_control_third_party} />
                  <Check label="Can withdraw" value={selected.ack_can_withdraw} />
                </Section>

                <Section title="Signatures">
                  <Field label="Player Signature" value={selected.player_signature} />
                  <Field label="Player Signed" value={selected.player_signature_date} />
                  <Field label="Parent Signature" value={selected.parent_signature || '—'} />
                  <Field
                    label="Parent Signed"
                    value={selected.parent_signature_date || '—'}
                  />
                </Section>

                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updatingId === selected.id || selected.status === 'active'}
                    onClick={() => updateStatus(selected, 'active')}
                  >
                    Mark Active
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updatingId === selected.id || selected.status === 'archived'}
                    onClick={() => updateStatus(selected, 'archived')}
                  >
                    Archive
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={updatingId === selected.id || selected.status === 'withdrawn'}
                    onClick={() => updateStatus(selected, 'withdrawn')}
                  >
                    Withdraw Consent
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 bg-muted/30 rounded-md p-3">
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function Check({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex w-4 h-4 items-center justify-center rounded-sm border ${
          value ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/40'
        }`}
      >
        {value ? '✓' : ''}
      </span>
      <span className="text-foreground/80">{label}</span>
    </div>
  );
}

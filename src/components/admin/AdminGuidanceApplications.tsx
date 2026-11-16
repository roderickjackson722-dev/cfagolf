import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Mail, Phone, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function AdminGuidanceApplications() {
  const { data: applications = [], isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['admin-guidance-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guidance_applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">Loading applications...</div>;
  }

  if (isError) {
    return (
      <div className="py-8 text-center">
        <p className="text-destructive">Applications could not be loaded.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {applications.length} {applications.length === 1 ? 'application' : 'applications'}, newest first
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table className="min-w-[1050px]">
          <TableHeader>
            <TableRow>
              <TableHead>Submitted</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Academics & Golf</TableHead>
              <TableHead>Parent or Guardian</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Player Links</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(application.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{application.player_name}</div>
                  <div className="text-sm text-muted-foreground">Grade {application.grade_level}</div>
                </TableCell>
                <TableCell>
                  <div>GPA: {application.gpa}</div>
                  <div>Scoring average: {application.scoring_average}</div>
                </TableCell>
                <TableCell className="font-medium">{application.parent_name}</TableCell>
                <TableCell>
                  <a href={`mailto:${application.parent_email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Mail className="h-4 w-4 shrink-0" />
                    {application.parent_email}
                  </a>
                  <a href={`tel:${application.parent_phone}`} className="mt-2 flex items-center gap-2 text-sm text-primary hover:underline">
                    <Phone className="h-4 w-4 shrink-0" />
                    {application.parent_phone}
                  </a>
                </TableCell>
                <TableCell>
                  {application.hbcu_profile_link && (
                    <a href={application.hbcu_profile_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <ExternalLink className="h-4 w-4" /> HBCU.GOLF profile
                    </a>
                  )}
                  <a href={application.swing_video_link} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 text-sm text-primary hover:underline">
                    <ExternalLink className="h-4 w-4" /> Swing video
                  </a>
                </TableCell>
              </TableRow>
            ))}
            {applications.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No guidance applications yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

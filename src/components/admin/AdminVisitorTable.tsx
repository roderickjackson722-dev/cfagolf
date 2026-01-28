import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow } from 'date-fns';
import { Globe, MapPin, Clock, Monitor, ExternalLink, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface SiteVisitor {
  id: string;
  visitor_id: string;
  page_url: string | null;
  referrer: string | null;
  user_agent: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  created_at: string;
}

export function AdminVisitorTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: visitors = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-visitors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_visitors')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as SiteVisitor[];
    },
  });

  // Filter visitors based on search term
  const filteredVisitors = visitors.filter((visitor) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      visitor.visitor_id.toLowerCase().includes(search) ||
      visitor.page_url?.toLowerCase().includes(search) ||
      visitor.country?.toLowerCase().includes(search) ||
      visitor.city?.toLowerCase().includes(search) ||
      visitor.region?.toLowerCase().includes(search)
    );
  });

  // Get browser info from user agent
  const getBrowserInfo = (userAgent: string | null): string => {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  };

  // Get device type from user agent
  const getDeviceType = (userAgent: string | null): string => {
    if (!userAgent) return 'Unknown';
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) return 'Mobile';
    return 'Desktop';
  };

  // Stats
  const todayVisitors = visitors.filter(v => {
    const visitDate = new Date(v.created_at);
    const today = new Date();
    return visitDate.toDateString() === today.toDateString();
  }).length;

  const uniqueVisitors = new Set(visitors.map(v => v.visitor_id)).size;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{visitors.length}</div>
          <div className="text-sm text-muted-foreground">Total Visits (Last 100)</div>
        </div>
        <div className="bg-green-500/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{todayVisitors}</div>
          <div className="text-sm text-muted-foreground">Today's Visits</div>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{uniqueVisitors}</div>
          <div className="text-sm text-muted-foreground">Unique Visitors</div>
        </div>
        <div className="bg-orange-500/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {visitors.filter(v => getDeviceType(v.user_agent) === 'Mobile').length}
          </div>
          <div className="text-sm text-muted-foreground">Mobile Visits</div>
        </div>
      </div>

      {/* Search and Refresh */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by location, page, or visitor ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button 
          variant="outline" 
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Visitors Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Page</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Referrer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVisitors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No visitors found
                </TableCell>
              </TableRow>
            ) : (
              filteredVisitors.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">
                          {formatDistanceToNow(new Date(visitor.created_at), { addSuffix: true })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(visitor.created_at), 'MMM d, h:mm a')}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        {visitor.city || visitor.region || visitor.country ? (
                          <>
                            <div className="font-medium text-sm">
                              {[visitor.city, visitor.region].filter(Boolean).join(', ')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {visitor.country || 'Unknown'}
                            </div>
                          </>
                        ) : (
                          <span className="text-muted-foreground text-sm">Unknown</span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{visitor.page_url || '/'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Badge variant="outline" className="text-xs">
                          {getDeviceType(visitor.user_agent)}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {getBrowserInfo(visitor.user_agent)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {visitor.referrer ? (
                      <div className="flex items-center gap-1 text-sm max-w-[150px]">
                        <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        <span className="truncate" title={visitor.referrer}>
                          {new URL(visitor.referrer).hostname}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Direct</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

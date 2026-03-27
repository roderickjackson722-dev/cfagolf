import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, subHours, startOfDay, endOfDay, eachDayOfInterval, isToday, isYesterday } from 'date-fns';
import { Globe, MapPin, Clock, Monitor, ExternalLink, RefreshCw, TrendingUp, Users, Smartphone, BarChart3 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

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

type TimeRange = '24h' | '7d' | '30d' | '90d';

const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function AdminAnalyticsDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const rangeStart = useMemo(() => {
    switch (timeRange) {
      case '24h': return subHours(new Date(), 24).toISOString();
      case '7d': return subDays(new Date(), 7).toISOString();
      case '30d': return subDays(new Date(), 30).toISOString();
      case '90d': return subDays(new Date(), 90).toISOString();
    }
  }, [timeRange]);

  const { data: visitors = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-analytics', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_visitors')
        .select('*')
        .gte('created_at', rangeStart)
        .order('created_at', { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data as SiteVisitor[];
    },
  });

  const getBrowserInfo = (ua: string | null): string => {
    if (!ua) return 'Unknown';
    if (ua.includes('Chrome') && !ua.includes('Edge')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  };

  const getDeviceType = (ua: string | null): string => {
    if (!ua) return 'Unknown';
    if (/Mobile|Android|iPhone|iPad/.test(ua)) return 'Mobile';
    return 'Desktop';
  };

  // Stats
  const stats = useMemo(() => {
    const total = visitors.length;
    const unique = new Set(visitors.map(v => v.visitor_id)).size;
    const mobile = visitors.filter(v => getDeviceType(v.user_agent) === 'Mobile').length;
    const today = visitors.filter(v => isToday(new Date(v.created_at))).length;
    return { total, unique, mobile, today };
  }, [visitors]);

  // Daily visits chart data
  const dailyData = useMemo(() => {
    const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const interval = eachDayOfInterval({ start: subDays(new Date(), days), end: new Date() });
    return interval.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const count = visitors.filter(v => format(new Date(v.created_at), 'yyyy-MM-dd') === dayStr).length;
      const uniqueCount = new Set(visitors.filter(v => format(new Date(v.created_at), 'yyyy-MM-dd') === dayStr).map(v => v.visitor_id)).size;
      return { date: format(day, 'MMM d'), visits: count, unique: uniqueCount };
    });
  }, [visitors, timeRange]);

  // Top pages
  const topPages = useMemo(() => {
    const counts: Record<string, number> = {};
    visitors.forEach(v => { const p = v.page_url || '/'; counts[p] = (counts[p] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([page, count]) => ({ page, count }));
  }, [visitors]);

  // Top locations
  const topLocations = useMemo(() => {
    const counts: Record<string, number> = {};
    visitors.forEach(v => {
      const loc = [v.city, v.region].filter(Boolean).join(', ') || 'Unknown';
      counts[loc] = (counts[loc] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([location, count]) => ({ location, count }));
  }, [visitors]);

  // Device breakdown for pie chart
  const deviceData = useMemo(() => {
    const counts: Record<string, number> = {};
    visitors.forEach(v => { const d = getDeviceType(v.user_agent); counts[d] = (counts[d] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [visitors]);

  // Browser breakdown
  const browserData = useMemo(() => {
    const counts: Record<string, number> = {};
    visitors.forEach(v => { const b = getBrowserInfo(v.user_agent); counts[b] = (counts[b] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  }, [visitors]);

  // Referrer breakdown
  const referrerData = useMemo(() => {
    const counts: Record<string, number> = {};
    visitors.forEach(v => {
      let ref = 'Direct';
      if (v.referrer) {
        try { ref = new URL(v.referrer).hostname; } catch { ref = v.referrer; }
      }
      counts[ref] = (counts[ref] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([source, count]) => ({ source, count }));
  }, [visitors]);

  // Filtered visitors for table
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range & Refresh */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          {(['24h', '7d', '30d', '90d'] as TimeRange[]).map(range => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold text-primary">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Visits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-3xl font-bold text-blue-600">{stats.unique}</div>
            <p className="text-sm text-muted-foreground">Unique Visitors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <BarChart3 className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-3xl font-bold text-green-600">{stats.today}</div>
            <p className="text-sm text-muted-foreground">Today's Visits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Smartphone className="w-6 h-6 mx-auto mb-2 text-orange-600" />
            <div className="text-3xl font-bold text-orange-600">{stats.mobile}</div>
            <p className="text-sm text-muted-foreground">Mobile Visits</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="traffic">Traffic Overview</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          <TabsTrigger value="visitors">Visitor Log</TabsTrigger>
        </TabsList>

        {/* Traffic Overview */}
        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daily Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={2} name="Total Visits" />
                    <Line type="monotone" dataKey="unique" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Unique Visitors" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Device Pie */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={deviceData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {deviceData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Browser Bar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Browser Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={browserData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} width={60} />
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Visits" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topLocations.map(({ location, count }, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      {location}
                    </span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Pages */}
        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Most Visited Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topPages}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="page" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Page Views" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Sources */}
        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={referrerData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis type="category" dataKey="source" tick={{ fill: 'hsl(var(--muted-foreground))' }} width={120} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} name="Referrals" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visitor Log */}
        <TabsContent value="visitors">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Visitor Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search by location, page, or visitor ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
                      filteredVisitors.slice(0, 100).map((visitor) => (
                        <TableRow key={visitor.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium text-sm">
                                  {format(new Date(visitor.created_at), 'MMM d, h:mm a')}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">
                                {[visitor.city, visitor.region].filter(Boolean).join(', ') || 'Unknown'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{visitor.page_url || '/'}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {getDeviceType(visitor.user_agent)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {visitor.referrer ? (
                              <span className="text-sm truncate max-w-[120px] block" title={visitor.referrer}>
                                {(() => { try { return new URL(visitor.referrer).hostname; } catch { return 'Unknown'; } })()}
                              </span>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

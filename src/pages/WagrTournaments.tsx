import { useState, useMemo } from 'react';
import { Search, MapPin, ExternalLink, Globe, Filter, Trophy, Calendar as CalendarIcon, List, Star, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useWagrTournaments } from '@/hooks/useWagrTournaments';
import { useWagrAttendance } from '@/hooks/useWagrAttendance';
import { useAuth } from '@/hooks/useAuth';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, isToday, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// US State coordinates for simple map
const STATE_COORDS: Record<string, [number, number]> = {
  AL:[32.3,-86.9],AK:[64.2,-152.5],AZ:[34.0,-111.1],AR:[35.2,-91.8],CA:[36.8,-119.4],
  CO:[39.1,-105.4],CT:[41.6,-72.7],DE:[38.9,-75.5],FL:[27.8,-81.8],GA:[32.9,-83.4],
  HI:[19.9,-155.6],ID:[44.2,-114.4],IL:[40.3,-89.0],IN:[40.3,-86.1],IA:[42.0,-93.2],
  KS:[38.5,-98.8],KY:[37.7,-84.7],LA:[31.2,-92.1],ME:[45.3,-69.4],MD:[39.0,-76.6],
  MA:[42.4,-71.4],MI:[44.3,-85.6],MN:[46.7,-94.7],MS:[32.7,-89.5],MO:[38.5,-91.8],
  MT:[46.9,-110.4],NE:[41.5,-99.8],NV:[38.8,-116.4],NH:[43.2,-71.6],NJ:[40.1,-74.5],
  NM:[34.8,-106.2],NY:[43.0,-75.0],NC:[35.6,-79.0],ND:[47.5,-100.5],OH:[40.4,-82.8],
  OK:[35.0,-97.1],OR:[43.8,-120.6],PA:[41.2,-77.2],RI:[41.6,-71.5],SC:[33.8,-81.2],
  SD:[43.9,-99.9],TN:[35.5,-86.0],TX:[31.1,-97.6],UT:[39.3,-111.1],VT:[44.3,-72.6],
  VA:[37.8,-79.4],WA:[47.8,-120.7],WV:[38.6,-80.5],WI:[43.8,-88.8],WY:[43.1,-107.6],DC:[38.9,-77.0],
};

export default function WagrTournaments() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [eventType, setEventType] = useState('');
  const [gender, setGender] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [view, setView] = useState<'list' | 'calendar' | 'map' | 'schedule'>('list');
  const [isScraping, setIsScraping] = useState(false);

  const { tournaments, isLoading } = useWagrTournaments({ search, city, state, country: '', eventType, gender });
  const { attendance, attendanceMap, toggleAttendance, isAttending } = useWagrAttendance();

  const hasFilters = search || city || state || eventType || gender;
  const clearFilters = () => { setSearch(''); setCity(''); setState(''); setEventType(''); setGender(''); };

  // Calendar data
  const calendarDays = useMemo(() => {
    const start = startOfMonth(calendarMonth);
    const end = endOfMonth(calendarMonth);
    return eachDayOfInterval({ start, end });
  }, [calendarMonth]);

  const tournamentsByDate = useMemo(() => {
    const map = new Map<string, typeof tournaments>();
    tournaments.forEach(t => {
      const key = t.start_date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return map;
  }, [tournaments]);

  // Map data - tournaments grouped by state
  const tournamentsByState = useMemo(() => {
    const map = new Map<string, typeof tournaments>();
    tournaments.forEach(t => {
      if (t.state) {
        if (!map.has(t.state)) map.set(t.state, []);
        map.get(t.state)!.push(t);
      }
    });
    return map;
  }, [tournaments]);

  // Schedule (attended tournaments)
  const scheduledTournaments = useMemo(() => {
    const ids = new Set(attendance.map(a => a.tournament_id));
    return tournaments.filter(t => ids.has(t.id)).sort((a, b) => a.start_date.localeCompare(b.start_date));
  }, [tournaments, attendance]);

  const handleScrape = async () => {
    setIsScraping(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-wagr-tournaments');
      if (error) throw error;
      toast({
        title: 'WAGR Scrape Complete',
        description: `Imported ${data.imported} tournaments, skipped ${data.skipped} duplicates.${data.errors?.length ? ` ${data.errors.length} errors.` : ''}`,
      });
    } catch (err: any) {
      toast({ title: 'Scrape Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="w-8 h-8 text-primary" />
              WAGR Tournament Finder
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse World Amateur Golf Ranking events across the US
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleScrape} disabled={isScraping}>
              {isScraping ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Globe className="w-4 h-4 mr-1" />}
              {isScraping ? 'Scraping...' : 'Sync from WAGR'}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search tournaments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Input placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
              <Input placeholder="State (e.g. GA)" value={state} onChange={e => setState(e.target.value)} />
              <Select value={eventType || 'all'} onValueChange={v => setEventType(v === 'all' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="Event Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {['All Ages', 'Junior', 'Collegiate', 'Senior', 'MidAm', 'Pro'].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={gender || 'all'} onValueChange={v => setGender(v === 'all' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Men">Men</SelectItem>
                  <SelectItem value="Women">Women</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-2 text-xs">Clear All Filters</Button>
            )}
          </CardContent>
        </Card>

        {/* View Tabs */}
        <Tabs value={view} onValueChange={v => setView(v as any)} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list"><List className="w-4 h-4 mr-1" />List</TabsTrigger>
            <TabsTrigger value="calendar"><CalendarIcon className="w-4 h-4 mr-1" />Calendar</TabsTrigger>
            <TabsTrigger value="map"><MapPin className="w-4 h-4 mr-1" />Map</TabsTrigger>
            {user && <TabsTrigger value="schedule"><Star className="w-4 h-4 mr-1" />My Schedule ({scheduledTournaments.length})</TabsTrigger>}
          </TabsList>

          {/* LIST VIEW */}
          <TabsContent value="list">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : tournaments.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{tournaments.length} tournament{tournaments.length !== 1 ? 's' : ''}</p>
                {tournaments.map(t => (
                  <TournamentRow
                    key={t.id}
                    tournament={t}
                    isAttending={isAttending(t.id)}
                    onToggleAttend={() => toggleAttendance.mutate({ tournamentId: t.id })}
                    isLoggedIn={!!user}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* CALENDAR VIEW */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <CardTitle className="text-lg">{format(calendarMonth, 'MMMM yyyy')}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="bg-muted p-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
                  ))}
                  {/* Padding for first day */}
                  {Array.from({ length: calendarDays[0]?.getDay() || 0 }).map((_, i) => (
                    <div key={`pad-${i}`} className="bg-background p-2 min-h-[80px]" />
                  ))}
                  {calendarDays.map(day => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const dayTournaments = tournamentsByDate.get(dateKey) || [];
                    return (
                      <div
                        key={dateKey}
                        className={`bg-background p-1 min-h-[80px] border-t ${isToday(day) ? 'bg-primary/5 ring-1 ring-primary/30' : ''}`}
                      >
                        <span className={`text-xs font-medium ${isToday(day) ? 'text-primary' : 'text-foreground'}`}>
                          {format(day, 'd')}
                        </span>
                        <div className="mt-1 space-y-0.5">
                          {dayTournaments.slice(0, 3).map(t => (
                            <div
                              key={t.id}
                              className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate cursor-default ${
                                isAttending(t.id)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                              title={t.tournament_name}
                            >
                              {t.tournament_name}
                            </div>
                          ))}
                          {dayTournaments.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{dayTournaments.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MAP VIEW */}
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tournament Map</CardTitle>
                <CardDescription>US-based WAGR tournaments by state</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full" style={{ paddingBottom: '60%' }}>
                  <svg viewBox="0 0 960 600" className="absolute inset-0 w-full h-full">
                    {/* Simple dot map */}
                    <rect width="960" height="600" fill="hsl(var(--muted))" rx="8" />
                    {Object.entries(STATE_COORDS).map(([st, [lat, lng]]) => {
                      const count = tournamentsByState.get(st)?.length || 0;
                      // Convert lat/lng to SVG coordinates (rough US projection)
                      const x = ((lng + 130) / 65) * 900 + 30;
                      const y = ((50 - lat) / 28) * 500 + 50;
                      if (x < 0 || x > 960 || y < 0 || y > 600) return null;
                      return (
                        <g key={st}>
                          <circle
                            cx={x}
                            cy={y}
                            r={count > 0 ? Math.min(6 + count * 2, 20) : 4}
                            fill={count > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.3)'}
                            stroke={count > 0 ? 'hsl(var(--primary-foreground))' : 'none'}
                            strokeWidth={count > 0 ? 1 : 0}
                            opacity={count > 0 ? 0.85 : 0.4}
                          />
                          {count > 0 && (
                            <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fill="hsl(var(--primary-foreground))" fontSize="8" fontWeight="bold">
                              {count}
                            </text>
                          )}
                          <text x={x} y={y + (count > 0 ? 16 : 12)} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="7" opacity="0.7">
                            {st}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-4">
                  {Array.from(tournamentsByState.entries())
                    .sort((a, b) => b[1].length - a[1].length)
                    .slice(0, 10)
                    .map(([st, ts]) => (
                      <button key={st} onClick={() => setState(st)} className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                        <MapPin className="w-3 h-3" />{st}: {ts.length}
                      </button>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SCHEDULE VIEW */}
          {user && (
            <TabsContent value="schedule">
              {scheduledTournaments.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Star className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground">No tournaments on your schedule yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Click the star icon on any tournament to add it</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{scheduledTournaments.length} tournament{scheduledTournaments.length !== 1 ? 's' : ''} on your schedule</p>
                  {scheduledTournaments.map(t => (
                    <TournamentRow
                      key={t.id}
                      tournament={t}
                      isAttending={true}
                      onToggleAttend={() => toggleAttendance.mutate({ tournamentId: t.id })}
                      isLoggedIn={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

function TournamentRow({ tournament: t, isAttending, onToggleAttend, isLoggedIn }: {
  tournament: any;
  isAttending: boolean;
  onToggleAttend: () => void;
  isLoggedIn: boolean;
}) {
  return (
    <div className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{t.tournament_name}</h4>
        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
          <span>{format(new Date(t.start_date), 'MMM d, yyyy')}</span>
          {t.end_date && <span>– {format(new Date(t.end_date), 'MMM d, yyyy')}</span>}
          {t.course_name && <span>• {t.course_name}</span>}
        </div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {(t.city || t.state) && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {[t.city, t.state].filter(Boolean).join(', ')}
            </span>
          )}
          {t.event_type && <Badge variant="outline" className="text-[10px] h-5">{t.event_type}</Badge>}
          {t.gender && <Badge variant="secondary" className="text-[10px] h-5">{t.gender}</Badge>}
          {t.power_rating && <span className="text-[10px] text-muted-foreground">PWR: {Number(t.power_rating).toFixed(0)}</span>}
        </div>
      </div>
      <div className="flex gap-1 ml-3 shrink-0 items-center">
        {isLoggedIn && (
          <Button
            variant={isAttending ? 'default' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onToggleAttend}
            title={isAttending ? 'Remove from schedule' : 'Add to schedule'}
          >
            <Star className={`w-4 h-4 ${isAttending ? 'fill-current' : ''}`} />
          </Button>
        )}
        {t.wagr_url && (
          <a href={t.wagr_url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Globe className="w-4 h-4" /></Button>
          </a>
        )}
        {t.external_url && (
          <a href={t.external_url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><ExternalLink className="w-4 h-4" /></Button>
          </a>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <Trophy className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-30" />
        <p className="text-muted-foreground">No WAGR tournaments found</p>
        <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or sync from WAGR</p>
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Search, MapPin, ExternalLink, Globe, Filter, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWagrTournaments } from '@/hooks/useWagrTournaments';
import { format } from 'date-fns';

export function WagrTournamentBrowser() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [eventType, setEventType] = useState('');
  const [gender, setGender] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { tournaments, isLoading } = useWagrTournaments({
    search,
    city,
    state,
    country: '',
    eventType,
    gender,
  });

  const clearFilters = () => {
    setSearch('');
    setCity('');
    setState('');
    setEventType('');
    setGender('');
  };

  const hasFilters = search || city || state || eventType || gender;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">WAGR Tournament Finder</CardTitle>
            </div>
            <CardDescription className="mt-1">
              Browse World Amateur Golf Ranking events. Find tournaments near you.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-1" />
            Filters
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tournament name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-muted/50 rounded-lg">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">City</label>
              <Input placeholder="Any city" value={city} onChange={e => setCity(e.target.value)} className="h-9" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">State</label>
              <Input placeholder="Any state" value={state} onChange={e => setState(e.target.value)} className="h-9" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Event Type</label>
              <Select value={eventType} onValueChange={v => setEventType(v === 'all' ? '' : v)}>
                <SelectTrigger className="h-9"><SelectValue placeholder="All types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {['All Ages', 'Junior', 'Collegiate', 'Senior', 'MidAm', 'Pro'].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Gender</label>
              <Select value={gender} onValueChange={v => setGender(v === 'all' ? '' : v)}>
                <SelectTrigger className="h-9"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Men">Men</SelectItem>
                  <SelectItem value="Women">Women</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="col-span-2 md:col-span-4 text-xs">
                Clear All Filters
              </Button>
            )}
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>No WAGR tournaments found</p>
            <p className="text-xs mt-1">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {tournaments.map(t => (
              <div key={t.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{t.tournament_name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{format(new Date(t.start_date), 'MMM d, yyyy')}</span>
                    {t.course_name && <span>• {t.course_name}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {(t.city || t.state || t.country) && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {[t.city, t.state, t.country].filter(Boolean).join(', ')}
                      </span>
                    )}
                    <Badge variant="outline" className="text-[10px] h-5">{t.event_type}</Badge>
                    <Badge variant="secondary" className="text-[10px] h-5">{t.gender}</Badge>
                    {t.power_rating && <span className="text-[10px] text-muted-foreground">PWR: {t.power_rating.toFixed(0)}</span>}
                  </div>
                </div>
                <div className="flex gap-1 ml-2 shrink-0">
                  {t.wagr_url && (
                    <a href={t.wagr_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Globe className="w-4 h-4" />
                      </Button>
                    </a>
                  )}
                  {t.external_url && (
                    <a href={t.external_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          {tournaments.length} tournament{tournaments.length !== 1 ? 's' : ''} • Data from WAGR®
        </p>
      </CardContent>
    </Card>
  );
}

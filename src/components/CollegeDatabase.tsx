import { useState, useMemo } from 'react';
import { CollegeFilters as FilterType, TeamGender, Division, US_STATES } from '@/types/college';
import { useColleges, useCollegeStats } from '@/hooks/useColleges';
import { CollegeCardSimple } from '@/components/CollegeCardSimple';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GraduationCap, MapPin, Trophy, Users, Search, X, ArrowUpDown } from 'lucide-react';

const initialFilters: FilterType = {
  search: '',
  divisions: [],
  states: [],
  schoolSizes: [],
  teamGenders: [],
  hbcuOnly: false,
  maxRanking: null,
  minScholarships: null,
  maxScoringAvg: null,
  maxActScore: null,
  maxSatScore: null,
  maxCost: null,
};

type SortOption = 'name' | 'state' | 'division';

export function CollegeDatabase() {
  const [filters, setFilters] = useState<FilterType>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const { data: colleges, isLoading } = useColleges(filters);
  const { data: stats } = useCollegeStats();

  const sortedColleges = useMemo(() => {
    if (!colleges) return [];
    
    return [...colleges].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'state':
          return a.state.localeCompare(b.state) || a.name.localeCompare(b.name);
        case 'division':
          const divisionOrder = ['D1', 'D2', 'D3', 'NAIA', 'JUCO'];
          return divisionOrder.indexOf(a.division) - divisionOrder.indexOf(b.division) || a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [colleges, sortBy]);

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleGenderChange = (value: string) => {
    if (value === 'all') {
      setFilters(prev => ({ ...prev, teamGenders: [] }));
    } else {
      setFilters(prev => ({ ...prev, teamGenders: [value as TeamGender] }));
    }
  };

  const handleDivisionChange = (value: string) => {
    if (value === 'all') {
      setFilters(prev => ({ ...prev, divisions: [] }));
    } else {
      setFilters(prev => ({ ...prev, divisions: [value as Division] }));
    }
  };

  const handleStateChange = (value: string) => {
    if (value === 'all') {
      setFilters(prev => ({ ...prev, states: [] }));
    } else {
      setFilters(prev => ({ ...prev, states: [value] }));
    }
  };

  const handleHbcuChange = (checked: boolean) => {
    setFilters(prev => ({ ...prev, hbcuOnly: checked }));
  };

  const clearAllFilters = () => {
    setFilters(initialFilters);
  };

  const hasActiveFilters = filters.search || 
    filters.divisions.length > 0 || 
    filters.states.length > 0 || 
    filters.teamGenders.length > 0 || 
    filters.hbcuOnly;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Reduced padding */}
      <section className="relative golf-gradient py-8 md:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-3 animate-fade-in">
              College Golf Database
            </h1>
            <p className="text-base md:text-lg text-primary-foreground/80 mb-4 animate-fade-in">
              Find your perfect college golf program.
            </p>
            
            {stats && (
              <div className="flex flex-wrap justify-center gap-4 text-primary-foreground/90 animate-fade-in text-sm">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span className="font-semibold">{stats.total}</span> Colleges
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span className="font-semibold">{Object.keys(stats.divisionCounts).length}</span> Divisions
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-semibold">{Object.keys(stats.stateCounts).length}</span> States
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-4 md:py-6">
        <div className="space-y-6">
          {/* Filters - Search + State + Division + Team Gender */}
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search colleges..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select 
              value={filters.states.length > 0 ? filters.states[0] : 'all'}
              onValueChange={handleStateChange}
            >
              <SelectTrigger className="w-full sm:w-44 bg-background">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50 max-h-60">
                <SelectItem value="all">All States</SelectItem>
                {US_STATES.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={filters.divisions.length > 0 ? filters.divisions[0] : 'all'}
              onValueChange={handleDivisionChange}
            >
              <SelectTrigger className="w-full sm:w-40 bg-background">
                <SelectValue placeholder="Division" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Divisions</SelectItem>
                <SelectItem value="D1">NCAA D1</SelectItem>
                <SelectItem value="D2">NCAA D2</SelectItem>
                <SelectItem value="D3">NCAA D3</SelectItem>
                <SelectItem value="NAIA">NAIA</SelectItem>
                <SelectItem value="JUCO">JUCO</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={filters.teamGenders.length > 0 ? filters.teamGenders[0] : 'all'}
              onValueChange={handleGenderChange}
            >
              <SelectTrigger className="w-full sm:w-48 bg-background">
                <SelectValue placeholder="Team Gender" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="Men">Men's Teams</SelectItem>
                <SelectItem value="Women">Women's Teams</SelectItem>
                <SelectItem value="Both">Both Men & Women</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-background">
              <Switch
                id="hbcu-filter"
                checked={filters.hbcuOnly}
                onCheckedChange={handleHbcuChange}
              />
              <Label htmlFor="hbcu-filter" className="text-sm font-medium cursor-pointer">
                HBCU Only
              </Label>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {isLoading ? (
                    <Skeleton className="h-5 w-24 inline-block" />
                  ) : (
                    <span className="font-medium text-foreground">{sortedColleges.length}</span>
                  )}{' '}
                  colleges found
                </span>
              </div>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-40 bg-background">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="state">State</SelectItem>
                  <SelectItem value="division">Division</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.hbcuOnly && (
                <Badge variant="secondary">
                  HBCU
                </Badge>
              )}
              {filters.states.length > 0 && (
                <Badge variant="outline">
                  <MapPin className="w-3 h-3 mr-1" />
                  {filters.states[0]}
                </Badge>
              )}
              {filters.divisions.length > 0 && (
                <Badge variant={filters.divisions[0].toLowerCase() as 'd1' | 'd2' | 'd3' | 'naia' | 'juco'}>
                  {filters.divisions[0]}
                </Badge>
              )}
              {filters.teamGenders.length > 0 && (
                <Badge variant="outline">
                  {filters.teamGenders[0] === 'Men' ? "Men's Teams" : 
                   filters.teamGenders[0] === 'Women' ? "Women's Teams" : 
                   "Men's & Women's Teams"}
                </Badge>
              )}
            </div>
          </div>

          {/* College Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : sortedColleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedColleges.map((college) => (
                <CollegeCardSimple key={college.id} college={college} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No colleges found</h3>
              <p className="text-muted-foreground">Try adjusting your search to see more results.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

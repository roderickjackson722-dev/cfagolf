import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Search, Filter, Scale, Trash2, ExternalLink, School, Trophy, MapPin, GraduationCap, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/Header';
import { CompareDrawer } from '@/components/CompareDrawer';
import { CompareFloatingBar } from '@/components/CompareFloatingBar';
import { CompareProvider, useCompare } from '@/hooks/useCompare';
import { useFavoriteColleges } from '@/hooks/useFavoriteColleges';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { DIVISIONS, Division } from '@/types/college';
import { cn } from '@/lib/utils';

const divisionVariants: Record<string, 'd1' | 'd2' | 'd3' | 'naia' | 'juco'> = {
  D1: 'd1',
  D2: 'd2',
  D3: 'd3',
  NAIA: 'naia',
  JUCO: 'juco',
};

function FavoritesContent() {
  const { user, hasPaidAccess } = useAuth();
  const { data: colleges, isLoading } = useFavoriteColleges();
  const { toggleFavorite, isPending } = useFavorites();
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare();
  
  const [search, setSearch] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const filteredColleges = useMemo(() => {
    if (!colleges) return [];
    
    let result = [...colleges];
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.state.toLowerCase().includes(searchLower) ||
        c.conference?.toLowerCase().includes(searchLower)
      );
    }
    
    // Division filter
    if (divisionFilter !== 'all') {
      result = result.filter(c => c.division === divisionFilter);
    }
    
    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'ranking':
          return (a.golf_national_ranking ?? 999) - (b.golf_national_ranking ?? 999);
        case 'cost':
          return (a.out_of_state_cost ?? 999999) - (b.out_of_state_cost ?? 999999);
        case 'state':
          return a.state.localeCompare(b.state);
        default:
          return 0;
      }
    });
    
    return result;
  }, [colleges, search, divisionFilter, sortBy]);

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!user || !hasPaidAccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Required</h1>
          <p className="text-muted-foreground mb-6">Please log in with a paid account to view your favorites.</p>
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="golf-gradient py-12 md:py-16">
        <div className="container">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" asChild className="text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
                My Favorite Colleges
              </h1>
              <p className="text-primary-foreground/80 mt-1">
                {colleges?.length ?? 0} saved programs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container py-6 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search favorites..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={divisionFilter} onValueChange={setDivisionFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Division" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Divisions</SelectItem>
              {DIVISIONS.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="ranking">Ranking</SelectItem>
              <SelectItem value="cost">Cost (Low to High)</SelectItem>
              <SelectItem value="state">State</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Favorites Grid */}
      <section className="container py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : filteredColleges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColleges.map((college) => {
              const inCompare = isInCompare(college.id);
              const canAddMore = compareList.length < 4;
              
              return (
                <Card key={college.id} className={cn(
                  "group relative overflow-hidden border-border/50 bg-card shadow-card transition-all duration-300 hover:shadow-card-hover",
                  inCompare && "ring-2 ring-primary border-primary"
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      {college.logo_url ? (
                        <img
                          src={college.logo_url}
                          alt={`${college.name} logo`}
                          className="w-14 h-14 rounded-lg object-contain bg-white p-1 border border-border/50 shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-border/50 shrink-0">
                          <School className="w-7 h-7 text-primary/60" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={divisionVariants[college.division]} className="text-xs">
                            {college.division}
                          </Badge>
                          {college.golf_national_ranking && (
                            <Badge variant="ranking" className="text-xs">
                              <Trophy className="w-3 h-3 mr-1" />
                              #{college.golf_national_ranking}
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold leading-tight text-foreground line-clamp-2">
                          {college.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{college.state}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <span>ACT: <strong className="text-foreground">{college.min_act_score ?? 'N/A'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="truncate">{formatCurrency(college.out_of_state_cost)}</span>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => toggleFavorite(college.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                      
                      <Button
                        variant={inCompare ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          if (inCompare) {
                            removeFromCompare(college.id);
                          } else if (canAddMore) {
                            addToCompare(college);
                          }
                        }}
                        disabled={!canAddMore && !inCompare}
                      >
                        <Scale className="w-4 h-4 mr-1" />
                        {inCompare ? 'Added' : 'Compare'}
                      </Button>
                      
                      {college.website_url && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={college.website_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : colleges && colleges.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6">Start exploring the database and save colleges you're interested in.</p>
            <Button asChild>
              <Link to="/">Browse Colleges</Link>
            </Button>
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </section>
      
      <CompareFloatingBar />
      <CompareDrawer />
    </div>
  );
}

export default function Favorites() {
  return (
    <CompareProvider>
      <FavoritesContent />
    </CompareProvider>
  );
}

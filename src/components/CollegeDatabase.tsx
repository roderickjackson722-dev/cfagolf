import { useState } from 'react';
import { CollegeFilters as FilterType } from '@/types/college';
import { useColleges, useCollegeStats } from '@/hooks/useColleges';
import { CollegeCard } from '@/components/CollegeCard';
import { CollegeFilters } from '@/components/CollegeFilters';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { GraduationCap, MapPin, Trophy, Users } from 'lucide-react';

const initialFilters: FilterType = {
  search: '',
  divisions: [],
  states: [],
  schoolSizes: [],
  maxRanking: null,
  minScholarships: null,
  maxScoringAvg: null,
  maxActScore: null,
  maxSatScore: null,
  maxCost: null,
};

export function CollegeDatabase() {
  const [filters, setFilters] = useState<FilterType>(initialFilters);
  const { data: colleges, isLoading } = useColleges(filters);
  const { data: stats } = useCollegeStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative golf-gradient py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-4 animate-fade-in">
              College Golf Database
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 animate-fade-in">
              Find your perfect college golf program. Search by division, academics, cost, and more.
            </p>
            
            {stats && (
              <div className="flex flex-wrap justify-center gap-6 text-primary-foreground/90 animate-fade-in">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-semibold">{stats.total}</span> Colleges
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">{Object.keys(stats.divisionCounts).length}</span> Divisions
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold">{Object.keys(stats.stateCounts).length}</span> States
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-8 md:py-12">
        <div className="space-y-6">
          {/* Filters */}
          <CollegeFilters filters={filters} onFiltersChange={setFilters} />

          {/* Results Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {isLoading ? (
                  <Skeleton className="h-5 w-24 inline-block" />
                ) : (
                  <span className="font-medium text-foreground">{colleges?.length}</span>
                )}{' '}
                colleges found
              </span>
            </div>
            
            {filters.divisions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.divisions.map(d => (
                  <Badge key={d} variant={d.toLowerCase() as 'd1' | 'd2' | 'd3' | 'naia' | 'juco'}>
                    {d}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* College Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
            </div>
          ) : colleges && colleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No colleges found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

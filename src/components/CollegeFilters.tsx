import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { CollegeFilters as FilterType, DIVISIONS, SCHOOL_SIZES, US_STATES, Division, SchoolSize } from '@/types/college';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CollegeFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

export function CollegeFilters({ filters, onFiltersChange }: CollegeFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleDivision = (division: Division) => {
    const newDivisions = filters.divisions.includes(division)
      ? filters.divisions.filter(d => d !== division)
      : [...filters.divisions, division];
    onFiltersChange({ ...filters, divisions: newDivisions });
  };

  const toggleSchoolSize = (size: SchoolSize) => {
    const newSizes = filters.schoolSizes.includes(size)
      ? filters.schoolSizes.filter(s => s !== size)
      : [...filters.schoolSizes, size];
    onFiltersChange({ ...filters, schoolSizes: newSizes });
  };

  const addState = (state: string) => {
    if (!filters.states.includes(state)) {
      onFiltersChange({ ...filters, states: [...filters.states, state] });
    }
  };

  const removeState = (state: string) => {
    onFiltersChange({ ...filters, states: filters.states.filter(s => s !== state) });
  };

  const clearFilters = () => {
    onFiltersChange({
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
    });
  };

  const hasActiveFilters = 
    filters.search ||
    filters.divisions.length > 0 ||
    filters.states.length > 0 ||
    filters.schoolSizes.length > 0 ||
    filters.maxRanking ||
    filters.minScholarships ||
    filters.maxScoringAvg ||
    filters.maxActScore ||
    filters.maxSatScore ||
    filters.maxCost;

  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search colleges..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10 bg-background/50"
          />
        </div>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Advanced Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">Active</Badge>
              )}
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 space-y-6 border-t border-border/50">
            {/* Division Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Division</Label>
              <div className="flex flex-wrap gap-2">
                {DIVISIONS.map((division) => (
                  <Button
                    key={division}
                    variant={filters.divisions.includes(division) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDivision(division)}
                    className="rounded-pill"
                  >
                    {division}
                  </Button>
                ))}
              </div>
            </div>

            {/* State Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block">State</Label>
              <Select onValueChange={addState}>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Add state..." />
                </SelectTrigger>
                <SelectContent className="bg-popover max-h-60">
                  {US_STATES.filter(s => !filters.states.includes(s)).map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.states.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.states.map((state) => (
                    <Badge
                      key={state}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeState(state)}
                    >
                      {state} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* School Size Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block">School Size</Label>
              <div className="flex flex-wrap gap-2">
                {SCHOOL_SIZES.map((size) => (
                  <Button
                    key={size}
                    variant={filters.schoolSizes.includes(size) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSchoolSize(size)}
                    className="rounded-pill"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Numeric Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Max Golf Ranking: {filters.maxRanking || 'Any'}
                </Label>
                <Slider
                  value={[filters.maxRanking || 100]}
                  onValueChange={([value]) => onFiltersChange({ ...filters, maxRanking: value === 100 ? null : value })}
                  max={100}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Min Scholarships: {filters.minScholarships || 'Any'}
                </Label>
                <Slider
                  value={[filters.minScholarships || 0]}
                  onValueChange={([value]) => onFiltersChange({ ...filters, minScholarships: value === 0 ? null : value })}
                  max={8}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Max Scoring Avg: {filters.maxScoringAvg || 'Any'}
                </Label>
                <Slider
                  value={[filters.maxScoringAvg || 80]}
                  onValueChange={([value]) => onFiltersChange({ ...filters, maxScoringAvg: value === 80 ? null : value })}
                  max={80}
                  min={68}
                  step={0.5}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Max ACT Score: {filters.maxActScore || 'Any'}
                </Label>
                <Slider
                  value={[filters.maxActScore || 36]}
                  onValueChange={([value]) => onFiltersChange({ ...filters, maxActScore: value === 36 ? null : value })}
                  max={36}
                  min={12}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Max SAT Score: {filters.maxSatScore || 'Any'}
                </Label>
                <Slider
                  value={[filters.maxSatScore || 1600]}
                  onValueChange={([value]) => onFiltersChange({ ...filters, maxSatScore: value === 1600 ? null : value })}
                  max={1600}
                  min={400}
                  step={10}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Max Out-of-State Cost: {filters.maxCost ? `$${filters.maxCost.toLocaleString()}` : 'Any'}
                </Label>
                <Slider
                  value={[filters.maxCost || 100000]}
                  onValueChange={([value]) => onFiltersChange({ ...filters, maxCost: value === 100000 ? null : value })}
                  max={100000}
                  min={5000}
                  step={1000}
                  className="mt-2"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

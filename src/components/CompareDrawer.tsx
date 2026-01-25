import { X, School, Trophy, DollarSign, GraduationCap, Users, MapPin, ExternalLink } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCompare } from '@/hooks/useCompare';
import { cn } from '@/lib/utils';

const divisionVariants: Record<string, 'd1' | 'd2' | 'd3' | 'naia' | 'juco'> = {
  D1: 'd1',
  D2: 'd2',
  D3: 'd3',
  NAIA: 'naia',
  JUCO: 'juco',
};

export function CompareDrawer() {
  const { compareList, isCompareOpen, setIsCompareOpen, removeFromCompare, clearCompare } = useCompare();

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US').format(value);
  };

  const metrics = [
    { label: 'Division', getValue: (c: typeof compareList[0]) => c.division, icon: Trophy },
    { label: 'Team Gender', getValue: (c: typeof compareList[0]) => c.team_gender === 'Both' ? 'Men & Women' : c.team_gender, icon: Users },
    { label: 'HBCU', getValue: (c: typeof compareList[0]) => c.is_hbcu ? 'Yes' : 'No', icon: School },
    { label: 'National Ranking', getValue: (c: typeof compareList[0]) => c.golf_national_ranking ? `#${c.golf_national_ranking}` : 'Unranked', icon: Trophy },
    { label: 'Golf Scoring Avg', getValue: (c: typeof compareList[0]) => c.recruiting_scoring_avg ?? 'N/A', icon: GraduationCap },
    { label: 'Scholarships', getValue: (c: typeof compareList[0]) => c.scholarships_available ?? 'N/A', icon: Trophy },
    { label: 'State', getValue: (c: typeof compareList[0]) => c.state, icon: MapPin },
    { label: 'Conference', getValue: (c: typeof compareList[0]) => c.conference ?? 'N/A', icon: Users },
    { label: 'School Size', getValue: (c: typeof compareList[0]) => c.school_size, icon: Users },
    { label: 'Students', getValue: (c: typeof compareList[0]) => formatNumber(c.number_of_students), icon: Users },
    { label: 'Min ACT', getValue: (c: typeof compareList[0]) => c.min_act_score ?? 'N/A', icon: GraduationCap },
    { label: 'Min SAT', getValue: (c: typeof compareList[0]) => c.min_sat_score ?? 'N/A', icon: GraduationCap },
    { label: 'Out-of-State Cost', getValue: (c: typeof compareList[0]) => formatCurrency(c.out_of_state_cost), icon: DollarSign },
  ];

  return (
    <Sheet open={isCompareOpen} onOpenChange={setIsCompareOpen}>
      <SheetContent side="bottom" className="h-[85vh] p-0">
        <SheetHeader className="px-6 py-4 border-b border-border bg-card sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-display">
              Compare Colleges ({compareList.length})
            </SheetTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={clearCompare}>
                Clear All
              </Button>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(85vh-80px)]">
          {compareList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <School className="w-12 h-12 mb-4 opacity-50" />
              <p>No colleges selected for comparison</p>
              <p className="text-sm">Select up to 4 colleges to compare</p>
            </div>
          ) : (
            <div className="p-6">
              {/* College Headers */}
              <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
                <div /> {/* Empty cell for labels */}
                {compareList.map((college) => (
                  <div key={college.id} className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => removeFromCompare(college.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                      {college.logo_url ? (
                        <img
                          src={college.logo_url}
                          alt={`${college.name} logo`}
                          className="w-16 h-16 mx-auto rounded-lg object-contain bg-white p-1 border border-border/50 mb-3"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-border/50 mb-3">
                          <School className="w-8 h-8 text-primary/60" />
                        </div>
                      )}
                      <h3 className="font-semibold text-sm line-clamp-2 mb-2">{college.name}</h3>
                      <Badge variant={divisionVariants[college.division]} className="text-xs">
                        {college.division}
                      </Badge>
                      {college.website_url && (
                        <a
                          href={college.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison Table */}
              <div className="border border-border rounded-lg overflow-hidden">
                {metrics.map((metric, index) => (
                  <div
                    key={metric.label}
                    className={cn(
                      "grid gap-4 items-center",
                      index % 2 === 0 ? "bg-muted/30" : "bg-card"
                    )}
                    style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}
                  >
                    <div className="p-4 font-medium text-sm flex items-center gap-2 text-muted-foreground border-r border-border">
                      <metric.icon className="w-4 h-4 text-primary" />
                      {metric.label}
                    </div>
                    {compareList.map((college) => {
                      const value = metric.getValue(college);
                      return (
                        <div key={college.id} className="p-4 text-center font-medium">
                          {metric.label === 'Division' ? (
                            <Badge variant={divisionVariants[college.division]}>
                              {value}
                            </Badge>
                          ) : (
                            value
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

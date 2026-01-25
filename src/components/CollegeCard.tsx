import { Heart, ExternalLink, MapPin, Users, Trophy, GraduationCap, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { College } from '@/types/college';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface CollegeCardProps {
  college: College;
}

const divisionVariants: Record<string, 'd1' | 'd2' | 'd3' | 'naia' | 'juco'> = {
  D1: 'd1',
  D2: 'd2',
  D3: 'd3',
  NAIA: 'naia',
  JUCO: 'juco',
};

export function CollegeCard({ college }: CollegeCardProps) {
  const { user, hasPaidAccess } = useAuth();
  const { isFavorite, toggleFavorite, isPending } = useFavorites();

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

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={divisionVariants[college.division]}>
                {college.division}
              </Badge>
              {college.golf_national_ranking && (
                <Badge variant="ranking">
                  <Trophy className="w-3 h-3 mr-1" />
                  #{college.golf_national_ranking}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg leading-tight text-foreground truncate">
              {college.name}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>{college.state}</span>
              {college.conference && (
                <>
                  <span className="mx-1">•</span>
                  <span>{college.conference}</span>
                </>
              )}
            </div>
          </div>
          
          {user && hasPaidAccess && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "shrink-0 transition-colors",
                isFavorite(college.id) 
                  ? "text-destructive hover:text-destructive/80" 
                  : "text-muted-foreground hover:text-destructive"
              )}
              onClick={() => toggleFavorite(college.id)}
              disabled={isPending}
            >
              <Heart className={cn("w-5 h-5", isFavorite(college.id) && "fill-current")} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-primary" />
            <div>
              <div className="text-xs uppercase tracking-wide">Scoring Avg</div>
              <div className="font-medium text-foreground">
                {college.recruiting_scoring_avg ?? 'N/A'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Trophy className="w-4 h-4 text-primary" />
            <div>
              <div className="text-xs uppercase tracking-wide">Scholarships</div>
              <div className="font-medium text-foreground">
                {college.scholarships_available ?? 'N/A'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <div className="text-xs uppercase tracking-wide">Students</div>
              <div className="font-medium text-foreground">
                {formatNumber(college.number_of_students)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-4 h-4 text-primary" />
            <div>
              <div className="text-xs uppercase tracking-wide">Out-of-State</div>
              <div className="font-medium text-foreground">
                {formatCurrency(college.out_of_state_cost)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-sm">
          <div className="flex gap-4 text-muted-foreground">
            <span>ACT: <strong className="text-foreground">{college.min_act_score ?? 'N/A'}</strong></span>
            <span>SAT: <strong className="text-foreground">{college.min_sat_score ?? 'N/A'}</strong></span>
          </div>
          
          {college.website_url && (
            <a
              href={college.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
            >
              Visit <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

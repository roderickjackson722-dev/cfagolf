import { School } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { College } from '@/types/college';
import { useState } from 'react';

interface CollegeCardSimpleProps {
  college: College;
}

export function CollegeCardSimple({ college }: CollegeCardSimpleProps) {
  const [imageError, setImageError] = useState(false);

  const LogoPlaceholder = () => (
    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-border/50 shrink-0">
      <School className="w-8 h-8 text-primary/60" />
    </div>
  );

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* College Logo */}
          {college.logo_url && !imageError ? (
            <img
              src={college.logo_url}
              alt={`${college.name} logo`}
              className="w-16 h-16 rounded-lg object-contain bg-white p-1 border border-border/50 shrink-0"
              onError={() => setImageError(true)}
            />
          ) : (
            <LogoPlaceholder />
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight text-foreground line-clamp-2 mb-2">
              {college.name}
            </h3>
            <Badge 
              variant="outline" 
              className="text-sm font-medium"
            >
              {college.team_gender === 'Both' 
                ? "Men's & Women's" 
                : college.team_gender === 'Men' 
                  ? "Men's Team" 
                  : "Women's Team"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

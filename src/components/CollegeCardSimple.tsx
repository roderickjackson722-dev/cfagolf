import { School, ExternalLink } from 'lucide-react';
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

  const CardWrapper = college.website_url ? 'a' : 'div';
  const cardProps = college.website_url 
    ? { 
        href: college.website_url, 
        target: '_blank', 
        rel: 'noopener noreferrer' as const,
      } 
    : {};

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <CardWrapper {...cardProps} className="block">
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
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg leading-tight text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {college.name}
                </h3>
                {college.website_url && (
                  <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              {college.team_gender !== 'None' && (
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
              )}
            </div>
          </div>
        </CardContent>
      </CardWrapper>
    </Card>
  );
}

import { Scale, X, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/hooks/useCompare';
import { cn } from '@/lib/utils';

export function CompareFloatingBar() {
  const { compareList, setIsCompareOpen, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-card border border-border shadow-xl rounded-full px-4 py-3 flex items-center gap-4">
        {/* Mini college avatars */}
        <div className="flex items-center -space-x-2">
          {compareList.map((college) => (
            <div
              key={college.id}
              className="relative w-10 h-10 rounded-full border-2 border-card bg-muted flex items-center justify-center overflow-hidden group"
            >
              {college.logo_url ? (
                <img
                  src={college.logo_url}
                  alt={college.name}
                  className="w-full h-full object-contain p-1 bg-white"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <School className="w-5 h-5 text-primary/60" />
              )}
              <button
                onClick={() => removeFromCompare(college.id)}
                className="absolute inset-0 bg-destructive/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="w-4 h-4 text-destructive-foreground" />
              </button>
            </div>
          ))}
          {/* Empty slots */}
          {[...Array(4 - compareList.length)].map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-10 h-10 rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/50 flex items-center justify-center"
            >
              <span className="text-xs text-muted-foreground">+</span>
            </div>
          ))}
        </div>

        <div className="h-8 w-px bg-border" />

        <span className="text-sm font-medium text-muted-foreground">
          {compareList.length}/4 selected
        </span>

        <Button
          onClick={() => setIsCompareOpen(true)}
          className="rounded-full gap-2"
          size="sm"
        >
          <Scale className="w-4 h-4" />
          Compare
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearCompare}
          className="text-muted-foreground hover:text-destructive"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserMenu } from './UserMenu';
import { Button } from '@/components/ui/button';

export function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <span className="font-display text-xl font-bold text-foreground">CFA Golf</span>
            <span className="hidden sm:block text-xs text-muted-foreground">College Database</span>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <UserMenu />
              ) : (
                <Link to="/login">
                  <Button variant="default" className="rounded-pill">
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

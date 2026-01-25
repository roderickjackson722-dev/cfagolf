import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Database, User, LogIn, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { UserMenu } from '@/components/UserMenu';
import cfaLogo from '@/assets/cfa-logo.png';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, hasPaidAccess } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/database', label: 'College Database' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img src={cfaLogo} alt="CFA" className="w-10 h-10 object-contain" />
            <div className="hidden sm:block">
              <span className="font-display text-lg font-bold text-foreground leading-tight block">
                College Fairway Advisors
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && hasPaidAccess && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/favorites"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/favorites')
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  Favorites
                </Link>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <div className="hidden md:block">
                    <UserMenu />
                  </div>
                ) : (
                  <Link to="/login" className="hidden md:block">
                    <Button className="rounded-full">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user && hasPaidAccess && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/dashboard')
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      isActive('/favorites')
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    Favorites
                  </Link>
                </>
              )}
              {!loading && !user && (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-primary bg-primary/10"
                >
                  Sign In
                </Link>
              )}
              {user && (
                <div className="pt-2 border-t border-border/50 mt-2">
                  <UserMenu />
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

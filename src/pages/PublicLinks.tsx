import { useMemo, useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  useResourceLinks,
  useLinkCategories,
  trackLinkClick,
} from '@/hooks/useResourceLinks';

const UNCAT = 'Uncategorized';

export default function PublicLinks() {
  const { data: links = [], isLoading } = useResourceLinks(false);
  const { data: categories = [] } = useLinkCategories(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return links;
    const s = search.toLowerCase();
    return links.filter(
      (l) =>
        l.name.toLowerCase().includes(s) ||
        (l.description || '').toLowerCase().includes(s),
    );
  }, [links, search]);

  const grouped = useMemo(() => {
    const m: Record<string, typeof links> = {};
    for (const l of filtered) {
      const k = l.category || UNCAT;
      (m[k] ||= []).push(l);
    }
    return m;
  }, [filtered]);

  const orderedCats = [
    ...categories.map((c) => c.name).filter((n) => grouped[n]),
    ...Object.keys(grouped).filter((k) => !categories.find((c) => c.name === k)),
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold font-playfair mb-2">Recruiting Resources</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Helpful links for student-athletes and parents navigating the college golf recruiting process.
          </p>
        </header>

        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-10 max-w-5xl mx-auto">
            {orderedCats.map((catName) => (
              <section key={catName}>
                <h2 className="text-2xl font-semibold mb-4 font-playfair">{catName}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {grouped[catName].map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackLinkClick(link)}
                      className="block group"
                    >
                      <Card className="h-full transition hover:border-primary hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold group-hover:text-primary flex items-center gap-1">
                              {link.icon && <span>{link.icon}</span>}
                              {link.name}
                            </h3>
                            <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                          </div>
                          {link.description && (
                            <p className="text-sm text-muted-foreground">{link.description}</p>
                          )}
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
              </section>
            ))}
            {orderedCats.length === 0 && (
              <p className="text-center text-muted-foreground">No resources found.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

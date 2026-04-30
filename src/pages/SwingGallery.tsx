import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, Video, MapPin, GraduationCap, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Golfer {
  user_id: string;
  full_name: string | null;
  graduation_year: number | null;
  handicap: number | null;
  high_school: string | null;
  city: string | null;
  state: string | null;
  avatar_url: string | null;
  goal_division: string | null;
  video_count: number;
  latest_video_at: string;
}

export default function SwingGallery() {
  const [golfers, setGolfers] = useState<Golfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gradFilter, setGradFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("get_public_swing_golfers");
      if (!error && data) setGolfers(data as Golfer[]);
      setLoading(false);
    })();
  }, []);

  const grads = Array.from(new Set(golfers.map((g) => g.graduation_year).filter(Boolean))).sort();

  const filtered = golfers.filter((g) => {
    const matchSearch = !search ||
      (g.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        g.high_school?.toLowerCase().includes(search.toLowerCase()) ||
        g.state?.toLowerCase().includes(search.toLowerCase()));
    const matchGrad = gradFilter === "all" || String(g.graduation_year) === gradFilter;
    return matchSearch && matchGrad;
  });

  return (
    <>
      <Helmet>
        <title>CFA Swing Vault — College Golf Recruiting Profiles | College Fairway Advisors</title>
        <meta
          name="description"
          content="Browse swing videos and recruiting profiles of junior golfers. College coaches can discover prospective student-athletes seeking placement."
        />
        <link rel="canonical" href="https://cfa.golf/m/swing" />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-8 text-center">
              <h1 className="font-display text-4xl font-bold text-foreground mb-3">CFA Swing Vault</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Public swing videos and recruiting profiles of junior golfers seeking college placement.
                College coaches — feel free to browse and reach out.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-3 mb-6">
              <Input
                placeholder="Search name, high school, state..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:col-span-2"
              />
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={gradFilter}
                onChange={(e) => setGradFilter(e.target.value)}
              >
                <option value="all">All grad years</option>
                {grads.map((y) => <option key={y} value={String(y)}>Class of {y}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Video className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    {golfers.length === 0
                      ? "No public swing profiles yet. Check back soon."
                      : "No golfers match your filters."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((g) => (
                  <Link key={g.user_id} to={`/m/swing/${g.user_id}`}>
                    <Card className="card-hover h-full">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                            {g.avatar_url ? (
                              <img src={g.avatar_url} alt={g.full_name ?? "Golfer"} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-lg font-bold text-primary">
                                {(g.full_name ?? "?").split(" ").map((p) => p[0]).join("").slice(0, 2)}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{g.full_name ?? "Junior Golfer"}</p>
                            {g.graduation_year && (
                              <p className="text-xs text-muted-foreground">Class of {g.graduation_year}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {g.high_school && (
                            <div className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" />{g.high_school}</div>
                          )}
                          {(g.city || g.state) && (
                            <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{[g.city, g.state].filter(Boolean).join(", ")}</div>
                          )}
                          {g.handicap !== null && (
                            <div className="flex items-center gap-1.5"><TrendingDown className="h-3.5 w-3.5" />Handicap: {g.handicap}</div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <Badge variant="secondary" className="text-xs">
                            <Video className="h-3 w-3 mr-1" />
                            {g.video_count} {g.video_count === 1 ? "swing" : "swings"}
                          </Badge>
                          {g.goal_division && <Badge variant="outline" className="text-xs">{g.goal_division}</Badge>}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

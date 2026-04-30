import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, MapPin, GraduationCap, TrendingDown, ChevronLeft, Mail, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEmbedUrl } from "@/lib/videoEmbed";

interface Profile {
  user_id: string;
  full_name: string | null;
  graduation_year: number | null;
  handicap: number | null;
  high_school: string | null;
  home_course: string | null;
  city: string | null;
  state: string | null;
  avatar_url: string | null;
  goal_division: string | null;
  club_team: string | null;
}

interface SwingVideo {
  id: string;
  title: string;
  video_url: string;
  swing_type: string | null;
  camera_angle: string | null;
  club: string | null;
  notes: string | null;
  created_at: string;
}

export default function SwingProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<SwingVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const [{ data: profileData }, { data: videoData }] = await Promise.all([
        supabase.rpc("get_public_swing_profile", { _user_id: userId }),
        supabase
          .from("swing_videos")
          .select("id, title, video_url, swing_type, camera_angle, club, notes, created_at")
          .eq("user_id", userId)
          .eq("is_public", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
      ]);
      if (profileData && profileData.length > 0) setProfile(profileData[0] as Profile);
      if (videoData) setVideos(videoData as SwingVideo[]);
      setLoading(false);
    })();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">This swing profile is not available or has no public videos yet.</p>
              <Link to="/m/swing"><Button variant="outline">Back to gallery</Button></Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const name = profile.full_name ?? "Junior Golfer";

  return (
    <>
      <Helmet>
        <title>{name} — Swing Profile | CFA Recruiting</title>
        <meta
          name="description"
          content={`${name}'s swing videos and recruiting profile${profile.graduation_year ? `, Class of ${profile.graduation_year}` : ""}${profile.high_school ? `, ${profile.high_school}` : ""}.`}
        />
        <link rel="canonical" href={`https://cfa.golf/m/swing/${profile.user_id}`} />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-5xl">
            <Link to="/m/swing" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
              <ChevronLeft className="h-4 w-4" /> Back to gallery
            </Link>

            <Card className="mb-6">
              <CardContent className="p-6 flex flex-col sm:flex-row gap-5 items-start">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-primary">
                      {name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="font-display text-3xl font-bold mb-1">{name}</h1>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.graduation_year && <Badge>Class of {profile.graduation_year}</Badge>}
                    {profile.goal_division && <Badge variant="outline">Targeting {profile.goal_division}</Badge>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    {profile.high_school && (
                      <div className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4" />{profile.high_school}</div>
                    )}
                    {(profile.city || profile.state) && (
                      <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{[profile.city, profile.state].filter(Boolean).join(", ")}</div>
                    )}
                    {profile.handicap !== null && (
                      <div className="flex items-center gap-1.5"><TrendingDown className="h-4 w-4" />Handicap: {profile.handicap}</div>
                    )}
                    {profile.home_course && (
                      <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />Home course: {profile.home_course}</div>
                    )}
                    {profile.club_team && (
                      <div className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4" />Club: {profile.club_team}</div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <a href="mailto:contact@cfa.golf?subject=Recruiting interest"><Button className="w-full"><Mail className="h-4 w-4 mr-1" />Contact via CFA</Button></a>
                </div>
              </CardContent>
            </Card>

            <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
              <Video className="h-5 w-5" /> Swing Videos ({videos.length})
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {videos.map((v) => {
                const embed = getEmbedUrl(v.video_url);
                return (
                  <Card key={v.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted">
                      {embed ? (
                        <iframe
                          src={embed}
                          className="w-full h-full"
                          title={v.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <a href={v.video_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-full text-muted-foreground">
                          Open video
                        </a>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <p className="font-semibold mb-1">{v.title}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {v.swing_type && <Badge variant="outline" className="text-[10px]">{v.swing_type}</Badge>}
                        {v.camera_angle && <Badge variant="outline" className="text-[10px]">{v.camera_angle}</Badge>}
                        {v.club && <Badge variant="outline" className="text-[10px]">{v.club}</Badge>}
                      </div>
                      {v.notes && <p className="text-sm text-muted-foreground">{v.notes}</p>}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

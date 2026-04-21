import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Mail, Heart, ExternalLink, Pencil, Star, MailOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const CoachDashboard = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: coach, isLoading: coachLoading } = useQuery({
    queryKey: ['my-coach-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('coaches')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: views = [] } = useQuery({
    queryKey: ['coach-views', coach?.id],
    queryFn: async () => {
      if (!coach) return [];
      const { data } = await supabase
        .from('coach_profile_views')
        .select('*')
        .eq('coach_id', coach.id)
        .order('created_at', { ascending: false })
        .limit(100);
      return data ?? [];
    },
    enabled: !!coach,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['coach-messages', coach?.id],
    queryFn: async () => {
      if (!coach) return [];
      const { data } = await supabase
        .from('coach_messages')
        .select('*')
        .eq('coach_id', coach.id)
        .order('created_at', { ascending: false });
      return data ?? [];
    },
    enabled: !!coach,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['coach-favorites', coach?.id],
    queryFn: async () => {
      if (!coach) return [];
      const { data } = await supabase
        .from('coach_favorites')
        .select('*')
        .eq('coach_id', coach.id)
        .order('created_at', { ascending: false });
      return data ?? [];
    },
    enabled: !!coach,
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('coach_messages').update({ is_read: true }).eq('id', id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coach-messages', coach?.id] }),
  });

  const toggleFavorite = useMutation({
    mutationFn: async ({ viewerUserId, viewerName }: { viewerUserId: string | null; viewerName: string | null }) => {
      if (!coach || !viewerUserId) return;
      const existing = favorites.find((f: any) => f.golfer_user_id === viewerUserId);
      if (existing) {
        await supabase.from('coach_favorites').delete().eq('id', existing.id);
      } else {
        await supabase.from('coach_favorites').insert({
          coach_id: coach.id,
          golfer_user_id: viewerUserId,
          golfer_name: viewerName,
        });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coach-favorites', coach?.id] }),
  });

  // Update last_login_at
  useEffect(() => {
    if (coach?.id) {
      supabase
        .from('coaches')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', coach.id)
        .then();
    }
  }, [coach?.id]);

  if (loading || coachLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/coach/login" replace />;
  if (!coach) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md text-center">
            <CardHeader>
              <CardTitle>No Coach Profile</CardTitle>
              <CardDescription>
                This account isn't linked to a coach profile. Please contact contact@cfa.golf.
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const uniqueViewers = new Set(views.map((v: any) => v.viewer_user_id || v.viewer_session_id)).size;
  const unreadCount = messages.filter((m: any) => !m.is_read).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">Welcome, {coach.full_name}</h1>
              <p className="text-muted-foreground">{coach.college_name}{coach.title ? ` · ${coach.title}` : ''}</p>
            </div>
            <div className="flex gap-2">
              <Link to={`/coach/${coach.slug}`} target="_blank">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-1" /> View public profile
                </Button>
              </Link>
              <Link to="/coach/profile/edit">
                <Button size="sm">
                  <Pencil className="w-4 h-4 mr-1" /> Edit profile
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center gap-3">
                <Eye className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{uniqueViewers}</p>
                  <p className="text-xs text-muted-foreground">Unique profile views</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-3">
                <Mail className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{messages.length}</p>
                  <p className="text-xs text-muted-foreground">Inbox messages ({unreadCount} unread)</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-3">
                <Heart className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{favorites.length}</p>
                  <p className="text-xs text-muted-foreground">Favorited golfers</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inbox */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" /> Inbox
              </CardTitle>
              <CardDescription>Messages sent via your public profile contact form</CardDescription>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No messages yet.</p>
              ) : (
                <div className="space-y-3">
                  {messages.map((m: any) => (
                    <div key={m.id} className={`p-4 rounded-lg border ${m.is_read ? 'bg-background' : 'bg-primary/5 border-primary/20'}`}>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-medium">
                            {m.sender_name} {!m.is_read && <Badge className="ml-2" variant="default">New</Badge>}
                          </p>
                          <a href={`mailto:${m.sender_email}`} className="text-sm text-primary hover:underline">{m.sender_email}</a>
                        </div>
                        <span className="text-xs text-muted-foreground">{format(new Date(m.created_at), 'MMM d, yyyy h:mm a')}</span>
                      </div>
                      <p className="text-sm mt-2 whitespace-pre-wrap">{m.message}</p>
                      {!m.is_read && (
                        <Button size="sm" variant="ghost" className="mt-2" onClick={() => markRead.mutate(m.id)}>
                          <MailOpen className="w-3 h-3 mr-1" /> Mark as read
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Viewers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" /> Recent Viewers
              </CardTitle>
              <CardDescription>Junior golfers who viewed your profile</CardDescription>
            </CardHeader>
            <CardContent>
              {views.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No views yet.</p>
              ) : (
                <div className="space-y-2">
                  {views.slice(0, 30).map((v: any) => {
                    const isFav = favorites.some((f: any) => f.golfer_user_id === v.viewer_user_id);
                    return (
                      <div key={v.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="text-sm">
                          <p className="font-medium">
                            {v.viewer_full_name || 'Anonymous visitor'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {v.viewer_graduation_year ? `Class of ${v.viewer_graduation_year}` : ''}
                            {v.viewer_handicap !== null ? ` · Handicap ${v.viewer_handicap}` : ''}
                            {' · '}{format(new Date(v.created_at), 'MMM d')}
                          </p>
                        </div>
                        {v.viewer_user_id && (
                          <Button
                            size="sm"
                            variant={isFav ? 'default' : 'outline'}
                            onClick={() => toggleFavorite.mutate({ viewerUserId: v.viewer_user_id, viewerName: v.viewer_full_name })}
                          >
                            <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoachDashboard;

import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useSocialClips, useDeleteClip, type SocialClip } from '@/hooks/useSocialClips';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Film, Plus, Trash2, Pencil, Search, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  generating: 'bg-yellow-100 text-yellow-800',
  ready: 'bg-emerald-100 text-emerald-800',
  published: 'bg-blue-100 text-blue-800',
};

export default function SocialClips() {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: clips = [], isLoading } = useSocialClips();
  const del = useDeleteClip();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');

  if (authLoading || adminLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const filtered = clips.filter((c: SocialClip) => {
    if (status !== 'all' && c.status !== status) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Film className="w-8 h-8 text-primary" />
                <h1 className="font-display text-3xl font-bold">Social Media Clip Generator</h1>
              </div>
              <p className="text-muted-foreground">
                Create, edit, and manage short-form video clips for Reels, TikTok & Shorts.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/admin/social-clips/new">
                  <Plus className="w-4 h-4 mr-2" /> New Clip
                </Link>
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search clips by title…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="generating">Generating</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {isLoading ? (
            <p className="text-muted-foreground">Loading clips…</p>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No clips yet. Click <strong>New Clip</strong> to create your first one.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((clip: SocialClip) => (
                <Card key={clip.id} className="overflow-hidden group">
                  <div className="aspect-[9/16] bg-muted relative">
                    {clip.thumbnail_url ? (
                      <img
                        src={clip.thumbnail_url}
                        alt={clip.title}
                        className="w-full h-full object-cover"
                      />
                    ) : clip.video_url ? (
                      <video
                        src={clip.video_url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Film className="w-12 h-12" />
                      </div>
                    )}
                    <Badge
                      className={`absolute top-2 right-2 ${statusColors[clip.status] || ''}`}
                    >
                      {clip.status}
                    </Badge>
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <div>
                      <p className="font-semibold text-sm line-clamp-1">{clip.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {clip.aspect_ratio} · {clip.duration ?? '?'}s
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button asChild size="sm" variant="outline" className="flex-1">
                        <Link to={`/admin/social-clips/${clip.id}/edit`}>
                          <Pencil className="w-3 h-3 mr-1" /> Edit
                        </Link>
                      </Button>
                      {clip.video_url && (
                        <Button asChild size="sm" variant="outline">
                          <a href={clip.video_url} download target="_blank" rel="noreferrer">
                            <Download className="w-3 h-3" />
                          </a>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm(`Delete "${clip.title}"?`)) {
                            del.mutate(clip.id, {
                              onSuccess: () => toast({ title: 'Clip deleted' }),
                            });
                          }
                        }}
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

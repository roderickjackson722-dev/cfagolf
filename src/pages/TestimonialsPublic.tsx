import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getEmbedUrl } from '@/lib/videoEmbed';

export default function TestimonialsPublic() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['public-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_public', true)
        .in('status', ['published', 'approved'])
        .order('is_featured', { ascending: false })
        .order('display_order', { ascending: true })
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Family <span className="text-primary">Stories</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from the families we've helped navigate the college golf recruiting journey.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No stories to share yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((t: any) => {
              const embed = t.video_url ? getEmbedUrl(t.video_url) : null;
              const name = t.share_first_name || 'Anonymous';
              return (
                <Card key={t.id} className={t.is_featured ? 'md:col-span-2 border-primary/50 shadow-lg' : ''}>
                  <CardContent className="pt-6 space-y-3">
                    {t.is_featured && <Badge className="bg-primary/20 text-primary border-primary/30">Featured</Badge>}
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-cfa-gold text-cfa-gold" />)}
                    </div>
                    {embed && (
                      <div className="aspect-video rounded overflow-hidden bg-muted">
                        <iframe src={embed} className="w-full h-full" allowFullScreen title={`Testimonial from ${name}`} />
                      </div>
                    )}
                    {(t.curated_content || t.content) && (
                      <div className="relative">
                        <Quote className="absolute -top-1 -left-1 w-6 h-6 text-primary/20" />
                        <p className="pl-6 text-sm whitespace-pre-wrap leading-relaxed">{t.curated_content || t.content}</p>
                      </div>
                    )}
                    <div className="pt-2 border-t text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground">{name}</p>
                      {(t.share_grade_level || t.share_location) && (
                        <p className="text-xs">
                          {[t.share_grade_level, t.share_location].filter(Boolean).join(' • ')}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

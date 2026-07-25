import { Star, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

function useTestimonialImageUrl(path?: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!path) { setUrl(null); return; }
    if (/^https?:\/\//i.test(path)) { setUrl(path); return; }
    let cancelled = false;
    supabase.storage
      .from('testimonial-images')
      .createSignedUrl(path, 60 * 60 * 24 * 7)
      .then(({ data }) => { if (!cancelled) setUrl(data?.signedUrl || null); });
    return () => { cancelled = true; };
  }, [path]);
  return url;
}

type TestimonialItem = { name: string; role: string; content: string; image_url?: string | null };

function TestimonialCard({ testimonial }: { testimonial: TestimonialItem }) {
  const imgUrl = useTestimonialImageUrl(testimonial.image_url);
  return (
    <Card className="relative bg-card border-border/50">
      <CardContent className="pt-8 pb-6">
        <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
        {imgUrl && (
          <div className="mb-4 rounded-md overflow-hidden bg-muted">
            <img src={imgUrl} alt={`${testimonial.name} testimonial`} className="w-full h-48 object-cover" loading="lazy" />
          </div>
        )}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-cfa-gold text-cfa-gold" />
          ))}
        </div>
        <p className="text-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 bg-primary">
            {imgUrl && <AvatarImage src={imgUrl} alt={testimonial.name} />}
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {testimonial.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const fallbackTestimonials = [
  {
    name: "Parent",
    role: "Parent of Division I Signee",
    content: "Our son would not be on the college golf team without the help of College Fairway Advisors. We can't thank you enough!",
  },
  {
    name: "Parent",
    role: "Parent of high school junior",
    content: "Our daughter is so excited about the opportunity CFA provided for her to meet college coaches and show off her talents for the coaches.",
  },
  {
    name: "Parent",
    role: "Parent of high school senior",
    content: "As a parent, I had no clue where to start. I thank CFA for guiding our family through the entire process.",
  }
];

export function TestimonialsSection() {
  const { data: dbTestimonials } = useQuery({
    queryKey: ['approved-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('name, role, content, curated_content, share_first_name, share_grade_level, share_location, image_url, is_featured, display_order, submitted_at')
        .eq('is_public', true)
        .in('status', ['approved', 'published'])
        .order('is_featured', { ascending: false })
        .order('display_order', { ascending: true })
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      return (data || [])
        .map((t: any) => ({
          name: t.share_first_name || t.name || 'Anonymous',
          role: [t.share_grade_level, t.share_location].filter(Boolean).join(' • ') || t.role || 'CFA Family',
          content: t.curated_content || t.content || '',
          image_url: t.image_url as string | null,
        }))
        .filter((t) => t.content);
    },
  });

  const testimonials = dbTestimonials && dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials;

  return (
    <section id="testimonials" className="section-padding bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            Success Stories
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Families Love{' '}
            <span className="text-primary">CFA</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join hundreds of golf families who've successfully navigated the recruiting process with our help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial as any} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    name: "Sarah M.",
    role: "Parent of D1 Golfer",
    content: "CFA made the recruiting process so much less stressful. The timeline and coach tracker kept us organized, and the college database helped us find schools we never would have considered.",
    initials: "SM"
  },
  {
    name: "James T.",
    role: "Junior Golfer, Class of 2024",
    content: "The video specs guide helped me create a highlight reel that coaches actually watched. I got responses from 12 schools within the first week of sending it out!",
    initials: "JT"
  },
  {
    name: "Michael & Linda R.",
    role: "Parents",
    content: "Worth every penny. The scholarship calculator alone saved us from making a costly mistake. We now understand the true value of each offer we're considering.",
    initials: "MR"
  }
];

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-background">
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
            <Card key={index} className="relative bg-card border-border/50">
              <CardContent className="pt-8 pb-6">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
                
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-cfa-gold text-cfa-gold" />
                  ))}
                </div>

                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 bg-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

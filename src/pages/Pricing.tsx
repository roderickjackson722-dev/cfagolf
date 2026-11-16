import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const steps = [
  {
    title: 'Planning',
    description:
      'We start with grade level, GPA, scoring average, and swing video, then build a tailored strategy and target list of programs that fit academically, athletically, and financially, with a clear timeline.',
  },
  {
    title: 'Player Profile and Video',
    description:
      'We review and polish the player profile and swing video, and show your family how to present scores, grades, and video so a coach can evaluate the player in minutes.',
  },
  {
    title: 'Templates and Outreach Prep',
    description:
      'You get a player resume template, email templates, and DM templates written in the player voice, plus a coach list and a simple follow up plan.',
  },
  {
    title: 'Exposure to Specific Coaches',
    description:
      'We help your family reach out directly to specific coaches at programs that fit your player, with personal outreach on your behalf.',
  },
  {
    title: 'Guidance Through Replies to Commitment',
    description:
      'We guide your family through replies, visits, and the offer conversation, so you never have to guess what to do next.',
  },
];

const Pricing = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-4">Pricing</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">One Program. One Price.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            One clear program for one player, with a clear plan and guided support from start to finish.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-primary/20 bg-card px-6 py-8 text-center shadow-card sm:px-10 sm:py-10">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">1 on 1 Guidance</h2>
          <p className="mt-5 font-display text-4xl font-bold text-primary sm:text-5xl">
            $699 <span className="font-sans text-lg font-medium text-muted-foreground sm:text-xl">one time</span>
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            One time program for one player. Apply first. Rod reviews the player before accepting a family, and payment is only taken after the player is accepted.
          </p>
          <div className="mx-auto mt-5 flex max-w-2xl items-start justify-center gap-3 text-left text-base leading-relaxed text-muted-foreground">
            <X aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-destructive" />
            <p>No guarantee of an offer, a roster spot, or a scholarship. That decision is always up to the coach.</p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold text-foreground sm:text-4xl">What is included</h2>
          <ol className="mt-10 space-y-5">
            {steps.map((step, index) => (
              <li key={step.title} className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-card sm:gap-6">
                <div aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xl font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Step {index + 1}</p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-center text-base leading-relaxed text-foreground">
            6 one on one calls with Rod, plus reply coaching, visit prep, and academic and eligibility check.
          </p>
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="h-14 w-full rounded-full px-8 text-base font-semibold shadow-lg sm:w-auto sm:text-lg">
              <Link to="/#application">
                Apply for 1 on 1 Guidance
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Pricing;

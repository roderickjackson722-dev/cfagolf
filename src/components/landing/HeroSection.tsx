import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-primary/85" />

      <div className="relative container mx-auto px-4 py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex max-w-full items-start gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-left text-xs leading-relaxed text-primary-foreground/90 backdrop-blur-sm sm:items-center sm:text-sm">
            <Star className="mt-0.5 h-4 w-4 shrink-0 fill-cfa-gold text-cfa-gold sm:mt-0" />
            <span>Where swing coaches build your game, CFA builds your path to a roster spot.</span>
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Your Path to <span className="text-cfa-gold">College Golf</span> Starts Here
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg md:text-xl">
            Expert 1 on 1 guidance for junior golfers and their families navigating HBCU college golf recruiting. We review grade level, GPA, scoring average, and swing video, then help put your player in front of the right HBCU coaches.
          </p>

          <div className="mx-auto mt-8 max-w-3xl space-y-4 text-left text-base leading-relaxed text-primary-foreground sm:text-lg">
            <p>
              <strong className="font-semibold text-cfa-gold">Free first:</strong>{' '}
              Create a free player profile on HBCU.GOLF. Coaches can search and track players there. The free profile stays free.
            </p>
            <p>
              <strong className="font-semibold text-cfa-gold">Paid 1 on 1:</strong>{' '}
              College Fairway Advisors works with a small number of players 1 on 1, with a tailored HBCU target list, templates, and guided coach outreach for a specific player.
            </p>
          </div>

          <p className="mx-auto mt-8 max-w-3xl border-t border-primary-foreground/20 pt-6 text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            We cannot guarantee an offer or a scholarship. That decision is always up to the coach. What we do is put your player in front of the right coaches with a clear plan, and guide your family through real conversations.
          </p>

          <div className="mt-8 flex flex-col items-center">
            <Button
              asChild
              size="lg"
              className="h-14 w-full max-w-sm rounded-full bg-primary-foreground px-6 text-base font-semibold text-primary shadow-lg hover:bg-primary-foreground/90 sm:w-auto sm:px-8 sm:text-lg"
            >
              <a href="#application">
                Apply for 1 on 1 Guidance
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <a
              href="https://hbcu.golf"
              target="_blank"
              rel="noreferrer"
              className="mt-4 text-sm font-medium text-primary-foreground/80 underline decoration-primary-foreground/40 underline-offset-4 transition-colors hover:text-primary-foreground"
            >
              Create a free HBCU.GOLF profile
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

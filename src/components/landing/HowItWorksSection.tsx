import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    title: 'Planning',
    description:
      'Your player recruiting process is unique. We start with grade level, GPA, scoring average, and swing video, then build a tailored strategy and target list of programs that fit academically, athletically, and financially, with a clear timeline.',
  },
  {
    title: 'Player Profile and Video',
    description:
      'Coaches need to see the player clearly and quickly. We review and polish the player profile and swing video, and show your family how to present scores, grades, and video so a coach can evaluate the player in minutes.',
  },
  {
    title: 'Templates and Outreach Prep',
    description:
      'We provide the templates, so your family does not have to guess what to say. You get a player resume template, email templates, and DM templates written in the player voice, plus a coach list and a simple follow up plan.',
  },
  {
    title: 'Exposure to Specific Coaches',
    description:
      'We help your family reach out directly to specific coaches at programs that fit your player, with personal outreach on your behalf, not a big database that never sends one email.',
  },
  {
    title: 'Guidance Through Replies to Commitment',
    description:
      'Recruiting is not just sending messages. It is knowing what to say when coaches respond. We guide your family through every reply, call, visit, and scholarship conversation, from the first message to the final decision, while your player stays focused on school and golf.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-secondary/35 py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              A clear, guided path from your player profile to the final college decision.
            </p>
          </div>

          <ol className="mt-12 space-y-6 md:mt-16 md:space-y-8">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-card sm:gap-6"
              >
                <div
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xl font-bold text-primary-foreground"
                >
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Step {index + 1}
                  </p>
                  <h3 className="font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 text-center md:mt-12">
            <Button
              asChild
              size="lg"
              className="h-14 w-full rounded-full px-6 text-base font-semibold shadow-lg sm:w-auto sm:px-8 sm:text-lg"
            >
              <a href="#application">
                Apply for 1 on 1 Guidance
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

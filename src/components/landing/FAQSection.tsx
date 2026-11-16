import { ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const faqs = [
  {
    question: 'When is the right time to start?',
    answer: 'Start as early as you can, and do not wait for a perfect scoring average. We work most with juniors and seniors. A junior gets more time to build a target list and build coach relationships. A senior can still move fast if the grades, scores, and video are ready and there are open spots. Apply, and Rod will tell you straight if the timing works for your player, or if you need a different plan.',
  },
  {
    question: 'What does CFA actually do for our family?',
    answer: 'Rod looks at your player as one player, not as a list. He reviews grade level, GPA, scoring average, and swing video, builds a target list of HBCU programs that fit, and gives your family a clear outreach plan. You get a player resume, email and DM templates, a follow up schedule, and coaching on what to say when coaches reply, from the first message to a visit or an offer conversation.',
  },
  {
    question: 'What do we need before we apply?',
    answer: 'You need grade level, GPA, recent scoring average, and swing video your family can share. You also need a parent or guardian email and phone. That is what Rod reviews first. If something is missing, he will tell you what to fix before you spend time on outreach.',
  },
  {
    question: 'Who talks to the coaches, you or us?',
    answer: 'Your family talks to the coaches. Rod gives you templates written in your player voice and tells you who to contact, when to follow up, and what to send next. That way coaches hear from your player and your family, and Rod stays in the background guiding the plan.',
  },
  {
    question: 'What happens when a coach replies?',
    answer: 'That is where most families get stuck, and it is where Rod stays with you. He helps you read the reply, decide what it really means, prepare for the call, plan the visit, and talk through next steps. You do not have to guess if a reply is real interest, a polite no, or a request for more scores or video.',
  },
  {
    question: 'Do you only help with HBCU golf?',
    answer: 'Yes. CFA is golf only, and the focus is HBCU golf programs. That is why the target list is built around HBCU programs that fit your player academically and athletically, not a long list of schools that will never be a fit.',
  },
  {
    question: 'Can you guarantee an offer or a scholarship?',
    answer: 'No. A coach makes that decision, and no advisor can make it for them. What Rod will do is put your player in front of the right coaches with a clear plan, and guide your family through every real conversation that comes from it. If he does not believe he can help your player, he will tell you that before you pay.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-20 bg-secondary/35 py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Questions Families Ask
          </h2>

          <Accordion type="single" collapsible className="mt-10 space-y-4 md:mt-12">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`question-${index + 1}`}
                className="rounded-xl border border-border/70 bg-card px-5 shadow-card sm:px-6"
              >
                <AccordionTrigger className="gap-4 py-5 text-left font-display text-lg font-semibold leading-snug text-foreground hover:no-underline sm:text-xl">
                  <span className="flex items-start gap-3">
                    <span className="shrink-0 text-primary">{index + 1}.</span>
                    <span>{faq.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pr-2 text-base leading-relaxed text-muted-foreground sm:pl-8 sm:text-lg">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10 text-center md:mt-12">
            <Button asChild size="lg" className="h-14 w-full rounded-full px-8 text-base font-semibold shadow-lg sm:w-auto sm:text-lg">
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

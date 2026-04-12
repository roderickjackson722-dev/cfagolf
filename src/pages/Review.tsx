import { useState } from "react";
import { Check, Video, Mail, Target, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const standardFeatures = [
  "30-min Zoom review",
  "Highlight reel analysis",
  "Email draft feedback",
  "Target list reality check",
];

const ebookFeatures = [
  ...standardFeatures,
  "Bonus: One follow-up email review included",
];

const steps = [
  {
    icon: Video,
    title: "Highlight Reel Review",
    description:
      "We'll watch your video (sound off, like coaches do) and timestamp exactly where they stop watching.",
  },
  {
    icon: Mail,
    title: "Email Draft Edit",
    description:
      "We'll red-line your outreach email for tone and professionalism.",
  },
  {
    icon: Target,
    title: "Target List Check",
    description:
      "We'll tell you if you're aiming too high, too low, or just right.",
  },
  {
    icon: MapPin,
    title: "Next Steps Roadmap",
    description:
      "You'll leave the call with a clear action plan.",
  },
];

const faqs = [
  {
    q: "How do I prepare for the call?",
    a: "Have your highlight reel link, one draft email, and your current target school list ready.",
  },
  {
    q: "What happens after I book?",
    a: "You'll receive a Zoom link. Show up, share your screen, and we'll review everything together.",
  },
  {
    q: "Can parents join the call?",
    a: "Absolutely. We recommend it.",
  },
  {
    q: "What if I need to reschedule?",
    a: "Use the link in your confirmation email to reschedule up to 24 hours before.",
  },
];

const Review = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-[#1E3F20] text-white py-5 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg font-semibold tracking-wide">College Fairway Advisors</p>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A2B4C] mb-4 font-serif">
            Your Coach's Eye Review — eBook Owner Discount
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A 30-minute, 1-on-1 Zoom session to review your highlight reel, email draft, and target list with a recruiting strategist.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Standard */}
          <Card className="border border-border bg-white">
            <CardContent className="p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Standard Price</p>
              <p className="text-4xl font-bold text-muted-foreground line-through mb-6">$199</p>
              <ul className="space-y-3">
                {standardFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground/60" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* eBook Owner */}
          <Card className="border-2 border-[#1E3F20] bg-white relative shadow-lg">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1E3F20] text-white hover:bg-[#1E3F20] text-xs px-3 py-1">
              Recommended
            </Badge>
            <CardContent className="p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#1E3F20] mb-2">eBook Owner Price</p>
              <p className="text-4xl font-bold text-[#1A2B4C] mb-1">$149</p>
              <p className="text-sm text-[#1E3F20] font-medium mb-6">Save $50 — Exclusive link for Playbook owners</p>
              <ul className="space-y-3">
                {ebookFeatures.map((f, i) => (
                  <li key={f} className="flex items-start gap-2 text-foreground">
                    <Check className={`h-5 w-5 mt-0.5 shrink-0 ${i === ebookFeatures.length - 1 ? "text-[#1E3F20]" : "text-[#1E3F20]/70"}`} />
                    <span className={i === ebookFeatures.length - 1 ? "font-semibold text-[#1E3F20]" : ""}>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What Happens */}
      <section className="bg-white py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A2B4C] text-center mb-10 font-serif">
            What Happens During the 30-Minute Call
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((s) => (
              <div key={s.title} className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-[#1E3F20]/10 flex items-center justify-center shrink-0">
                  <s.icon className="h-5 w-5 text-[#1E3F20]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A2B4C] mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A2B4C] mb-8 font-serif">
            Book Your Session Now
          </h2>
          {/* Calendly placeholder */}
          <div className="bg-white border border-border rounded-lg p-8 md:p-12 mb-4 min-h-[400px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium mb-2">Calendly Widget</p>
              <p className="text-sm">Replace this div with your Calendly inline embed:</p>
              <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                https://calendly.com/YOUR-LINK/30min
              </code>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            You'll receive a confirmation email with Zoom link immediately after booking.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-12 md:py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A2B4C] text-center mb-8 font-serif">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-[#1A2B4C] font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2B4C] text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-1 text-sm">
          <p>© {new Date().getFullYear()} College Fairway Advisors</p>
          <p>www.cfa.golf</p>
          <p>info@cfa.golf</p>
        </div>
      </footer>
    </div>
  );
};

export default Review;

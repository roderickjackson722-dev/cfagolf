import { Check, X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

type Feature = {
  title: string;
  description: string;
  consulting: boolean;
  digital: boolean;
};

type FeatureCategory = {
  category: string;
  features: Feature[];
};

const featureCategories: FeatureCategory[] = [
  {
    category: "Digital Tools & Platform Access",
    features: [
      {
        title: "Full College Golf Database Access",
        description: "Search and filter 1,000+ college golf programs by division, conference, academic requirements, and more.",
        consulting: true,
        digital: true,
      },
      {
        title: "Target School List Builder",
        description: "Create a strategic shortlist of colleges that match your academic profile, golf skills, and personal preferences.",
        consulting: true,
        digital: true,
      },
      {
        title: "Tournament Result Tracker",
        description: "Log your competitive results and build a comprehensive playing resume for college coaches.",
        consulting: true,
        digital: true,
      },
      {
        title: "Coach Contact Tracker",
        description: "Organize all your coach communications, follow-ups, and relationship building in one place.",
        consulting: true,
        digital: true,
      },
      {
        title: "Campus Visit Planner",
        description: "Plan, track, and compare campus visits with rating tools and side-by-side comparisons.",
        consulting: true,
        digital: true,
      },
      {
        title: "Scholarship Calculator",
        description: "Analyze and compare scholarship offers to understand the true value of each opportunity.",
        consulting: true,
        digital: true,
      },
      {
        title: "Recruiting Timeline & Worksheets",
        description: "Grade-specific action plans, eligibility checklists, and core course tracking worksheets.",
        consulting: true,
        digital: true,
      },
    ],
  },
  {
    category: "Webinars & Educational Content",
    features: [
      {
        title: "LPGA & PGA Pro Webinars",
        description: "Exclusive partnered webinars featuring LPGA and PGA professionals sharing insights on collegiate golf and beyond.",
        consulting: true,
        digital: true,
      },
      {
        title: "College Coach Q&A Sessions",
        description: "Learn directly from current and former college golf coaches about what they look for in recruits.",
        consulting: true,
        digital: false,
      },
      {
        title: "Recruiting Strategy Workshops",
        description: "Self-paced workshops covering recruiting best practices, communication templates, and timeline planning.",
        consulting: true,
        digital: true,
      },
    ],
  },
  {
    category: "Personalized 1-on-1 Consulting",
    features: [
      {
        title: "12 One-on-One Consulting Calls",
        description: "Personal consultation with an experienced advisor guiding you step-by-step through every phase of the recruiting process.",
        consulting: true,
        digital: false,
      },
      {
        title: "Personalized Recruiting Roadmap",
        description: "A custom-built strategy plan tailored to your academic and athletic profile, with ongoing adjustments based on your progress.",
        consulting: true,
        digital: false,
      },
      {
        title: "Academic & Eligibility Evaluation",
        description: "In-depth assessment of your grades, test scores, and NCAA/NAIA eligibility to identify your best-fit programs.",
        consulting: true,
        digital: false,
      },
      {
        title: "Coach Communication Management",
        description: "Expert guidance on how to reach out to coaches, craft compelling emails, and build meaningful relationships with programs.",
        consulting: true,
        digital: false,
      },
      {
        title: "Highlight Video Review & Feedback",
        description: "Professional review of your golf highlight videos with specific feedback on what coaches want to see.",
        consulting: true,
        digital: false,
      },
      {
        title: "Scholarship Negotiation Strategy",
        description: "Expert tips and hands-on support to help you evaluate and negotiate scholarship offers to maximize your package.",
        consulting: true,
        digital: false,
      },
      {
        title: "Campus Visit Preparation & Coaching",
        description: "Personalized preparation before each campus visit including questions to ask, things to look for, and follow-up strategy.",
        consulting: true,
        digital: false,
      },
      {
        title: "College Visit Planning & Coordination",
        description: "Assistance planning your visit schedule to shortlisted colleges with advice on how to maximize your time.",
        consulting: true,
        digital: false,
      },
    ],
  },
  {
    category: "Ongoing Support",
    features: [
      {
        title: "Priority Email Support",
        description: "Direct access to the CFA team via email for quick questions and guidance between coaching calls.",
        consulting: true,
        digital: false,
      },
      {
        title: "Transfer Portal Guidance",
        description: "If your situation changes, receive expert guidance on navigating the transfer portal process.",
        consulting: true,
        digital: false,
      },
      {
        title: "NIL & Name-Image-Likeness Guidance",
        description: "Advice on understanding and maximizing NIL opportunities as a student-athlete.",
        consulting: true,
        digital: false,
      },
    ],
  },
];

function AvailabilityBadge({ available, label }: { available: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {available ? (
        <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-success" />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
          <X className="w-4 h-4 text-destructive" />
        </div>
      )}
      <span className="text-xs text-muted-foreground hidden sm:inline">
        {available ? `Included in ${label}` : `Not in ${label}`}
      </span>
    </div>
  );
}

export function PricingFeatureAccordion() {
  return (
    <div className="max-w-5xl mx-auto mt-20">
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
          What's Included
        </span>
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Compare <span className="text-primary">Package Features</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Expand each section to see exactly what's included in each plan. Every consulting feature includes all digital tools.
        </p>
      </div>

      {/* Sticky tier headers */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center mb-2 px-4 py-3 bg-muted/50 rounded-lg sticky top-0 z-10">
        <span className="font-semibold text-foreground text-sm">Feature</span>
        <div className="text-center w-24 sm:w-32">
          <Badge className="bg-primary text-primary-foreground">Consulting</Badge>
          <p className="text-[10px] text-muted-foreground mt-1">$2,499</p>
        </div>
        <div className="text-center w-24 sm:w-32">
          <Badge variant="secondary">Annual Portal</Badge>
          <p className="text-[10px] text-muted-foreground mt-1">$24.99/mo</p>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["Digital Tools & Platform Access"]} className="space-y-2">
        {featureCategories.map((category) => (
          <AccordionItem key={category.category} value={category.category} className="border rounded-lg px-4 bg-card">
            <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline">
              {category.category}
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                ({category.features.length} features)
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {category.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[1fr_auto_auto] gap-4 items-start py-3 border-b border-border/50 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">{feature.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{feature.description}</p>
                    </div>
                    <div className="w-24 sm:w-32 flex justify-center">
                      <AvailabilityBadge available={feature.consulting} label="Consulting" />
                    </div>
                    <div className="w-24 sm:w-32 flex justify-center">
                      <AvailabilityBadge available={feature.digital} label="Digital" />
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

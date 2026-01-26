import { 
  GraduationCap, 
  Target, 
  Video, 
  Calendar, 
  Users, 
  FileText, 
  Calculator,
  ClipboardList,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Users,
    title: "Monthly Coaching Calls",
    description: "One-on-one consultation calls guiding you step-by-step through every phase of the recruiting process."
  },
  {
    icon: Video,
    title: "LPGA and PGA Pro Webinars",
    description: "Exclusive partnered webinars featuring LPGA professionals sharing insights on collegiate golf and beyond."
  },
  {
    icon: GraduationCap,
    title: "College Coach Sessions",
    description: "Learn directly from current and former college golf coaches about what they look for in recruits."
  },
  {
    icon: Target,
    title: "Target School List Builder",
    description: "Create a strategic list of colleges that match your academic profile, golf skills, and personal preferences."
  },
  {
    icon: ClipboardList,
    title: "Tournament Result Log",
    description: "Track your competitive results and build a comprehensive playing resume for college coaches."
  },
  {
    icon: FileText,
    title: "Coach Contact Tracker",
    description: "Organize all your coach communications, follow-ups, and relationship building in one place."
  },
  {
    icon: Calculator,
    title: "Scholarship Calculator",
    description: "Analyze and compare scholarship offers to understand the true value of each opportunity."
  },
  {
    icon: Calendar,
    title: "12-Month Recruiting Timeline",
    description: "Grade-specific action plans that keep you on track throughout the recruiting process."
  }
];

export function ServicesSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            Consulting Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Expert Guidance{' '}
            <span className="text-primary">Every Step of the Way</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our personalized consulting service pairs you with experienced advisors, LPGA pros, and college coaches who guide you through every phase of the recruiting journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="group card-hover border-border/50 bg-card">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <service.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/login">
            <Button size="lg" className="rounded-full font-semibold px-8">
              Access All Tools
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-3">
            Sign up to access your recruiting dashboard
          </p>
        </div>
      </div>
    </section>
  );
}

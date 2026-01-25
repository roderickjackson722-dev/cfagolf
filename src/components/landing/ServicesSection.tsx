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
    icon: Target,
    title: "Target School List Builder",
    description: "Create a strategic list of colleges that match your academic profile, golf skills, and personal preferences."
  },
  {
    icon: Video,
    title: "Swing Video Shot List & Specs",
    description: "Professional guidelines for creating compelling highlight videos that catch coaches' attention."
  },
  {
    icon: ClipboardList,
    title: "Tournament Result Log",
    description: "Track your competitive results and build a comprehensive playing resume for college coaches."
  },
  {
    icon: Users,
    title: "Coach Contact Tracker",
    description: "Organize all your coach communications, follow-ups, and relationship building in one place."
  },
  {
    icon: FileText,
    title: "Pre-Call Question Prep",
    description: "Be prepared for every coach call with our comprehensive question templates and talking points."
  },
  {
    icon: GraduationCap,
    title: "Campus Visit Comparison",
    description: "Evaluate and compare your campus visits with structured worksheets for informed decisions."
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
            Member Benefits
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need to{' '}
            <span className="text-primary">Get Recruited</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our comprehensive toolkit guides you through every step of the college golf recruiting process with professional templates, trackers, and resources.
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
            Sign up free to access your recruiting dashboard
          </p>
        </div>
      </div>
    </section>
  );
}

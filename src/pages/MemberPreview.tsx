import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Users, 
  Calendar, 
  Trophy, 
  Calculator, 
  Database, 
  Heart,
  FileText,
  TrendingUp,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const features = [
  {
    icon: Database,
    title: 'College Database',
    description: 'Access our comprehensive database of 500+ college golf programs with detailed information on divisions, rankings, and recruiting requirements.',
    highlights: ['Division I, II, III, NAIA & JUCO', 'Team rankings & statistics', 'Academic requirements', 'Scholarship availability']
  },
  {
    icon: Target,
    title: 'Target School Builder',
    description: 'Build and organize your personalized list of target schools across reach, match, and safety categories.',
    highlights: ['Categorize by fit level', 'Track application progress', 'Priority rankings', 'Notes & reminders']
  },
  {
    icon: Users,
    title: 'Coach Contact Tracker',
    description: 'Keep track of all your coach communications, follow-ups, and relationship building in one organized place.',
    highlights: ['Contact management', 'Follow-up reminders', 'Response tracking', 'Communication history']
  },
  {
    icon: Calendar,
    title: 'Campus Visit Planner',
    description: 'Document and compare your campus visits with detailed ratings and notes to make informed decisions.',
    highlights: ['Visit scheduling', 'Rating categories', 'Photo uploads', 'Comparison tools']
  },
  {
    icon: Trophy,
    title: 'Tournament Log',
    description: 'Track your competitive results and build a comprehensive tournament history for coach communications.',
    highlights: ['Score tracking', 'Performance analytics', 'Position tracking', 'Export for coaches']
  },
  {
    icon: Calculator,
    title: 'Scholarship Calculator',
    description: 'Compare scholarship offers and calculate the true cost of attendance across different programs.',
    highlights: ['Financial aid comparison', 'Net cost analysis', 'Offer tracking', 'Decision support']
  }
];

const bonusFeatures = [
  { icon: Heart, label: 'Favorite Schools List' },
  { icon: FileText, label: 'PDF Export Reports' },
  { icon: TrendingUp, label: 'Progress Dashboard' },
];

export default function MemberPreview() {
  const { user, hasPaidAccess } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm">
                Member Portal Preview
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Everything You Need for 
                <span className="text-primary"> College Golf Recruiting</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Our comprehensive suite of tools helps you stay organized, track your progress, 
                and make informed decisions throughout your recruiting journey.
              </p>
              
              {!user ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/login">
                    <Button size="lg" className="rounded-full px-8">
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button size="lg" variant="outline" className="rounded-full px-8">
                      View Pricing
                    </Button>
                  </Link>
                </div>
              ) : !hasPaidAccess ? (
                <Link to="/pricing">
                  <Button size="lg" className="rounded-full px-8">
                    Unlock Full Access
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <Button size="lg" className="rounded-full px-8">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Powerful Recruiting Tools
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Each tool is designed specifically for junior golfers navigating the college recruiting process.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="absolute top-3 right-3">
                    <Lock className="w-4 h-4 text-muted-foreground/50" />
                  </div>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Bonus Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Plus Additional Features
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {bonusFeatures.map((feature) => (
                <div 
                  key={feature.label}
                  className="flex items-center gap-2 bg-background px-4 py-3 rounded-full border shadow-sm"
                >
                  <feature.icon className="w-5 h-5 text-primary" />
                  <span className="font-medium">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/20">
              <CardContent className="py-12 text-center">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join College Fairway Advisors and get access to all the tools you need 
                  to navigate college golf recruiting with confidence.
                </p>
                
                {!user ? (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/login">
                      <Button size="lg" className="rounded-full px-8">
                        Create Account
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <a 
                      href="https://calendly.com/cfagolf/free-consultation"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="lg" variant="outline" className="rounded-full px-8">
                        Schedule Free Consultation
                      </Button>
                    </a>
                  </div>
                ) : !hasPaidAccess ? (
                  <Link to="/pricing">
                    <Button size="lg" className="rounded-full px-8">
                      Become a Member
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/dashboard">
                    <Button size="lg" className="rounded-full px-8">
                      Access Your Dashboard
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

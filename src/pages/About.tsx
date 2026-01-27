import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Users, Target, ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import about page images
import hbcuGolfTeam from '@/assets/about/hbcu-golf-team.jpg';
import bcgcaGroup from '@/assets/about/bcgca-group.jpg';
import legendsSign from '@/assets/about/legends-sign.jpg';
import coachingLesson from '@/assets/about/coaching-lesson.jpg';
import dortchClassic from '@/assets/about/dortch-classic.jpg';
import womensTeam from '@/assets/about/womens-team.jpg';
import coachesMeeting from '@/assets/about/coaches-meeting.jpg';
import hbcuStudents from '@/assets/about/hbcu-students.jpg';
import sasChampionship from '@/assets/about/sas-championship.jpg';
import trophyPresentation from '@/assets/about/trophy-presentation.jpg';

const pillars = [
  {
    icon: Lightbulb,
    title: 'Clarity Over Confusion',
    description: 'We replace anxiety with a plan. You will always know where you stand, what the next step is, and why it matters.',
  },
  {
    icon: Users,
    title: 'Advocacy Over Ambiguity',
    description: "We don't just give advice; we act. From initiating coach communications to managing your recruiting timeline, we are active partners in your corner.",
  },
  {
    icon: Target,
    title: 'Strategy Over Chance',
    description: 'We move you from hoping to be discovered to implementing a targeted campaign. Your journey is data-informed, relationship-driven, and designed for success.',
  },
];

const galleryImages = [
  { src: hbcuGolfTeam, alt: 'HBCU Golf team members' },
  { src: womensTeam, alt: 'Women\'s golf team with trophy' },
  { src: coachesMeeting, alt: 'Golf coaches meeting' },
  { src: hbcuStudents, alt: 'HBCU Golf students' },
  { src: bcgcaGroup, alt: 'BCGCA group photo on golf course' },
  { src: sasChampionship, alt: 'SAS Championship event' },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm">
                About Us
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Your Expert Guide Through 
                <span className="text-primary"> College Golf Recruiting</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                For the dedicated junior golfer, the path to college golf is more complex than a tricky dogleg. 
                It's a maze of deadlines, communications, evaluations, and negotiations that happens <em>off the course</em>.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                  We Are Your Family's <span className="text-primary">Strategic Recruiting Partner</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  College Fairway Advisors exists for one purpose: <strong>to be your expert guide through that maze.</strong>
                </p>
                <p className="text-muted-foreground mb-6">
                  We are not a swing coach. While your coach perfects your game, we navigate the collegiate landscape, 
                  advocate on your behalf, and build the bridge that connects your talent with a college roster spot.
                </p>
                <Link to="/member-preview">
                  <Button className="rounded-full">
                    Explore Our Services
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <img 
                  src={coachingLesson} 
                  alt="Golf coaching session" 
                  className="rounded-2xl shadow-xl w-full object-cover aspect-[4/5]"
                />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-2xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 grid grid-cols-2 gap-4">
                <img 
                  src={legendsSign} 
                  alt="Where Legends Begin sign" 
                  className="rounded-xl shadow-lg w-full object-cover aspect-[3/4]"
                />
                <img 
                  src={trophyPresentation} 
                  alt="Trophy presentation at golf event" 
                  className="rounded-xl shadow-lg w-full object-cover aspect-[3/4] mt-8"
                />
              </div>
              <div className="order-1 md:order-2">
                <Badge variant="outline" className="mb-4">Our Story</Badge>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                  From Proven Success to Clear Mission
                </h2>
                <p className="text-muted-foreground mb-4">
                  Our founder didn't set out to build a traditional academy. After years immersed in the collegiate golf world 
                  and successfully guiding the first clients—resulting in a <strong>golf scholarship offer</strong> and 
                  multiple <strong>HBCU coach connections</strong>—a clear pattern emerged.
                </p>
                <p className="text-muted-foreground mb-4">
                  Families with exceptional young golfers were lost. They had invested in great coaching but had no roadmap 
                  for the recruiting process. They were unsure how to communicate with coaches, how to get seen, or how to 
                  evaluate opportunities.
                </p>
                <p className="text-muted-foreground">
                  College Fairway Advisors was founded to solve that exact problem. We codified the system that delivered 
                  those early results into a clear, strategic consultancy service. We focus exclusively on what happens 
                  after the scores are posted, turning athletic potential into tangible college opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Three Pillars */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Our Philosophy</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                The Three Pillars of Our Approach
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {pillars.map((pillar, index) => (
                <Card key={pillar.title} className="border-none shadow-lg bg-card hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8 pb-6 px-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <pillar.icon className="w-8 h-8 text-primary" />
                    </div>
                    <span className="text-5xl font-bold text-primary/20 absolute top-4 right-6">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
                    <p className="text-muted-foreground">{pillar.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4">Meet The Founder</Badge>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                  Rod Jackson
                </h2>
                <p className="text-muted-foreground mb-4">
                  Rod Jackson is the strategic force behind College Fairway Advisors. With a deep network within 
                  collegiate golf and a firsthand understanding of the recruiting process's complexities, he built 
                  CFA to demystify the journey for families.
                </p>
                <p className="text-muted-foreground mb-4">
                  Rod's passion for the game was first ignited as a teenager with The First Tee of Atlanta, 
                  leading him to compete as a student-athlete on the men's golf team at <strong>Alabama A&M University</strong>. 
                  After earning his degree, he pursued and achieved the prestigious designation of <strong>PGA Professional</strong>, 
                  building a career at the top Golf Management company in the world, Troon Golf.
                </p>
                <p className="text-muted-foreground mb-4">
                  For the past decade, Rod has served as the Tournament Director for multiple HBCU golf tournaments, 
                  giving him an unparalleled, behind-the-scenes view of the coaching landscape, recruiting needs, 
                  and talent within the HBCU golf world.
                </p>
                <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg mt-6">
                  <Quote className="w-6 h-6 text-primary mb-2" />
                  <p className="text-foreground italic">
                    "Rod isn't just a consultant; he is an architect of player development. He has used his insider's 
                    knowledge of the destination to design a better, more proven journey."
                  </p>
                </div>
              </div>
              <div className="relative">
                <img 
                  src={dortchClassic} 
                  alt="Rod Jackson speaking at HBCU Golf event" 
                  className="rounded-2xl shadow-xl w-full object-cover"
                />
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-2xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Our Community</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Building Pathways in College Golf
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From HBCU championships to coaching clinics, we're deeply connected to the college golf community.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((image, index) => (
                <div 
                  key={index} 
                  className="relative overflow-hidden rounded-xl group"
                >
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/20">
              <CardContent className="py-12 text-center">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Ready to Move from Hoping to Having a Plan?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  If you're ready to take the next step in your college golf journey, we should talk. 
                  Schedule a complimentary <strong>Recruiting Roadmap Call</strong> to discuss your goals 
                  and how we can help you achieve them.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://calendly.com/cfagolf/free-consultation"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" className="rounded-full px-8">
                      Schedule Free Consultation
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </a>
                  <Link to="/member-preview">
                    <Button size="lg" variant="outline" className="rounded-full px-8">
                      Explore Our Services
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

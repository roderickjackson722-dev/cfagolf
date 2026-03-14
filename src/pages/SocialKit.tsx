import { useState } from 'react';
import { Copy, Check, Download, Instagram, Facebook, Twitter, Linkedin, Video, Image, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import cfaLogo from '@/assets/cfa-logo.png';

const SITE_URL = 'https://cfagolf.com';

const captions = {
  instagram: [
    {
      title: 'Parent Pain Point',
      text: `Your kid's swing coach can build their game. But who's building their path to a roster spot? 🎯⛳

That's where College Fairway Advisors comes in.

We give junior golfers and their families the tools, strategy, and expert guidance to navigate the college golf recruiting process with confidence.

✅ 1,000+ college programs searchable
✅ Target school builder
✅ Coach contact tracker
✅ Scholarship calculator
✅ 12 months of expert coaching

Link in bio to get started 👆

#collegegolf #juniorgolf #golfrecruiting #d1golf #highschoolgolf #golfdad #golfmom #collegeathlete`,
    },
    {
      title: 'Value Proposition',
      text: `Stop juggling spreadsheets, emails, and guesswork. 📊

College Fairway Advisors gives you ONE platform to navigate the entire college golf recruiting process.

From finding the right programs to tracking coach outreach to comparing scholarship offers — we've got you covered.

🔗 cfagolf.com/go

#collegegolfrecruiting #juniorgolfer #golfscholarship #collegeathletes #golflife`,
    },
    {
      title: 'Stats Highlight',
      text: `Did you know there are 1,000+ college golf programs across D1, D2, D3, NAIA, and JUCO? 🏌️‍♂️

Finding the RIGHT fit for your game AND your goals can feel overwhelming.

That's why we built College Fairway Advisors — the only all-in-one recruiting platform built specifically for junior golfers.

Start your search today ➡️ Link in bio

#collegegolf #golfrecruiting #juniorgolf #d1golf #d2golf #d3golf #naiagolf #jucogolf`,
    },
  ],
  facebook: [
    {
      title: 'Parent-Focused Post',
      text: `Attention golf parents: Your child's swing coach builds their game. But who's building their path to a college roster?

College Fairway Advisors is the only all-in-one recruiting platform built specifically for junior golfers and their families.

🎯 Search 1,000+ college golf programs
📋 Build target school lists with expert guidance
📧 Track coach outreach and follow-ups
💰 Compare scholarship offers side-by-side
📅 12 months of personalized coaching support

We take the guesswork out of college golf recruiting so you can focus on what matters — supporting your athlete.

Learn more at cfagolf.com`,
    },
    {
      title: 'Success Story Hook',
      text: `The college golf recruiting process doesn't have to be stressful.

With College Fairway Advisors, families get:
✅ A searchable database of every college golf program
✅ Tools to organize their recruiting journey
✅ Expert guidance every step of the way

Whether your junior golfer is dreaming of D1 or finding the perfect D3 fit, we're here to help.

Get started: cfagolf.com/go`,
    },
  ],
  twitter: [
    {
      title: 'Quick Hook',
      text: `Your swing coach builds the game. We build the path to a roster spot. ⛳🎯

College Fairway Advisors: The only all-in-one college golf recruiting platform.

1,000+ programs. Expert guidance. One platform.

cfagolf.com/go`,
    },
    {
      title: 'Stats Thread Starter',
      text: `There are 1,000+ college golf programs in the US.

Finding the right fit is overwhelming.

That's why we built @CFAgolf — searchable database, coach tracker, scholarship calculator, and 12 months of expert support.

All in one platform. cfagolf.com`,
    },
    {
      title: 'Problem/Solution',
      text: `Spreadsheets for tracking coaches ❌
Guessing which programs fit ❌
Comparing scholarships in your head ❌

College Fairway Advisors gives you ONE platform for the entire recruiting process ✅

cfagolf.com/go`,
    },
  ],
  linkedin: [
    {
      title: 'Professional Announcement',
      text: `Excited to share College Fairway Advisors — the recruiting platform we wish existed when navigating the college golf landscape.

For junior golfers and their families, the recruiting process can be overwhelming. There are 1,000+ programs across D1, D2, D3, NAIA, and JUCO. Finding the right fit academically, athletically, and financially requires organization, strategy, and expert guidance.

That's exactly what CFA provides:
• Comprehensive college program database
• Target school builder with categorization tools
• Coach contact tracker with follow-up reminders
• Scholarship offer comparison calculator
• Campus visit planning and evaluation
• 12 months of personalized coaching

Where swing coaches build the game, we build the path to a roster spot.

Learn more: cfagolf.com`,
    },
  ],
  tiktok: [
    {
      title: 'Hook for Video',
      text: `POV: You're a golf parent trying to figure out college recruiting 😵‍💫

There are 1,000+ programs. Hundreds of coaches to contact. Scholarships to compare.

Where do you even start?

That's why we built College Fairway Advisors — the ONLY all-in-one platform for college golf recruiting.

Link in bio 🔗

#collegegolf #juniorgolf #golfrecruiting #golfdad #golfmom #d1golf #collegeathlete #golflife`,
    },
    {
      title: 'Quick Value',
      text: `Swing coaches build the game 🏌️
We build the path to a roster spot 🎯

College Fairway Advisors ⛳

#collegegolf #juniorgolf #golfrecruiting`,
    },
  ],
};

const hashtags = {
  primary: ['#collegegolf', '#juniorgolf', '#golfrecruiting', '#d1golf', '#collegegolfrecruiting'],
  secondary: ['#highschoolgolf', '#golfdad', '#golfmom', '#collegeathlete', '#golflife', '#golfscholarship'],
  divisions: ['#d1golf', '#d2golf', '#d3golf', '#naiagolf', '#jucogolf'],
};

export default function SocialKit() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadImage = (src: string, filename: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <img src={cfaLogo} alt="CFA" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">Social Media Kit</h1>
              <p className="text-primary-foreground/80">Ready-to-use assets and captions for sharing CFA</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Visual Assets */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            Visual Assets
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Instagram Square */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram Feed (1080×1080)
                </CardTitle>
                <CardDescription>Square format for feed posts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <img 
                  src="/flyers/cfa-social-flyer-instagram.jpg" 
                  alt="CFA Instagram Flyer" 
                  className="w-full aspect-square object-cover rounded-lg border"
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => downloadImage('/flyers/cfa-social-flyer-instagram.jpg', 'cfa-instagram-flyer.jpg')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>

            {/* Story/Reel Format */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Stories/Reels (1080×1920)
                </CardTitle>
                <CardDescription>Vertical format for stories & reels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <img 
                  src="/flyers/cfa-social-flyer.jpg" 
                  alt="CFA Vertical Flyer" 
                  className="w-full aspect-[9/16] object-cover rounded-lg border"
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => downloadImage('/flyers/cfa-social-flyer.jpg', 'cfa-story-flyer.jpg')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>

            {/* Promo Video */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Promo Video Clip
                </CardTitle>
                <CardDescription>Use for TikTok, Reels, or Stories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <video 
                  src="/videos/cfa-promo-clip.mp4" 
                  className="w-full aspect-[9/16] object-cover rounded-lg border"
                  controls
                  muted
                  playsInline
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => downloadImage('/videos/cfa-promo-clip.mp4', 'cfa-promo-clip.mp4')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>

            {/* TikTok Square */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  TikTok Post (1080×1080)
                </CardTitle>
                <CardDescription>Square format for TikTok feed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <img 
                  src="/flyers/cfa-social-flyer-tiktok.jpg" 
                  alt="CFA TikTok Flyer" 
                  className="w-full aspect-square object-cover rounded-lg border"
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => downloadImage('/flyers/cfa-social-flyer-tiktok.jpg', 'cfa-tiktok-flyer.jpg')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>

            {/* Facebook Square */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Facebook className="w-4 h-4" />
                  Facebook Post (1080×1080)
                </CardTitle>
                <CardDescription>Square format for Facebook feed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <img 
                  src="/flyers/cfa-social-flyer-facebook.jpg" 
                  alt="CFA Facebook Flyer" 
                  className="w-full aspect-square object-cover rounded-lg border"
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => downloadImage('/flyers/cfa-social-flyer-facebook.jpg', 'cfa-facebook-flyer.jpg')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>

            {/* LinkedIn Square */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn Post (1080×1080)
                </CardTitle>
                <CardDescription>Square format for LinkedIn feed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <img 
                  src="/flyers/cfa-social-flyer-linkedin-square.jpg" 
                  alt="CFA LinkedIn Flyer" 
                  className="w-full aspect-square object-cover rounded-lg border"
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => downloadImage('/flyers/cfa-social-flyer-linkedin-square.jpg', 'cfa-linkedin-square-flyer.jpg')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>

            {/* Pinterest Square */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Pinterest Pin (1000×1000)
                </CardTitle>
                <CardDescription>Square format for Pinterest</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <img 
                  src="/flyers/cfa-social-flyer-pinterest-square.jpg" 
                  alt="CFA Pinterest Flyer" 
                  className="w-full aspect-square object-cover rounded-lg border"
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => downloadImage('/flyers/cfa-social-flyer-pinterest-square.jpg', 'cfa-pinterest-square-flyer.jpg')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Hashtags */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-primary" />
            Hashtag Sets
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Primary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{hashtags.primary.join(' ')}</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(hashtags.primary.join(' '), 'hashtags-primary')}
                >
                  {copiedId === 'hashtags-primary' ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  Copy
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Secondary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{hashtags.secondary.join(' ')}</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(hashtags.secondary.join(' '), 'hashtags-secondary')}
                >
                  {copiedId === 'hashtags-secondary' ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  Copy
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Division Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{hashtags.divisions.join(' ')}</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(hashtags.divisions.join(' '), 'hashtags-divisions')}
                >
                  {copiedId === 'hashtags-divisions' ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  Copy
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Platform Captions */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Pre-Written Captions</h2>
          
          <Tabs defaultValue="instagram" className="w-full">
            <TabsList className="mb-4 flex-wrap h-auto gap-1">
              <TabsTrigger value="instagram" className="flex items-center gap-1.5">
                <Instagram className="w-4 h-4" /> Instagram
              </TabsTrigger>
              <TabsTrigger value="facebook" className="flex items-center gap-1.5">
                <Facebook className="w-4 h-4" /> Facebook
              </TabsTrigger>
              <TabsTrigger value="twitter" className="flex items-center gap-1.5">
                <Twitter className="w-4 h-4" /> X / Twitter
              </TabsTrigger>
              <TabsTrigger value="linkedin" className="flex items-center gap-1.5">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </TabsTrigger>
              <TabsTrigger value="tiktok" className="flex items-center gap-1.5">
                <Video className="w-4 h-4" /> TikTok
              </TabsTrigger>
            </TabsList>

            {Object.entries(captions).map(([platform, posts]) => (
              <TabsContent key={platform} value={platform} className="space-y-4">
                {posts.map((post, idx) => (
                  <Card key={idx}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-secondary/50 p-4 rounded-lg mb-3 font-sans">
                        {post.text}
                      </pre>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(post.text, `${platform}-${idx}`)}
                      >
                        {copiedId === `${platform}-${idx}` ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Caption
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Quick Links */}
        <section className="bg-secondary/50 rounded-xl p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-3">Quick Copy Links</h2>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(`${SITE_URL}/go`, 'link-go')}
            >
              {copiedId === 'link-go' ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
              cfagolf.com/go
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(SITE_URL, 'link-main')}
            >
              {copiedId === 'link-main' ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
              cfagolf.com
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(`${SITE_URL}/checkout`, 'link-checkout')}
            >
              {copiedId === 'link-checkout' ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
              cfagolf.com/checkout
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

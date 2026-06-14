import { Navigate } from 'react-router-dom';
import { Shield, Database, Users, CreditCard, Download, Eye, MessageSquare, FileText, Tag, GraduationCap, Mail, BookOpen, Trophy, ShoppingBag, MailPlus, Newspaper, Phone, BarChart3, DollarSign, UserCog, Link2, Megaphone, Briefcase, Presentation, FileSignature, FolderOpen, UserSquare2, Receipt, Film } from 'lucide-react';
import { AdminInvoiceBuilder } from '@/components/admin/AdminInvoiceBuilder';
import Inventory from '@/pages/admin/Inventory';
import ContentLibraryEmbedded from '@/pages/admin/ContentLibrary';
import StudentsEmbedded from '@/pages/admin/Students';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAllPlayers } from '@/hooks/usePlayers';
import { AdminMemberContent } from '@/components/admin/AdminMemberContent';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useColleges } from '@/hooks/useColleges';
import { AdminCollegeTable } from '@/components/admin/AdminCollegeTable';
import { AdminDatabaseCleanup } from '@/components/admin/AdminDatabaseCleanup';
import { AdminUserTable } from '@/components/admin/AdminUserTable';
import { AdminMembershipTable } from '@/components/admin/AdminMembershipTable';
import { AdminAnalyticsDashboard } from '@/components/admin/AdminAnalyticsDashboard';
import { ClippdImporter } from '@/components/admin/ClippdImporter';
import { AdminTestimonialTable } from '@/components/admin/AdminTestimonialTable';
import { CollegeBulkImporter } from '@/components/admin/CollegeBulkImporter';
import AdminFlyerEditor from '@/components/admin/AdminFlyerEditor';
import { AdminPromoCodeTable } from '@/components/admin/AdminPromoCodeTable';
import { AdminHighSchoolTable } from '@/components/admin/AdminHighSchoolTable';
import { CoachCRM } from '@/components/admin/CoachCRM';
import { ModuleAgenda } from '@/components/admin/ModuleAgenda';
import { AdminWagrTable } from '@/components/admin/AdminWagrTable';
import { AdminToolkitTable } from '@/components/admin/AdminToolkitTable';
import { AdminSalesTable } from '@/components/admin/AdminSalesTable';
import { AdminSubscriberTable } from '@/components/admin/AdminSubscriberTable';
import { AdminReleasesTable } from '@/components/admin/AdminReleasesTable';
import { AdminNewsletterTable } from '@/components/admin/AdminNewsletterTable';
import { DemoCallAgenda } from '@/components/admin/DemoCallAgenda';
import { AdminCoachesTable } from '@/components/admin/AdminCoachesTable';
import { AdminPresentationTokens } from '@/components/admin/AdminPresentationTokens';
import { AdminPresentationSlides } from '@/components/admin/AdminPresentationSlides';
import { HbcuProgramsTable } from '@/components/admin/HbcuProgramsTable';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CollegeFilters } from '@/types/college';

const defaultFilters: CollegeFilters = {
  search: '',
  divisions: [],
  states: [],
  schoolSizes: [],
  teamGenders: [],
  hbcuOnly: false,
  maxRanking: null,
  minScholarships: null,
  maxScoringAvg: null,
  maxActScore: null,
  maxSatScore: null,
  maxCost: null,
};

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: colleges = [], isLoading: collegesLoading } = useColleges(defaultFilters);

  const isLoading = authLoading || adminLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access the admin panel. Please contact an administrator if you believe this is an error.
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-primary" />
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Admin Panel
                </h1>
              </div>
              <p className="text-muted-foreground">
                Manage college data, users, and system settings
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button asChild variant="outline">
                <Link to="/admin/email-templates">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Templates
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin/agenda-templates">
                  <Link2 className="w-4 h-4 mr-2" />
                  Agenda Templates
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin/links">
                  <Link2 className="w-4 h-4 mr-2" />
                  Links Library
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin/social-clips">
                  <Film className="w-4 h-4 mr-2" />
                  Social Clips
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin/resources">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Free Resources
                </Link>
              </Button>
            </div>
          </div>


          {/* Top-level category tabs */}
          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="flex flex-wrap h-auto">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Members
              </TabsTrigger>
              <TabsTrigger value="sales" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Sales & Marketing
              </TabsTrigger>
              <TabsTrigger value="coaches" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Coaches
              </TabsTrigger>
              <TabsTrigger value="sales-tools" className="flex items-center gap-2">
                <Presentation className="w-4 h-4" />
                Sales Tools
              </TabsTrigger>
              <TabsTrigger value="other" className="flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Other
              </TabsTrigger>
            </TabsList>

            {/* === CONTENT === */}
            <TabsContent value="content">
              <Tabs defaultValue="colleges" className="space-y-6">
                <TabsList className="flex flex-wrap h-auto">
                  <TabsTrigger value="colleges" className="flex items-center gap-2">
                    <Database className="w-4 h-4" /> Colleges
                  </TabsTrigger>
                  <TabsTrigger value="highschools" className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> High Schools
                  </TabsTrigger>
                  <TabsTrigger value="wagr" className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" /> WAGR
                  </TabsTrigger>
                  <TabsTrigger value="hbcu" className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" /> HBCU Programs
                  </TabsTrigger>
                  <TabsTrigger value="import" className="flex items-center gap-2">
                    <Download className="w-4 h-4" /> Data Import
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="colleges" className="space-y-6">
                  <AdminDatabaseCleanup />
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        <CardTitle>College Database</CardTitle>
                      </div>
                      <CardDescription>
                        Add, edit, or remove colleges from the database. Upload logos and manage all college information.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminCollegeTable colleges={colleges} isLoading={collegesLoading} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="highschools">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <CardTitle>Georgia High School Golf Teams</CardTitle>
                      </div>
                      <CardDescription>
                        452 GHSA member schools with golf programs. Add coach contact info as you discover it.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminHighSchoolTable />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="wagr">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-primary" />
                        <CardTitle>WAGR Tournaments</CardTitle>
                      </div>
                      <CardDescription>
                        Manage World Amateur Golf Ranking tournament database. Add events manually or import from wagr.com.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminWagrTable />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="hbcu">
                  <HbcuProgramsTable />
                </TabsContent>

                <TabsContent value="import" className="space-y-6">
                  <CollegeBulkImporter />
                  <ClippdImporter />
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* === MEMBERS === */}
            <TabsContent value="members">
              <Tabs defaultValue="users" className="space-y-6">
                <TabsList className="flex flex-wrap h-auto">
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> Users
                  </TabsTrigger>
                  <TabsTrigger value="memberships" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Memberships
                  </TabsTrigger>
                  <TabsTrigger value="subscribers" className="flex items-center gap-2">
                    <MailPlus className="w-4 h-4" /> Subscribers
                  </TabsTrigger>
                  <TabsTrigger value="releases" className="flex items-center gap-2">
                    <FileSignature className="w-4 h-4" /> Releases
                  </TabsTrigger>
                  <TabsTrigger value="member-content" className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" /> Member Files
                  </TabsTrigger>
                  <TabsTrigger value="players" className="flex items-center gap-2">
                    <UserSquare2 className="w-4 h-4" /> Players
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        <CardTitle>Registered Users</CardTitle>
                      </div>
                      <CardDescription>
                        View all registered user profiles, manage paid access status, and see user details.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminUserTable />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="memberships">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <CardTitle>Memberships & Payments</CardTitle>
                      </div>
                      <CardDescription>
                        View all customer memberships, payment history, and revenue statistics from Stripe.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminMembershipTable />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="subscribers">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <MailPlus className="w-5 h-5 text-primary" />
                        <CardTitle>Email Subscribers</CardTitle>
                      </div>
                      <CardDescription>
                        View and manage email list subscribers. Export to CSV or remove inactive subscribers.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminSubscriberTable />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="releases">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <FileSignature className="w-5 h-5 text-primary" />
                        <CardTitle>Player Profile Releases</CardTitle>
                      </div>
                      <CardDescription>
                        Search, view, and export signed Player Profile Release forms. Update status when a parent or player asks to withdraw consent.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminReleasesTable />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="member-content">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-primary" />
                        <CardTitle>Member Files & Saved Data</CardTitle>
                      </div>
                      <CardDescription>
                        Pick a member to review every document, worksheet, swing video, and tool entry saved under their account.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminMemberContent />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="players">
                  <AdminPlayersPanel />
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* === SALES & MARKETING === */}
            <TabsContent value="sales">
              <Tabs defaultValue="sales-log" className="space-y-6">
                <TabsList className="flex flex-wrap h-auto">
                  <TabsTrigger value="sales-log" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Sales
                  </TabsTrigger>
                  <TabsTrigger value="promos" className="flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Promo Codes
                  </TabsTrigger>
                  <TabsTrigger value="toolkit" className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Toolkit
                  </TabsTrigger>
                  <TabsTrigger value="flyer" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Flyer
                  </TabsTrigger>
                  <TabsTrigger value="newsletter" className="flex items-center gap-2">
                    <Newspaper className="w-4 h-4" /> Newsletter
                  </TabsTrigger>
                  <TabsTrigger value="testimonials" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Reviews
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Analytics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sales-log">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <CardTitle>Sales</CardTitle>
                      </div>
                      <CardDescription>
                        Every digital product purchase, including buyer details, amount, source page, and location.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminSalesTable />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="promos">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-primary" />
                        <CardTitle>Promo Codes</CardTitle>
                      </div>
                      <CardDescription>
                        Create and manage discount promo codes for the checkout process.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminPromoCodeTable />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="toolkit">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        <CardTitle>Recruiting Toolkit</CardTitle>
                      </div>
                      <CardDescription>
                        View toolkit sales, purchase history, and product links. Products are sold as a $99 bundle.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminToolkitTable />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="flyer">
                  <AdminFlyerEditor />
                </TabsContent>

                <TabsContent value="newsletter">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Newspaper className="w-5 h-5 text-primary" />
                        <CardTitle>Monthly Newsletter</CardTitle>
                      </div>
                      <CardDescription>
                        View and edit the monthly recruiting tip emails sent to all active subscribers on the 1st of each month.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminNewsletterTable />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="testimonials">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        <CardTitle>Customer Reviews</CardTitle>
                      </div>
                      <CardDescription>
                        Review submitted testimonials and approve them to display on the website.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminTestimonialTable />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        <CardTitle>Site Analytics</CardTitle>
                      </div>
                      <CardDescription>
                        Website traffic analytics, visitor locations, and browsing activity.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminAnalyticsDashboard />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* === COACHES === */}
            <TabsContent value="coaches">
              <Tabs defaultValue="coaches-portal" className="space-y-6">
                <TabsList className="flex flex-wrap h-auto">
                  <TabsTrigger value="coaches-portal" className="flex items-center gap-2">
                    <UserCog className="w-4 h-4" /> Coaches Portal
                  </TabsTrigger>
                  <TabsTrigger value="crm" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Coach CRM
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="coaches-portal">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <UserCog className="w-5 h-5 text-primary" />
                        <CardTitle>Coaches Portal</CardTitle>
                      </div>
                      <CardDescription>
                        Create coach accounts, send magic-login links, reset passwords, and review access requests.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminCoachesTable />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="crm">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary" />
                        <CardTitle>Coach Outreach CRM</CardTitle>
                      </div>
                      <CardDescription>
                        Manage relationships with high school golf coaches. Send personalized email campaigns to promote CFA to their golf families.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CoachCRM />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* === SALES TOOLS === */}
            <TabsContent value="sales-tools">
              <Tabs defaultValue="demo-call" className="space-y-6">
                <TabsList className="flex flex-wrap h-auto">
                  <TabsTrigger value="demo-call" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Demo Call
                  </TabsTrigger>
                  <TabsTrigger value="agenda" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Module Agenda
                  </TabsTrigger>
                  <TabsTrigger value="share-links" className="flex items-center gap-2">
                    <Link2 className="w-4 h-4" /> Share Links
                  </TabsTrigger>
                  <TabsTrigger value="slide-editor" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Slide Editor
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="demo-call">
                  <DemoCallAgenda />
                </TabsContent>

                <TabsContent value="agenda">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <CardTitle>Module Agenda</CardTitle>
                      </div>
                      <CardDescription>
                        Session-by-session agenda for each coaching module. Use this as your guide during client meetings.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ModuleAgenda />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="share-links">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Link2 className="w-5 h-5 text-primary" />
                        <CardTitle>Member Tools Presentation Links</CardTitle>
                      </div>
                      <CardDescription>
                        Generate, copy, and revoke unguessable share links for the public 20-slide member tools demo. Use these in Zoom sales calls.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminPresentationTokens />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="slide-editor">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-primary" />
                        <CardTitle>Presentation Slide Editor</CardTitle>
                      </div>
                      <CardDescription>
                        Edit slide titles, bullets, and upload real screenshots and your CFA logo. All share links use this same content — changes go live immediately after Save.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminPresentationSlides />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* === OTHER === */}
            <TabsContent value="other">
              <Tabs defaultValue="invoices" className="space-y-6">
                <TabsList className="flex flex-wrap h-auto">
                  <TabsTrigger value="invoices" className="flex items-center gap-2">
                    <Receipt className="w-4 h-4" /> Invoices
                  </TabsTrigger>
                  <TabsTrigger value="inventory" className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Inventory
                  </TabsTrigger>
                  <TabsTrigger value="content-library" className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" /> Content Library
                  </TabsTrigger>
                  <TabsTrigger value="students" className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Students
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="invoices">
                  <AdminInvoiceBuilder />
                </TabsContent>
                <TabsContent value="inventory">
                  <Inventory embedded={true} />
                </TabsContent>
                <TabsContent value="content-library">
                  <ContentLibraryEmbedded embedded={true} />
                </TabsContent>
                <TabsContent value="students">
                  <StudentsEmbedded embedded={true} />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

function AdminPlayersPanel() {
  const { data: players = [], isLoading } = useAllPlayers();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <UserSquare2 className="w-5 h-5 text-primary" />
              <CardTitle>Player Portfolio Sites</CardTitle>
            </div>
            <CardDescription>
              Manage student-athlete recruiting websites at /p/&lt;slug&gt; or custom domains.
            </CardDescription>
          </div>
          <Button asChild>
            <Link to="/admin/players/new">+ New Player</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : players.length === 0 ? (
          <p className="text-muted-foreground py-4">No players yet. Create the first one.</p>
        ) : (
          <div className="divide-y border rounded-md">
            {players.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="font-medium">{p.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    /p/{p.slug}{p.custom_domain ? ` · ${p.custom_domain}` : ''} · {p.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/p/${p.slug}`} target="_blank" rel="noopener noreferrer">View</a>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to={`/admin/players/${p.id}/edit`}>Edit</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Admin;

import { Navigate } from 'react-router-dom';
import { Shield, Database, Users, CreditCard, Download, Eye, MessageSquare, FileText, Tag, GraduationCap, Mail, BookOpen, Trophy, ShoppingBag, MailPlus, Newspaper, Phone, BarChart3, DollarSign } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useColleges } from '@/hooks/useColleges';
import { AdminCollegeTable } from '@/components/admin/AdminCollegeTable';
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
import { AdminNewsletterTable } from '@/components/admin/AdminNewsletterTable';
import { DemoCallAgenda } from '@/components/admin/DemoCallAgenda';

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
          <div className="mb-8">
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

          {/* Tabs for different sections */}
          <Tabs defaultValue="colleges" className="space-y-6">
            <TabsList>
              <TabsTrigger value="colleges" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Colleges
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="memberships" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Memberships
              </TabsTrigger>
              <TabsTrigger value="import" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Data Import
              </TabsTrigger>
              <TabsTrigger value="visitors" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="flyer" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Flyer
              </TabsTrigger>
              <TabsTrigger value="promos" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Promo Codes
              </TabsTrigger>
              <TabsTrigger value="highschools" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                High Schools
              </TabsTrigger>
              <TabsTrigger value="crm" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Coach CRM
              </TabsTrigger>
              <TabsTrigger value="demo-call" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Demo Call
              </TabsTrigger>
              <TabsTrigger value="agenda" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Module Agenda
              </TabsTrigger>
              <TabsTrigger value="wagr" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                WAGR
              </TabsTrigger>
              <TabsTrigger value="toolkit" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Toolkit
              </TabsTrigger>
              <TabsTrigger value="sales" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Sales
              </TabsTrigger>
              <TabsTrigger value="subscribers" className="flex items-center gap-2">
                <MailPlus className="w-4 h-4" />
                Subscribers
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                Newsletter
              </TabsTrigger>
            </TabsList>

            {/* College Management Tab */}
            <TabsContent value="colleges">
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
                  <AdminCollegeTable 
                    colleges={colleges} 
                    isLoading={collegesLoading} 
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Management Tab */}
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

            {/* Membership Management Tab */}
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

            {/* Data Import Tab */}
            <TabsContent value="import" className="space-y-6">
              <CollegeBulkImporter />
              <ClippdImporter />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="visitors">
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

            {/* Testimonials Management Tab */}
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
            {/* Flyer Editor Tab */}
            <TabsContent value="flyer">
              <AdminFlyerEditor />
            </TabsContent>

            {/* Promo Codes Tab */}
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

            {/* High Schools Tab */}
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

            {/* Coach CRM Tab */}
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
            {/* Demo Call Agenda Tab */}
            <TabsContent value="demo-call">
              <DemoCallAgenda />
            </TabsContent>
            {/* Module Agenda Tab */}
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
            {/* WAGR Tournaments Tab */}
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
            {/* Toolkit Tab */}
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
            {/* Sales Tab */}
            <TabsContent value="sales">
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
            {/* Email Subscribers Tab */}
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
            {/* Newsletter Editor Tab */}
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
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;

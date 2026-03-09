import { Navigate } from 'react-router-dom';
import { Shield, Database, Users, CreditCard, Download, Eye, MessageSquare, FileText, Tag, GraduationCap, Mail, BookOpen, Trophy } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useColleges } from '@/hooks/useColleges';
import { AdminCollegeTable } from '@/components/admin/AdminCollegeTable';
import { AdminUserTable } from '@/components/admin/AdminUserTable';
import { AdminMembershipTable } from '@/components/admin/AdminMembershipTable';
import { AdminVisitorTable } from '@/components/admin/AdminVisitorTable';
import { ClippdImporter } from '@/components/admin/ClippdImporter';
import { AdminTestimonialTable } from '@/components/admin/AdminTestimonialTable';
import { CollegeBulkImporter } from '@/components/admin/CollegeBulkImporter';
import AdminFlyerEditor from '@/components/admin/AdminFlyerEditor';
import { AdminPromoCodeTable } from '@/components/admin/AdminPromoCodeTable';
import { AdminHighSchoolTable } from '@/components/admin/AdminHighSchoolTable';
import { CoachCRM } from '@/components/admin/CoachCRM';
import { ModuleAgenda } from '@/components/admin/ModuleAgenda';
import { AdminWagrTable } from '@/components/admin/AdminWagrTable';
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
                <Eye className="w-4 h-4" />
                Visitors
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
              <TabsTrigger value="agenda" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Module Agenda
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

            {/* Site Visitors Tab */}
            <TabsContent value="visitors">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    <CardTitle>Site Visitors</CardTitle>
                  </div>
                  <CardDescription>
                    View recent site visitors, their locations, and browsing activity. Emails are sent automatically for each new visitor.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminVisitorTable />
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
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;

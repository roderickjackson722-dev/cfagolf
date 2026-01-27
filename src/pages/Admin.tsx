import { Navigate } from 'react-router-dom';
import { Shield, Database, Users, CreditCard, Download } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useColleges } from '@/hooks/useColleges';
import { AdminCollegeTable } from '@/components/admin/AdminCollegeTable';
import { AdminUserTable } from '@/components/admin/AdminUserTable';
import { AdminMembershipTable } from '@/components/admin/AdminMembershipTable';
import { ClippdImporter } from '@/components/admin/ClippdImporter';
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
            <TabsContent value="import">
              <ClippdImporter />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;

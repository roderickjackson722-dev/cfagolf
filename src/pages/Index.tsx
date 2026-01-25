import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { CollegeDatabase } from '@/components/CollegeDatabase';
import { PaywallGate } from '@/components/PaywallGate';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { user, hasPaidAccess, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12">
          <Skeleton className="h-64 w-full rounded-xl mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-72 rounded-xl" />
            <Skeleton className="h-72 rounded-xl" />
            <Skeleton className="h-72 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Show paywall if not logged in or no paid access
  if (!user || !hasPaidAccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <PaywallGate />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CollegeDatabase />
    </div>
  );
};

export default Index;

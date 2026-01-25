import { AuthForm } from '@/components/AuthForm';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { user, loading, hasPaidAccess } = useAuth();

  // Redirect based on access level
  if (!loading && user) {
    if (hasPaidAccess) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/pricing" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 md:py-24">
        <div className="container max-w-md">
          <AuthForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

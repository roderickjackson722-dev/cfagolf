import { AuthForm } from '@/components/AuthForm';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { user, loading } = useAuth();

  // Redirect if already logged in
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12 md:py-24">
        <AuthForm />
      </div>
    </div>
  );
};

export default Login;

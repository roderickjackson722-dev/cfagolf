import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        toast.error('No session ID found');
        setVerifying(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId },
        });

        if (error) throw error;

        if (data.success && data.paid) {
          setVerified(true);
          toast.success('Payment verified! Welcome to CFA Golf!');
        } else {
          toast.error('Payment verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        toast.error('Failed to verify payment');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {verifying ? (
            <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
          ) : verified ? (
            <CheckCircle className="w-16 h-16 mx-auto text-primary" />
          ) : null}
          <CardTitle className="text-2xl font-display mt-4">
            {verifying ? 'Verifying Payment...' : verified ? 'Welcome to CFA Golf!' : 'Payment Issue'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {verifying ? (
            <p className="text-muted-foreground">
              Please wait while we verify your payment...
            </p>
          ) : verified ? (
            <>
              <p className="text-muted-foreground">
                Your membership is now active! You have full access to all CFA Golf recruiting tools and resources.
              </p>
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">
                There was an issue verifying your payment. Please contact support if the issue persists.
              </p>
              <Button 
                onClick={() => navigate('/login')} 
                variant="outline"
                className="w-full"
              >
                Return to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;

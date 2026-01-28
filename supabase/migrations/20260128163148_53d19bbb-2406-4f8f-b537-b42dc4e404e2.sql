-- Drop the old trigger and function
DROP TRIGGER IF EXISTS trigger_send_welcome_email ON public.profiles;
DROP FUNCTION IF EXISTS public.send_welcome_email_on_paid_access();

-- Create the corrected function using net.http_post from pg_net
CREATE OR REPLACE FUNCTION public.send_welcome_email_on_paid_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only trigger when has_paid_access changes from false/null to true
  IF (OLD.has_paid_access IS DISTINCT FROM true) AND (NEW.has_paid_access = true) THEN
    -- Call the send-welcome-email edge function via pg_net
    PERFORM net.http_post(
      url := 'https://hmycumiukfdbfhplgbri.supabase.co/functions/v1/send-welcome-email',
      body := jsonb_build_object(
        'email', NEW.email,
        'fullName', NEW.full_name
      ),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhteWN1bWl1a2ZkYmZocGxnYnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMTM1ODYsImV4cCI6MjA4NDg4OTU4Nn0.T3UkX67UM5fLgYqMGuf3za9bX4gs33gJ0f5XDtEPSGE'
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER trigger_send_welcome_email
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.send_welcome_email_on_paid_access();
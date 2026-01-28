-- Enable pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create function to send welcome email via edge function
CREATE OR REPLACE FUNCTION public.send_welcome_email_on_paid_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  supabase_url text;
  anon_key text;
BEGIN
  -- Only trigger when has_paid_access changes from false/null to true
  IF (OLD.has_paid_access IS DISTINCT FROM true) AND (NEW.has_paid_access = true) THEN
    -- Get the Supabase URL and anon key from environment
    supabase_url := current_setting('app.settings.supabase_url', true);
    anon_key := current_setting('app.settings.supabase_anon_key', true);
    
    -- If settings not available, use hardcoded values (set during migration)
    IF supabase_url IS NULL THEN
      supabase_url := 'https://hmycumiukfdbfhplgbri.supabase.co';
    END IF;
    
    IF anon_key IS NULL THEN
      anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhteWN1bWl1a2ZkYmZocGxnYnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMTM1ODYsImV4cCI6MjA4NDg4OTU4Nn0.T3UkX67UM5fLgYqMGuf3za9bX4gs33gJ0f5XDtEPSGE';
    END IF;
    
    -- Call the send-welcome-email edge function via pg_net
    PERFORM extensions.http_post(
      url := supabase_url || '/functions/v1/send-welcome-email',
      body := json_build_object(
        'email', NEW.email,
        'fullName', NEW.full_name
      )::text,
      headers := json_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || anon_key
      )::jsonb
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS trigger_send_welcome_email ON public.profiles;
CREATE TRIGGER trigger_send_welcome_email
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.send_welcome_email_on_paid_access();
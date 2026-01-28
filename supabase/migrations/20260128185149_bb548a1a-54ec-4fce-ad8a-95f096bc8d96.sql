-- Create a table to track site visitors
CREATE TABLE public.site_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  page_url text,
  referrer text,
  user_agent text,
  ip_address text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS (allow inserts from anyone, but only admins can read)
ALTER TABLE public.site_visitors ENABLE ROW LEVEL SECURITY;

-- Anyone can insert visitor records
CREATE POLICY "Anyone can log visits"
ON public.site_visitors
FOR INSERT
WITH CHECK (true);

-- Only admins can view visitor logs
CREATE POLICY "Admins can view visitors"
ON public.site_visitors
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to notify admin of new visitors
CREATE OR REPLACE FUNCTION public.notify_admin_new_visitor()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://hmycumiukfdbfhplgbri.supabase.co/functions/v1/notify-admin',
    body := jsonb_build_object(
      'type', 'visitor',
      'visitorId', NEW.visitor_id,
      'pageUrl', NEW.page_url,
      'referrer', NEW.referrer,
      'timestamp', NEW.created_at
    ),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhteWN1bWl1a2ZkYmZocGxnYnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMTM1ODYsImV4cCI6MjA4NDg4OTU4Nn0.T3UkX67UM5fLgYqMGuf3za9bX4gs33gJ0f5XDtEPSGE'
    )
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new visitors
CREATE TRIGGER trigger_notify_admin_new_visitor
  AFTER INSERT ON public.site_visitors
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_new_visitor();

-- Create function to notify admin of new signups
CREATE OR REPLACE FUNCTION public.notify_admin_new_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://hmycumiukfdbfhplgbri.supabase.co/functions/v1/notify-admin',
    body := jsonb_build_object(
      'type', 'signup',
      'email', NEW.email,
      'fullName', NEW.full_name,
      'graduationYear', NEW.graduation_year,
      'handicap', NEW.handicap,
      'highSchool', NEW.high_school,
      'state', NEW.state,
      'city', NEW.city,
      'phone', NEW.phone,
      'timestamp', NEW.created_at
    ),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhteWN1bWl1a2ZkYmZocGxnYnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMTM1ODYsImV4cCI6MjA4NDg4OTU4Nn0.T3UkX67UM5fLgYqMGuf3za9bX4gs33gJ0f5XDtEPSGE'
    )
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new signups (fires on profile creation)
CREATE TRIGGER trigger_notify_admin_new_signup
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_new_signup();
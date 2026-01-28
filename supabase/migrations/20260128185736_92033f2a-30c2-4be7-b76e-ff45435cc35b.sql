-- Update the visitor notification trigger function to include location data
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
      'country', NEW.country,
      'region', NEW.region,
      'city', NEW.city,
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
-- Create campus_visits table for tracking college visits
CREATE TABLE public.campus_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
  custom_school_name TEXT,
  visit_date DATE NOT NULL,
  visit_type TEXT DEFAULT 'in-person',
  
  -- Ratings (1-5 scale)
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  campus_rating INTEGER CHECK (campus_rating >= 1 AND campus_rating <= 5),
  facilities_rating INTEGER CHECK (facilities_rating >= 1 AND facilities_rating <= 5),
  coaching_rating INTEGER CHECK (coaching_rating >= 1 AND coaching_rating <= 5),
  team_culture_rating INTEGER CHECK (team_culture_rating >= 1 AND team_culture_rating <= 5),
  academics_rating INTEGER CHECK (academics_rating >= 1 AND academics_rating <= 5),
  
  -- Notes and details
  notes TEXT,
  pros TEXT,
  cons TEXT,
  questions_asked TEXT,
  follow_up_needed BOOLEAN DEFAULT false,
  
  -- Photos stored as array of URLs
  photo_urls JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campus_visits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own campus visits"
  ON public.campus_visits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add campus visits"
  ON public.campus_visits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campus visits"
  ON public.campus_visits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campus visits"
  ON public.campus_visits FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_campus_visits_updated_at
  BEFORE UPDATE ON public.campus_visits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for visit photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('visit-photos', 'visit-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for visit photos
CREATE POLICY "Users can upload visit photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'visit-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own visit photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'visit-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own visit photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'visit-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Visit photos are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'visit-photos');
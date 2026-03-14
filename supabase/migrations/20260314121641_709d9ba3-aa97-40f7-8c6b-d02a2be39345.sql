
CREATE TABLE public.player_profile_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Section 1: Player Information
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  graduation_year INTEGER NOT NULL,
  current_school TEXT NOT NULL,
  gpa TEXT NOT NULL,
  sat_score TEXT,
  act_score TEXT,
  golf_achievements TEXT NOT NULL,
  player_email TEXT NOT NULL,
  player_phone TEXT NOT NULL,
  
  -- Section 2: Parent/Guardian Information
  parent_name TEXT,
  parent_relationship TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  
  -- Section 3: Authorization
  auth_athletic_profile BOOLEAN NOT NULL DEFAULT false,
  auth_academic_info BOOLEAN NOT NULL DEFAULT false,
  auth_personal_info BOOLEAN NOT NULL DEFAULT false,
  auth_direct_coach_contact BOOLEAN NOT NULL DEFAULT false,
  
  -- Section 4: Photo/Video Release
  release_marketing BOOLEAN DEFAULT false,
  release_website_social BOOLEAN DEFAULT false,
  release_name_achievements BOOLEAN DEFAULT false,
  release_success_story BOOLEAN DEFAULT false,
  
  -- Section 5: Acknowledgments
  ack_not_agency BOOLEAN NOT NULL DEFAULT false,
  ack_no_guarantees BOOLEAN NOT NULL DEFAULT false,
  ack_flat_fee BOOLEAN NOT NULL DEFAULT false,
  ack_no_control_third_party BOOLEAN NOT NULL DEFAULT false,
  ack_can_withdraw BOOLEAN NOT NULL DEFAULT false,
  
  -- Section 6: Signatures
  player_signature TEXT NOT NULL,
  player_signature_date DATE NOT NULL,
  parent_signature TEXT,
  parent_signature_date DATE,
  
  -- Metadata
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.player_profile_releases ENABLE ROW LEVEL SECURITY;

-- Users can insert their own release
CREATE POLICY "Users can submit own release" ON public.player_profile_releases
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own release
CREATE POLICY "Users can view own release" ON public.player_profile_releases
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own release
CREATE POLICY "Users can update own release" ON public.player_profile_releases
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all releases
CREATE POLICY "Admins can view all releases" ON public.player_profile_releases
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update all releases
CREATE POLICY "Admins can update all releases" ON public.player_profile_releases
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger
CREATE TRIGGER update_player_profile_releases_updated_at
  BEFORE UPDATE ON public.player_profile_releases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

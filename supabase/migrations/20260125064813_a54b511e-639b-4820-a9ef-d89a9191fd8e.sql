-- Create enum for divisions
CREATE TYPE public.division AS ENUM ('D1', 'D2', 'D3', 'NAIA', 'JUCO');

-- Create enum for school sizes
CREATE TYPE public.school_size AS ENUM ('Small', 'Medium', 'Large', 'Very Large');

-- Create colleges table
CREATE TABLE public.colleges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  division public.division NOT NULL,
  conference TEXT,
  school_size public.school_size NOT NULL,
  golf_national_ranking INTEGER,
  scholarships_available INTEGER DEFAULT 0,
  recruiting_scoring_avg DECIMAL(4,1),
  min_act_score INTEGER,
  min_sat_score INTEGER,
  number_of_students INTEGER,
  out_of_state_cost INTEGER,
  website_url TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on colleges (public read, admin write)
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- Everyone can read colleges (this is reference data)
CREATE POLICY "Anyone can view colleges"
  ON public.colleges FOR SELECT
  USING (true);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  has_paid_access BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create favorites table for saved colleges
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, college_id)
);

-- Enable RLS on favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add their own favorites
CREATE POLICY "Users can add favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own favorites
CREATE POLICY "Users can remove favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_colleges_updated_at
  BEFORE UPDATE ON public.colleges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample college data
INSERT INTO public.colleges (name, state, division, conference, school_size, golf_national_ranking, scholarships_available, recruiting_scoring_avg, min_act_score, min_sat_score, number_of_students, out_of_state_cost, website_url) VALUES
  ('University of Texas', 'Texas', 'D1', 'Big 12', 'Very Large', 5, 4, 72.5, 25, 1200, 51000, 42000, 'https://texassports.com/golf'),
  ('Arizona State University', 'Arizona', 'D1', 'Pac-12', 'Very Large', 3, 4, 71.8, 24, 1150, 77000, 31000, 'https://thesundevils.com/golf'),
  ('Oklahoma State University', 'Oklahoma', 'D1', 'Big 12', 'Large', 1, 4, 70.9, 23, 1100, 25000, 26000, 'https://okstate.com/golf'),
  ('Stanford University', 'California', 'D1', 'Pac-12', 'Medium', 8, 4, 72.2, 33, 1500, 17000, 58000, 'https://gostanford.com/golf'),
  ('Duke University', 'North Carolina', 'D1', 'ACC', 'Medium', 12, 4, 72.8, 33, 1480, 16000, 62000, 'https://goduke.com/golf'),
  ('University of Georgia', 'Georgia', 'D1', 'SEC', 'Very Large', 6, 4, 72.0, 26, 1250, 40000, 32000, 'https://georgiadogs.com/golf'),
  ('Pepperdine University', 'California', 'D1', 'WCC', 'Small', 10, 4, 72.4, 28, 1300, 8000, 60000, 'https://pepperdinewaves.com/golf'),
  ('University of Florida', 'Florida', 'D1', 'SEC', 'Very Large', 4, 4, 71.5, 27, 1280, 55000, 29000, 'https://floridagators.com/golf'),
  ('Wake Forest University', 'North Carolina', 'D1', 'ACC', 'Medium', 7, 4, 72.1, 31, 1400, 9000, 59000, 'https://godeacs.com/golf'),
  ('University of Alabama', 'Alabama', 'D1', 'SEC', 'Very Large', 15, 4, 73.0, 24, 1150, 38000, 32000, 'https://rolltide.com/golf'),
  ('Vanderbilt University', 'Tennessee', 'D1', 'SEC', 'Medium', 9, 4, 72.3, 34, 1520, 13000, 57000, 'https://vucommodores.com/golf'),
  ('University of Southern California', 'California', 'D1', 'Pac-12', 'Large', 11, 4, 72.5, 32, 1450, 47000, 64000, 'https://usctrojans.com/golf'),
  ('Texas A&M University', 'Texas', 'D1', 'SEC', 'Very Large', 14, 4, 72.9, 25, 1200, 72000, 40000, 'https://12thman.com/golf'),
  ('Auburn University', 'Alabama', 'D1', 'SEC', 'Large', 18, 4, 73.2, 24, 1150, 31000, 32000, 'https://auburntigers.com/golf'),
  ('University of Illinois', 'Illinois', 'D1', 'Big Ten', 'Very Large', 20, 4, 73.4, 27, 1280, 56000, 35000, 'https://fightingillini.com/golf'),
  ('Barry University', 'Florida', 'D2', 'SSC', 'Small', 2, 3, 72.0, 21, 1000, 9000, 32000, 'https://gobucs.com/golf'),
  ('Lynn University', 'Florida', 'D2', 'SSC', 'Small', 5, 3, 72.5, 20, 980, 3000, 42000, 'https://lynnfightingknights.com/golf'),
  ('Columbus State University', 'Georgia', 'D2', 'PBC', 'Medium', 8, 3, 73.0, 20, 950, 8000, 18000, 'https://csucougars.com/golf'),
  ('University of Indianapolis', 'Indiana', 'D2', 'GLVC', 'Medium', 12, 3, 73.5, 22, 1050, 5500, 34000, 'https://uindy.edu/golf'),
  ('Methodist University', 'North Carolina', 'D3', 'USA South', 'Small', 3, 0, 74.0, 19, 900, 2500, 38000, 'https://gomethodist.com/golf'),
  ('Huntingdon College', 'Alabama', 'D3', 'USA South', 'Small', 6, 0, 74.5, 18, 880, 1200, 30000, 'https://huntingdonhawks.com/golf'),
  ('Oglethorpe University', 'Georgia', 'D3', 'SAA', 'Small', 10, 0, 75.0, 23, 1100, 1400, 42000, 'https://opetrels.com/golf'),
  ('Keiser University', 'Florida', 'NAIA', 'Sun', 'Medium', 1, 4, 71.5, 19, 900, 4000, 22000, 'https://gokeiserseahawks.com/golf'),
  ('SCAD', 'Georgia', 'NAIA', 'Sun', 'Medium', 4, 4, 72.0, 21, 1000, 15000, 40000, 'https://scadbees.com/golf'),
  ('Dalton State College', 'Georgia', 'NAIA', 'AAC', 'Small', 8, 3, 73.0, 18, 850, 5000, 12000, 'https://dscroadrunners.com/golf'),
  ('Indian River State College', 'Florida', 'JUCO', 'FCSAA', 'Medium', 2, 2, 72.5, 17, 800, 17000, 10000, 'https://irscpioneers.com/golf'),
  ('Odessa College', 'Texas', 'JUCO', 'WJCAC', 'Small', 5, 2, 73.0, 16, 780, 6000, 8000, 'https://waborangers.com/golf'),
  ('Tyler Junior College', 'Texas', 'JUCO', 'NJCAA', 'Medium', 8, 2, 73.5, 17, 800, 12000, 9000, 'https://tjcapaches.com/golf');
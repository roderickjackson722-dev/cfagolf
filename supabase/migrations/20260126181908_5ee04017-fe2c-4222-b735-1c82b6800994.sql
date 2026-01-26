-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for college logos
INSERT INTO storage.buckets (id, name, public) VALUES ('college-logos', 'college-logos', true);

-- Storage policies for college logos
CREATE POLICY "Anyone can view college logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'college-logos');

CREATE POLICY "Admins can upload college logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'college-logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update college logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'college-logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete college logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'college-logos' AND public.has_role(auth.uid(), 'admin'));

-- Add policies to colleges table for admin CRUD operations
CREATE POLICY "Admins can insert colleges"
ON public.colleges
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update colleges"
ON public.colleges
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete colleges"
ON public.colleges
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
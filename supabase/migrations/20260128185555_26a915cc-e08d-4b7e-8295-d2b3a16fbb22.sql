-- Add location columns to site_visitors table
ALTER TABLE public.site_visitors
ADD COLUMN country text,
ADD COLUMN region text,
ADD COLUMN city text;
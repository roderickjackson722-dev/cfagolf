
-- Extend app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'inventory_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'inventory_editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'inventory_viewer';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Mail, UserCircle, Video } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type DigitalProduct = {
  id: string;
  product_key: string;
  title: string;
  subtitle: string;
  description: string;
  price_cents: number;
  icon_name: string;
  color: string;
  bg_color: string;
  route: string;
  sort_order: number;
  is_active: boolean;
};

const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Mail,
  UserCircle,
  Video,
};

export const getProductIcon = (iconName: string): LucideIcon => {
  return ICON_MAP[iconName] || FileText;
};

export const useDigitalProductsList = () => {
  return useQuery({
    queryKey: ['digital-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('digital_products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data as DigitalProduct[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

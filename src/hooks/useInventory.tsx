import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useIsAdmin } from './useAdmin';

export type InventoryCategory = { id: string; name: string; is_editable: boolean; sort_order: number; is_active: boolean };
export type InventorySize = { id: string; name: string; sort_order: number; is_active: boolean };
export type InventoryBrand = { id: string; name: string; is_active: boolean };
export type InventoryStyle = { id: string; name: string; is_active: boolean };

export type InventoryItem = {
  id: string;
  category_id: string | null;
  color_name: string;
  color_hex: string | null;
  size_id: string | null;
  brand_id: string | null;
  style_id: string | null;
  quantity_on_hand: number;
  quantity_reserved: number;
  reorder_point: number;
  unit_cost: number | null;
  selling_price: number | null;
  location: string | null;
  notes: string | null;
  image_url: string | null;
  transfer_type: string | null;
  compatible_fabric: string | null;
  created_at: string;
  updated_at: string;
};

export type InventoryLog = {
  id: string;
  item_id: string | null;
  user_id: string | null;
  user_email: string | null;
  change_type: string;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  quantity_change: number | null;
  created_at: string;
};

export type InventoryShare = {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  invited_by: string | null;
  invited_at: string;
  accepted_at: string | null;
  is_active: boolean;
};

// ---------- Access ----------
export function useInventoryAccess() {
  const { user } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  return useQuery({
    queryKey: ['inventory-access', user?.id, isAdmin],
    queryFn: async () => {
      if (!user) return { canView: false, canEdit: false, canAdmin: false };
      if (isAdmin) return { canView: true, canEdit: true, canAdmin: true };
      const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id);
      const roles = (data || []).map((r: any) => r.role);
      const canAdmin = roles.includes('inventory_admin');
      const canEdit = canAdmin || roles.includes('inventory_editor');
      const canView = canEdit || roles.includes('inventory_viewer');
      return { canView, canEdit, canAdmin };
    },
    enabled: !!user,
  });
}

// ---------- Lookups ----------
export function useInventoryCategories() {
  return useQuery({
    queryKey: ['inventory_categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('inventory_categories' as any).select('*').order('sort_order');
      if (error) throw error;
      return (data || []) as unknown as InventoryCategory[];
    },
  });
}
export function useInventorySizes() {
  return useQuery({
    queryKey: ['inventory_sizes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('inventory_sizes' as any).select('*').order('sort_order');
      if (error) throw error;
      return (data || []) as unknown as InventorySize[];
    },
  });
}
export function useInventoryBrands() {
  return useQuery({
    queryKey: ['inventory_brands'],
    queryFn: async () => {
      const { data, error } = await supabase.from('inventory_brands' as any).select('*').order('name');
      if (error) throw error;
      return (data || []) as unknown as InventoryBrand[];
    },
  });
}
export function useInventoryStyles() {
  return useQuery({
    queryKey: ['inventory_styles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('inventory_styles' as any).select('*').order('name');
      if (error) throw error;
      return (data || []) as unknown as InventoryStyle[];
    },
  });
}

// ---------- Items ----------
export function useInventoryItems() {
  return useQuery({
    queryKey: ['inventory_items'],
    queryFn: async () => {
      const { data, error } = await supabase.from('inventory_items' as any).select('*').order('updated_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as InventoryItem[];
    },
  });
}

export function useSaveInventoryItem() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (item: Partial<InventoryItem> & { id?: string }) => {
      const isNew = !item.id;
      let result;
      if (isNew) {
        const { data, error } = await supabase.from('inventory_items' as any).insert(item as any).select().single();
        if (error) throw error;
        result = data;
      } else {
        const { id, ...rest } = item;
        const { data, error } = await supabase.from('inventory_items' as any).update(rest as any).eq('id', id!).select().single();
        if (error) throw error;
        result = data;
      }
      if (user) {
        await supabase.from('inventory_logs' as any).insert({
          item_id: (result as any).id,
          user_id: user.id,
          user_email: user.email,
          change_type: isNew ? 'new_item' : 'edit',
          new_value: (result as any).color_name + ' / ' + ((result as any).quantity_on_hand ?? ''),
        } as any);
      }
      return result;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory_items'] });
      qc.invalidateQueries({ queryKey: ['inventory_logs'] });
    },
  });
}

export function useDeleteInventoryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('inventory_items' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory_items'] }),
  });
}

export function useAdjustStock() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ id, delta, current }: { id: string; delta: number; current: number }) => {
      const newQty = Math.max(0, current + delta);
      const { error } = await supabase.from('inventory_items' as any).update({ quantity_on_hand: newQty }).eq('id', id);
      if (error) throw error;
      if (user) {
        await supabase.from('inventory_logs' as any).insert({
          item_id: id,
          user_id: user.id,
          user_email: user.email,
          change_type: 'stock_adjustment',
          field_name: 'quantity_on_hand',
          old_value: String(current),
          new_value: String(newQty),
          quantity_change: delta,
        } as any);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory_items'] });
      qc.invalidateQueries({ queryKey: ['inventory_logs'] });
    },
  });
}

// ---------- Logs ----------
export function useInventoryLogs() {
  return useQuery({
    queryKey: ['inventory_logs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('inventory_logs' as any).select('*').order('created_at', { ascending: false }).limit(500);
      if (error) throw error;
      return (data || []) as unknown as InventoryLog[];
    },
  });
}

// ---------- Settings ----------
export function useInventorySettings() {
  return useQuery({
    queryKey: ['inventory_settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('inventory_settings' as any).select('*');
      if (error) throw error;
      const map: Record<string, string> = {};
      (data || []).forEach((row: any) => { map[row.key] = row.value || ''; });
      return map;
    },
  });
}

export function useSaveInventorySetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase.from('inventory_settings' as any).upsert({ key, value, updated_at: new Date().toISOString() } as any, { onConflict: 'key' });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory_settings'] }),
  });
}

// ---------- Generic lookup CRUD ----------
export function useLookupCrud(table: 'inventory_categories' | 'inventory_sizes' | 'inventory_brands' | 'inventory_styles') {
  const qc = useQueryClient();
  return {
    add: useMutation({
      mutationFn: async (name: string) => {
        const { error } = await supabase.from(table as any).insert({ name } as any);
        if (error) throw error;
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
    }),
    rename: useMutation({
      mutationFn: async ({ id, name }: { id: string; name: string }) => {
        const { error } = await supabase.from(table as any).update({ name } as any).eq('id', id);
        if (error) throw error;
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
    }),
    remove: useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from(table as any).update({ is_active: false } as any).eq('id', id);
        if (error) throw error;
      },
      onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
    }),
  };
}

// ---------- Shares ----------
export function useInventoryShares() {
  return useQuery({
    queryKey: ['inventory_shares'],
    queryFn: async () => {
      const { data, error } = await supabase.from('inventory_shares' as any).select('*').order('invited_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as InventoryShare[];
    },
  });
}

export function useInviteShare() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ email, role }: { email: string; role: 'admin' | 'editor' | 'viewer' }) => {
      const { error } = await supabase.from('inventory_shares' as any).insert({
        email: email.toLowerCase().trim(),
        role,
        invited_by: user?.id ?? null,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory_shares'] }),
  });
}

export function useRevokeShare() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('inventory_shares' as any).update({ is_active: false } as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory_shares'] }),
  });
}

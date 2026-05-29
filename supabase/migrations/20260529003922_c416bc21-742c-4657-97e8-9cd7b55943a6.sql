
-- Helper function: check inventory access (admins, editors, viewers, or platform admin)
CREATE OR REPLACE FUNCTION public.has_inventory_access(_min_role text DEFAULT 'viewer')
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.has_role(auth.uid(), 'admin'::app_role)
    OR public.has_role(auth.uid(), 'inventory_admin'::app_role)
    OR (
      _min_role IN ('viewer', 'editor')
      AND public.has_role(auth.uid(), 'inventory_editor'::app_role)
    )
    OR (
      _min_role = 'viewer'
      AND public.has_role(auth.uid(), 'inventory_viewer'::app_role)
    )
$$;

-- ============== inventory_categories ==============
CREATE TABLE public.inventory_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_editable boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_categories TO authenticated;
GRANT ALL ON public.inventory_categories TO service_role;
ALTER TABLE public.inventory_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inv cats view" ON public.inventory_categories FOR SELECT TO authenticated USING (public.has_inventory_access('viewer'));
CREATE POLICY "inv cats write" ON public.inventory_categories FOR ALL TO authenticated USING (public.has_inventory_access('editor')) WITH CHECK (public.has_inventory_access('editor'));

-- ============== inventory_sizes ==============
CREATE TABLE public.inventory_sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_sizes TO authenticated;
GRANT ALL ON public.inventory_sizes TO service_role;
ALTER TABLE public.inventory_sizes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inv sizes view" ON public.inventory_sizes FOR SELECT TO authenticated USING (public.has_inventory_access('viewer'));
CREATE POLICY "inv sizes write" ON public.inventory_sizes FOR ALL TO authenticated USING (public.has_inventory_access('editor')) WITH CHECK (public.has_inventory_access('editor'));

-- ============== inventory_brands ==============
CREATE TABLE public.inventory_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_brands TO authenticated;
GRANT ALL ON public.inventory_brands TO service_role;
ALTER TABLE public.inventory_brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inv brands view" ON public.inventory_brands FOR SELECT TO authenticated USING (public.has_inventory_access('viewer'));
CREATE POLICY "inv brands write" ON public.inventory_brands FOR ALL TO authenticated USING (public.has_inventory_access('editor')) WITH CHECK (public.has_inventory_access('editor'));

-- ============== inventory_styles ==============
CREATE TABLE public.inventory_styles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_styles TO authenticated;
GRANT ALL ON public.inventory_styles TO service_role;
ALTER TABLE public.inventory_styles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inv styles view" ON public.inventory_styles FOR SELECT TO authenticated USING (public.has_inventory_access('viewer'));
CREATE POLICY "inv styles write" ON public.inventory_styles FOR ALL TO authenticated USING (public.has_inventory_access('editor')) WITH CHECK (public.has_inventory_access('editor'));

-- ============== inventory_items ==============
CREATE TABLE public.inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.inventory_categories(id) ON DELETE SET NULL,
  color_name text NOT NULL DEFAULT '',
  color_hex text,
  size_id uuid REFERENCES public.inventory_sizes(id) ON DELETE SET NULL,
  brand_id uuid REFERENCES public.inventory_brands(id) ON DELETE SET NULL,
  style_id uuid REFERENCES public.inventory_styles(id) ON DELETE SET NULL,
  quantity_on_hand int NOT NULL DEFAULT 0,
  quantity_reserved int NOT NULL DEFAULT 0,
  reorder_point int NOT NULL DEFAULT 0,
  unit_cost numeric(10,2),
  selling_price numeric(10,2),
  location text,
  notes text,
  image_url text,
  transfer_type text,
  compatible_fabric text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_items TO authenticated;
GRANT ALL ON public.inventory_items TO service_role;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inv items view" ON public.inventory_items FOR SELECT TO authenticated USING (public.has_inventory_access('viewer'));
CREATE POLICY "inv items write" ON public.inventory_items FOR ALL TO authenticated USING (public.has_inventory_access('editor')) WITH CHECK (public.has_inventory_access('editor'));

CREATE TRIGGER trg_inventory_items_updated_at
BEFORE UPDATE ON public.inventory_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============== inventory_logs ==============
CREATE TABLE public.inventory_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES public.inventory_items(id) ON DELETE SET NULL,
  user_id uuid,
  user_email text,
  change_type text NOT NULL,
  field_name text,
  old_value text,
  new_value text,
  quantity_change int,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.inventory_logs TO authenticated;
GRANT ALL ON public.inventory_logs TO service_role;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inv logs view" ON public.inventory_logs FOR SELECT TO authenticated USING (public.has_inventory_access('viewer'));
CREATE POLICY "inv logs insert" ON public.inventory_logs FOR INSERT TO authenticated WITH CHECK (public.has_inventory_access('editor') AND auth.uid() = user_id);

-- ============== inventory_settings ==============
CREATE TABLE public.inventory_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_settings TO authenticated;
GRANT ALL ON public.inventory_settings TO service_role;
ALTER TABLE public.inventory_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inv settings view" ON public.inventory_settings FOR SELECT TO authenticated USING (public.has_inventory_access('viewer'));
CREATE POLICY "inv settings write" ON public.inventory_settings FOR ALL TO authenticated USING (public.has_inventory_access('editor')) WITH CHECK (public.has_inventory_access('editor'));

-- ============== inventory_shares ==============
CREATE TABLE public.inventory_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin','editor','viewer')),
  invited_by uuid,
  invited_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  user_id uuid,
  is_active boolean NOT NULL DEFAULT true
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_shares TO authenticated;
GRANT ALL ON public.inventory_shares TO service_role;
ALTER TABLE public.inventory_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inv shares admins manage" ON public.inventory_shares FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'inventory_admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'inventory_admin'::app_role));

-- ============== Storage bucket ==============
INSERT INTO storage.buckets (id, name, public)
VALUES ('inventory-images', 'inventory-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "inventory images public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'inventory-images');

CREATE POLICY "inventory images authed upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'inventory-images' AND public.has_inventory_access('editor'));

CREATE POLICY "inventory images authed update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'inventory-images' AND public.has_inventory_access('editor'));

CREATE POLICY "inventory images authed delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'inventory-images' AND public.has_inventory_access('editor'));

-- ============== Seed data ==============
INSERT INTO public.inventory_categories (name, is_editable, sort_order) VALUES
  ('T-shirt', false, 1),
  ('Transfer Print', false, 2)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.inventory_sizes (name, sort_order) VALUES
  ('XS', 1), ('S', 2), ('M', 3), ('L', 4), ('XL', 5), ('2XL', 6), ('3XL', 7)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.inventory_styles (name) VALUES
  ('Men''s'), ('Women''s'), ('Youth'), ('Unisex'),
  ('V-neck'), ('Hoodie'), ('T-shirt'), ('Longsleeve'), ('Tank top')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.inventory_settings (key, value) VALUES
  ('label_category', 'Category'),
  ('label_color', 'Color'),
  ('label_size', 'Size'),
  ('label_brand', 'Brand'),
  ('label_style', 'Style'),
  ('label_quantity', 'Quantity on Hand'),
  ('label_reserved', 'Quantity Reserved'),
  ('label_reorder_point', 'Reorder Point'),
  ('label_unit_cost', 'Unit Cost'),
  ('label_selling_price', 'Selling Price'),
  ('label_location', 'Location'),
  ('label_notes', 'Notes')
ON CONFLICT (key) DO NOTHING;

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { useInventoryCategories, useInventorySizes, useInventoryBrands, useInventoryStyles, useInventorySettings, useSaveInventorySetting, useLookupCrud } from '@/hooks/useInventory';
import { toast } from '@/hooks/use-toast';

const LABEL_KEYS = [
  ['label_category', 'Category'],
  ['label_color', 'Color'],
  ['label_size', 'Size'],
  ['label_brand', 'Brand'],
  ['label_style', 'Style'],
  ['label_quantity', 'Quantity on Hand'],
  ['label_reserved', 'Quantity Reserved'],
  ['label_reorder_point', 'Reorder Point'],
  ['label_unit_cost', 'Unit Cost'],
  ['label_selling_price', 'Selling Price'],
  ['label_location', 'Location'],
  ['label_notes', 'Notes'],
];

function LookupManager({ title, table, items }: { title: string; table: 'inventory_categories' | 'inventory_sizes' | 'inventory_brands' | 'inventory_styles'; items: { id: string; name: string; is_active?: boolean; is_editable?: boolean }[] }) {
  const [newName, setNewName] = useState('');
  const crud = useLookupCrud(table);
  const visible = items.filter(i => i.is_active !== false);
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-2">
          <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder={`Add ${title.toLowerCase()}…`} />
          <Button size="sm" onClick={() => { if (newName.trim()) crud.add.mutate(newName.trim(), { onSuccess: () => { setNewName(''); toast({ title: 'Added' }); } }); }}><Plus className="w-4 h-4" /></Button>
        </div>
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {visible.map(i => (
            <li key={i.id} className="flex items-center justify-between border rounded px-2 py-1 text-sm">
              <span>{i.name}</span>
              {i.is_editable !== false && (
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => crud.remove.mutate(i.id)}><Trash2 className="w-3 h-3" /></Button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function InventorySettingsPanel() {
  const { data: settings = {} } = useInventorySettings();
  const saveSetting = useSaveInventorySetting();
  const { data: categories = [] } = useInventoryCategories();
  const { data: sizes = [] } = useInventorySizes();
  const { data: brands = [] } = useInventoryBrands();
  const { data: styles = [] } = useInventoryStyles();

  const [local, setLocal] = useState<Record<string, string>>({});
  const getVal = (k: string) => local[k] ?? settings[k] ?? '';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Field Labels</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {LABEL_KEYS.map(([k, fallback]) => (
              <div key={k} className="space-y-1">
                <Label className="text-xs text-muted-foreground">{fallback}</Label>
                <div className="flex gap-2">
                  <Input value={getVal(k)} onChange={e => setLocal(p => ({ ...p, [k]: e.target.value }))} />
                  <Button size="sm" variant="outline" onClick={() => saveSetting.mutate({ key: k, value: getVal(k) }, { onSuccess: () => toast({ title: 'Saved' }) })}>Save</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LookupManager title="Categories" table="inventory_categories" items={categories} />
        <LookupManager title="Sizes" table="inventory_sizes" items={sizes} />
        <LookupManager title="Brands" table="inventory_brands" items={brands} />
        <LookupManager title="Styles" table="inventory_styles" items={styles} />
      </div>
    </div>
  );
}

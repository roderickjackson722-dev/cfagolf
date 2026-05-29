import { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Search, Download, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { useInventoryItems, useInventoryCategories, useInventorySizes, useInventoryBrands, useInventoryStyles, useAdjustStock, useDeleteInventoryItem, useInventoryAccess, InventoryItem } from '@/hooks/useInventory';
import InventoryItemDialog from './InventoryItemDialog';
import { toast } from '@/hooks/use-toast';

export default function InventoryDashboard() {
  const { data: items = [], isLoading } = useInventoryItems();
  const { data: categories = [] } = useInventoryCategories();
  const { data: sizes = [] } = useInventorySizes();
  const { data: brands = [] } = useInventoryBrands();
  const { data: styles = [] } = useInventoryStyles();
  const { data: access } = useInventoryAccess();
  const adjust = useAdjustStock();
  const del = useDeleteInventoryItem();
  const searchRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterStyle, setFilterStyle] = useState('all');
  const [filterSize, setFilterSize] = useState('all');
  const [lowOnly, setLowOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'updated' | 'name' | 'qty' | 'cost'>('updated');
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const catMap = useMemo(() => Object.fromEntries(categories.map(c => [c.id, c.name])), [categories]);
  const sizeMap = useMemo(() => Object.fromEntries(sizes.map(s => [s.id, s.name])), [sizes]);
  const brandMap = useMemo(() => Object.fromEntries(brands.map(b => [b.id, b.name])), [brands]);
  const styleMap = useMemo(() => Object.fromEntries(styles.map(s => [s.id, s.name])), [styles]);

  const filtered = useMemo(() => {
    let list = items.filter(i => {
      if (filterCat !== 'all' && i.category_id !== filterCat) return false;
      if (filterBrand !== 'all' && i.brand_id !== filterBrand) return false;
      if (filterStyle !== 'all' && i.style_id !== filterStyle) return false;
      if (filterSize !== 'all' && i.size_id !== filterSize) return false;
      if (lowOnly && i.quantity_on_hand > i.reorder_point) return false;
      if (search) {
        const s = search.toLowerCase();
        const hay = [i.color_name, i.notes, i.location, brandMap[i.brand_id || ''], catMap[i.category_id || '']].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
    list.sort((a, b) => {
      if (sortBy === 'name') return a.color_name.localeCompare(b.color_name);
      if (sortBy === 'qty') return b.quantity_on_hand - a.quantity_on_hand;
      if (sortBy === 'cost') return (Number(b.unit_cost) || 0) - (Number(a.unit_cost) || 0);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    return list;
  }, [items, filterCat, filterBrand, filterStyle, filterSize, lowOnly, search, sortBy, brandMap, catMap]);

  const totals = useMemo(() => ({
    count: items.length,
    value: items.reduce((s, i) => s + (Number(i.unit_cost) || 0) * i.quantity_on_hand, 0),
    low: items.filter(i => i.quantity_on_hand <= i.reorder_point).length,
  }), [items]);

  const exportCsv = () => {
    const headers = ['Category', 'Color', 'Hex', 'Size', 'Brand', 'Style', 'On Hand', 'Reserved', 'Reorder', 'Unit Cost', 'Selling Price', 'Location', 'Notes'];
    const rows = filtered.map(i => [
      catMap[i.category_id || ''] || '', i.color_name, i.color_hex || '', sizeMap[i.size_id || ''] || '',
      brandMap[i.brand_id || ''] || '', styleMap[i.style_id || ''] || '',
      i.quantity_on_hand, i.quantity_reserved, i.reorder_point, i.unit_cost ?? '', i.selling_price ?? '', i.location || '', (i.notes || '').replace(/\n/g, ' '),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canEdit = access?.canEdit;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Items</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{totals.count}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Inventory Value</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">${totals.value.toFixed(2)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Low Stock</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold flex items-center gap-2">{totals.low > 0 && <AlertTriangle className="w-6 h-6 text-amber-500" />}{totals.low}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Inventory</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4 mr-1" />CSV</Button>
              {canEdit && <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="w-4 h-4 mr-1" />Add Item</Button>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input ref={searchRef} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterCat} onValueChange={setFilterCat}><SelectTrigger className="w-[140px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Categories</SelectItem>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
            <Select value={filterBrand} onValueChange={setFilterBrand}><SelectTrigger className="w-[140px]"><SelectValue placeholder="Brand" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Brands</SelectItem>{brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent></Select>
            <Select value={filterStyle} onValueChange={setFilterStyle}><SelectTrigger className="w-[140px]"><SelectValue placeholder="Style" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Styles</SelectItem>{styles.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select>
            <Select value={filterSize} onValueChange={setFilterSize}><SelectTrigger className="w-[120px]"><SelectValue placeholder="Size" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Sizes</SelectItem>{sizes.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="qty">Quantity</SelectItem>
                <SelectItem value="cost">Unit Cost</SelectItem>
              </SelectContent></Select>
            <Button variant={lowOnly ? 'default' : 'outline'} size="sm" onClick={() => setLowOnly(v => !v)}>Low stock</Button>
          </div>

          {isLoading ? <div className="text-center py-8 text-muted-foreground">Loading…</div> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Style</TableHead>
                    <TableHead className="text-right">On Hand</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 && <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-8">No items</TableCell></TableRow>}
                  {filtered.map(i => {
                    const low = i.quantity_on_hand <= i.reorder_point;
                    return (
                      <TableRow key={i.id}>
                        <TableCell>{i.image_url ? <img src={i.image_url} alt="" className="w-10 h-10 object-cover rounded" /> : <div className="w-10 h-10 bg-muted rounded" />}</TableCell>
                        <TableCell>{catMap[i.category_id || ''] || '—'}</TableCell>
                        <TableCell><div className="flex items-center gap-2">{i.color_hex && <span className="w-4 h-4 rounded border" style={{ background: i.color_hex }} />}{i.color_name}</div></TableCell>
                        <TableCell>{sizeMap[i.size_id || ''] || '—'}</TableCell>
                        <TableCell>{brandMap[i.brand_id || ''] || '—'}</TableCell>
                        <TableCell>{styleMap[i.style_id || ''] || '—'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {canEdit && <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => adjust.mutate({ id: i.id, delta: -1, current: i.quantity_on_hand })}><Minus className="w-3 h-3" /></Button>}
                            <Badge variant={low ? 'destructive' : 'secondary'} className="min-w-[2.5rem] justify-center">{i.quantity_on_hand}</Badge>
                            {canEdit && <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => adjust.mutate({ id: i.id, delta: 1, current: i.quantity_on_hand })}><Plus className="w-3 h-3" /></Button>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{i.unit_cost ? `$${Number(i.unit_cost).toFixed(2)}` : '—'}</TableCell>
                        <TableCell className="text-right">{i.selling_price ? `$${Number(i.selling_price).toFixed(2)}` : '—'}</TableCell>
                        <TableCell>
                          {canEdit && (
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditing(i); setDialogOpen(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { if (confirm('Delete this item?')) del.mutate(i.id, { onSuccess: () => toast({ title: 'Deleted' }) }); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <InventoryItemDialog open={dialogOpen} onOpenChange={setDialogOpen} item={editing} />
    </div>
  );
}

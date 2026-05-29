import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2, Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useInventoryCategories, useInventorySizes, useInventoryBrands, useInventoryStyles, useSaveInventoryItem, InventoryItem } from '@/hooks/useInventory';
import { toast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  item: InventoryItem | null;
}

const TRANSFER_TYPES = ['Screen print', 'DTF', 'HTV', 'Sublimation'];

type SizeRow = { size_id: string | null; quantity_on_hand: number };

export default function InventoryItemDialog({ open, onOpenChange, item }: Props) {
  const { data: categories = [] } = useInventoryCategories();
  const { data: sizes = [] } = useInventorySizes();
  const { data: brands = [] } = useInventoryBrands();
  const { data: styles = [] } = useInventoryStyles();
  const save = useSaveInventoryItem();

  const empty: Partial<InventoryItem> = {
    color_name: '', quantity_on_hand: 0, quantity_reserved: 0, reorder_point: 0,
  };
  const [form, setForm] = useState<Partial<InventoryItem>>(empty);
  const [images, setImages] = useState<string[]>([]);
  const [sizeRows, setSizeRows] = useState<SizeRow[]>([{ size_id: null, quantity_on_hand: 0 }]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (item) {
      setForm({ ...item });
      const imgs = (item as any).image_url
        ? String((item as any).image_url).split(',').map(s => s.trim()).filter(Boolean)
        : [];
      setImages(imgs);
      setSizeRows([{ size_id: item.size_id, quantity_on_hand: item.quantity_on_hand ?? 0 }]);
    } else {
      setForm(empty);
      setImages([]);
      setSizeRows([{ size_id: null, quantity_on_hand: 0 }]);
    }
  }, [open, item]);

  const set = (k: keyof InventoryItem, v: any) => setForm(p => ({ ...p, [k]: v }));

  const transferCat = categories.find(c => c.id === form.category_id)?.name === 'Transfer Print';

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const { error } = await supabase.storage.from('inventory-images').upload(path, file, { upsert: true });
        if (error) throw error;
        const { data } = supabase.storage.from('inventory-images').getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      setImages(prev => [...prev, ...uploaded]);
    } catch (e: any) {
      toast({ title: 'Upload failed', description: e.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const updateRow = (i: number, patch: Partial<SizeRow>) =>
    setSizeRows(rows => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addRow = () => setSizeRows(rows => [...rows, { size_id: null, quantity_on_hand: 0 }]);
  const removeRow = (i: number) => setSizeRows(rows => rows.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!form.color_name?.trim()) {
      toast({ title: 'Color name is required', variant: 'destructive' });
      return;
    }
    if (sizeRows.length === 0) {
      toast({ title: 'Add at least one size row', variant: 'destructive' });
      return;
    }
    const image_url = images.join(',');
    const base = { ...form, image_url } as Partial<InventoryItem>;
    try {
      // First row: update existing item if editing, else insert
      const [first, ...rest] = sizeRows;
      await new Promise<void>((resolve, reject) => {
        save.mutate(
          { ...base, size_id: first.size_id, quantity_on_hand: first.quantity_on_hand },
          { onSuccess: () => resolve(), onError: (e) => reject(e) },
        );
      });
      // Remaining rows: always insert as new items (strip id)
      for (const r of rest) {
        const { id, ...rest2 } = base as any;
        await new Promise<void>((resolve, reject) => {
          save.mutate(
            { ...rest2, size_id: r.size_id, quantity_on_hand: r.quantity_on_hand },
            { onSuccess: () => resolve(), onError: (e) => reject(e) },
          );
        });
      }
      toast({ title: item ? 'Item updated' : `${sizeRows.length} item(s) created` });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{item ? 'Edit Item' : 'New Item'}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Category</Label>
            <Select value={form.category_id || ''} onValueChange={v => set('category_id', v)}>
              <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select></div>
          <div className="space-y-2"><Label>Color Name *</Label><Input value={form.color_name || ''} onChange={e => set('color_name', e.target.value)} /></div>
          <div className="space-y-2"><Label>Brand</Label>
            <Select value={form.brand_id || ''} onValueChange={v => set('brand_id', v)}>
              <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent>{brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
            </Select></div>
          <div className="space-y-2"><Label>Style</Label>
            <Select value={form.style_id || ''} onValueChange={v => set('style_id', v)}>
              <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent>{styles.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select></div>
          <div className="space-y-2"><Label>Quantity Reserved</Label><Input type="number" value={form.quantity_reserved ?? 0} onChange={e => set('quantity_reserved', Number(e.target.value))} /></div>
          <div className="space-y-2"><Label>Reorder Point</Label><Input type="number" value={form.reorder_point ?? 0} onChange={e => set('reorder_point', Number(e.target.value))} /></div>
          <div className="space-y-2"><Label>Unit Cost ($)</Label><Input type="number" step="0.01" value={form.unit_cost ?? ''} onChange={e => set('unit_cost', e.target.value ? Number(e.target.value) : null)} /></div>
          <div className="space-y-2"><Label>Selling Price ($)</Label><Input type="number" step="0.01" value={form.selling_price ?? ''} onChange={e => set('selling_price', e.target.value ? Number(e.target.value) : null)} /></div>
          <div className="space-y-2"><Label>Location</Label><Input value={form.location || ''} onChange={e => set('location', e.target.value)} /></div>

          <div className="col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label>Sizes &amp; Quantities</Label>
              <Button type="button" variant="outline" size="sm" onClick={addRow}><Plus className="w-4 h-4 mr-1" />Add size</Button>
            </div>
            <div className="space-y-2">
              {sizeRows.map((row, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Select value={row.size_id || ''} onValueChange={v => updateRow(i, { size_id: v })}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Size…" /></SelectTrigger>
                    <SelectContent>{sizes.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input
                    type="number"
                    className="w-32"
                    placeholder="Qty"
                    value={row.quantity_on_hand}
                    onChange={e => updateRow(i, { quantity_on_hand: Number(e.target.value) })}
                  />
                  {sizeRows.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(i)}><X className="w-4 h-4" /></Button>
                  )}
                </div>
              ))}
            </div>
            {!item && sizeRows.length > 1 && (
              <p className="text-xs text-muted-foreground">Each size will be saved as a separate inventory item sharing the same color, brand, style, and photos.</p>
            )}
          </div>

          <div className="col-span-2 space-y-2"><Label>Notes</Label><Textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} /></div>

          <div className="col-span-2 space-y-2">
            <Label>Photos</Label>
            <div className="flex gap-2 items-center">
              <label className="cursor-pointer">
                <input type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files)} />
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>{uploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}Upload photos</span>
                </Button>
              </label>
              <span className="text-xs text-muted-foreground">You can pick multiple, or take a photo on mobile.</span>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="" className="w-24 h-24 object-cover rounded border" />
                    <button
                      type="button"
                      onClick={() => setImages(imgs => imgs.filter((_, idx) => idx !== i))}
                      className="absolute -top-2 -right-2 bg-background border rounded-full p-0.5 shadow"
                      aria-label="Remove photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {transferCat && (
            <>
              <div className="space-y-2"><Label>Transfer Type</Label>
                <Select value={form.transfer_type || ''} onValueChange={v => set('transfer_type', v)}>
                  <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>{TRANSFER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select></div>
              <div className="space-y-2"><Label>Compatible Fabric</Label><Input value={form.compatible_fabric || ''} onChange={e => set('compatible_fabric', e.target.value)} /></div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

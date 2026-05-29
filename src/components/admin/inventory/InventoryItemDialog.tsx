import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useInventoryCategories, useInventorySizes, useInventoryBrands, useInventoryStyles, useSaveInventoryItem, InventoryItem } from '@/hooks/useInventory';
import { toast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  item: InventoryItem | null;
}

const TRANSFER_TYPES = ['Screen print', 'DTF', 'HTV', 'Sublimation'];

export default function InventoryItemDialog({ open, onOpenChange, item }: Props) {
  const { data: categories = [] } = useInventoryCategories();
  const { data: sizes = [] } = useInventorySizes();
  const { data: brands = [] } = useInventoryBrands();
  const { data: styles = [] } = useInventoryStyles();
  const save = useSaveInventoryItem();

  const empty: Partial<InventoryItem> = {
    color_name: '', color_hex: '#000000', quantity_on_hand: 0, quantity_reserved: 0, reorder_point: 0,
  };
  const [form, setForm] = useState<Partial<InventoryItem>>(empty);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) setForm(item ? { ...item } : empty);
  }, [open, item]);

  const set = (k: keyof InventoryItem, v: any) => setForm(p => ({ ...p, [k]: v }));

  const transferCat = categories.find(c => c.id === form.category_id)?.name === 'Transfer Print';

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { error } = await supabase.storage.from('inventory-images').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('inventory-images').getPublicUrl(path);
      set('image_url', data.publicUrl);
    } catch (e: any) {
      toast({ title: 'Upload failed', description: e.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!form.color_name?.trim()) {
      toast({ title: 'Color name is required', variant: 'destructive' });
      return;
    }
    save.mutate(form, {
      onSuccess: () => {
        toast({ title: item ? 'Item updated' : 'Item created' });
        onOpenChange(false);
      },
      onError: (e: any) => toast({ title: 'Save failed', description: e.message, variant: 'destructive' }),
    });
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
          <div className="space-y-2"><Label>Color Swatch</Label>
            <div className="flex gap-2">
              <Input type="color" value={form.color_hex || '#000000'} onChange={e => set('color_hex', e.target.value)} className="w-16 h-10 p-1" />
              <Input value={form.color_hex || ''} onChange={e => set('color_hex', e.target.value)} placeholder="#000000" />
            </div></div>
          <div className="space-y-2"><Label>Size</Label>
            <Select value={form.size_id || ''} onValueChange={v => set('size_id', v)}>
              <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent>{sizes.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select></div>
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
          <div className="space-y-2"><Label>Quantity on Hand</Label><Input type="number" value={form.quantity_on_hand ?? 0} onChange={e => set('quantity_on_hand', Number(e.target.value))} /></div>
          <div className="space-y-2"><Label>Quantity Reserved</Label><Input type="number" value={form.quantity_reserved ?? 0} onChange={e => set('quantity_reserved', Number(e.target.value))} /></div>
          <div className="space-y-2"><Label>Reorder Point</Label><Input type="number" value={form.reorder_point ?? 0} onChange={e => set('reorder_point', Number(e.target.value))} /></div>
          <div className="space-y-2"><Label>Unit Cost ($)</Label><Input type="number" step="0.01" value={form.unit_cost ?? ''} onChange={e => set('unit_cost', e.target.value ? Number(e.target.value) : null)} /></div>
          <div className="space-y-2"><Label>Selling Price ($)</Label><Input type="number" step="0.01" value={form.selling_price ?? ''} onChange={e => set('selling_price', e.target.value ? Number(e.target.value) : null)} /></div>
          <div className="space-y-2"><Label>Location</Label><Input value={form.location || ''} onChange={e => set('location', e.target.value)} /></div>
          <div className="col-span-2 space-y-2"><Label>Notes</Label><Textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} /></div>
          <div className="col-span-2 space-y-2"><Label>Image</Label>
            <div className="flex gap-2 items-center">
              <Input value={form.image_url || ''} onChange={e => set('image_url', e.target.value)} placeholder="Paste URL or upload" />
              <label className="cursor-pointer">
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                <Button type="button" variant="outline" size="sm" asChild><span>{uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}</span></Button>
              </label>
            </div>
            {form.image_url && <img src={form.image_url} alt="" className="w-24 h-24 object-cover rounded mt-2" />}
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

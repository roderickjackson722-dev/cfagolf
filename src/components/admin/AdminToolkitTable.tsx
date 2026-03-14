import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DollarSign, Users, ShoppingCart, TrendingUp, Pencil, Save, Loader2, Upload, FileText, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

type DigitalProduct = {
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
  file_url: string | null;
};

export const AdminToolkitTable = () => {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['admin-digital-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('digital_products')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as DigitalProduct[];
    },
  });

  const { data: purchases = [], isLoading: purchasesLoading } = useQuery({
    queryKey: ['admin-toolkit-purchases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('digital_product_purchases')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['admin-toolkit-profiles'],
    queryFn: async () => {
      if (purchases.length === 0) return [];
      const userIds = [...new Set(purchases.map(p => p.user_id))];
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);
      if (error) throw error;
      return data;
    },
    enabled: purchases.length > 0,
  });

  const updateMutation = useMutation({
    mutationFn: async (product: DigitalProduct) => {
      const { error } = await supabase
        .from('digital_products')
        .update({
          title: product.title.trim(),
          subtitle: product.subtitle.trim(),
          description: product.description.trim(),
          price_cents: product.price_cents,
          is_active: product.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', product.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-digital-products'] });
      queryClient.invalidateQueries({ queryKey: ['digital-products'] });
      setEditingProduct(null);
      toast.success('Product updated');
    },
    onError: () => toast.error('Failed to update product'),
  });

  const profileMap = Object.fromEntries(profiles.map(p => [p.user_id, p]));
  const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
  const directPurchases = purchases.filter(p => p.purchase_type === 'direct').length;
  const membershipGrants = purchases.filter(p => p.purchase_type !== 'direct').length;

  const isLoading = productsLoading || purchasesLoading;

  if (isLoading) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${(totalRevenue / 100).toFixed(0)}`, icon: DollarSign, color: 'text-emerald-600' },
          { label: 'Total Purchases', value: purchases.length, icon: ShoppingCart, color: 'text-blue-600' },
          { label: 'Direct Sales', value: directPurchases, icon: TrendingUp, color: 'text-purple-600' },
          { label: 'Membership Grants', value: membershipGrants, icon: Users, color: 'text-amber-600' },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Editable Products */}
      <Card>
        <CardHeader><CardTitle className="text-base">Products in Toolkit</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{product.title}</p>
                      <p className="text-xs text-muted-foreground">{product.subtitle}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">${(product.price_cents / 100).toFixed(0)}</TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                      {product.is_active ? 'Active' : 'Hidden'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setEditingProduct({ ...product })}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Purchase history */}
      <Card>
        <CardHeader><CardTitle className="text-base">Purchase History ({purchases.length})</CardTitle></CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No purchases yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map(purchase => {
                  const profile = profileMap[purchase.user_id];
                  return (
                    <TableRow key={purchase.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{profile?.full_name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{profile?.email || purchase.user_id.slice(0, 8)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={purchase.purchase_type === 'direct' ? 'default' : 'secondary'}>
                          {purchase.purchase_type === 'direct' ? 'Purchased' : 'Membership'}
                        </Badge>
                      </TableCell>
                      <TableCell>${((purchase.amount_paid || 0) / 100).toFixed(2)}</TableCell>
                      <TableCell className="text-sm">{format(new Date(purchase.created_at), 'MMM d, yyyy')}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={editingProduct.subtitle}
                  onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  maxLength={500}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={editingProduct.price_cents / 100}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price_cents: Math.round(Number(e.target.value) * 100) })}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Downloadable File (PDF)</Label>
                {editingProduct.file_url ? (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                    <a href={editingProduct.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline truncate flex-1">
                      {editingProduct.file_url.split('/').pop()}
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingProduct({ ...editingProduct, file_url: null })}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No file uploaded</p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !editingProduct) return;
                    setUploading(true);
                    try {
                      const ext = file.name.split('.').pop();
                      const path = `${editingProduct.product_key}/file.${ext}`;
                      const { error: uploadError } = await supabase.storage
                        .from('toolkit-files')
                        .upload(path, file, { upsert: true });
                      if (uploadError) throw uploadError;
                      const { data: urlData } = supabase.storage.from('toolkit-files').getPublicUrl(path);
                      setEditingProduct({ ...editingProduct, file_url: urlData.publicUrl });
                      toast.success('File uploaded');
                    } catch (err: any) {
                      toast.error(err.message || 'Upload failed');
                    } finally {
                      setUploading(false);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                  {uploading ? 'Uploading...' : 'Upload File'}
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={editingProduct.is_active}
                  onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, is_active: checked })}
                />
                <Label>Active (visible to customers)</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
            <Button
              onClick={() => editingProduct && updateMutation.mutate(editingProduct)}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

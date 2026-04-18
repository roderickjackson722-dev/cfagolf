import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

type SaleRow = {
  id: string;
  product_key: string;
  user_id: string;
  amount_paid: number | null;
  stripe_session_id: string | null;
  purchase_type: string;
  buyer_email: string | null;
  buyer_name: string | null;
  referrer_path: string | null;
  referrer_url: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  created_at: string;
};

type ProductRow = { product_key: string; title: string };
type ProfileRow = { user_id: string; email: string | null; full_name: string | null };

export const AdminSalesTable = () => {
  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['admin-sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('digital_product_purchases')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as SaleRow[];
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ['admin-sales-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('digital_products')
        .select('product_key, title');
      if (error) throw error;
      return (data || []) as ProductRow[];
    },
  });

  const userIds = Array.from(new Set(sales.map((s) => s.user_id).filter(Boolean)));
  const { data: profiles = [] } = useQuery({
    queryKey: ['admin-sales-profiles', userIds],
    enabled: userIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, email, full_name')
        .in('user_id', userIds);
      if (error) throw error;
      return (data || []) as ProfileRow[];
    },
  });

  const productMap = new Map(products.map((p) => [p.product_key, p.title]));
  const profileMap = new Map(profiles.map((p) => [p.user_id, p]));

  const totalRevenue = sales.reduce((sum, s) => sum + (s.amount_paid || 0), 0);
  const totalSales = sales.length;
  const avgOrder = totalSales > 0 ? totalRevenue / totalSales : 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const formatMoney = (cents: number | null) =>
    cents != null ? `$${(cents / 100).toFixed(2)}` : '—';

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">{totalSales}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatMoney(totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Order</p>
                <p className="text-2xl font-bold">{formatMoney(Math.round(avgOrder))}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      {sales.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No sales recorded yet. Sales will appear here automatically when customers complete a purchase.
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Source Page</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((s) => {
                const profile = profileMap.get(s.user_id);
                const buyerEmail = s.buyer_email || profile?.email || '—';
                const buyerName = s.buyer_name || profile?.full_name || '—';
                const productTitle = productMap.get(s.product_key) || s.product_key;
                const location = [s.city, s.region, s.country].filter(Boolean).join(', ') || '—';
                return (
                  <TableRow key={s.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {format(new Date(s.created_at), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell className="font-medium">{productTitle}</TableCell>
                    <TableCell>{buyerName}</TableCell>
                    <TableCell className="text-sm">{buyerEmail}</TableCell>
                    <TableCell className="font-semibold">{formatMoney(s.amount_paid)}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate" title={s.referrer_url || s.referrer_path || ''}>
                      {s.referrer_path || '—'}
                    </TableCell>
                    <TableCell className="text-sm">{location}</TableCell>
                    <TableCell>
                      <Badge variant={s.purchase_type === 'direct' ? 'default' : 'secondary'}>
                        {s.purchase_type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

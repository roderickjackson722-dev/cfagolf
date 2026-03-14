import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const PRODUCTS = [
  { id: 'roadmap', title: 'The Recruiting Roadmap', route: '/shop/roadmap' },
  { id: 'templates', title: '15 Email Templates for Golf Coaches', route: '/shop/templates' },
  { id: 'resume', title: 'The Athlete Resume Template', route: '/shop/resume' },
  { id: 'course', title: 'The Recruiting Huddle', route: '/shop/course' },
];

export const AdminToolkitTable = () => {
  const { data: purchases = [], isLoading } = useQuery({
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

  const profileMap = Object.fromEntries(profiles.map(p => [p.user_id, p]));

  const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
  const directPurchases = purchases.filter(p => p.purchase_type === 'direct').length;
  const membershipGrants = purchases.filter(p => p.purchase_type !== 'direct').length;

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

      {/* Products overview */}
      <Card>
        <CardHeader><CardTitle className="text-base">Products in Toolkit</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {PRODUCTS.map(p => (
              <a key={p.id} href={p.route} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <span className="font-medium text-sm">{p.title}</span>
                <Badge variant="outline" className="ml-auto text-xs">View</Badge>
              </a>
            ))}
          </div>
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
    </div>
  );
};

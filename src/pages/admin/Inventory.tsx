import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Settings, FileText, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useInventoryAccess } from '@/hooks/useInventory';
import InventoryDashboard from '@/components/admin/inventory/InventoryDashboard';
import InventorySettingsPanel from '@/components/admin/inventory/InventorySettingsPanel';
import InventoryLogsPanel from '@/components/admin/inventory/InventoryLogsPanel';
import InventorySharesPanel from '@/components/admin/inventory/InventorySharesPanel';

interface Props {
  defaultTab?: 'dashboard' | 'settings' | 'logs' | 'shares';
  embedded?: boolean;
}

export default function Inventory({ defaultTab = 'dashboard', embedded = false }: Props) {
  const { user, loading } = useAuth();
  const { data: access, isLoading } = useInventoryAccess();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  if (loading || isLoading) return <div className="p-8 text-center">Loading…</div>;
  if (!access?.canView) {
    return (
      <div className="p-8 max-w-md mx-auto text-center space-y-3">
        <h2 className="text-xl font-semibold">No inventory access</h2>
        <p className="text-sm text-muted-foreground">Ask an admin to grant you an inventory role.</p>
      </div>
    );
  }

  const content = (
    <Tabs defaultValue={defaultTab} className="space-y-4">
      <TabsList className="flex flex-wrap h-auto">
        <TabsTrigger value="dashboard"><LayoutDashboard className="w-4 h-4 mr-1" />Dashboard</TabsTrigger>
        {access.canEdit && <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-1" />Settings</TabsTrigger>}
        <TabsTrigger value="logs"><FileText className="w-4 h-4 mr-1" />Activity</TabsTrigger>
        {access.canAdmin && <TabsTrigger value="shares"><Users className="w-4 h-4 mr-1" />Sharing</TabsTrigger>}
      </TabsList>
      <TabsContent value="dashboard"><InventoryDashboard /></TabsContent>
      {access.canEdit && <TabsContent value="settings"><InventorySettingsPanel /></TabsContent>}
      <TabsContent value="logs"><InventoryLogsPanel /></TabsContent>
      {access.canAdmin && <TabsContent value="shares"><InventorySharesPanel /></TabsContent>}
    </Tabs>
  );

  if (embedded) return content;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}><ArrowLeft className="w-4 h-4 mr-1" />Back to Admin</Button>
            <h1 className="text-2xl font-bold mt-2">Inventory</h1>
          </div>
        </div>
        {content}
      </div>
    </div>
  );
}

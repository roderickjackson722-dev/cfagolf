import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useInventoryLogs } from '@/hooks/useInventory';

export default function InventoryLogsPanel() {
  const { data: logs = [], isLoading } = useInventoryLogs();
  return (
    <Card>
      <CardHeader><CardTitle>Activity Log</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? <div className="text-center py-6 text-muted-foreground">Loading…</div> : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Old</TableHead>
                  <TableHead>New</TableHead>
                  <TableHead className="text-right">Qty Δ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No activity yet</TableCell></TableRow>}
                {logs.map(l => (
                  <TableRow key={l.id}>
                    <TableCell className="text-xs">{new Date(l.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-xs">{l.user_email || '—'}</TableCell>
                    <TableCell><Badge variant="outline">{l.change_type}</Badge></TableCell>
                    <TableCell className="text-xs">{l.field_name || '—'}</TableCell>
                    <TableCell className="text-xs">{l.old_value || '—'}</TableCell>
                    <TableCell className="text-xs">{l.new_value || '—'}</TableCell>
                    <TableCell className="text-right">{l.quantity_change != null ? (l.quantity_change > 0 ? `+${l.quantity_change}` : l.quantity_change) : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

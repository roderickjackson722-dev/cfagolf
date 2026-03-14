import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Save, X, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NewsletterTip {
  id: string;
  month_index: number;
  month_name: string;
  subject: string;
  title: string;
  tip: string;
  action_items: string[];
  updated_at: string;
}

export function AdminNewsletterTable() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<NewsletterTip>>({});
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [sendingTestId, setSendingTestId] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [testEmailFor, setTestEmailFor] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: tips = [], isLoading } = useQuery({
    queryKey: ['admin-newsletter-tips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_tips')
        .select('*')
        .order('month_index', { ascending: true });
      if (error) throw error;
      return data as NewsletterTip[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<NewsletterTip>) => {
      const { error } = await supabase.from('newsletter_tips').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-newsletter-tips'] });
      setEditingId(null);
      toast({ title: 'Newsletter tip updated' });
    },
  });

  const sendTestMutation = useMutation({
    mutationFn: async ({ monthIndex, email }: { monthIndex: number; email: string }) => {
      const { data, error } = await supabase.functions.invoke('send-monthly-newsletter', {
        body: { month_index: monthIndex, test_email: email },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Test email sent!', description: 'Check your inbox.' });
      setTestEmailFor(null);
      setTestEmail('');
    },
    onError: (error) => {
      toast({ title: 'Failed to send test', description: error.message, variant: 'destructive' });
    },
  });

  const startEdit = (tip: NewsletterTip) => {
    setEditingId(tip.id);
    setEditForm({
      subject: tip.subject,
      title: tip.title,
      tip: tip.tip,
      action_items: tip.action_items,
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateMutation.mutate({ id: editingId, ...editForm });
  };

  const handleSendTest = (tip: NewsletterTip) => {
    if (testEmailFor === tip.id && testEmail) {
      sendTestMutation.mutate({ monthIndex: tip.month_index, email: testEmail });
    } else {
      setTestEmailFor(tip.id);
    }
  };

  const currentMonth = new Date().getMonth();

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading newsletter tips...</div>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Each month's tip is automatically sent to all active subscribers on the 1st at 9:00 AM EST. Edit any month's content below.
      </p>

      <div className="grid gap-4">
        {tips.map((tip) => {
          const isEditing = editingId === tip.id;
          const isCurrent = tip.month_index === currentMonth;
          const isPreviewing = previewId === tip.id;
          const isTestOpen = testEmailFor === tip.id;

          return (
            <Card key={tip.id} className={isCurrent ? 'border-primary/50 bg-primary/5' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{tip.month_name}</CardTitle>
                    {isCurrent && <Badge variant="default" className="text-xs">This Month</Badge>}
                  </div>
                  <div className="flex gap-1">
                    {!isEditing && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => handleSendTest(tip)}>
                          <Send className="w-3 h-3 mr-1" /> Test
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setPreviewId(isPreviewing ? null : tip.id)}>
                          {isPreviewing ? 'Hide' : 'Preview'}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => startEdit(tip)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isTestOpen && !isEditing && (
                  <div className="flex items-center gap-2 mb-3 p-2 bg-muted rounded-lg">
                    <Input
                      type="email"
                      placeholder="Enter email to send test..."
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => sendTestMutation.mutate({ monthIndex: tip.month_index, email: testEmail })}
                      disabled={!testEmail || sendTestMutation.isPending}
                    >
                      {sendTestMutation.isPending ? 'Sending...' : 'Send'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setTestEmailFor(null); setTestEmail(''); }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email Subject</label>
                      <Input
                        value={editForm.subject || ''}
                        onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Title (with emoji)</label>
                      <Input
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tip Content</label>
                      <Textarea
                        value={editForm.tip || ''}
                        onChange={(e) => setEditForm({ ...editForm, tip: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Action Items (one per line)</label>
                      <Textarea
                        value={(editForm.action_items || []).join('\n')}
                        onChange={(e) => setEditForm({ ...editForm, action_items: e.target.value.split('\n').filter(Boolean) })}
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdit} disabled={updateMutation.isPending}>
                        <Save className="w-4 h-4 mr-1" /> Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium">{tip.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tip.tip}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {(tip.action_items || []).length} action items · Last updated {new Date(tip.updated_at).toLocaleDateString()}
                    </p>

                    {isPreviewing && (
                      <div className="mt-4 border rounded-lg overflow-hidden">
                        <div className="bg-primary text-primary-foreground p-4 text-center">
                          <h3 className="font-bold text-lg">{tip.title}</h3>
                          <p className="text-sm opacity-90">Monthly Recruiting Tip from CFA Golf</p>
                        </div>
                        <div className="p-4 bg-card text-sm text-card-foreground">
                          <p className="mb-2">Hey Golf Family,</p>
                          <p className="mb-3">{tip.tip}</p>
                          <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg">
                            <p className="font-semibold text-primary mb-2">📋 This Month's Action Items:</p>
                            <ul className="list-disc pl-5 space-y-1">
                              {(tip.action_items || []).map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

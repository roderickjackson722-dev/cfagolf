import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Download, FileText, GripVertical, Eye, Save, FolderOpen, FilePlus2, Pencil } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  generateInvoicePdf,
  calcInvoiceTotals,
  type InvoiceLineItem,
  type InvoiceData,
} from '@/lib/invoicePdf';

type CatalogItem = {
  id: string;
  category: string;
  name: string;
  price: number;
  description: string;
};

const CATALOG: CatalogItem[] = [
  // Core programs
  { id: 'consulting', category: 'Programs', name: 'Full Recruiting Consulting (HS)', price: 2499, description: '12-module CFA consulting program for HS golfers. Includes Custom Player Recruiting Website (photos, tournaments, videos, references, coach contact).' },
  { id: 'transfer', category: 'Programs', name: 'Transfer Student Program', price: 1499, description: '6-module CFA program for transfer portal navigation.' },
  { id: 'portal', category: 'Programs', name: 'Client Portal Access (1 year)', price: 299, description: '12-month access to CFA Client Portal: target schools, coach tracker, tournament log, visit comparison, scholarship calculator.' },
  { id: 'ebook', category: 'Programs', name: 'Recruiting Toolkit eBook', price: 25, description: 'Digital toolkit with templates, timeline, and resources.' },
  { id: 'review', category: 'Programs', name: 'Coach Video Review', price: 149, description: 'Coach\'s Eye video swing review and recruiting positioning session.' },

  { id: 'session-60', category: 'Sessions', name: 'Private 60-min Consulting Session', price: 199, description: 'One-on-one 60-minute Zoom consulting session.' },
  { id: 'session-30', category: 'Sessions', name: 'Private 30-min Consulting Session', price: 119, description: 'One-on-one 30-minute Zoom consulting session.' },
  { id: 'family-meeting', category: 'Sessions', name: 'Family Strategy Meeting', price: 249, description: '90-minute strategy meeting with player and parents.' },

  { id: 'portfolio-site', category: 'Portfolio', name: 'Custom Player Recruiting Website (à la carte)', price: 499, description: 'Branded player site at /p/[name] with photo gallery, swing sequence, tournament resume, video highlights, references & coach contact. INCLUDED FREE with Full Consulting Program.' },
  { id: 'portfolio-domain', category: 'Portfolio', name: 'Custom Domain Setup', price: 99, description: 'Connect player\'s purchased custom domain to their portfolio site.' },
  { id: 'resume-design', category: 'Portfolio', name: 'Athletic Resume Design', price: 149, description: 'Professionally designed 1-page athletic resume PDF.' },
  { id: 'highlight-edit', category: 'Portfolio', name: 'Highlight Reel Edit', price: 199, description: 'Edit raw swing/tournament footage into a recruiting highlight reel.' },

  { id: 'coach-email-pack', category: 'Coach Outreach', name: 'Coach Email Templates (5)', price: 79, description: '5 personalized email templates ready to send to college coaches.' },
  { id: 'coach-campaign', category: 'Coach Outreach', name: 'Coach Outreach Campaign (25 coaches)', price: 349, description: 'Personalized outreach campaign to 25 college coaches with follow-ups.' },

  { id: 'target-list', category: 'Planning', name: 'Target School List (20)', price: 199, description: 'Custom Dream/Target/Safety list of 20 schools tailored to player profile.' },
  { id: 'visit-plan', category: 'Planning', name: 'Campus Visit Itinerary', price: 99, description: 'Custom visit itinerary with prep questions and follow-up checklist.' },
  { id: 'scholarship-calc', category: 'Planning', name: 'Scholarship Net-Cost Analysis', price: 79, description: 'Detailed net-cost analysis across selected schools.' },
  { id: 'core-course-audit', category: 'Planning', name: 'NCAA Core Course Audit', price: 89, description: 'Eligibility audit of transcript against NCAA core-course requirements.' },
];

const CATEGORIES = Array.from(new Set(CATALOG.map((c) => c.category)));

const STATUSES = ['draft', 'sent', 'paid', 'void'] as const;
type InvoiceStatus = typeof STATUSES[number];

type SavedInvoice = {
  id: string;
  invoice_number: string;
  status: InvoiceStatus;
  client_name: string;
  client_email: string | null;
  client_address: string | null;
  issue_date: string;
  due_date: string | null;
  notes: string | null;
  items: InvoiceLineItem[];
  discount: number;
  tax_percent: number;
  total: number;
  updated_at: string;
};

const newInvoiceNumber = () =>
  `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

const today = () => new Date().toISOString().slice(0, 10);
const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const AdminInvoiceBuilder = () => {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState(newInvoiceNumber());
  const [status, setStatus] = useState<InvoiceStatus>('draft');
  const [issueDate, setIssueDate] = useState(today());
  const [dueDate, setDueDate] = useState(inDays(14));
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [notes, setNotes] = useState('Thank you for choosing College Fairway Advisors. Payment via Zelle, check, or credit card.');
  const [discount, setDiscount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [items, setItems] = useState<InvoiceLineItem[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadInvoices = async () => {
    setLoadingList(true);
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('updated_at', { ascending: false });
    setLoadingList(false);
    if (error) {
      toast({ title: 'Failed to load invoices', description: error.message, variant: 'destructive' });
      return;
    }
    setSavedInvoices((data || []) as any);
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const addCatalogItem = (c: CatalogItem) => {
    setItems((prev) => [
      ...prev,
      {
        id: `${c.id}-${Date.now()}`,
        description: `${c.name}${c.description ? ` — ${c.description}` : ''}`,
        quantity: 1,
        unit_price: c.price,
      },
    ]);
  };

  const addBlank = () => {
    setItems((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, description: '', quantity: 1, unit_price: 0 },
    ]);
  };

  const updateItem = (id: string, patch: Partial<InvoiceLineItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const id = e.dataTransfer.getData('text/catalog-id');
    const c = CATALOG.find((x) => x.id === id);
    if (c) addCatalogItem(c);
  };

  const data: InvoiceData = useMemo(
    () => ({
      invoice_number: invoiceNumber,
      issue_date: issueDate,
      due_date: dueDate,
      client_name: clientName,
      client_email: clientEmail,
      client_address: clientAddress,
      notes,
      items,
      discount: Number(discount) || 0,
      tax_percent: Number(taxPercent) || 0,
    }),
    [invoiceNumber, issueDate, dueDate, clientName, clientEmail, clientAddress, notes, items, discount, taxPercent],
  );

  const totals = calcInvoiceTotals(data);

  const handleDownload = () => {
    if (!clientName.trim()) {
      toast({ title: 'Client name required', variant: 'destructive' });
      return;
    }
    if (items.length === 0) {
      toast({ title: 'Add at least one line item', variant: 'destructive' });
      return;
    }
    const doc = generateInvoicePdf(data);
    const safeName = clientName.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    doc.save(`${invoiceNumber}-${safeName}.pdf`);
    toast({ title: 'Invoice downloaded', description: `${invoiceNumber}.pdf saved.` });
  };

  const handlePreview = () => {
    if (items.length === 0) {
      toast({ title: 'Add at least one line item', variant: 'destructive' });
      return;
    }
    const doc = generateInvoicePdf(data);
    window.open(doc.output('bloburl'), '_blank');
  };

  const resetForm = () => {
    setCurrentId(null);
    setItems([]);
    setClientName('');
    setClientEmail('');
    setClientAddress('');
    setDiscount(0);
    setTaxPercent(0);
    setStatus('draft');
    setNotes('Thank you for choosing College Fairway Advisors. Payment via Zelle, check, or credit card.');
    setInvoiceNumber(newInvoiceNumber());
    setIssueDate(today());
    setDueDate(inDays(14));
  };

  const handleSave = async () => {
    if (!clientName.trim()) {
      toast({ title: 'Client name required', variant: 'destructive' });
      return;
    }
    if (items.length === 0) {
      toast({ title: 'Add at least one line item', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = {
      invoice_number: invoiceNumber,
      status,
      client_name: clientName,
      client_email: clientEmail || null,
      client_address: clientAddress || null,
      issue_date: issueDate,
      due_date: dueDate || null,
      notes: notes || null,
      items: items as any,
      discount: Number(discount) || 0,
      tax_percent: Number(taxPercent) || 0,
      total: Number(totals.total.toFixed(2)),
    };

    let res;
    if (currentId) {
      res = await supabase.from('invoices').update(payload).eq('id', currentId).select().single();
    } else {
      const { data: userData } = await supabase.auth.getUser();
      res = await supabase
        .from('invoices')
        .insert({ ...payload, created_by: userData.user?.id })
        .select()
        .single();
    }
    setSaving(false);
    if (res.error) {
      toast({ title: 'Save failed', description: res.error.message, variant: 'destructive' });
      return;
    }
    setCurrentId(res.data!.id);
    toast({ title: currentId ? 'Invoice updated' : 'Invoice saved' });
    loadInvoices();
  };

  const handleLoad = (inv: SavedInvoice) => {
    setCurrentId(inv.id);
    setInvoiceNumber(inv.invoice_number);
    setStatus((inv.status as InvoiceStatus) || 'draft');
    setIssueDate(inv.issue_date);
    setDueDate(inv.due_date || inDays(14));
    setClientName(inv.client_name);
    setClientEmail(inv.client_email || '');
    setClientAddress(inv.client_address || '');
    setNotes(inv.notes || '');
    setItems(Array.isArray(inv.items) ? inv.items : []);
    setDiscount(Number(inv.discount) || 0);
    setTaxPercent(Number(inv.tax_percent) || 0);
    toast({ title: `Loaded ${inv.invoice_number}` });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('invoices').delete().eq('id', deleteId);
    if (error) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Invoice deleted' });
      if (currentId === deleteId) resetForm();
      loadInvoices();
    }
    setDeleteId(null);
  };

  const statusBadgeVariant = (s: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
    if (s === 'paid') return 'default';
    if (s === 'sent') return 'secondary';
    if (s === 'void') return 'destructive';
    return 'outline';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Invoice Builder</CardTitle>
                <CardDescription>
                  {currentId ? (
                    <span className="flex items-center gap-1.5"><Pencil className="w-3 h-3" /> Editing {invoiceNumber}</span>
                  ) : (
                    'Build à la carte invoices. Save them to reopen and edit anytime.'
                  )}
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={resetForm}>
              <FilePlus2 className="w-4 h-4 mr-1" /> New Invoice
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Saved invoices list */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Saved Invoices</CardTitle>
          </div>
          <CardDescription>Click any invoice to reopen and edit it.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingList ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : savedInvoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved invoices yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground border-b">
                  <tr>
                    <th className="text-left py-2 pr-3">Invoice #</th>
                    <th className="text-left py-2 pr-3">Client</th>
                    <th className="text-left py-2 pr-3">Issue</th>
                    <th className="text-left py-2 pr-3">Status</th>
                    <th className="text-right py-2 pr-3">Total</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {savedInvoices.map((inv) => (
                    <tr key={inv.id} className={`border-b last:border-0 hover:bg-muted/40 ${currentId === inv.id ? 'bg-primary/5' : ''}`}>
                      <td className="py-2 pr-3 font-mono text-xs">{inv.invoice_number}</td>
                      <td className="py-2 pr-3">{inv.client_name}</td>
                      <td className="py-2 pr-3">{inv.issue_date}</td>
                      <td className="py-2 pr-3">
                        <Badge variant={statusBadgeVariant(inv.status)} className="capitalize">{inv.status}</Badge>
                      </td>
                      <td className="py-2 pr-3 text-right font-medium">${Number(inv.total).toFixed(2)}</td>
                      <td className="py-2 text-right whitespace-nowrap">
                        <Button size="sm" variant="ghost" onClick={() => handleLoad(inv)}>
                          <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => {
                          const doc = generateInvoicePdf({
                            invoice_number: inv.invoice_number,
                            issue_date: inv.issue_date,
                            due_date: inv.due_date || '',
                            client_name: inv.client_name,
                            client_email: inv.client_email || '',
                            client_address: inv.client_address || '',
                            notes: inv.notes || '',
                            items: Array.isArray(inv.items) ? inv.items : [],
                            discount: Number(inv.discount) || 0,
                            tax_percent: Number(inv.tax_percent) || 0,
                          });
                          window.open(doc.output('bloburl'), '_blank');
                        }}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setDeleteId(inv.id)}>
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Catalog */}
        <Card className="self-start">
          <CardHeader>
            <CardTitle className="text-base">Service Catalog</CardTitle>
            <CardDescription>Click or drag onto the invoice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {CATEGORIES.map((cat) => (
              <div key={cat}>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {cat}
                </p>
                <div className="space-y-1.5">
                  {CATALOG.filter((c) => c.category === cat).map((c) => (
                    <button
                      key={c.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/catalog-id', c.id)}
                      onClick={() => addCatalogItem(c)}
                      className="w-full text-left p-2 rounded-md border bg-card hover:bg-accent hover:border-primary/40 transition flex items-center gap-2 group cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        ${c.price}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Builder */}
        <div className="space-y-6">
          {/* Meta + client */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label>Invoice #</Label>
                  <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                </div>
                <div>
                  <Label>Issue Date</Label>
                  <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <div>
                  <Label>Status</Label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Client Name *</Label>
                  <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Smith Family / John Smith" />
                </div>
                <div>
                  <Label>Client Email</Label>
                  <Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="parent@email.com" />
                </div>
              </div>
              <div>
                <Label>Client Address (optional)</Label>
                <Textarea value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} rows={2} />
              </div>
            </CardContent>
          </Card>

          {/* Line items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Line Items</CardTitle>
                <Button size="sm" variant="outline" onClick={addBlank}>
                  <Plus className="w-4 h-4 mr-1" /> Custom Line
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`rounded-md border-2 border-dashed transition ${
                  dragOver ? 'border-primary bg-primary/5' : 'border-muted'
                } ${items.length === 0 ? 'p-10 text-center' : 'p-3'}`}
              >
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Drag services here or click them in the catalog to add line items.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="grid gap-2 md:grid-cols-[1fr_70px_100px_100px_auto] items-start p-2 rounded border bg-card">
                        <Textarea
                          value={item.description}
                          onChange={(e) => updateItem(item.id, { description: e.target.value })}
                          rows={2}
                          className="text-sm"
                          placeholder="Description"
                        />
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) || 1 })}
                        />
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) => updateItem(item.id, { unit_price: Number(e.target.value) || 0 })}
                        />
                        <div className="text-right font-medium pt-2 px-2">
                          ${(item.quantity * item.unit_price).toFixed(2)}
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <Label>Discount ($)</Label>
                    <Input type="number" min={0} step="0.01" value={discount} onChange={(e) => setDiscount(Number(e.target.value) || 0)} />
                  </div>
                  <div>
                    <Label>Tax (%)</Label>
                    <Input type="number" min={0} step="0.01" value={taxPercent} onChange={(e) => setTaxPercent(Number(e.target.value) || 0)} />
                  </div>
                </div>
                <div className="space-y-1 text-sm bg-muted/40 rounded-md p-4 self-end">
                  <div className="flex justify-between"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between text-muted-foreground"><span>Discount</span><span>-${Number(discount).toFixed(2)}</span></div>
                  )}
                  {taxPercent > 0 && (
                    <div className="flex justify-between text-muted-foreground"><span>Tax ({taxPercent}%)</span><span>${totals.tax.toFixed(2)}</span></div>
                  )}
                  <div className="flex justify-between font-bold text-base border-t pt-2 mt-2 text-primary">
                    <span>Total Due</span><span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Label>Notes / Payment Instructions</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
              </div>

              <div className="mt-6 flex flex-wrap gap-2 justify-end">
                <Button variant="outline" onClick={resetForm}>Reset</Button>
                <Button variant="outline" onClick={handlePreview}>
                  <Eye className="w-4 h-4 mr-1" /> Preview
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-1" /> Save as PDF
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-1" />
                  {saving ? 'Saving…' : currentId ? 'Update Invoice' : 'Save Invoice'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the saved invoice. The PDF you already downloaded will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

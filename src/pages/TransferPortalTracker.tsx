import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  ArrowLeftRight, Plus, Trash2, ChevronLeft, Edit, GraduationCap,
  Clock, Building, Mail, Star, Info, ChevronDown
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/hooks/useAuth';
import { useTransferPortal, PortalStatus, InterestLevel, TransferPortalInput } from '@/hooks/useTransferPortal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaywallGate } from '@/components/PaywallGate';

const STATUS_OPTIONS: { value: PortalStatus; label: string; color: string }[] = [
  { value: 'exploring', label: 'Exploring', color: 'bg-muted text-muted-foreground' },
  { value: 'contacted', label: 'Contacted Coach', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'applied', label: 'Applied', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  { value: 'accepted', label: 'Accepted', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { value: 'committed', label: 'Committed', color: 'bg-primary/20 text-primary' },
  { value: 'declined', label: 'Declined', color: 'bg-destructive/20 text-destructive' },
];

const INTEREST_OPTIONS: { value: InterestLevel; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const TransferPortalTracker = () => {
  const { user, loading, hasPaidAccess } = useAuth();
  const { entries, isLoading, addEntry, updateEntry, deleteEntry } = useTransferPortal();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TransferPortalInput>({
    school_name: '',
    current_school: '',
    status: 'exploring',
    overall_interest: 'medium',
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!hasPaidAccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <PaywallGate />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const resetForm = () => {
    setForm({ school_name: '', current_school: '', status: 'exploring', overall_interest: 'medium' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!form.school_name.trim()) return;
    if (editingId) {
      updateEntry.mutate({ id: editingId, ...form });
    } else {
      addEntry.mutate(form);
    }
    resetForm();
  };

  const startEdit = (entry: any) => {
    setForm({
      school_name: entry.school_name,
      current_school: entry.current_school || '',
      portal_entry_date: entry.portal_entry_date || undefined,
      status: entry.status,
      division: entry.division || undefined,
      coach_name: entry.coach_name || undefined,
      coach_email: entry.coach_email || undefined,
      scholarship_offer: entry.scholarship_offer || undefined,
      academic_fit_rating: entry.academic_fit_rating || undefined,
      athletic_fit_rating: entry.athletic_fit_rating || undefined,
      overall_interest: entry.overall_interest || 'medium',
      credits_accepted: entry.credits_accepted || undefined,
      total_credits: entry.total_credits || undefined,
      eligibility_years_remaining: entry.eligibility_years_remaining || undefined,
      notes: entry.notes || undefined,
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const getStatusBadge = (status: PortalStatus) => {
    const opt = STATUS_OPTIONS.find(s => s.value === status);
    return <Badge className={opt?.color || ''}>{opt?.label || status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon"><ChevronLeft className="w-5 h-5" /></Button>
            </Link>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                <ArrowLeftRight className="w-7 h-7 text-primary" />
                Transfer Portal Tracker
              </h1>
              <p className="text-muted-foreground">Track schools, offers, and credit transfers</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card><CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-foreground">{entries.length}</p>
              <p className="text-xs text-muted-foreground">Schools Tracked</p>
            </CardContent></Card>
            <Card><CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-primary">{entries.filter(e => e.status === 'contacted' || e.status === 'applied').length}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent></Card>
            <Card><CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-green-600">{entries.filter(e => e.scholarship_offer && e.scholarship_offer > 0).length}</p>
              <p className="text-xs text-muted-foreground">With Offers</p>
            </CardContent></Card>
            <Card><CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-foreground">{entries.filter(e => e.status === 'accepted' || e.status === 'committed').length}</p>
              <p className="text-xs text-muted-foreground">Accepted</p>
            </CardContent></Card>
          </div>

          {/* NCAA Transfer Portal Info */}
          <Collapsible className="mb-6">
            <Card className="border-primary/30 bg-primary/5">
              <CollapsibleTrigger className="w-full">
                <CardContent className="pt-4 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground text-sm">NCAA Transfer Portal — Key Rules & 2026 Updates</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </CardContent>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 pb-4 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What is the Transfer Portal?</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Online database where athletes declare intent to transfer</li>
                        <li>• Once entered, coaches from other schools can legally contact you</li>
                        <li>• Entering does <strong>not</strong> guarantee a scholarship elsewhere</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">🔹 2026 Rule Changes</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• <strong>Immediate eligibility</strong> regardless of transfer count</li>
                        <li>• Must be academically eligible at previous school</li>
                        <li>• Transfer windows still apply for undergraduates</li>
                      </ul>
                    </div>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-semibold text-foreground mb-2">⛳ 2025-2026 Golf Transfer Windows</h4>
                    <div className="flex flex-wrap gap-4 text-muted-foreground">
                      <span><strong className="text-foreground">Men's Golf:</strong> May 13 – Jun 11, 2026</span>
                      <span><strong className="text-foreground">Women's Golf:</strong> May 6 – Jun 4, 2026</span>
                    </div>
                  </div>
                  <Link to="/tools/transfer-guide">
                    <Button variant="outline" size="sm" className="rounded-full mt-2">
                      <BookOpen className="w-4 h-4 mr-1" /> View Full Transfer Guide →
                    </Button>
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Add / Edit Form */}
          <div className="mb-6">
            {!showForm ? (
              <Button onClick={() => setShowForm(true)} className="rounded-full">
                <Plus className="w-4 h-4 mr-2" /> Add School
              </Button>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{editingId ? 'Edit School' : 'Add Transfer Target'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Target School *</Label>
                      <Input value={form.school_name} onChange={e => setForm(f => ({ ...f, school_name: e.target.value }))} placeholder="e.g. University of Georgia" />
                    </div>
                    <div>
                      <Label>Current School</Label>
                      <Input value={form.current_school || ''} onChange={e => setForm(f => ({ ...f, current_school: e.target.value }))} placeholder="Your current institution" />
                    </div>
                    <div>
                      <Label>Division</Label>
                      <Select value={form.division || ''} onValueChange={v => setForm(f => ({ ...f, division: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select division" /></SelectTrigger>
                        <SelectContent>
                          {['D1', 'D2', 'D3', 'NAIA', 'JUCO'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select value={form.status || 'exploring'} onValueChange={v => setForm(f => ({ ...f, status: v as PortalStatus }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Coach Name</Label>
                      <Input value={form.coach_name || ''} onChange={e => setForm(f => ({ ...f, coach_name: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Coach Email</Label>
                      <Input type="email" value={form.coach_email || ''} onChange={e => setForm(f => ({ ...f, coach_email: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Scholarship Offer ($)</Label>
                      <Input type="number" value={form.scholarship_offer || ''} onChange={e => setForm(f => ({ ...f, scholarship_offer: Number(e.target.value) || undefined }))} />
                    </div>
                    <div>
                      <Label>Interest Level</Label>
                      <Select value={form.overall_interest || 'medium'} onValueChange={v => setForm(f => ({ ...f, overall_interest: v as InterestLevel }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {INTEREST_OPTIONS.map(i => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Credits Accepted</Label>
                      <Input type="number" value={form.credits_accepted || ''} onChange={e => setForm(f => ({ ...f, credits_accepted: Number(e.target.value) || undefined }))} />
                    </div>
                    <div>
                      <Label>Total Credits</Label>
                      <Input type="number" value={form.total_credits || ''} onChange={e => setForm(f => ({ ...f, total_credits: Number(e.target.value) || undefined }))} />
                    </div>
                    <div>
                      <Label>Eligibility Years Remaining</Label>
                      <Input type="number" value={form.eligibility_years_remaining || ''} onChange={e => setForm(f => ({ ...f, eligibility_years_remaining: Number(e.target.value) || undefined }))} />
                    </div>
                    <div>
                      <Label>Portal Entry Date</Label>
                      <Input type="date" value={form.portal_entry_date || ''} onChange={e => setForm(f => ({ ...f, portal_entry_date: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Why this school? What's the fit?" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSubmit} disabled={!form.school_name.trim()}>
                      {editingId ? 'Update' : 'Add School'}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Entries List */}
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : entries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ArrowLeftRight className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Schools Yet</h3>
                <p className="text-muted-foreground">Start tracking potential transfer destinations</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {entries.map(entry => (
                <Card key={entry.id} className="card-hover">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-foreground">{entry.school_name}</h3>
                          {getStatusBadge(entry.status)}
                          {entry.division && <Badge variant="outline">{entry.division}</Badge>}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                          {entry.current_school && (
                            <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" /> From: {entry.current_school}</span>
                          )}
                          {entry.coach_name && (
                            <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {entry.coach_name}</span>
                          )}
                          {entry.coach_email && (
                            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {entry.coach_email}</span>
                          )}
                          {entry.eligibility_years_remaining != null && (
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {entry.eligibility_years_remaining}yr eligibility</span>
                          )}
                          {entry.credits_accepted != null && entry.total_credits != null && (
                            <span>{entry.credits_accepted}/{entry.total_credits} credits accepted</span>
                          )}
                          {entry.scholarship_offer != null && entry.scholarship_offer > 0 && (
                            <span className="text-primary font-medium">${entry.scholarship_offer.toLocaleString()} offer</span>
                          )}
                        </div>
                        {entry.notes && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{entry.notes}</p>}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(entry)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteEntry.mutate(entry.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TransferPortalTracker;

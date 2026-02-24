import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Send, Mail, FileText, Clock, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface HighSchool {
  id: string;
  name: string;
  classification: string;
  area_number: number | null;
  coach_name: string | null;
  coach_email: string | null;
  contact_status: string;
  last_contacted_at: string | null;
  total_emails_sent: number;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
}

interface OutreachRecord {
  id: string;
  high_school_id: string;
  subject: string | null;
  body: string | null;
  status: string;
  sent_at: string;
  high_schools?: { name: string; coach_name: string | null };
}

const CLASSIFICATIONS = ['AAAAAA', 'AAAAA', 'AAAA', 'AAA', 'AA', 'A Division I', 'A Division II', 'Private'];

export function CoachCRM() {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSchools, setSelectedSchools] = useState<Set<string>>(new Set());
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignBody, setCampaignBody] = useState('');
  const [templateEditorOpen, setTemplateEditorOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<EmailTemplate | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateBody, setTemplateBody] = useState('');
  const queryClient = useQueryClient();

  // Fetch schools with coach emails
  const { data: schools = [], isLoading } = useQuery({
    queryKey: ['crm-schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('high_schools' as any)
        .select('id, name, classification, area_number, coach_name, coach_email, contact_status, last_contacted_at, total_emails_sent')
        .order('name');
      if (error) throw error;
      return (data || []) as unknown as HighSchool[];
    },
  });

  // Fetch templates
  const { data: templates = [] } = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates' as any)
        .select('*')
        .eq('category', 'coach_outreach')
        .order('created_at');
      if (error) throw error;
      return (data || []) as unknown as EmailTemplate[];
    },
  });

  // Fetch outreach history
  const { data: outreachHistory = [] } = useQuery({
    queryKey: ['outreach-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hs_coach_outreach' as any)
        .select('*, high_schools(name, coach_name)')
        .order('sent_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data || []) as unknown as OutreachRecord[];
    },
  });

  // Send campaign mutation
  const sendCampaign = useMutation({
    mutationFn: async () => {
      const recipients = schools
        .filter(s => selectedSchools.has(s.id) && s.coach_email)
        .map(s => ({
          highSchoolId: s.id,
          coachName: s.coach_name || 'Coach',
          coachEmail: s.coach_email!,
          schoolName: s.name,
        }));

      if (!recipients.length) throw new Error('No selected schools have coach emails');

      const { data, error } = await supabase.functions.invoke('send-coach-campaign', {
        body: { recipients, subject: campaignSubject, body: campaignBody },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Campaign sent! ${data.sent} emails delivered, ${data.failed} failed.`);
      setSelectedSchools(new Set());
      setCampaignOpen(false);
      queryClient.invalidateQueries({ queryKey: ['crm-schools'] });
      queryClient.invalidateQueries({ queryKey: ['outreach-history'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Save template mutation
  const saveTemplate = useMutation({
    mutationFn: async () => {
      if (editTemplate) {
        const { error } = await supabase.from('email_templates' as any)
          .update({ name: templateName, subject: templateSubject, body: templateBody } as any)
          .eq('id', editTemplate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('email_templates' as any)
          .insert({ name: templateName, subject: templateSubject, body: templateBody, category: 'coach_outreach' } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success('Template saved');
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      setTemplateEditorOpen(false);
      setEditTemplate(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('email_templates' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Template deleted');
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
    },
  });

  // Filter schools
  const filtered = schools.filter(s => {
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.coach_name?.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === 'all' || s.classification === classFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'has_email' && s.coach_email) ||
      (statusFilter === 'no_email' && !s.coach_email) ||
      (statusFilter === 'contacted' && s.contact_status === 'contacted') ||
      (statusFilter === 'not_contacted' && s.contact_status !== 'contacted');
    return matchesSearch && matchesClass && matchesStatus;
  });

  const emailableSelected = schools.filter(s => selectedSchools.has(s.id) && s.coach_email);
  const totalWithEmails = schools.filter(s => s.coach_email).length;

  const toggleAll = () => {
    if (selectedSchools.size === filtered.length) {
      setSelectedSchools(new Set());
    } else {
      setSelectedSchools(new Set(filtered.map(s => s.id)));
    }
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setCampaignSubject(template.subject);
      setCampaignBody(template.body);
    }
  };

  const openTemplateEditor = (template?: EmailTemplate) => {
    if (template) {
      setEditTemplate(template);
      setTemplateName(template.name);
      setTemplateSubject(template.subject);
      setTemplateBody(template.body);
    } else {
      setEditTemplate(null);
      setTemplateName('');
      setTemplateSubject('');
      setTemplateBody('');
    }
    setTemplateEditorOpen(true);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'contacted':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Contacted</Badge>;
      case 'responded':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Responded</Badge>;
      default:
        return <Badge variant="outline">Not Contacted</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="contacts">
        <TabsList>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Contacts ({schools.length})
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Templates ({templates.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            History ({outreachHistory.length})
          </TabsTrigger>
        </TabsList>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-2xl font-bold">{schools.length}</p>
                <p className="text-xs text-muted-foreground">Total Schools</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-2xl font-bold text-green-600">{totalWithEmails}</p>
                <p className="text-xs text-muted-foreground">With Email</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{schools.filter(s => s.contact_status === 'contacted').length}</p>
                <p className="text-xs text-muted-foreground">Contacted</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-2xl font-bold text-amber-600">{schools.length - totalWithEmails}</p>
                <p className="text-xs text-muted-foreground">Need Email</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search schools or coaches..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Classification" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classifications</SelectItem>
                {CLASSIFICATIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="has_email">Has Email</SelectItem>
                <SelectItem value="no_email">No Email</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="not_contacted">Not Contacted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campaign action bar */}
          {selectedSchools.size > 0 && (
            <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-medium">{selectedSchools.size} selected</span>
                <span className="text-muted-foreground text-sm">
                  ({emailableSelected.length} with email)
                </span>
              </div>
              <Dialog open={campaignOpen} onOpenChange={setCampaignOpen}>
                <DialogTrigger asChild>
                  <Button disabled={emailableSelected.length === 0}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Campaign ({emailableSelected.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Send Email Campaign</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      <p>Sending to <strong>{emailableSelected.length}</strong> coaches</p>
                      <p className="text-muted-foreground mt-1">
                        Use <code className="bg-background px-1 rounded">{'{{coach_name}}'}</code> and <code className="bg-background px-1 rounded">{'{{school_name}}'}</code> for personalization
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Load Template</Label>
                      <Select value={selectedTemplate} onValueChange={loadTemplate}>
                        <SelectTrigger><SelectValue placeholder="Select a template..." /></SelectTrigger>
                        <SelectContent>
                          {templates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Subject Line</Label>
                      <Input value={campaignSubject} onChange={e => setCampaignSubject(e.target.value)} placeholder="Email subject..." />
                    </div>

                    <div className="space-y-2">
                      <Label>Email Body</Label>
                      <Textarea value={campaignBody} onChange={e => setCampaignBody(e.target.value)} rows={12} placeholder="Write your email..." className="font-mono text-sm" />
                    </div>

                    {/* Preview */}
                    {campaignSubject && emailableSelected[0] && (
                      <div className="border rounded-lg p-4 space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">PREVIEW (first recipient)</p>
                        <p className="font-medium">
                          {campaignSubject
                            .replace(/\{\{coach_name\}\}/gi, emailableSelected[0].coach_name || 'Coach')
                            .replace(/\{\{school_name\}\}/gi, emailableSelected[0].name)}
                        </p>
                        <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                          {campaignBody
                            .replace(/\{\{coach_name\}\}/gi, emailableSelected[0].coach_name || 'Coach')
                            .replace(/\{\{school_name\}\}/gi, emailableSelected[0].name)
                            .substring(0, 500)}...
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      <p>This will send <strong>{emailableSelected.length} real emails</strong> from contact@cfa.golf. Make sure your content is ready.</p>
                    </div>

                    <Button 
                      onClick={() => sendCampaign.mutate()} 
                      disabled={sendCampaign.isPending || !campaignSubject || !campaignBody}
                      className="w-full"
                      size="lg"
                    >
                      {sendCampaign.isPending ? 'Sending...' : `Send to ${emailableSelected.length} Coaches`}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="border rounded-lg overflow-auto max-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox checked={selectedSchools.size === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} />
                    </TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Coach</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead>Sent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(school => (
                    <TableRow key={school.id} className={selectedSchools.has(school.id) ? 'bg-primary/5' : ''}>
                      <TableCell>
                        <Checkbox
                          checked={selectedSchools.has(school.id)}
                          onCheckedChange={(checked) => {
                            const next = new Set(selectedSchools);
                            checked ? next.add(school.id) : next.delete(school.id);
                            setSelectedSchools(next);
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{school.classification}</Badge></TableCell>
                      <TableCell className="text-sm">{school.coach_name || <span className="text-muted-foreground italic">—</span>}</TableCell>
                      <TableCell className="text-sm">
                        {school.coach_email ? (
                          <span className="text-green-600 dark:text-green-400">{school.coach_email}</span>
                        ) : (
                          <span className="text-muted-foreground italic">Not set</span>
                        )}
                      </TableCell>
                      <TableCell>{statusBadge(school.contact_status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {school.last_contacted_at ? format(new Date(school.last_contacted_at), 'MMM d, yyyy') : '—'}
                      </TableCell>
                      <TableCell className="text-center">{school.total_emails_sent || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Use <code className="bg-muted px-1 rounded">{'{{coach_name}}'}</code> and <code className="bg-muted px-1 rounded">{'{{school_name}}'}</code> for personalization
            </p>
            <Button onClick={() => openTemplateEditor()}>
              <FileText className="w-4 h-4 mr-2" />New Template
            </Button>
          </div>

          <div className="grid gap-4">
            {templates.map(template => (
              <Card key={template.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>Subject: {template.subject}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openTemplateEditor(template)}>Edit</Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        if (confirm('Delete this template?')) deleteTemplate.mutate(template.id);
                      }}>Delete</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm whitespace-pre-wrap text-muted-foreground bg-muted p-3 rounded-lg max-h-40 overflow-y-auto">
                    {template.body}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Template Editor Dialog */}
          <Dialog open={templateEditorOpen} onOpenChange={setTemplateEditorOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editTemplate ? 'Edit Template' : 'New Template'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="e.g. Initial Outreach" />
                </div>
                <div className="space-y-2">
                  <Label>Subject Line</Label>
                  <Input value={templateSubject} onChange={e => setTemplateSubject(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Body</Label>
                  <Textarea value={templateBody} onChange={e => setTemplateBody(e.target.value)} rows={12} className="font-mono text-sm" />
                </div>
                <Button onClick={() => saveTemplate.mutate()} disabled={!templateName || !templateSubject || !templateBody || saveTemplate.isPending}>
                  {saveTemplate.isPending ? 'Saving...' : 'Save Template'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          {outreachHistory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No campaigns sent yet</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-auto max-h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Coach</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outreachHistory.map(record => (
                    <TableRow key={record.id}>
                      <TableCell className="text-sm">{format(new Date(record.sent_at), 'MMM d, yyyy h:mm a')}</TableCell>
                      <TableCell className="font-medium">{(record as any).high_schools?.name || '—'}</TableCell>
                      <TableCell className="text-sm">{(record as any).high_schools?.coach_name || '—'}</TableCell>
                      <TableCell className="text-sm max-w-[300px] truncate">{record.subject}</TableCell>
                      <TableCell>
                        <Badge variant={record.status === 'sent' ? 'default' : 'destructive'}>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

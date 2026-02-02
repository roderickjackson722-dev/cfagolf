import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Trash2, 
  ChevronLeft,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Download,
  Edit,
  Check,
  Clock,
  Building,
  AlertCircle
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useCoachContacts, ContactStatus, ContactType, CoachContactInput } from '@/hooks/useCoachContacts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SchoolSelectAutocomplete } from '@/components/SchoolSelectAutocomplete';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateCoachTracker } from '@/lib/pdfTemplates';
import { format } from 'date-fns';

const statusConfig: Record<ContactStatus, { label: string; color: string }> = {
  initial: { label: 'Initial Contact', color: 'bg-slate-100 text-slate-700' },
  responded: { label: 'Responded', color: 'bg-blue-100 text-blue-700' },
  in_conversation: { label: 'In Conversation', color: 'bg-amber-100 text-amber-700' },
  visited: { label: 'Visited', color: 'bg-purple-100 text-purple-700' },
  offer: { label: 'Offer Received', color: 'bg-emerald-100 text-emerald-700' },
  committed: { label: 'Committed', color: 'bg-primary/20 text-primary' },
  declined: { label: 'Declined', color: 'bg-red-100 text-red-700' },
};

const contactTypeLabels: Record<ContactType, string> = {
  email: 'Email',
  phone: 'Phone Call',
  in_person: 'In Person',
  camp: 'Camp/Showcase',
  other: 'Other',
};

const CoachTracker = () => {
  const { user, loading } = useAuth();
  const { 
    contacts, 
    contactsByStatus,
    upcomingFollowUps,
    isLoading: contactsLoading,
    addContact,
    updateContact,
    deleteContact
  } = useCoachContacts();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [formData, setFormData] = useState<CoachContactInput>({
    school_name: '',
    coach_name: '',
    coach_title: '',
    email: '',
    phone: '',
    first_contact_date: '',
    contact_type: undefined,
    response_received: false,
    follow_up_date: '',
    notes: '',
    status: 'initial',
  });

  const resetForm = () => {
    setFormData({
      school_name: '',
      coach_name: '',
      coach_title: '',
      email: '',
      phone: '',
      first_contact_date: '',
      contact_type: undefined,
      response_received: false,
      follow_up_date: '',
      notes: '',
      status: 'initial',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async () => {
    if (!formData.school_name.trim() || !formData.coach_name.trim()) return;

    if (editingContact) {
      await updateContact.mutateAsync({ id: editingContact, ...formData });
      setEditingContact(null);
    } else {
      await addContact.mutateAsync(formData);
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (contact: typeof contacts[0]) => {
    setFormData({
      school_name: contact.school_name,
      coach_name: contact.coach_name,
      coach_title: contact.coach_title || '',
      email: contact.email || '',
      phone: contact.phone || '',
      first_contact_date: contact.first_contact_date || '',
      contact_type: contact.contact_type || undefined,
      response_received: contact.response_received,
      follow_up_date: contact.follow_up_date || '',
      notes: contact.notes || '',
      status: contact.status,
    });
    setEditingContact(contact.id);
    setIsAddDialogOpen(true);
  };

  const handleStatusChange = async (id: string, status: ContactStatus) => {
    await updateContact.mutateAsync({ id, status });
  };

  const renderContactCard = (contact: typeof contacts[0]) => (
    <Card key={contact.id} className="group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-semibold text-foreground">{contact.coach_name}</h4>
            <p className="text-sm text-muted-foreground">{contact.coach_title || 'Coach'}</p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(contact)}>
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-destructive" 
              onClick={() => deleteContact.mutate(contact.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{contact.school_name}</span>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground mb-3">
          {contact.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              <a href={`mailto:${contact.email}`} className="hover:text-primary">{contact.email}</a>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              <a href={`tel:${contact.phone}`} className="hover:text-primary">{contact.phone}</a>
            </div>
          )}
          {contact.first_contact_date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>First contact: {format(new Date(contact.first_contact_date), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>

        {contact.notes && (
          <p className="text-xs text-muted-foreground italic mb-3 line-clamp-2">
            {contact.notes}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Select
            value={contact.status}
            onValueChange={(value: ContactStatus) => handleStatusChange(contact.id, value)}
          >
            <SelectTrigger className="h-7 w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {Object.entries(statusConfig).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {contact.response_received && (
            <Badge variant="secondary" className="text-xs">
              <Check className="w-3 h-3 mr-1" />
              Responded
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Coach Contact Tracker
                </h1>
                <p className="text-muted-foreground text-sm">
                  Track and manage communications with college coaches
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => generateCoachTracker()}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) {
                  setEditingContact(null);
                  resetForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg bg-background max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingContact ? 'Edit Contact' : 'Add Coach Contact'}</DialogTitle>
                    <DialogDescription>
                      Track your communication with college coaches
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <SchoolSelectAutocomplete
                          value={formData.school_name}
                          onChange={(value) => setFormData({ ...formData, school_name: value })}
                          placeholder="Search for a school..."
                          label="School Name *"
                          allowCustom={false}
                        />
                      </div>
                      <div>
                        <Label htmlFor="coach_name">Coach Name *</Label>
                        <Input
                          id="coach_name"
                          value={formData.coach_name}
                          onChange={(e) => setFormData({ ...formData, coach_name: e.target.value })}
                          placeholder="Coach's full name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="coach_title">Title</Label>
                        <Input
                          id="coach_title"
                          value={formData.coach_title}
                          onChange={(e) => setFormData({ ...formData, coach_title: e.target.value })}
                          placeholder="Head Coach, Assistant, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_type">Contact Type</Label>
                        <Select
                          value={formData.contact_type || ''}
                          onValueChange={(value: ContactType) => setFormData({ ...formData, contact_type: value })}
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover z-50">
                            {Object.entries(contactTypeLabels).map(([key, label]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="coach@university.edu"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_contact_date">First Contact Date</Label>
                        <Input
                          id="first_contact_date"
                          type="date"
                          value={formData.first_contact_date}
                          onChange={(e) => setFormData({ ...formData, first_contact_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="follow_up_date">Follow-up Date</Label>
                        <Input
                          id="follow_up_date"
                          type="date"
                          value={formData.follow_up_date}
                          onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status || 'initial'}
                        onValueChange={(value: ContactStatus) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          {Object.entries(statusConfig).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="response_received"
                        checked={formData.response_received}
                        onCheckedChange={(checked) => setFormData({ ...formData, response_received: checked as boolean })}
                      />
                      <Label htmlFor="response_received" className="text-sm font-normal">
                        Response received from coach
                      </Label>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Add notes about this contact..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsAddDialogOpen(false);
                      setEditingContact(null);
                      resetForm();
                    }}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={!formData.school_name.trim() || !formData.coach_name.trim() || addContact.isPending || updateContact.isPending}
                    >
                      {editingContact ? 'Save Changes' : 'Add Contact'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{contacts.length}</p>
                  <p className="text-xs text-muted-foreground">Total Contacts</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{contacts.filter(c => c.response_received).length}</p>
                  <p className="text-xs text-muted-foreground">Responses</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingFollowUps.length}</p>
                  <p className="text-xs text-muted-foreground">Follow-ups Due</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{contactsByStatus.offer.length + contactsByStatus.committed.length}</p>
                  <p className="text-xs text-muted-foreground">Offers/Commits</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs View */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Contacts</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
              <TabsTrigger value="followups">Follow-ups</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {contactsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : contacts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No coach contacts yet</h3>
                    <p className="text-muted-foreground mb-4">Start tracking your communications with college coaches</p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Contact
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contacts.map(renderContactCard)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pipeline">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(statusConfig).slice(0, 4).map(([status, config]) => (
                  <div key={status} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={config.color}>{config.label}</Badge>
                      <span className="text-sm text-muted-foreground">
                        ({contactsByStatus[status as ContactStatus].length})
                      </span>
                    </div>
                    <div className="space-y-2">
                      {contactsByStatus[status as ContactStatus].map(renderContactCard)}
                      {contactsByStatus[status as ContactStatus].length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg border-dashed">
                          No contacts
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="followups">
              {upcomingFollowUps.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No upcoming follow-ups</h3>
                    <p className="text-muted-foreground">Schedule follow-up dates when adding or editing contacts</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      Upcoming Follow-ups
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Follow-up Date</TableHead>
                          <TableHead>Coach</TableHead>
                          <TableHead>School</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingFollowUps.map((contact) => (
                          <TableRow key={contact.id}>
                            <TableCell className="font-medium">
                              {contact.follow_up_date && format(new Date(contact.follow_up_date), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell>{contact.coach_name}</TableCell>
                            <TableCell>{contact.school_name}</TableCell>
                            <TableCell>
                              <Badge className={statusConfig[contact.status].color}>
                                {statusConfig[contact.status].label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(contact)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoachTracker;

import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Calculator, 
  Plus, 
  Download, 
  Trash2, 
  Edit2, 
  DollarSign,
  TrendingDown,
  Award,
  Star,
  Calendar,
  Loader2,
  Check,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useScholarshipOffers, ScholarshipOfferInput } from '@/hooks/useScholarshipOffers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { pdfGenerators } from '@/lib/pdfTemplates';
import { toast } from '@/hooks/use-toast';

const divisions = ['D1', 'D2', 'D3', 'NAIA', 'JUCO'];
const statuses = [
  { value: 'pending', label: 'Pending', color: 'bg-muted text-muted-foreground' },
  { value: 'accepted', label: 'Accepted', color: 'bg-primary text-primary-foreground' },
  { value: 'declined', label: 'Declined', color: 'bg-destructive text-destructive-foreground' },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const ScholarshipCalculator = () => {
  const { user, loading: authLoading } = useAuth();
  const { offers, loading, addOffer, updateOffer, deleteOffer, stats } = useScholarshipOffers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<string | null>(null);
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const emptyForm: ScholarshipOfferInput = {
    school_name: '',
    division: '',
    tuition_cost: 0,
    room_board_cost: 0,
    books_fees: 0,
    athletic_scholarship: 0,
    academic_scholarship: 0,
    need_based_aid: 0,
    other_grants: 0,
    work_study: 0,
    loans_offered: 0,
    offer_date: '',
    decision_deadline: '',
    status: 'pending',
    is_favorite: false,
    notes: '',
  };

  const [formData, setFormData] = useState<ScholarshipOfferInput>(emptyForm);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingOffer(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.school_name) {
      toast({
        title: "Error",
        description: "Please enter a school name",
        variant: "destructive",
      });
      return;
    }

    if (editingOffer) {
      await updateOffer(editingOffer, formData);
    } else {
      await addOffer(formData);
    }
    
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (offer: typeof offers[0]) => {
    setFormData({
      school_name: offer.school_name,
      division: offer.division || '',
      tuition_cost: offer.tuition_cost,
      room_board_cost: offer.room_board_cost,
      books_fees: offer.books_fees,
      athletic_scholarship: offer.athletic_scholarship,
      academic_scholarship: offer.academic_scholarship,
      need_based_aid: offer.need_based_aid,
      other_grants: offer.other_grants,
      work_study: offer.work_study,
      loans_offered: offer.loans_offered,
      offer_date: offer.offer_date || '',
      decision_deadline: offer.decision_deadline || '',
      status: offer.status,
      is_favorite: offer.is_favorite,
      notes: offer.notes || '',
    });
    setEditingOffer(offer.id);
    setIsAddDialogOpen(true);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      pdfGenerators['scholarship-calc']();
      toast({
        title: "Download Started",
        description: "Scholarship Calculator PDF has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const calculateTotalCost = () => {
    return (formData.tuition_cost || 0) + (formData.room_board_cost || 0) + (formData.books_fees || 0);
  };

  const calculateTotalAid = () => {
    return (formData.athletic_scholarship || 0) + 
           (formData.academic_scholarship || 0) + 
           (formData.need_based_aid || 0) + 
           (formData.other_grants || 0) + 
           (formData.work_study || 0);
  };

  const calculateNetCost = () => {
    return Math.max(0, calculateTotalCost() - calculateTotalAid());
  };

  const getScholarshipPercentage = (offer: typeof offers[0]) => {
    const totalCost = offer.tuition_cost + offer.room_board_cost + offer.books_fees;
    if (totalCost === 0) return 0;
    const totalAid = offer.athletic_scholarship + offer.academic_scholarship + 
                     offer.need_based_aid + offer.other_grants + offer.work_study;
    return Math.min(100, Math.round((totalAid / totalCost) * 100));
  };

  const getStatusBadge = (status: string) => {
    const statusInfo = statuses.find(s => s.value === status) || statuses[0];
    return <Badge className={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                <Calculator className="w-8 h-8 text-primary" />
                Scholarship Offer Calculator
              </h1>
              <p className="text-muted-foreground">
                Compare financial aid packages and find the best value for your education.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export PDF
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Offer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingOffer ? 'Edit Scholarship Offer' : 'Add Scholarship Offer'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* School Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="school_name">School Name *</Label>
                        <Input
                          id="school_name"
                          value={formData.school_name}
                          onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                          placeholder="e.g., University of Texas"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="division">Division</Label>
                        <Select
                          value={formData.division}
                          onValueChange={(value) => setFormData({ ...formData, division: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select division" />
                          </SelectTrigger>
                          <SelectContent>
                            {divisions.map((div) => (
                              <SelectItem key={div} value={div}>{div}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Costs Section */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-destructive" />
                        Annual Costs
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="tuition_cost">Tuition & Fees</Label>
                          <Input
                            id="tuition_cost"
                            type="number"
                            min="0"
                            value={formData.tuition_cost || ''}
                            onChange={(e) => setFormData({ ...formData, tuition_cost: parseInt(e.target.value) || 0 })}
                            placeholder="$45,000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="room_board_cost">Room & Board</Label>
                          <Input
                            id="room_board_cost"
                            type="number"
                            min="0"
                            value={formData.room_board_cost || ''}
                            onChange={(e) => setFormData({ ...formData, room_board_cost: parseInt(e.target.value) || 0 })}
                            placeholder="$15,000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="books_fees">Books & Supplies</Label>
                          <Input
                            id="books_fees"
                            type="number"
                            min="0"
                            value={formData.books_fees || ''}
                            onChange={(e) => setFormData({ ...formData, books_fees: parseInt(e.target.value) || 0 })}
                            placeholder="$1,200"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Total Cost: <span className="font-semibold text-foreground">{formatCurrency(calculateTotalCost())}</span>
                      </p>
                    </div>

                    {/* Aid Section */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        Financial Aid & Scholarships
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="athletic_scholarship">Athletic Scholarship</Label>
                          <Input
                            id="athletic_scholarship"
                            type="number"
                            min="0"
                            value={formData.athletic_scholarship || ''}
                            onChange={(e) => setFormData({ ...formData, athletic_scholarship: parseInt(e.target.value) || 0 })}
                            placeholder="$20,000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="academic_scholarship">Academic Scholarship</Label>
                          <Input
                            id="academic_scholarship"
                            type="number"
                            min="0"
                            value={formData.academic_scholarship || ''}
                            onChange={(e) => setFormData({ ...formData, academic_scholarship: parseInt(e.target.value) || 0 })}
                            placeholder="$10,000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="need_based_aid">Need-Based Aid</Label>
                          <Input
                            id="need_based_aid"
                            type="number"
                            min="0"
                            value={formData.need_based_aid || ''}
                            onChange={(e) => setFormData({ ...formData, need_based_aid: parseInt(e.target.value) || 0 })}
                            placeholder="$5,000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="other_grants">Other Grants</Label>
                          <Input
                            id="other_grants"
                            type="number"
                            min="0"
                            value={formData.other_grants || ''}
                            onChange={(e) => setFormData({ ...formData, other_grants: parseInt(e.target.value) || 0 })}
                            placeholder="$2,000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="work_study">Work-Study</Label>
                          <Input
                            id="work_study"
                            type="number"
                            min="0"
                            value={formData.work_study || ''}
                            onChange={(e) => setFormData({ ...formData, work_study: parseInt(e.target.value) || 0 })}
                            placeholder="$3,000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="loans_offered">Loans Offered (not deducted)</Label>
                          <Input
                            id="loans_offered"
                            type="number"
                            min="0"
                            value={formData.loans_offered || ''}
                            onChange={(e) => setFormData({ ...formData, loans_offered: parseInt(e.target.value) || 0 })}
                            placeholder="$5,500"
                          />
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span>Total Aid (excluding loans):</span>
                          <span className="font-semibold text-primary">{formatCurrency(calculateTotalAid())}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold mt-1">
                          <span>Net Cost:</span>
                          <span className="text-foreground">{formatCurrency(calculateNetCost())}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="offer_date">Offer Date</Label>
                        <Input
                          id="offer_date"
                          type="date"
                          value={formData.offer_date}
                          onChange={(e) => setFormData({ ...formData, offer_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="decision_deadline">Decision Deadline</Label>
                        <Input
                          id="decision_deadline"
                          type="date"
                          value={formData.decision_deadline}
                          onChange={(e) => setFormData({ ...formData, decision_deadline: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any additional details about the offer..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => {
                        setIsAddDialogOpen(false);
                        resetForm();
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingOffer ? 'Update Offer' : 'Add Offer'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalOffers}</p>
                  <p className="text-xs text-muted-foreground">Total Offers</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.lowestNetCost > 0 ? formatCurrency(stats.lowestNetCost) : '-'}
                  </p>
                  <p className="text-xs text-muted-foreground">Lowest Net Cost</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.totalScholarships > 0 ? formatCurrency(stats.totalScholarships) : '-'}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Aid Offered</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pendingDecisions}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Offers List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Scholarship Offers</CardTitle>
              <CardDescription>
                Compare offers side-by-side to find the best value
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : offers.length === 0 ? (
                <div className="text-center py-12">
                  <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Offers Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your scholarship offers to compare them side-by-side.
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Offer
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {offers.map((offer, index) => {
                    const isExpanded = expandedOffer === offer.id;
                    const scholarshipPercent = getScholarshipPercentage(offer);
                    const totalCost = offer.tuition_cost + offer.room_board_cost + offer.books_fees;
                    const totalAid = offer.athletic_scholarship + offer.academic_scholarship + 
                                     offer.need_based_aid + offer.other_grants + offer.work_study;
                    
                    return (
                      <div 
                        key={offer.id} 
                        className={`border rounded-lg overflow-hidden transition-all ${
                          index === 0 ? 'border-primary/50 bg-primary/5' : ''
                        }`}
                      >
                        {/* Main Row */}
                        <div 
                          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setExpandedOffer(isExpanded ? null : offer.id)}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              {index === 0 && (
                                <div className="hidden sm:flex w-8 h-8 rounded-full bg-primary text-primary-foreground items-center justify-center">
                                  <Star className="w-4 h-4" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-foreground">{offer.school_name}</h3>
                                  {offer.division && (
                                    <Badge variant="outline">{offer.division}</Badge>
                                  )}
                                  {getStatusBadge(offer.status)}
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                  <span>Net Cost: <span className="font-semibold text-foreground">{formatCurrency(offer.net_cost)}</span></span>
                                  <span className="hidden sm:inline">|</span>
                                  <span className="hidden sm:inline">{scholarshipPercent}% covered</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="hidden md:block w-32">
                                <Progress value={scholarshipPercent} className="h-2" />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(offer);
                                }}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteOffer(offer.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="border-t bg-muted/30 p-4">
                            <div className="grid md:grid-cols-3 gap-6">
                              {/* Costs */}
                              <div>
                                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-destructive" />
                                  Annual Costs
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tuition & Fees</span>
                                    <span>{formatCurrency(offer.tuition_cost)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Room & Board</span>
                                    <span>{formatCurrency(offer.room_board_cost)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Books & Supplies</span>
                                    <span>{formatCurrency(offer.books_fees)}</span>
                                  </div>
                                  <div className="flex justify-between font-semibold pt-2 border-t">
                                    <span>Total Cost</span>
                                    <span>{formatCurrency(totalCost)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Aid */}
                              <div>
                                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                  <Award className="w-4 h-4 text-primary" />
                                  Financial Aid
                                </h4>
                                <div className="space-y-2 text-sm">
                                  {offer.athletic_scholarship > 0 && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Athletic Scholarship</span>
                                      <span className="text-primary">{formatCurrency(offer.athletic_scholarship)}</span>
                                    </div>
                                  )}
                                  {offer.academic_scholarship > 0 && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Academic Scholarship</span>
                                      <span className="text-primary">{formatCurrency(offer.academic_scholarship)}</span>
                                    </div>
                                  )}
                                  {offer.need_based_aid > 0 && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Need-Based Aid</span>
                                      <span className="text-primary">{formatCurrency(offer.need_based_aid)}</span>
                                    </div>
                                  )}
                                  {offer.other_grants > 0 && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Other Grants</span>
                                      <span className="text-primary">{formatCurrency(offer.other_grants)}</span>
                                    </div>
                                  )}
                                  {offer.work_study > 0 && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Work-Study</span>
                                      <span className="text-primary">{formatCurrency(offer.work_study)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between font-semibold pt-2 border-t text-primary">
                                    <span>Total Aid</span>
                                    <span>{formatCurrency(totalAid)}</span>
                                  </div>
                                  {offer.loans_offered > 0 && (
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Loans Offered</span>
                                      <span>{formatCurrency(offer.loans_offered)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Summary */}
                              <div>
                                <h4 className="font-semibold text-foreground mb-3">Summary</h4>
                                <div className="space-y-3">
                                  <div className="p-3 bg-background rounded-lg">
                                    <p className="text-sm text-muted-foreground">Net Cost Per Year</p>
                                    <p className="text-2xl font-bold text-foreground">{formatCurrency(offer.net_cost)}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      4-Year Total: {formatCurrency(offer.net_cost * 4)}
                                    </p>
                                  </div>
                                  {offer.decision_deadline && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Calendar className="w-4 h-4 text-muted-foreground" />
                                      <span>Deadline: {format(new Date(offer.decision_deadline), 'MMM d, yyyy')}</span>
                                    </div>
                                  )}
                                  {offer.notes && (
                                    <p className="text-sm text-muted-foreground italic">"{offer.notes}"</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScholarshipCalculator;

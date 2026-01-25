import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ArrowLeft, Plus, MapPin, Calendar, Star, Camera, 
  MessageSquare, ThumbsUp, ThumbsDown, AlertCircle, Trash2, Edit, X, Image
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useCampusVisits, CampusVisit } from '@/hooks/useCampusVisits';
import { useAllColleges } from '@/hooks/useColleges';

const VISIT_TYPES = ['in-person', 'virtual', 'unofficial', 'official'];

function StarRating({ value, onChange, disabled = false }: { 
  value: number | null; 
  onChange?: (val: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange?.(star)}
          className={`transition-colors ${disabled ? 'cursor-default' : 'cursor-pointer hover:text-yellow-400'}`}
        >
          <Star 
            className={`h-5 w-5 ${(value || 0) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
          />
        </button>
      ))}
    </div>
  );
}

function VisitCard({ visit, onEdit, onDelete }: { 
  visit: CampusVisit; 
  onEdit: () => void;
  onDelete: () => void;
}) {
  const schoolName = visit.college?.name || visit.custom_school_name || 'Unknown School';
  const photoUrls = visit.photo_urls || [];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {visit.college?.logo_url ? (
              <img 
                src={visit.college.logo_url} 
                alt={schoolName}
                className="h-12 w-12 object-contain rounded"
              />
            ) : (
              <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                <MapPin className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{schoolName}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {visit.college && (
                  <>
                    <span>{visit.college.state}</span>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">{visit.college.division}</Badge>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(visit.visit_date), 'MMM d, yyyy')}</span>
            <Badge variant="secondary" className="capitalize">{visit.visit_type}</Badge>
          </div>
          {visit.overall_rating && (
            <div className="flex items-center gap-1">
              <StarRating value={visit.overall_rating} disabled />
            </div>
          )}
        </div>

        {/* Rating breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {[
            { label: 'Campus', value: visit.campus_rating },
            { label: 'Facilities', value: visit.facilities_rating },
            { label: 'Coaching', value: visit.coaching_rating },
            { label: 'Team Culture', value: visit.team_culture_rating },
            { label: 'Academics', value: visit.academics_rating },
          ].filter(r => r.value).map(rating => (
            <div key={rating.label} className="flex items-center justify-between bg-muted/50 rounded px-2 py-1">
              <span className="text-muted-foreground">{rating.label}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{rating.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pros/Cons */}
        <div className="grid md:grid-cols-2 gap-3">
          {visit.pros && (
            <div className="bg-green-500/10 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium mb-1">
                <ThumbsUp className="h-4 w-4" />
                <span>Pros</span>
              </div>
              <p className="text-sm">{visit.pros}</p>
            </div>
          )}
          {visit.cons && (
            <div className="bg-red-500/10 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium mb-1">
                <ThumbsDown className="h-4 w-4" />
                <span>Cons</span>
              </div>
              <p className="text-sm">{visit.cons}</p>
            </div>
          )}
        </div>

        {visit.notes && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-muted-foreground font-medium mb-1">
              <MessageSquare className="h-4 w-4" />
              <span>Notes</span>
            </div>
            <p className="text-sm">{visit.notes}</p>
          </div>
        )}

        {/* Photos */}
        {photoUrls.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {photoUrls.map((url, idx) => (
              <img 
                key={idx}
                src={url}
                alt={`Visit photo ${idx + 1}`}
                className="h-20 w-20 object-cover rounded-lg flex-shrink-0"
              />
            ))}
          </div>
        )}

        {visit.follow_up_needed && (
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Follow-up needed</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function VisitForm({ 
  visit, 
  onSubmit, 
  onCancel,
  uploadPhoto,
}: { 
  visit?: CampusVisit | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  uploadPhoto: (file: File) => Promise<string>;
}) {
  const { data: colleges = [] } = useAllColleges();
  const [formData, setFormData] = useState({
    college_id: visit?.college_id || '',
    custom_school_name: visit?.custom_school_name || '',
    visit_date: visit?.visit_date || format(new Date(), 'yyyy-MM-dd'),
    visit_type: visit?.visit_type || 'in-person',
    overall_rating: visit?.overall_rating || null,
    campus_rating: visit?.campus_rating || null,
    facilities_rating: visit?.facilities_rating || null,
    coaching_rating: visit?.coaching_rating || null,
    team_culture_rating: visit?.team_culture_rating || null,
    academics_rating: visit?.academics_rating || null,
    notes: visit?.notes || '',
    pros: visit?.pros || '',
    cons: visit?.cons || '',
    questions_asked: visit?.questions_asked || '',
    follow_up_needed: visit?.follow_up_needed || false,
    photo_urls: visit?.photo_urls || [],
  });
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredColleges = colleges.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 20);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadPhoto(file);
        newUrls.push(url);
      }
      setFormData(prev => ({
        ...prev,
        photo_urls: [...prev.photo_urls, ...newUrls]
      }));
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photo_urls: prev.photo_urls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      college_id: formData.college_id || null,
      custom_school_name: formData.college_id ? null : formData.custom_school_name || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="notes">Notes & Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>School</Label>
            <Input
              placeholder="Search colleges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <div className="max-h-40 overflow-y-auto border rounded-md">
                {filteredColleges.map(college => (
                  <button
                    key={college.id}
                    type="button"
                    className={`w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-2 ${
                      formData.college_id === college.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, college_id: college.id, custom_school_name: '' }));
                      setSearchQuery(college.name);
                    }}
                  >
                    {college.logo_url && (
                      <img src={college.logo_url} alt="" className="h-6 w-6 object-contain" />
                    )}
                    <span>{college.name}</span>
                    <Badge variant="outline" className="ml-auto">{college.division}</Badge>
                  </button>
                ))}
              </div>
            )}
            <div className="text-sm text-muted-foreground">Or enter custom school name:</div>
            <Input
              placeholder="Custom school name"
              value={formData.custom_school_name}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                custom_school_name: e.target.value,
                college_id: ''
              }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Visit Date</Label>
              <Input
                type="date"
                value={formData.visit_date}
                onChange={(e) => setFormData(prev => ({ ...prev, visit_date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Visit Type</Label>
              <Select
                value={formData.visit_type}
                onValueChange={(val) => setFormData(prev => ({ ...prev, visit_type: val }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VISIT_TYPES.map(type => (
                    <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="follow-up">Follow-up needed?</Label>
            <Switch
              id="follow-up"
              checked={formData.follow_up_needed}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, follow_up_needed: checked }))}
            />
          </div>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-4 mt-4">
          <div className="space-y-4">
            {[
              { key: 'overall_rating', label: 'Overall Rating' },
              { key: 'campus_rating', label: 'Campus' },
              { key: 'facilities_rating', label: 'Golf Facilities' },
              { key: 'coaching_rating', label: 'Coaching Staff' },
              { key: 'team_culture_rating', label: 'Team Culture' },
              { key: 'academics_rating', label: 'Academics' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <Label>{label}</Label>
                <StarRating
                  value={formData[key as keyof typeof formData] as number | null}
                  onChange={(val) => setFormData(prev => ({ ...prev, [key]: val }))}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-green-600">
                <ThumbsUp className="h-4 w-4" /> Pros
              </Label>
              <Textarea
                placeholder="What did you like?"
                value={formData.pros}
                onChange={(e) => setFormData(prev => ({ ...prev, pros: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-red-600">
                <ThumbsDown className="h-4 w-4" /> Cons
              </Label>
              <Textarea
                placeholder="What concerns do you have?"
                value={formData.cons}
                onChange={(e) => setFormData(prev => ({ ...prev, cons: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>General Notes</Label>
            <Textarea
              placeholder="Overall impressions, memorable moments..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Questions Asked</Label>
            <Textarea
              placeholder="Questions you asked the coaches..."
              value={formData.questions_asked}
              onChange={(e) => setFormData(prev => ({ ...prev, questions_asked: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Camera className="h-4 w-4" /> Photos
            </Label>
            <div className="flex flex-wrap gap-2">
              {formData.photo_urls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img src={url} alt="" className="h-20 w-20 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="h-20 w-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                ) : (
                  <Image className="h-6 w-6 text-muted-foreground" />
                )}
              </label>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{visit ? 'Update' : 'Add'} Visit</Button>
      </div>
    </form>
  );
}

export default function CampusVisits() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { visits, isLoading, stats, addVisit, updateVisit, deleteVisit, uploadPhoto } = useCampusVisits();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<CampusVisit | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (data: any) => {
    if (editingVisit) {
      await updateVisit.mutateAsync({ id: editingVisit.id, ...data });
    } else {
      await addVisit.mutateAsync(data);
    }
    setDialogOpen(false);
    setEditingVisit(null);
  };

  const handleEdit = (visit: CampusVisit) => {
    setEditingVisit(visit);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this visit?')) {
      await deleteVisit.mutateAsync(id);
    }
  };

  const toggleCompare = (id: string) => {
    setSelectedForCompare(prev => 
      prev.includes(id) 
        ? prev.filter(v => v !== id)
        : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const compareVisits = visits.filter(v => selectedForCompare.includes(v.id));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Campus Visits</h1>
              <p className="text-muted-foreground">Track and compare your college visits</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={compareMode ? "default" : "outline"}
              onClick={() => {
                setCompareMode(!compareMode);
                if (compareMode) setSelectedForCompare([]);
              }}
            >
              {compareMode ? 'Exit Compare' : 'Compare Visits'}
            </Button>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setEditingVisit(null);
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Visit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingVisit ? 'Edit' : 'Add'} Campus Visit</DialogTitle>
                </DialogHeader>
                <VisitForm
                  visit={editingVisit}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setDialogOpen(false);
                    setEditingVisit(null);
                  }}
                  uploadPhoto={uploadPhoto}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.totalVisits}</div>
              <div className="text-sm text-muted-foreground">Total Visits</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold flex items-center gap-1">
                {stats.averageOverallRating.toFixed(1)}
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-amber-600">{stats.followUpsNeeded}</div>
              <div className="text-sm text-muted-foreground">Follow-ups Needed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold truncate">
                {stats.topRatedVisit?.college?.name || stats.topRatedVisit?.custom_school_name || '-'}
              </div>
              <div className="text-sm text-muted-foreground">Top Rated</div>
            </CardContent>
          </Card>
        </div>

        {/* Compare Mode */}
        {compareMode && selectedForCompare.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Comparing {selectedForCompare.length} Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Metric</th>
                      {compareVisits.map(v => (
                        <th key={v.id} className="text-center py-2 px-3">
                          {v.college?.name || v.custom_school_name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'visit_date', label: 'Visit Date', format: (v: CampusVisit) => format(new Date(v.visit_date), 'MMM d, yyyy') },
                      { key: 'overall_rating', label: 'Overall', format: (v: CampusVisit) => v.overall_rating ? `${v.overall_rating}/5` : '-' },
                      { key: 'campus_rating', label: 'Campus', format: (v: CampusVisit) => v.campus_rating ? `${v.campus_rating}/5` : '-' },
                      { key: 'facilities_rating', label: 'Facilities', format: (v: CampusVisit) => v.facilities_rating ? `${v.facilities_rating}/5` : '-' },
                      { key: 'coaching_rating', label: 'Coaching', format: (v: CampusVisit) => v.coaching_rating ? `${v.coaching_rating}/5` : '-' },
                      { key: 'team_culture_rating', label: 'Team Culture', format: (v: CampusVisit) => v.team_culture_rating ? `${v.team_culture_rating}/5` : '-' },
                      { key: 'academics_rating', label: 'Academics', format: (v: CampusVisit) => v.academics_rating ? `${v.academics_rating}/5` : '-' },
                    ].map(({ key, label, format }) => (
                      <tr key={key} className="border-b">
                        <td className="py-2 px-3 font-medium">{label}</td>
                        {compareVisits.map(v => (
                          <td key={v.id} className="text-center py-2 px-3">
                            {format(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Visits Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : visits.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No visits yet</h3>
              <p className="text-muted-foreground mb-4">Start tracking your campus visits to compare programs</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Visit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {visits.map(visit => (
              <div key={visit.id} className="relative">
                {compareMode && (
                  <button
                    onClick={() => toggleCompare(visit.id)}
                    className={`absolute -top-2 -left-2 z-10 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedForCompare.includes(visit.id)
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-background border-muted-foreground'
                    }`}
                  >
                    {selectedForCompare.includes(visit.id) && '✓'}
                  </button>
                )}
                <VisitCard
                  visit={visit}
                  onEdit={() => handleEdit(visit)}
                  onDelete={() => handleDelete(visit.id)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

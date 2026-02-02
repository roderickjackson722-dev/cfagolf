import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  Target, 
  Plus, 
  Trash2, 
  Star, 
  ChevronLeft,
  GripVertical,
  Download,
  StickyNote,
  GraduationCap
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useTargetSchools, TargetSchoolCategory } from '@/hooks/useTargetSchools';
import { useAllColleges } from '@/hooks/useColleges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { generateTargetSchoolList } from '@/lib/pdfTemplates';

const categoryConfig = {
  dream: {
    label: 'Dream Schools (Reach)',
    color: 'bg-amber-500/10 text-amber-700 border-amber-300',
    icon: Star,
    description: 'Aspirational programs that may be competitive',
  },
  target: {
    label: 'Target Schools (Match)',
    color: 'bg-primary/10 text-primary border-primary/30',
    icon: Target,
    description: 'Programs where you have a strong chance',
  },
  safety: {
    label: 'Safety Schools',
    color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
    icon: GraduationCap,
    description: 'Programs where admission is likely',
  },
};

const TargetSchoolBuilder = () => {
  const { user, loading } = useAuth();
  const { 
    dreamSchools, 
    matchSchools, 
    safetySchools, 
    isLoading: schoolsLoading,
    addSchool,
    removeSchool,
    updateSchool
  } = useTargetSchools();
  const { data: colleges = [] } = useAllColleges();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TargetSchoolCategory>('target');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(null);
  const [customSchoolName, setCustomSchoolName] = useState('');
  const [notes, setNotes] = useState('');
  const [editingSchool, setEditingSchool] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');

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

  const filteredColleges = colleges.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 20);

  const handleAddSchool = async () => {
    if (!selectedCollegeId && !customSchoolName.trim()) return;

    await addSchool.mutateAsync({
      college_id: selectedCollegeId || undefined,
      custom_school_name: !selectedCollegeId ? customSchoolName : undefined,
      category: selectedCategory,
      notes: notes || undefined,
    });

    // Reset form
    setSelectedCollegeId(null);
    setCustomSchoolName('');
    setNotes('');
    setSearchQuery('');
    setIsAddDialogOpen(false);
  };

  const handleUpdateNotes = async (id: string) => {
    await updateSchool.mutateAsync({ id, notes: editNotes });
    setEditingSchool(null);
    setEditNotes('');
  };

  const handleMoveSchool = async (id: string, newCategory: TargetSchoolCategory) => {
    await updateSchool.mutateAsync({ id, category: newCategory });
  };

  const renderSchoolList = (schools: typeof dreamSchools, category: TargetSchoolCategory) => {
    const config = categoryConfig[category];
    const Icon = config.icon;

    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base">{config.label}</CardTitle>
              <CardDescription className="text-xs">{config.description}</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="w-fit">
            {schools.length} school{schools.length !== 1 ? 's' : ''}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          {schools.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No schools added yet
            </p>
          ) : (
            schools.map((school) => (
              <div
                key={school.id}
                className="p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow group"
              >
                <div className="flex items-start gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {school.college?.logo_url && (
                        <img 
                          src={school.college.logo_url} 
                          alt="" 
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      <p className="font-medium text-sm truncate">
                        {school.college?.name || school.custom_school_name}
                      </p>
                    </div>
                    {school.college && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {school.college.state} • {school.college.division}
                        {school.college.recruiting_scoring_avg && 
                          ` • ${school.college.recruiting_scoring_avg} avg`
                        }
                      </p>
                    )}
                    {school.notes && (
                      <p className="text-xs text-muted-foreground mt-1 italic line-clamp-2">
                        {school.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        setEditingSchool(school.id);
                        setEditNotes(school.notes || '');
                      }}
                    >
                      <StickyNote className="w-3.5 h-3.5" />
                    </Button>
                    <Select
                      value={school.category}
                      onValueChange={(value: TargetSchoolCategory) => handleMoveSchool(school.id, value)}
                    >
                      <SelectTrigger className="h-7 w-20 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="dream">Dream</SelectItem>
                        <SelectItem value="target">Target</SelectItem>
                        <SelectItem value="safety">Safety</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => removeSchool.mutate(school.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    );
  };

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
                  <Target className="w-6 h-6 text-primary" />
                  Target School List Builder
                </h1>
                <p className="text-muted-foreground text-sm">
                  Organize your college prospects into Dream, Target, and Safety categories
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => generateTargetSchoolList()}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add School
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-background">
                  <DialogHeader>
                    <DialogTitle>Add School to Your List</DialogTitle>
                    <DialogDescription>
                      Search from our database or add a custom school
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select value={selectedCategory} onValueChange={(v: TargetSchoolCategory) => setSelectedCategory(v)}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          <SelectItem value="dream">Dream (Reach)</SelectItem>
                          <SelectItem value="target">Target (Match)</SelectItem>
                          <SelectItem value="safety">Safety</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <SchoolSelectAutocomplete
                      value={searchQuery}
                      onChange={(value) => {
                        setSearchQuery(value);
                        if (!value) setSelectedCollegeId(null);
                      }}
                      onCollegeSelect={(collegeId, collegeName) => {
                        setSelectedCollegeId(collegeId);
                        if (collegeId) {
                          setCustomSchoolName('');
                          setSearchQuery(collegeName);
                        }
                      }}
                      selectedCollegeId={selectedCollegeId}
                      placeholder="Search by school name or state..."
                      label="Search Database"
                      allowCustom={true}
                      customValue={customSchoolName}
                      onCustomChange={(value) => {
                        setCustomSchoolName(value);
                        if (value) {
                          setSelectedCollegeId(null);
                          setSearchQuery('');
                        }
                      }}
                    />

                    <div>
                      <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
                      <Textarea
                        placeholder="Add notes about this school..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddSchool}
                      disabled={(!selectedCollegeId && !customSchoolName.trim()) || addSchool.isPending}
                    >
                      {addSchool.isPending ? 'Adding...' : 'Add School'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryConfig.dream.color}`}>
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{dreamSchools.length}</p>
                  <p className="text-xs text-muted-foreground">Dream Schools</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryConfig.target.color}`}>
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{matchSchools.length}</p>
                  <p className="text-xs text-muted-foreground">Target Schools</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryConfig.safety.color}`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{safetySchools.length}</p>
                  <p className="text-xs text-muted-foreground">Safety Schools</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* School Lists */}
          {schoolsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {renderSchoolList(dreamSchools, 'dream')}
              {renderSchoolList(matchSchools, 'target')}
              {renderSchoolList(safetySchools, 'safety')}
            </div>
          )}

          {/* Edit Notes Dialog */}
          <Dialog open={!!editingSchool} onOpenChange={(open) => !open && setEditingSchool(null)}>
            <DialogContent className="sm:max-w-md bg-background">
              <DialogHeader>
                <DialogTitle>Edit Notes</DialogTitle>
                <DialogDescription>
                  Add or update notes for this school
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add your notes here..."
                rows={4}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingSchool(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => editingSchool && handleUpdateNotes(editingSchool)}
                  disabled={updateSchool.isPending}
                >
                  Save Notes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TargetSchoolBuilder;

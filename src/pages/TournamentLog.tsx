import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Plus, 
  Download, 
  Trash2, 
  Edit2, 
  Trophy,
  Calendar,
  MapPin,
  Flag,
  TrendingUp,
  Award,
  X,
  Loader2
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useTournamentResults, TournamentResultInput, RoundScore } from '@/hooks/useTournamentResults';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { pdfGenerators } from '@/lib/pdfTemplates';
import { toast } from '@/hooks/use-toast';

const tournamentTypes = [
  { value: 'local', label: 'Local/Club Event' },
  { value: 'regional', label: 'Regional Tournament' },
  { value: 'state', label: 'State Championship' },
  { value: 'national', label: 'National Event' },
  { value: 'ajga', label: 'AJGA' },
  { value: 'usga', label: 'USGA Junior' },
  { value: 'high_school', label: 'High School' },
  { value: 'college_camp', label: 'College Camp' },
  { value: 'other', label: 'Other' },
];

const TournamentLog = () => {
  const { user, loading: authLoading } = useAuth();
  const { results, loading, addResult, updateResult, deleteResult, stats } = useTournamentResults();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<TournamentResultInput>({
    tournament_name: '',
    tournament_date: '',
    location: '',
    course_name: '',
    rounds: 1,
    round_scores: [],
    total_score: undefined,
    relative_to_par: undefined,
    finish_position: undefined,
    field_size: undefined,
    tournament_type: 'local',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      tournament_name: '',
      tournament_date: '',
      location: '',
      course_name: '',
      rounds: 1,
      round_scores: [],
      total_score: undefined,
      relative_to_par: undefined,
      finish_position: undefined,
      field_size: undefined,
      tournament_type: 'local',
      notes: '',
    });
    setEditingResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tournament_name || !formData.tournament_date) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingResult) {
      await updateResult(editingResult, formData);
    } else {
      await addResult(formData);
    }
    
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (result: typeof results[0]) => {
    setFormData({
      tournament_name: result.tournament_name,
      tournament_date: result.tournament_date,
      location: result.location || '',
      course_name: result.course_name || '',
      rounds: result.rounds,
      round_scores: result.round_scores,
      total_score: result.total_score || undefined,
      relative_to_par: result.relative_to_par || undefined,
      finish_position: result.finish_position || undefined,
      field_size: result.field_size || undefined,
      tournament_type: result.tournament_type,
      notes: result.notes || '',
    });
    setEditingResult(result.id);
    setIsAddDialogOpen(true);
  };

  const handleRoundScoreChange = (roundNum: number, score: number) => {
    const newScores = [...(formData.round_scores || [])];
    const existingIndex = newScores.findIndex(r => r.round === roundNum);
    
    if (existingIndex >= 0) {
      newScores[existingIndex] = { round: roundNum, score };
    } else {
      newScores.push({ round: roundNum, score });
    }
    
    // Calculate total score
    const totalScore = newScores.reduce((sum, r) => sum + r.score, 0);
    
    setFormData({
      ...formData,
      round_scores: newScores.sort((a, b) => a.round - b.round),
      total_score: totalScore,
    });
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      pdfGenerators['tournament-log']();
      toast({
        title: "Download Started",
        description: "Tournament Result Log PDF has been downloaded.",
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

  const getTypeLabel = (type: string) => {
    return tournamentTypes.find(t => t.value === type)?.label || type;
  };

  const getPositionBadge = (position: number | null) => {
    if (!position) return null;
    
    if (position === 1) {
      return <Badge className="bg-accent text-accent-foreground">🏆 1st</Badge>;
    } else if (position === 2) {
      return <Badge variant="secondary">🥈 2nd</Badge>;
    } else if (position === 3) {
      return <Badge className="bg-primary/80 text-primary-foreground">🥉 3rd</Badge>;
    } else if (position <= 10) {
      return <Badge variant="secondary">Top 10</Badge>;
    }
    return <Badge variant="outline">{position}th</Badge>;
  };

  const formatRelativeToPar = (score: number | null) => {
    if (score === null || score === undefined) return '-';
    if (score === 0) return 'E';
    return score > 0 ? `+${score}` : score.toString();
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
                <ClipboardList className="w-8 h-8 text-primary" />
                Tournament Result Log
              </h1>
              <p className="text-muted-foreground">
                Track your competitive golf results and build your tournament resume.
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
                    Add Result
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingResult ? 'Edit Tournament Result' : 'Add Tournament Result'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="tournament_name">Tournament Name *</Label>
                        <Input
                          id="tournament_name"
                          value={formData.tournament_name}
                          onChange={(e) => setFormData({ ...formData, tournament_name: e.target.value })}
                          placeholder="e.g., State Junior Championship"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="tournament_date">Date *</Label>
                        <Input
                          id="tournament_date"
                          type="date"
                          value={formData.tournament_date}
                          onChange={(e) => setFormData({ ...formData, tournament_date: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="tournament_type">Tournament Type</Label>
                        <Select
                          value={formData.tournament_type}
                          onValueChange={(value) => setFormData({ ...formData, tournament_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {tournamentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g., Dallas, TX"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="course_name">Course Name</Label>
                        <Input
                          id="course_name"
                          value={formData.course_name}
                          onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                          placeholder="e.g., TPC Four Seasons"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="rounds">Number of Rounds</Label>
                        <Select
                          value={formData.rounds?.toString()}
                          onValueChange={(value) => setFormData({ ...formData, rounds: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select rounds" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} Round{num > 1 ? 's' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="relative_to_par">Score Relative to Par</Label>
                        <Input
                          id="relative_to_par"
                          type="number"
                          value={formData.relative_to_par || ''}
                          onChange={(e) => setFormData({ ...formData, relative_to_par: e.target.value ? parseInt(e.target.value) : undefined })}
                          placeholder="e.g., -2 or +5"
                        />
                      </div>
                    </div>

                    {/* Round Scores */}
                    {formData.rounds && formData.rounds > 0 && (
                      <div>
                        <Label>Round Scores</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                          {Array.from({ length: formData.rounds }, (_, i) => i + 1).map((roundNum) => (
                            <div key={roundNum}>
                              <Label className="text-xs text-muted-foreground">Round {roundNum}</Label>
                              <Input
                                type="number"
                                value={formData.round_scores?.find(r => r.round === roundNum)?.score || ''}
                                onChange={(e) => handleRoundScoreChange(roundNum, parseInt(e.target.value) || 0)}
                                placeholder="72"
                              />
                            </div>
                          ))}
                        </div>
                        {formData.total_score && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Total: {formData.total_score}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="finish_position">Finish Position</Label>
                        <Input
                          id="finish_position"
                          type="number"
                          min="1"
                          value={formData.finish_position || ''}
                          onChange={(e) => setFormData({ ...formData, finish_position: e.target.value ? parseInt(e.target.value) : undefined })}
                          placeholder="e.g., 5"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="field_size">Field Size</Label>
                        <Input
                          id="field_size"
                          type="number"
                          min="1"
                          value={formData.field_size || ''}
                          onChange={(e) => setFormData({ ...formData, field_size: e.target.value ? parseInt(e.target.value) : undefined })}
                          placeholder="e.g., 120"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Weather conditions, notable shots, lessons learned..."
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
                        {editingResult ? 'Update Result' : 'Add Result'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalTournaments}</p>
                  <p className="text-xs text-muted-foreground">Tournaments</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.averageScore || '-'}</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.wins}</p>
                  <p className="text-xs text-muted-foreground">Wins</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.topTenFinishes}</p>
                  <p className="text-xs text-muted-foreground">Top 10s</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Flag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.bestFinish || '-'}</p>
                  <p className="text-xs text-muted-foreground">Best Finish</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Table */}
          <Card>
            <CardHeader>
              <CardTitle>Tournament History</CardTitle>
              <CardDescription>
                Your competitive golf results - most recent first
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Results Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start tracking your tournament results to build your golf resume.
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Result
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Tournament</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-center">Score</TableHead>
                        <TableHead className="text-center">+/-</TableHead>
                        <TableHead className="text-center">Finish</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              {format(new Date(result.tournament_date), 'MMM d, yyyy')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{result.tournament_name}</p>
                              {result.course_name && (
                                <p className="text-sm text-muted-foreground">{result.course_name}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{getTypeLabel(result.tournament_type)}</Badge>
                          </TableCell>
                          <TableCell>
                            {result.location && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {result.location}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {result.round_scores?.length > 0 ? (
                              <div>
                                <p className="font-medium">{result.total_score}</p>
                                <p className="text-xs text-muted-foreground">
                                  ({result.round_scores.map(r => r.score).join('-')})
                                </p>
                              </div>
                            ) : result.total_score ? (
                              result.total_score
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            <span className={
                              result.relative_to_par !== null && result.relative_to_par < 0 
                                ? 'text-red-500' 
                                : result.relative_to_par !== null && result.relative_to_par > 0 
                                  ? 'text-foreground' 
                                  : ''
                            }>
                              {formatRelativeToPar(result.relative_to_par)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              {getPositionBadge(result.finish_position)}
                              {result.field_size && (
                                <span className="text-xs text-muted-foreground">
                                  of {result.field_size}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(result)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteResult(result.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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

export default TournamentLog;

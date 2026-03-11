import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, GraduationCap, Save } from 'lucide-react';
import { useWorksheetData } from '@/hooks/useWorksheetData';
import { Badge } from '@/components/ui/badge';

interface CourseEntry {
  id: string;
  courseName: string;
  credits: number;
  grade: string;
  transferStatus: 'accepted' | 'pending' | 'denied' | 'unknown';
  targetEquivalent: string;
  notes: string;
}

interface CreditAuditData {
  currentSchool: string;
  targetSchool: string;
  totalCreditsEarned: number;
  gpa: string;
  courses: CourseEntry[];
  eligibilityNotes: string;
  yearsUsed: number;
  yearsRemaining: number;
}

const defaultData: CreditAuditData = {
  currentSchool: '',
  targetSchool: '',
  totalCreditsEarned: 0,
  gpa: '',
  courses: [],
  eligibilityNotes: '',
  yearsUsed: 0,
  yearsRemaining: 4,
};

const GRADE_OPTIONS = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'W', 'P'];

export function CreditAuditWorksheet() {
  const { data: savedData, saveData, isSaving } = useWorksheetData('credit_audit');
  const [formData, setFormData] = useState<CreditAuditData>(defaultData);

  useEffect(() => {
    if (savedData) {
      setFormData({ ...defaultData, ...savedData as unknown as CreditAuditData });
    }
  }, [savedData]);

  const handleSave = () => {
    saveData(formData as any);
  };

  const addCourse = () => {
    setFormData(prev => ({
      ...prev,
      courses: [...prev.courses, {
        id: crypto.randomUUID(),
        courseName: '',
        credits: 3,
        grade: '',
        transferStatus: 'unknown',
        targetEquivalent: '',
        notes: '',
      }],
    }));
  };

  const updateCourse = (id: string, field: keyof CourseEntry, value: any) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.map(c => c.id === id ? { ...c, [field]: value } : c),
    }));
  };

  const removeCourse = (id: string) => {
    setFormData(prev => ({ ...prev, courses: prev.courses.filter(c => c.id !== id) }));
  };

  const acceptedCredits = formData.courses
    .filter(c => c.transferStatus === 'accepted')
    .reduce((sum, c) => sum + (c.credits || 0), 0);

  const pendingCredits = formData.courses
    .filter(c => c.transferStatus === 'pending' || c.transferStatus === 'unknown')
    .reduce((sum, c) => sum + (c.credits || 0), 0);

  const statusColor = (s: string) => {
    switch (s) {
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'denied': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Credit Transfer Audit
          </CardTitle>
          <CardDescription>
            Map your current coursework to target school requirements and track credit acceptance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* School Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Current School</Label>
              <Input value={formData.currentSchool} onChange={e => setFormData(f => ({ ...f, currentSchool: e.target.value }))} placeholder="Your current institution" />
            </div>
            <div>
              <Label>Target Transfer School</Label>
              <Input value={formData.targetSchool} onChange={e => setFormData(f => ({ ...f, targetSchool: e.target.value }))} placeholder="Where you want to transfer" />
            </div>
            <div>
              <Label>Current GPA</Label>
              <Input value={formData.gpa} onChange={e => setFormData(f => ({ ...f, gpa: e.target.value }))} placeholder="e.g. 3.5" />
            </div>
            <div>
              <Label>Total Credits Earned</Label>
              <Input type="number" value={formData.totalCreditsEarned || ''} onChange={e => setFormData(f => ({ ...f, totalCreditsEarned: Number(e.target.value) }))} />
            </div>
          </div>

          {/* Eligibility */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Years of Eligibility Used</Label>
              <Input type="number" value={formData.yearsUsed} onChange={e => setFormData(f => ({ ...f, yearsUsed: Number(e.target.value) }))} />
            </div>
            <div>
              <Label>Years Remaining</Label>
              <Input type="number" value={formData.yearsRemaining} onChange={e => setFormData(f => ({ ...f, yearsRemaining: Number(e.target.value) }))} />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-green-50 dark:bg-green-950 border-green-200">
              <CardContent className="pt-4 text-center">
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{acceptedCredits}</p>
                <p className="text-xs text-green-600 dark:text-green-400">Credits Accepted</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200">
              <CardContent className="pt-4 text-center">
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{pendingCredits}</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">Pending / Unknown</p>
              </CardContent>
            </Card>
            <Card className="bg-muted">
              <CardContent className="pt-4 text-center">
                <p className="text-2xl font-bold text-foreground">{formData.courses.length}</p>
                <p className="text-xs text-muted-foreground">Courses Tracked</p>
              </CardContent>
            </Card>
          </div>

          {/* Course List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-semibold">Course-by-Course Audit</Label>
              <Button size="sm" variant="outline" onClick={addCourse}>
                <Plus className="w-4 h-4 mr-1" /> Add Course
              </Button>
            </div>

            {formData.courses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Add courses to start tracking credit transfers</p>
            ) : (
              <div className="space-y-3">
                {formData.courses.map((course) => (
                  <Card key={course.id} className="border-border/50">
                    <CardContent className="pt-4">
                      <div className="grid md:grid-cols-6 gap-3 items-end">
                        <div className="md:col-span-2">
                          <Label className="text-xs">Course Name</Label>
                          <Input value={course.courseName} onChange={e => updateCourse(course.id, 'courseName', e.target.value)} placeholder="e.g. ENG 101" />
                        </div>
                        <div>
                          <Label className="text-xs">Credits</Label>
                          <Input type="number" value={course.credits} onChange={e => updateCourse(course.id, 'credits', Number(e.target.value))} />
                        </div>
                        <div>
                          <Label className="text-xs">Grade</Label>
                          <Select value={course.grade} onValueChange={v => updateCourse(course.id, 'grade', v)}>
                            <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                            <SelectContent>{GRADE_OPTIONS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Transfer Status</Label>
                          <Select value={course.transferStatus} onValueChange={v => updateCourse(course.id, 'transferStatus', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="denied">Denied</SelectItem>
                              <SelectItem value="unknown">Unknown</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end">
                          <Button variant="ghost" size="icon" onClick={() => removeCourse(course.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 mt-3">
                        <div>
                          <Label className="text-xs">Target School Equivalent</Label>
                          <Input value={course.targetEquivalent} onChange={e => updateCourse(course.id, 'targetEquivalent', e.target.value)} placeholder="Equivalent course at target school" />
                        </div>
                        <div>
                          <Label className="text-xs">Notes</Label>
                          <Input value={course.notes} onChange={e => updateCourse(course.id, 'notes', e.target.value)} placeholder="Any notes" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Eligibility Notes */}
          <div>
            <Label>Eligibility & Transfer Notes</Label>
            <Textarea
              value={formData.eligibilityNotes}
              onChange={e => setFormData(f => ({ ...f, eligibilityNotes: e.target.value }))}
              placeholder="NCAA/NAIA transfer rules, sit-out requirements, waiver notes..."
              rows={4}
            />
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="rounded-full">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Audit'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

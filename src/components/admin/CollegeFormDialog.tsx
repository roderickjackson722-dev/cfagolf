import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { College, Division, SchoolSize, TeamGender, DIVISIONS, SCHOOL_SIZES, TEAM_GENDERS, US_STATES } from '@/types/college';
import { CollegeLogoUpload } from './CollegeLogoUpload';
import { useUploadCollegeLogo } from '@/hooks/useAdminColleges';

interface CollegeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  college: College | null;
  onSubmit: (data: CollegeFormData) => void;
  isSubmitting: boolean;
}

export interface CollegeFormData {
  name: string;
  state: string;
  division: Division;
  conference: string | null;
  school_size: SchoolSize;
  team_gender: TeamGender;
  is_hbcu: boolean;
  golf_national_ranking: number | null;
  min_act_score: number | null;
  min_sat_score: number | null;
  number_of_students: number | null;
  out_of_state_cost: number | null;
  website_url: string | null;
  logo_url: string | null;
}

const defaultFormData: CollegeFormData = {
  name: '',
  state: '',
  division: 'D1',
  conference: null,
  school_size: 'Medium',
  team_gender: 'Both',
  is_hbcu: false,
  golf_national_ranking: null,
  min_act_score: null,
  min_sat_score: null,
  number_of_students: null,
  out_of_state_cost: null,
  website_url: null,
  logo_url: null,
};

export function CollegeFormDialog({
  open,
  onOpenChange,
  college,
  onSubmit,
  isSubmitting,
}: CollegeFormDialogProps) {
  const [formData, setFormData] = useState<CollegeFormData>(defaultFormData);
  const uploadLogo = useUploadCollegeLogo();

  useEffect(() => {
    if (college) {
      setFormData({
        name: college.name,
        state: college.state,
        division: college.division,
        conference: college.conference,
        school_size: college.school_size,
        team_gender: college.team_gender,
        is_hbcu: college.is_hbcu,
        golf_national_ranking: college.golf_national_ranking,
        min_act_score: college.min_act_score,
        min_sat_score: college.min_sat_score,
        number_of_students: college.number_of_students,
        out_of_state_cost: college.out_of_state_cost,
        website_url: college.website_url,
        logo_url: college.logo_url,
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [college, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleLogoUpload = async (file: File): Promise<string> => {
    const collegeId = college?.id || crypto.randomUUID();
    const url = await uploadLogo.mutateAsync({ file, collegeId });
    return url;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {college ? 'Edit College' : 'Add New College'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <CollegeLogoUpload
            currentLogoUrl={formData.logo_url}
            onUpload={handleLogoUpload}
            isUploading={uploadLogo.isPending}
            onLogoChange={(url) => setFormData({ ...formData, logo_url: url })}
          />

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">College Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="state">State *</Label>
              <Select
                value={formData.state}
                onValueChange={(value) => setFormData({ ...formData, state: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="division">Division *</Label>
              <Select
                value={formData.division}
                onValueChange={(value) => setFormData({ ...formData, division: value as Division })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  {DIVISIONS.map((div) => (
                    <SelectItem key={div} value={div}>
                      {div}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="conference">Conference</Label>
              <Input
                id="conference"
                value={formData.conference || ''}
                onChange={(e) => setFormData({ ...formData, conference: e.target.value || null })}
              />
            </div>

            <div>
              <Label htmlFor="school_size">School Size *</Label>
              <Select
                value={formData.school_size}
                onValueChange={(value) => setFormData({ ...formData, school_size: value as SchoolSize })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {SCHOOL_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="team_gender">Team Gender *</Label>
              <Select
                value={formData.team_gender}
                onValueChange={(value) => setFormData({ ...formData, team_gender: value as TeamGender })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_GENDERS.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="is_hbcu"
                checked={formData.is_hbcu}
                onCheckedChange={(checked) => setFormData({ ...formData, is_hbcu: !!checked })}
              />
              <Label htmlFor="is_hbcu">HBCU</Label>
            </div>
          </div>

          {/* Academic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="golf_national_ranking">Golf National Ranking</Label>
              <Input
                id="golf_national_ranking"
                type="number"
                value={formData.golf_national_ranking || ''}
                onChange={(e) => setFormData({ ...formData, golf_national_ranking: e.target.value ? parseInt(e.target.value) : null })}
              />
            </div>

            <div>
              <Label htmlFor="number_of_students">Number of Students</Label>
              <Input
                id="number_of_students"
                type="number"
                value={formData.number_of_students || ''}
                onChange={(e) => setFormData({ ...formData, number_of_students: e.target.value ? parseInt(e.target.value) : null })}
              />
            </div>

            <div>
              <Label htmlFor="min_act_score">Minimum ACT Score</Label>
              <Input
                id="min_act_score"
                type="number"
                value={formData.min_act_score || ''}
                onChange={(e) => setFormData({ ...formData, min_act_score: e.target.value ? parseInt(e.target.value) : null })}
              />
            </div>

            <div>
              <Label htmlFor="min_sat_score">Minimum SAT Score</Label>
              <Input
                id="min_sat_score"
                type="number"
                value={formData.min_sat_score || ''}
                onChange={(e) => setFormData({ ...formData, min_sat_score: e.target.value ? parseInt(e.target.value) : null })}
              />
            </div>

            <div>
              <Label htmlFor="out_of_state_cost">Out-of-State Cost ($)</Label>
              <Input
                id="out_of_state_cost"
                type="number"
                value={formData.out_of_state_cost || ''}
                onChange={(e) => setFormData({ ...formData, out_of_state_cost: e.target.value ? parseInt(e.target.value) : null })}
              />
            </div>

            <div>
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                type="url"
                value={formData.website_url || ''}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value || null })}
                placeholder="https://"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name || !formData.state}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                college ? 'Update College' : 'Add College'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

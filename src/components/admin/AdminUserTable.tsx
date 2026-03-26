import { useState, useEffect } from 'react';
import { Search, Edit, User, Check, X, Crown, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAllProfiles, useUpdateUserProfile, useDeleteUserProfile, UserProfile } from '@/hooks/useAdminUsers';
import { MeetingProgressTracker } from '@/components/admin/MeetingProgressTracker';
import { format } from 'date-fns';

export function AdminUserTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);
  const { data: profiles = [], isLoading } = useAllProfiles();
  const updateProfile = useUpdateUserProfile();
  const deleteProfile = useDeleteUserProfile();

  const filteredUsers = profiles.filter((profile) =>
    (profile.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (profile.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleTogglePaidAccess = (profile: UserProfile) => {
    updateProfile.mutate({
      id: profile.id,
      data: { has_paid_access: !profile.has_paid_access },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>{filteredUsers.length} users</span>
        <span>•</span>
        <span>{filteredUsers.filter(u => u.has_paid_access).length} paid members</span>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Graduation</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Paid Access</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    {profile.full_name || '—'}
                  </TableCell>
                  <TableCell>{profile.email || '—'}</TableCell>
                  <TableCell>{profile.graduation_year || '—'}</TableCell>
                  <TableCell>{profile.state || '—'}</TableCell>
                  <TableCell>
                    {(profile as any).program_type === 'consulting' ? (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-300">Consulting</Badge>
                    ) : (profile as any).program_type === 'digital' ? (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">Digital</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Free Signup</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={profile.has_paid_access || false}
                        onCheckedChange={() => handleTogglePaidAccess(profile)}
                      />
                      {profile.has_paid_access && (
                        <Badge className="bg-primary text-primary-foreground">
                          <Crown className="w-3 h-3 mr-1" />
                          Member
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(profile.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingUser(profile)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingUser(profile)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <UserDetailDialog
        user={editingUser}
        onClose={() => setEditingUser(null)}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the account for{' '}
              <span className="font-semibold">{deletingUser?.full_name || deletingUser?.email}</span>?
              This action cannot be undone and will remove all their data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingUser) {
                  deleteProfile.mutate(deletingUser.user_id, {
                    onSuccess: () => setDeletingUser(null),
                  });
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProfile.isPending ? 'Deleting...' : 'Delete User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function UserDetailDialog({ user, onClose }: { user: UserProfile | null; onClose: () => void }) {
  const updateProfile = useUpdateUserProfile();
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        state: user.state || '',
        graduation_year: user.graduation_year,
        handicap: user.handicap,
        high_school: user.high_school || '',
        club_team: user.club_team || '',
        home_course: user.home_course || '',
        goal_division: user.goal_division || '',
        has_paid_access: user.has_paid_access,
        program_type: (user as any).program_type || 'high_school',
      } as any);
    }
  }, [user]);

  if (!user) return null;

  const handleSave = () => {
    updateProfile.mutate(
      { id: user.id, data: formData },
      { onSuccess: () => onClose() }
    );
  };

  const updateField = (field: keyof UserProfile, value: string | number | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={!!user} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-y-auto h-[90vh]">
        <DialogHeader>
          <DialogTitle>Manage User: {user.full_name || user.email}</DialogTitle>
          <DialogDescription>View and manage profile, coaching sessions, notes, and action items.</DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="progress" className="w-full flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="progress">Coaching Workspace</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="col-span-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name || ''}
                  onChange={(e) => updateField('full_name', e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label htmlFor="graduation_year">Graduation Year</Label>
                <Input
                  id="graduation_year"
                  type="number"
                  value={formData.graduation_year || ''}
                  onChange={(e) => updateField('graduation_year', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="2026"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city || ''}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state || ''}
                  onChange={(e) => updateField('state', e.target.value)}
                  placeholder="State"
                />
              </div>
              <div>
                <Label htmlFor="handicap">Avg 18-Hole Score</Label>
                <Input
                  id="handicap"
                  type="number"
                  step="1"
                  value={formData.handicap ?? ''}
                  onChange={(e) => updateField('handicap', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="72"
                />
              </div>
              <div>
                <Label htmlFor="high_school">High School</Label>
                <Input
                  id="high_school"
                  value={formData.high_school || ''}
                  onChange={(e) => updateField('high_school', e.target.value)}
                  placeholder="High school name"
                />
              </div>
              <div>
                <Label htmlFor="club_team">Club Team</Label>
                <Input
                  id="club_team"
                  value={formData.club_team || ''}
                  onChange={(e) => updateField('club_team', e.target.value)}
                  placeholder="Club team name"
                />
              </div>
              <div>
                <Label htmlFor="home_course">Home Course</Label>
                <Input
                  id="home_course"
                  value={formData.home_course || ''}
                  onChange={(e) => updateField('home_course', e.target.value)}
                  placeholder="Home course"
                />
              </div>
              <div>
                <Label htmlFor="goal_division">Goal Division</Label>
                <Select
                  value={formData.goal_division || ''}
                  onValueChange={(value) => updateField('goal_division', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="D1">D1</SelectItem>
                    <SelectItem value="D2">D2</SelectItem>
                    <SelectItem value="D3">D3</SelectItem>
                    <SelectItem value="NAIA">NAIA</SelectItem>
                    <SelectItem value="JUCO">JUCO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label>Program Type</Label>
                  <p className="text-sm text-muted-foreground">
                    What the user signed up for
                  </p>
                </div>
                <Select
                  value={(formData as any).program_type || 'high_school'}
                  onValueChange={(value) => updateField('program_type' as any, value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_school">Free Signup</SelectItem>
                    <SelectItem value="digital">Digital Membership</SelectItem>
                    <SelectItem value="consulting">1-on-1 Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Paid Access Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.has_paid_access ? 'Active Member' : 'Free User'}
                  </p>
                </div>
                <Switch
                  checked={formData.has_paid_access || false}
                  onCheckedChange={(checked) => updateField('has_paid_access', checked)}
                />
              </div>
            </div>

            <div className="pt-4 border-t text-xs text-muted-foreground">
              <p>Created: {format(new Date(user.created_at), 'PPpp')}</p>
              <p>Updated: {format(new Date(user.updated_at), 'PPpp')}</p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updateProfile.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="progress" className="mt-4">
            <MeetingProgressTracker 
              userId={user.user_id} 
              userName={user.full_name || undefined}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

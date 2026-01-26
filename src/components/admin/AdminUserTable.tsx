import { useState } from 'react';
import { Search, Edit, User, Check, X, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAllProfiles, useUpdateUserProfile, UserProfile } from '@/hooks/useAdminUsers';
import { format } from 'date-fns';

export function AdminUserTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const { data: profiles = [], isLoading } = useAllProfiles();
  const updateProfile = useUpdateUserProfile();

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
              <TableHead>Paid Access</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingUser(profile)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
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
    </div>
  );
}

function UserDetailDialog({ user, onClose }: { user: UserProfile | null; onClose: () => void }) {
  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>User Profile Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback>
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{user.full_name || 'No name'}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <Label className="text-muted-foreground text-xs">Phone</Label>
              <p className="font-medium">{user.phone || '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Location</Label>
              <p className="font-medium">{user.city && user.state ? `${user.city}, ${user.state}` : user.state || '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Graduation Year</Label>
              <p className="font-medium">{user.graduation_year || '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Handicap</Label>
              <p className="font-medium">{user.handicap ?? '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">High School</Label>
              <p className="font-medium">{user.high_school || '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Club Team</Label>
              <p className="font-medium">{user.club_team || '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Home Course</Label>
              <p className="font-medium">{user.home_course || '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Goal Division</Label>
              <p className="font-medium">{user.goal_division || '—'}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-muted-foreground text-xs">Paid Access Status</Label>
                <p className="font-medium flex items-center gap-2">
                  {user.has_paid_access ? (
                    <>
                      <Check className="w-4 h-4 text-primary" />
                      Active Member
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-muted-foreground" />
                      Free User
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t text-xs text-muted-foreground">
            <p>Created: {format(new Date(user.created_at), 'PPpp')}</p>
            <p>Updated: {format(new Date(user.updated_at), 'PPpp')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

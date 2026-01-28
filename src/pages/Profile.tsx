import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  User, 
  Save, 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail,
  Target,
  Trophy,
  Users,
  ClipboardList,
  Loader2,
  Flag
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { useTargetSchools } from '@/hooks/useTargetSchools';
import { useCoachContacts } from '@/hooks/useCoachContacts';
import { useTournamentResults } from '@/hooks/useTournamentResults';
import { AvatarUpload } from '@/components/AvatarUpload';
import { MeetingProgressCard } from '@/components/profile/MeetingProgressCard';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const DIVISIONS = ['D1', 'D2', 'D3', 'NAIA', 'JUCO'];

const currentYear = new Date().getFullYear();
const graduationYears = Array.from({ length: 8 }, (_, i) => currentYear + i);

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  graduation_year: number | null;
  high_school: string;
  club_team: string;
  handicap: number | null;
  home_course: string;
  goal_division: string;
  avatar_url: string | null;
}

const Profile = () => {
  const { user, loading: authLoading, profile } = useAuth();
  const { targetSchools } = useTargetSchools();
  const { contacts, stats: coachStats } = useCoachContacts();
  const { results: tournamentResults, stats: tournamentStats } = useTournamentResults();
  
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    graduation_year: null,
    high_school: '',
    club_team: '',
    handicap: null,
    home_course: '',
    goal_division: '',
    avatar_url: null,
  });

  useEffect(() => {
    if (profile) {
      fetchFullProfile();
    }
  }, [profile]);

  const fetchFullProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setProfileData({
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        city: data.city || '',
        state: data.state || '',
        graduation_year: data.graduation_year,
        high_school: data.high_school || '',
        club_team: data.club_team || '',
        handicap: data.handicap,
        home_course: data.home_course || '',
        goal_division: data.goal_division || '',
        avatar_url: data.avatar_url || null,
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name || null,
          phone: profileData.phone || null,
          city: profileData.city || null,
          state: profileData.state || null,
          graduation_year: profileData.graduation_year,
          high_school: profileData.high_school || null,
          club_team: profileData.club_team || null,
          handicap: profileData.handicap,
          home_course: profileData.home_course || null,
          goal_division: profileData.goal_division || null,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Calculate progress metrics
  const profileFields = [
    profileData.full_name,
    profileData.phone,
    profileData.city,
    profileData.state,
    profileData.graduation_year,
    profileData.high_school,
    profileData.handicap,
    profileData.goal_division,
  ];
  const completedFields = profileFields.filter(f => f !== null && f !== '').length;
  const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

  const schoolsResearched = targetSchools.length;
  const schoolsGoal = 20;
  const schoolsProgress = Math.min(Math.round((schoolsResearched / schoolsGoal) * 100), 100);

  const coachContacts = contacts.length;
  const coachGoal = 10;
  const coachProgress = Math.min(Math.round((coachContacts / coachGoal) * 100), 100);

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
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <User className="w-8 h-8 text-primary" />
              My Profile
            </h1>
            <p className="text-muted-foreground">
              Complete your golfer profile to help coaches learn about you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Photo */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                  <CardDescription>
                    Upload a photo to personalize your profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <AvatarUpload
                    currentAvatarUrl={profileData.avatar_url}
                    onUploadComplete={(url) => setProfileData({ ...profileData, avatar_url: url || null })}
                    size="lg"
                  />
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Basic information about yourself
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="graduation_year">Graduation Year</Label>
                      <Select
                        value={profileData.graduation_year?.toString() || ''}
                        onValueChange={(value) => setProfileData({ ...profileData, graduation_year: value ? parseInt(value) : null })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {graduationYears.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        placeholder="Your city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select
                        value={profileData.state}
                        onValueChange={(value) => setProfileData({ ...profileData, state: value })}
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
                  </div>
                </CardContent>
              </Card>

              {/* Academic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Academic Information
                  </CardTitle>
                  <CardDescription>
                    Your school and academic details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="high_school">High School</Label>
                      <Input
                        id="high_school"
                        value={profileData.high_school}
                        onChange={(e) => setProfileData({ ...profileData, high_school: e.target.value })}
                        placeholder="Your high school name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="club_team">Club/Travel Team</Label>
                      <Input
                        id="club_team"
                        value={profileData.club_team}
                        onChange={(e) => setProfileData({ ...profileData, club_team: e.target.value })}
                        placeholder="e.g., AJGA, PGA Jr League"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Golf Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="w-5 h-5 text-primary" />
                    Golf Information
                  </CardTitle>
                  <CardDescription>
                    Your golf skills and goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="handicap">Handicap Index</Label>
                      <Input
                        id="handicap"
                        type="number"
                        step="0.1"
                        value={profileData.handicap ?? ''}
                        onChange={(e) => setProfileData({ ...profileData, handicap: e.target.value ? parseFloat(e.target.value) : null })}
                        placeholder="e.g., 2.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="home_course">Home Course</Label>
                      <Input
                        id="home_course"
                        value={profileData.home_course}
                        onChange={(e) => setProfileData({ ...profileData, home_course: e.target.value })}
                        placeholder="Your home golf course"
                      />
                    </div>
                    <div>
                      <Label htmlFor="goal_division">Goal Division</Label>
                      <Select
                        value={profileData.goal_division}
                        onValueChange={(value) => setProfileData({ ...profileData, goal_division: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select target division" />
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
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} size="lg">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Progress Sidebar */}
            <div className="space-y-6">
              {/* Coaching Progress */}
              <MeetingProgressCard />
              {/* Profile Completion */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Completion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${profileCompletion * 3.52} 352`}
                          className="text-primary transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-foreground">{profileCompletion}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {completedFields} of {profileFields.length} fields completed
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recruiting Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recruiting Progress</CardTitle>
                  <CardDescription>Track your recruiting journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Target Schools</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{schoolsResearched}/{schoolsGoal}</span>
                    </div>
                    <Progress value={schoolsProgress} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Coach Contacts</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{coachContacts}/{coachGoal}</span>
                    </div>
                    <Progress value={coachProgress} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Tournaments Logged</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{tournamentStats.totalTournaments}</span>
                    </div>
                  </div>

                  {coachStats.responseRate > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Response Rate</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{coachStats.responseRate}%</span>
                      </div>
                      <Progress value={coachStats.responseRate} className="h-2" />
                    </div>
                  )}

                  {tournamentStats.wins > 0 && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-primary">
                        <Trophy className="w-5 h-5" />
                        <span className="font-medium">{tournamentStats.wins} Tournament Win{tournamentStats.wins > 1 ? 's' : ''}!</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-foreground">
                        {profileData.handicap ?? '-'}
                      </p>
                      <p className="text-xs text-muted-foreground">Handicap</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-foreground">
                        {profileData.graduation_year || '-'}
                      </p>
                      <p className="text-xs text-muted-foreground">Grad Year</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-foreground">
                        {tournamentStats.averageScore || '-'}
                      </p>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-foreground">
                        {tournamentStats.topTenFinishes}
                      </p>
                      <p className="text-xs text-muted-foreground">Top 10s</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;

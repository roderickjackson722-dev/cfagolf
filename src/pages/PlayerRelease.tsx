import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { usePlayerRelease, PlayerReleaseData } from '@/hooks/usePlayerRelease';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, FileText, Shield, Camera, PenLine, Loader2 } from 'lucide-react';
import cfaLogo from '@/assets/cfa-logo-transparent.png';

const PlayerRelease = () => {
  const { user, loading, hasPaidAccess, profile } = useAuth();
  const { hasSubmittedRelease, isLoading: releaseLoading, submitRelease } = usePlayerRelease();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    date_of_birth: '',
    graduation_year: '',
    current_school: '',
    gpa: '',
    sat_score: '',
    act_score: '',
    golf_achievements: '',
    player_email: profile?.email || '',
    player_phone: '',
    parent_name: '',
    parent_relationship: '',
    parent_email: '',
    parent_phone: '',
    auth_athletic_profile: false,
    auth_academic_info: false,
    auth_personal_info: false,
    auth_direct_coach_contact: false,
    release_marketing: false,
    release_website_social: false,
    release_name_achievements: false,
    release_success_story: false,
    ack_not_agency: false,
    ack_no_guarantees: false,
    ack_flat_fee: false,
    ack_no_control_third_party: false,
    ack_can_withdraw: false,
    player_signature: '',
    player_signature_date: new Date().toISOString().split('T')[0],
    parent_signature: '',
    parent_signature_date: '',
  });

  const [submitting, setSubmitting] = useState(false);

  if (!loading && !user) return <Navigate to="/login" replace />;
  if (!loading && !releaseLoading && hasSubmittedRelease) return <Navigate to="/welcome" replace />;

  // Only consulting members need this form
  if (!loading && profile && profile.program_type !== 'consulting') {
    return <Navigate to="/welcome" replace />;
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const allAcknowledged = formData.ack_not_agency && formData.ack_no_guarantees && formData.ack_flat_fee && formData.ack_no_control_third_party && formData.ack_can_withdraw;
  const allAuthorized = formData.auth_athletic_profile && formData.auth_academic_info && formData.auth_personal_info && formData.auth_direct_coach_contact;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allAuthorized) {
      toast({ title: 'Authorization Required', description: 'Please authorize all items in Section 3 to proceed.', variant: 'destructive' });
      return;
    }
    if (!allAcknowledged) {
      toast({ title: 'Acknowledgment Required', description: 'Please check all acknowledgment boxes in Section 5.', variant: 'destructive' });
      return;
    }
    if (!formData.player_signature.trim()) {
      toast({ title: 'Signature Required', description: 'Please type your full name as your legal signature.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const releaseData: PlayerReleaseData = {
        ...formData,
        graduation_year: parseInt(formData.graduation_year),
        sat_score: formData.sat_score || undefined,
        act_score: formData.act_score || undefined,
        parent_name: formData.parent_name || undefined,
        parent_relationship: formData.parent_relationship || undefined,
        parent_email: formData.parent_email || undefined,
        parent_phone: formData.parent_phone || undefined,
        parent_signature: formData.parent_signature || undefined,
        parent_signature_date: formData.parent_signature_date || undefined,
      };
      await submitRelease.mutateAsync(releaseData);
      toast({ title: 'Form Submitted!', description: 'Your Player Profile Release has been submitted. A team member will be in touch within 2-3 business days.' });
      navigate('/welcome');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to submit form.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 md:py-12">
        <div className="container max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8 space-y-4">
            <img src={cfaLogo} alt="CFA" className="h-24 w-auto mx-auto object-contain" />
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Player Profile Release & Consent Form
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              This form must be completed before College Fairway Advisors can share any information with college coaches or recruiting personnel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Player Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Section 1: Player Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input required value={formData.full_name} onChange={e => updateField('full_name', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth *</Label>
                    <Input type="date" required value={formData.date_of_birth} onChange={e => updateField('date_of_birth', e.target.value)} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Graduation Year *</Label>
                    <Select required value={formData.graduation_year} onValueChange={v => updateField('graduation_year', v)}>
                      <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {[2025, 2026, 2027, 2028, 2029, 2030].map(y => (
                          <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Current School *</Label>
                    <Input required value={formData.current_school} onChange={e => updateField('current_school', e.target.value)} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>GPA *</Label>
                    <Input required value={formData.gpa} onChange={e => updateField('gpa', e.target.value)} placeholder="e.g. 3.5" />
                  </div>
                  <div className="space-y-2">
                    <Label>SAT Score</Label>
                    <Input value={formData.sat_score} onChange={e => updateField('sat_score', e.target.value)} placeholder="Optional" />
                  </div>
                  <div className="space-y-2">
                    <Label>ACT Score</Label>
                    <Input value={formData.act_score} onChange={e => updateField('act_score', e.target.value)} placeholder="Optional" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Primary Golf Achievements *</Label>
                  <Textarea required value={formData.golf_achievements} onChange={e => updateField('golf_achievements', e.target.value)} placeholder="Tournament wins, scoring average, rankings, etc." rows={4} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Player Email *</Label>
                    <Input type="email" required value={formData.player_email} onChange={e => updateField('player_email', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Player Phone *</Label>
                    <Input type="tel" required value={formData.player_phone} onChange={e => updateField('player_phone', e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Parent/Guardian Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Section 2: Parent/Guardian Information
                </CardTitle>
                <CardDescription>Required if player is under 18</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Parent/Guardian Name</Label>
                    <Input value={formData.parent_name} onChange={e => updateField('parent_name', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship to Player</Label>
                    <Input value={formData.parent_relationship} onChange={e => updateField('parent_relationship', e.target.value)} placeholder="e.g. Father, Mother, Guardian" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Parent/Guardian Email</Label>
                    <Input type="email" value={formData.parent_email} onChange={e => updateField('parent_email', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Parent/Guardian Phone</Label>
                    <Input type="tel" value={formData.parent_phone} onChange={e => updateField('parent_phone', e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Authorization to Share Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Section 3: Authorization to Share Information
                </CardTitle>
                <CardDescription>All authorizations are required to proceed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { field: 'auth_athletic_profile', label: 'Athletic Profile Information', desc: 'I authorize CFA to share my/our child\'s athletic profile, including tournament results, scoring averages, swing videos, and golf achievements.' },
                  { field: 'auth_academic_info', label: 'Academic Information', desc: 'I authorize CFA to share my/our child\'s academic information, including GPA, test scores, NCAA Eligibility status, and intended major.' },
                  { field: 'auth_personal_info', label: 'Personal Information', desc: 'I authorize CFA to share my/our child\'s name, graduation year, photos, videos, and contact information with college coaches.' },
                  { field: 'auth_direct_coach_contact', label: 'Direct Coach Contact', desc: 'I authorize CFA to contact college coaches directly on behalf of my/our child to introduce them, share their profile, and advocate for recruiting opportunities.' },
                ].map(item => (
                  <div key={item.field} className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30">
                    <Switch
                      checked={formData[item.field as keyof typeof formData] as boolean}
                      onCheckedChange={v => updateField(item.field, v)}
                    />
                    <div>
                      <p className="font-medium text-sm">{item.label} *</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Section 4: Photo/Video Release */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Section 4: Photo/Video Release (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { field: 'release_marketing', label: 'I grant permission for CFA to use my/our child\'s photo/video in CFA marketing materials.' },
                  { field: 'release_website_social', label: 'I grant permission for CFA to use my/our child\'s photo/video on the CFA website and social media.' },
                  { field: 'release_name_achievements', label: 'I grant permission for CFA to use my/our child\'s name and achievements in promotional content.' },
                  { field: 'release_success_story', label: 'I grant permission for CFA to share my/our child\'s success story (with commitment details) after they sign.' },
                ].map(item => (
                  <div key={item.field} className="flex items-start gap-3 p-3 rounded-lg border">
                    <Switch
                      checked={formData[item.field as keyof typeof formData] as boolean}
                      onCheckedChange={v => updateField(item.field, v)}
                    />
                    <p className="text-sm">{item.label}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Section 5: Acknowledgment and Understanding */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Section 5: Acknowledgment and Understanding
                </CardTitle>
                <CardDescription>All items must be checked to proceed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm font-medium text-foreground">I/we acknowledge and understand that:</p>
                {[
                  { field: 'ack_not_agency', label: 'College Fairway Advisors is a recruiting consultancy service, NOT a sports agency, and does NOT represent players in contract negotiations.' },
                  { field: 'ack_no_guarantees', label: 'College Fairway Advisors does NOT guarantee scholarships, roster spots, or admission to any college or university.' },
                  { field: 'ack_flat_fee', label: 'College Fairway Advisors charges a flat fee for services and does NOT take a percentage of any scholarship or financial aid.' },
                  { field: 'ack_no_control_third_party', label: 'Once information is shared with college coaches, CFA has no control over how that information is used by third parties.' },
                  { field: 'ack_can_withdraw', label: 'I/we may withdraw this consent at any time by providing written notice to CFA.' },
                ].map(item => (
                  <div key={item.field} className="flex items-start gap-3">
                    <Checkbox
                      checked={formData[item.field as keyof typeof formData] as boolean}
                      onCheckedChange={v => updateField(item.field, !!v)}
                      className="mt-0.5"
                    />
                    <p className="text-sm">{item.label}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Section 6: Signatures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenLine className="w-5 h-5 text-primary" />
                  Section 6: Signatures
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Player Signature *</Label>
                    <Input required value={formData.player_signature} onChange={e => updateField('player_signature', e.target.value)} placeholder="Type full name as legal signature" className="font-serif italic" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input type="date" required value={formData.player_signature_date} onChange={e => updateField('player_signature_date', e.target.value)} />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">Parent/Guardian Signature (required if player is under 18)</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Parent/Guardian Signature</Label>
                      <Input value={formData.parent_signature} onChange={e => updateField('parent_signature', e.target.value)} placeholder="Type full name as legal signature" className="font-serif italic" />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" value={formData.parent_signature_date} onChange={e => updateField('parent_signature_date', e.target.value)} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={submitting || !allAcknowledged || !allAuthorized}>
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Player Profile Release'
              )}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlayerRelease;

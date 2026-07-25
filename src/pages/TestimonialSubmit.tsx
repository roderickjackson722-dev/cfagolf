import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Send, Star, Lightbulb, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import cfaLogo from '@/assets/cfa-logo-transparent.png';

const GRADES = ['9th', '10th', '11th', '12th', 'College'];

const DEFAULT_GUIDE = {
  intro_heading: "Not sure what to say? Here's a quick guide",
  intro_body: 'Share what feels most authentic. A few sentences from the heart mean more than a polished script.',
  guide_points: [] as string[],
  privacy_note: 'For privacy, please use FIRST NAMES ONLY. Never share last names, school names, or coach names.',
};

export default function TestimonialSubmit() {
  const [form, setForm] = useState({
    biggest_challenge: '',
    how_helped: '',
    what_valued_most: '',
    how_journey_changed: '',
    advice_to_others: '',
    additional_comments: '',
    share_first_name: '',
    share_grade_level: '',
    share_location: '',
    video_url: '',
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [shareName, setShareName] = useState(false);
  const [shareGrade, setShareGrade] = useState(false);
  const [shareLoc, setShareLoc] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [guide, setGuide] = useState(DEFAULT_GUIDE);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('testimonial_prompt_settings')
        .select('intro_heading, intro_body, guide_points, privacy_note')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) setGuide({
        intro_heading: data.intro_heading,
        intro_body: data.intro_body,
        guide_points: Array.isArray(data.guide_points) ? (data.guide_points as string[]) : [],
        privacy_note: data.privacy_note,
      });
    })();
  }, []);

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasAnswer =
      form.biggest_challenge || form.how_helped || form.what_valued_most ||
      form.how_journey_changed || form.advice_to_others || form.additional_comments;
    if (!hasAnswer && !form.video_url && !videoFile) {
      toast.error('Please answer at least one question or share a video.');
      return;
    }
    setSubmitting(true);
    try {
      let video_file_path: string | null = null;
      if (videoFile) {
        if (videoFile.size > 200 * 1024 * 1024) {
          toast.error('Video must be under 200 MB.');
          setSubmitting(false);
          return;
        }
        const ext = videoFile.name.split('.').pop() || 'mp4';
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('testimonial-videos')
          .upload(path, videoFile, { contentType: videoFile.type });
        if (upErr) throw upErr;
        video_file_path = path;
      }

      let image_url: string | null = null;
      if (imageFile) {
        if (imageFile.size > 10 * 1024 * 1024) {
          toast.error('Image must be under 10 MB.');
          setSubmitting(false);
          return;
        }
        const ext = imageFile.name.split('.').pop() || 'jpg';
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('testimonial-images')
          .upload(path, imageFile, { contentType: imageFile.type });
        if (upErr) throw upErr;
        image_url = path;
      }
        const { error: upErr } = await supabase.storage
          .from('testimonial-videos')
          .upload(path, videoFile, { contentType: videoFile.type });
        if (upErr) throw upErr;
        video_file_path = path;
      }

      const payload = {
        ...form,
        share_first_name: shareName ? form.share_first_name.trim().slice(0, 50) : '',
        share_grade_level: shareGrade ? form.share_grade_level : '',
        share_location: shareLoc ? form.share_location.trim().slice(0, 100) : '',
        is_anonymous: !shareName && !shareGrade && !shareLoc,
        video_file_path,
      };

      const { error } = await supabase.functions.invoke('submit-testimonial', { body: payload });
      if (error) throw error;
      setSubmitted(true);
      toast.success('Thank you for sharing your story!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-10">
          <img src={cfaLogo} alt="CFA" className="h-24 w-auto object-contain mx-auto mb-4" />
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Thank you for sharing your <span className="text-primary">experience!</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Your story helps other families navigate their recruiting journey with confidence.
            We will never share your name publicly — unless you give us permission. Your honest
            feedback is what matters most.
          </p>
        </div>

        {submitted ? (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-10 pb-10 text-center">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">Thank you!</h2>
              <p className="text-muted-foreground text-lg">
                Your feedback helps other families find clarity and confidence in their recruiting journey.
              </p>
              <div className="flex gap-1 justify-center mt-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-cfa-gold text-cfa-gold" />)}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6 border-primary/30 bg-primary/5">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-display text-lg font-bold mb-1">{guide.intro_heading}</h2>
                    <p className="text-sm text-muted-foreground">{guide.intro_body}</p>
                  </div>
                </div>
                {guide.guide_points.length > 0 && (
                  <ul className="list-disc pl-8 space-y-1.5 text-sm">
                    {guide.guide_points.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                )}
                <div className="flex items-start gap-3 rounded-md border border-cfa-gold/40 bg-cfa-gold/10 p-3">
                  <Shield className="w-4 h-4 text-cfa-gold shrink-0 mt-0.5" />
                  <p className="text-xs font-medium">{guide.privacy_note}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  ['biggest_challenge', 'What was your biggest challenge before working with College Fairway Advisors?'],
                  ['how_helped', 'How did College Fairway Advisors help you overcome that challenge?'],
                  ['what_valued_most', 'What did you value most about the experience?'],
                  ['how_journey_changed', "How has your child's recruiting journey changed since working with us?"],
                  ['advice_to_others', 'What would you say to a parent or student-athlete who is just starting the recruiting process?'],
                  ['additional_comments', "Is there anything else you'd like to share?"],
                ].map(([key, label]) => (
                  <div className="space-y-2" key={key}>
                    <Label htmlFor={key}>{label}</Label>
                    <Textarea
                      id={key}
                      rows={3}
                      maxLength={2000}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => set(key as keyof typeof form, e.target.value)}
                      className="resize-none"
                    />
                  </div>
                ))}

                <div className="space-y-3 rounded-lg border p-4">
                  <h3 className="font-semibold">Video Testimonial (Optional)</h3>
                  <div className="space-y-2">
                    <Label htmlFor="video_file">Upload a video (MP4, MOV, WebM — under 200MB)</Label>
                    <Input
                      id="video_file"
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video_url">…or paste a link (YouTube, Vimeo, Google Drive)</Label>
                    <Input
                      id="video_url"
                      placeholder="https://…"
                      value={form.video_url}
                      onChange={(e) => set('video_url', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border p-4">
                  <h3 className="font-semibold">Optional — Share what you're comfortable with</h3>
                  <p className="text-xs text-muted-foreground">
                    If you leave everything unchecked, your testimonial stays fully anonymous.
                  </p>

                  <div className="flex items-start gap-3">
                    <Checkbox id="sn" checked={shareName} onCheckedChange={(v) => setShareName(!!v)} />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="sn" className="cursor-pointer">Yes, share my first name</Label>
                      {shareName && (
                        <Input
                          placeholder="First name only"
                          value={form.share_first_name}
                          onChange={(e) => set('share_first_name', e.target.value)}
                          maxLength={50}
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox id="sg" checked={shareGrade} onCheckedChange={(v) => setShareGrade(!!v)} />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="sg" className="cursor-pointer">Yes, share grade level</Label>
                      {shareGrade && (
                        <div className="flex flex-wrap gap-2">
                          {GRADES.map((g) => (
                            <button
                              type="button"
                              key={g}
                              onClick={() => set('share_grade_level', g)}
                              className={`px-3 py-1 rounded-full text-sm border ${form.share_grade_level === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-background'}`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox id="sl" checked={shareLoc} onCheckedChange={(v) => setShareLoc(!!v)} />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="sl" className="cursor-pointer">Yes, share location</Label>
                      {shareLoc && (
                        <Input
                          placeholder="e.g., Atlanta, GA"
                          value={form.share_location}
                          onChange={(e) => set('share_location', e.target.value)}
                          maxLength={100}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full rounded-full" disabled={submitting}>
                  {submitting ? 'Submitting…' : (<><Send className="w-4 h-4 mr-2" /> Submit Testimonial</>)}
                </Button>
              </form>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

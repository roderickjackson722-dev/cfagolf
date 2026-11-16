import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Check, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import {
  GUIDANCE_CALLS_WITH_ROD,
  GUIDANCE_PROGRAM_PRICE,
  guidanceApplicationSchema,
  type GuidanceApplicationValues,
} from '@/lib/guidanceApplication';

const included = [
  'Review of the player profile, grade level, GPA, scoring average, and swing video',
  'Tailored HBCU target list, built for that player',
  'Player resume template, email templates, and DM templates',
  'Coach outreach plan and follow up schedule',
  `${GUIDANCE_CALLS_WITH_ROD} one on one calls with Rod`,
  'Reply coaching, visit prep, and offer and scholarship conversation guidance',
  'Academic and eligibility check',
];

type ApplicationValues = GuidanceApplicationValues;
type ApplicationField = keyof ApplicationValues;

const initialValues: ApplicationValues = {
  playerName: '',
  gradeLevel: '',
  gpa: '',
  scoringAverage: '',
  swingVideoLink: '',
  parentName: '',
  parentEmail: '',
  parentPhone: '',
};

const fields: Array<{
  name: ApplicationField;
  label: string;
  placeholder: string;
  type?: string;
  inputMode?: 'text' | 'decimal' | 'email' | 'tel' | 'url';
  autoComplete?: string;
}> = [
  { name: 'playerName', label: 'Player name', placeholder: 'Player name', autoComplete: 'off' },
  { name: 'gradeLevel', label: 'Grade level', placeholder: 'e.g. 11th grade' },
  { name: 'gpa', label: 'GPA', placeholder: 'e.g. 3.8', inputMode: 'decimal' },
  { name: 'scoringAverage', label: 'Scoring average', placeholder: 'e.g. 78', inputMode: 'decimal' },
  { name: 'swingVideoLink', label: 'Swing video link', placeholder: 'https://...', type: 'url', inputMode: 'url' },
  { name: 'parentName', label: 'Parent or guardian name', placeholder: 'Parent or guardian name', autoComplete: 'name' },
  { name: 'parentEmail', label: 'Parent or guardian email', placeholder: 'you@example.com', type: 'email', inputMode: 'email', autoComplete: 'email' },
  { name: 'parentPhone', label: 'Parent or guardian phone', placeholder: '(555) 555-5555', type: 'tel', inputMode: 'tel', autoComplete: 'tel' },
];

export function CTASection() {
  const [values, setValues] = useState<ApplicationValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name as ApplicationField;
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setSubmitError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = guidanceApplicationSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === 'string' && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('submit-guidance-application', {
        body: result.data,
      });
      if (error || !data?.success) {
        throw new Error('Application submission failed');
      }
      setSubmitted(true);
    } catch {
      setSubmitError('We could not submit your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="application" className="scroll-mt-20 bg-background py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-card">
          <div className="border-b border-border/70 px-6 py-8 text-center sm:px-10 sm:py-10">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">1 on 1 Guidance</h2>
            <p className="mt-5 font-display text-4xl font-bold text-primary sm:text-5xl">
              ${GUIDANCE_PROGRAM_PRICE} <span className="font-sans text-lg font-medium text-muted-foreground sm:text-xl">one time</span>
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              One time program for one player. Apply first. Rod reviews the player before accepting a family, and payment is only taken after the player is accepted.
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <h3 className="font-display text-xl font-semibold text-foreground">What is included</h3>
            <ul className="mt-5 space-y-4">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-foreground">
                  <Check aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-border/70 pt-7">
              <h3 className="font-display text-xl font-semibold text-foreground">What is not included</h3>
              <div className="mt-4 flex items-start gap-3 text-base leading-relaxed text-muted-foreground">
                <X aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-destructive" />
                <p>No guarantee of an offer, a roster spot, or a scholarship. That decision is always up to the coach.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-3xl md:mt-20">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Apply for 1 on 1 Guidance</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Tell us about your player. Rod reviews every application and only takes players he believes he can guide well.
            </p>
          </div>

          {submitted ? (
            <div role="status" className="mt-8 rounded-2xl border border-primary/25 bg-secondary/60 p-8 text-center sm:p-10">
              <p className="text-lg font-medium leading-relaxed text-foreground">
                Thank you. Rod will reach out within the next 24 to 48 hours regarding your free fit conversation.
              </p>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} className="mt-8">
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                {fields.map((field) => {
                  const inputId = `application-${field.name}`;
                  const errorId = `${inputId}-error`;
                  return (
                    <div key={field.name} className={field.name === 'parentPhone' ? 'sm:col-span-2' : ''}>
                      <Label htmlFor={inputId}>{field.label}</Label>
                      <Input
                        id={inputId}
                        name={field.name}
                        type={field.type ?? 'text'}
                        inputMode={field.inputMode}
                        autoComplete={field.autoComplete}
                        placeholder={field.placeholder}
                        value={values[field.name]}
                        onChange={handleChange}
                        required
                        aria-invalid={Boolean(errors[field.name])}
                        aria-describedby={errors[field.name] ? errorId : undefined}
                        className="mt-2"
                      />
                      {errors[field.name] && (
                        <p id={errorId} className="mt-2 text-sm text-destructive">
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              {submitError && (
                <p role="alert" className="mt-6 text-center text-sm text-destructive">{submitError}</p>
              )}
              <div className="mt-8 text-center">
                <Button type="submit" size="lg" disabled={isSubmitting} className="h-14 w-full rounded-full px-8 text-base font-semibold shadow-lg sm:w-auto sm:text-lg">
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  <Send aria-hidden="true" className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

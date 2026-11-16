import { useState, type FormEvent } from 'react';
import { Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { buildContactUsMailto, CFA_CONTACT_EMAIL, type ContactUsValues } from '@/lib/contactUs';

export function ContactUsForm() {
  const [preparedEmailLink, setPreparedEmailLink] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: ContactUsValues = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      studentName: String(formData.get('studentName') ?? ''),
      questions: String(formData.get('questions') ?? ''),
    };
    const mailtoLink = buildContactUsMailto(values);
    setPreparedEmailLink(mailtoLink);
    window.location.href = mailtoLink;
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">Contact Us</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Have a question about your player&apos;s college golf recruiting journey? Tell Rod who you are, your student&apos;s name, and how he can help.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Submitting opens your email app with a message ready to send to Rod.
        </p>
      </div>

      <form className="mt-8 space-y-5 text-left" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="contact-name">Your name</Label>
            <Input id="contact-name" name="name" autoComplete="name" maxLength={100} required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="contact-student-name">Student name</Label>
            <Input id="contact-student-name" name="studentName" autoComplete="off" maxLength={100} required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="contact-email">Email address</Label>
            <Input id="contact-email" name="email" type="email" inputMode="email" autoComplete="email" maxLength={255} required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="contact-phone">Phone number</Label>
            <Input id="contact-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={25} required className="mt-2" />
          </div>
        </div>
        <div>
          <Label htmlFor="contact-questions">Questions</Label>
          <Textarea
            id="contact-questions"
            name="questions"
            placeholder="What would you like to ask Rod about your student's recruiting journey?"
            rows={6}
            maxLength={2000}
            required
            className="mt-2"
          />
        </div>

        {preparedEmailLink && (
          <div role="status" className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-foreground">
            Your email app should now be open. Select Send there to deliver your message to Rod. If it did not open,{' '}
            <a href={preparedEmailLink} className="font-medium text-primary underline">open the prepared email again</a>
            {' '}or email <a href={`mailto:${CFA_CONTACT_EMAIL}`} className="font-medium text-primary underline">{CFA_CONTACT_EMAIL}</a>.
          </div>
        )}

        <div className="text-center">
          <Button type="submit" size="lg" className="h-12 rounded-full px-8">
            <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
            Contact Us
            <Send className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </form>
    </div>
  );
}

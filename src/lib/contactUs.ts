export const CFA_CONTACT_EMAIL = 'collegefairwayadvisors@gmail.com';

export type ContactUsValues = {
  name: string;
  email: string;
  phone: string;
  studentName: string;
  questions: string;
};

export function buildContactUsMailto(values: ContactUsValues) {
  const subject = `CFA Contact Us — ${values.studentName.trim()}`;
  const body = [
    `Name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    `Phone: ${values.phone.trim()}`,
    `Student name: ${values.studentName.trim()}`,
    '',
    'Questions:',
    values.questions.trim(),
  ].join('\n');

  return `mailto:${CFA_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

import { describe, expect, it } from 'vitest';
import { buildContactUsMailto, CFA_CONTACT_EMAIL } from './contactUs';

describe('Contact Us email', () => {
  it('prepares the family details and questions for Rod’s current email address', () => {
    const link = buildContactUsMailto({
      name: 'Pat Parent',
      email: 'pat@example.com',
      phone: '(555) 555-5555',
      studentName: 'Sam Student',
      questions: 'Which HBCU programs fit Sam?',
    });

    expect(CFA_CONTACT_EMAIL).toBe('collegefairwayadvisors@gmail.com');
    expect(link.startsWith(`mailto:${CFA_CONTACT_EMAIL}?`)).toBe(true);
    const decoded = decodeURIComponent(link);
    expect(decoded).toContain('Name: Pat Parent');
    expect(decoded).toContain('Email: pat@example.com');
    expect(decoded).toContain('Phone: (555) 555-5555');
    expect(decoded).toContain('Student name: Sam Student');
    expect(decoded).toContain('Which HBCU programs fit Sam?');
  });
});

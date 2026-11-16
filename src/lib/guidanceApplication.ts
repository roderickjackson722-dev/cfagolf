import { z } from 'zod';

export const GUIDANCE_PROGRAM_PRICE = 699;
export const GUIDANCE_CALLS_WITH_ROD = 6;

const httpLink = (label: string) =>
  z.string()
    .trim()
    .min(1, `Enter the ${label}`)
    .max(500, 'Keep the link under 500 characters')
    .url('Enter a valid link, including https://')
    .refine((value) => {
      try {
        const url = new URL(value);
        return url.protocol === 'https:' || url.protocol === 'http:';
      } catch {
        return false;
      }
    }, 'Enter a valid http or https link');

const numericText = (label: string, maximum: number) =>
  z.string()
    .trim()
    .min(1, `Enter the ${label}`)
    .max(10, `Enter a valid ${label}`)
    .regex(/^\d+(\.\d{1,2})?$/, `Enter a valid ${label}`)
    .refine((value) => Number(value) >= 0 && Number(value) <= maximum, `${label} must be between 0 and ${maximum}`);

export const guidanceApplicationSchema = z.object({
  playerName: z.string().trim().min(1, 'Enter the player name').max(100, 'Keep the player name under 100 characters'),
  gradeLevel: z.string().trim().min(1, 'Enter the grade level').max(30, 'Keep the grade level under 30 characters'),
  gpa: numericText('GPA', 10),
  scoringAverage: numericText('scoring average', 200),
  profileLink: httpLink('HBCU.GOLF profile link'),
  swingVideoLink: httpLink('swing video link'),
  parentName: z.string().trim().min(1, 'Enter the parent or guardian name').max(100, 'Keep the name under 100 characters'),
  parentEmail: z.string().trim().min(1, 'Enter the parent or guardian email').max(255, 'Keep the email under 255 characters').email('Enter a valid email address'),
  parentPhone: z.string().trim().min(7, 'Enter a valid phone number').max(25, 'Enter a valid phone number').regex(/^[0-9+().\-\s]+$/, 'Enter a valid phone number'),
});

export type GuidanceApplicationValues = z.infer<typeof guidanceApplicationSchema>;

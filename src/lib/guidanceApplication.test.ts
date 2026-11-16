import { describe, expect, it } from 'vitest';
import {
  GUIDANCE_CALLS_WITH_ROD,
  GUIDANCE_PROGRAM_PRICE,
  guidanceApplicationSchema,
  type GuidanceApplicationValues,
} from './guidanceApplication';

const validApplication: GuidanceApplicationValues = {
  playerName: 'Test Player',
  gradeLevel: '11',
  gpa: '3.8',
  scoringAverage: '78',
  profileLink: 'https://hbcu.golf/player/test',
  swingVideoLink: 'https://youtube.com/watch?v=test',
  parentName: 'Test Parent',
  parentEmail: 'parent@example.com',
  parentPhone: '(555) 555-5555',
};

describe('guidance program rules', () => {
  it('keeps the one-time guidance price at $699', () => {
    expect(GUIDANCE_PROGRAM_PRICE).toBe(699);
  });

  it('includes six one-on-one calls with Rod', () => {
    expect(GUIDANCE_CALLS_WITH_ROD).toBe(6);
  });

  it('requires both parent email and phone', () => {
    expect(guidanceApplicationSchema.safeParse({ ...validApplication, parentEmail: '' }).success).toBe(false);
    expect(guidanceApplicationSchema.safeParse({ ...validApplication, parentPhone: '' }).success).toBe(false);
  });

  it('accepts only http or https player links', () => {
    expect(guidanceApplicationSchema.safeParse({ ...validApplication, profileLink: 'javascript:alert(1)' }).success).toBe(false);
    expect(guidanceApplicationSchema.safeParse({ ...validApplication, swingVideoLink: 'javascript:alert(1)' }).success).toBe(false);
    expect(guidanceApplicationSchema.safeParse(validApplication).success).toBe(true);
  });
});

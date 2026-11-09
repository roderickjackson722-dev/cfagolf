import { describe, expect, it } from 'vitest';
import { PROGRAMS } from '../../supabase/functions/create-membership-checkout/programs';

describe('Consulting original pricing', () => {
  it('charges the original $3,499 one-time consulting price', () => {
    expect(PROGRAMS.consulting.amount).toBe(349900);
    expect(PROGRAMS.consulting.mode).toBe('payment');
  });
});
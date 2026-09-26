import { supabase } from '@/integrations/supabase/client';
import { slugify } from '@/hooks/usePlayers';

export async function fetchProfileByUserId(userId: string) {
  const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle();
  return data as any;
}

/** Map member profile fields into player website fields. */
export function profileToPlayerFields(p: any) {
  return {
    full_name: p?.full_name || null,
    graduation_year: p?.graduation_year ?? null,
    handicap: p?.handicap ?? null,
    high_school: p?.high_school || null,
    home_course: p?.home_course || null,
    contact_email: p?.email || null,
    profile_photo_url: p?.avatar_url || null,
  } as Record<string, any>;
}

/** Fill only empty fields on a player form with profile data. */
export function mergeProfileIntoPlayer<T extends Record<string, any>>(form: T, profile: any): T {
  const fields = profileToPlayerFields(profile);
  const next: Record<string, any> = { ...form };
  for (const [k, v] of Object.entries(fields)) {
    if ((next[k] === null || next[k] === undefined || next[k] === '') && v !== null) next[k] = v;
  }
  return next as T;
}

async function uniqueSlug(base: string) {
  let slug = base || `player-${Date.now()}`;
  for (let i = 2; i < 50; i++) {
    const { data } = await supabase.from('players').select('id').eq('slug', slug).maybeSingle();
    if (!data) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

/** Find the member's player site, or create one pre-filled from their profile. Returns player id. */
export async function getOrCreateMemberSite(profile: any): Promise<string> {
  const { data: existing } = await supabase.from('players').select('id').eq('user_id', profile.user_id).maybeSingle();
  if (existing) return existing.id;
  const name = profile.full_name || profile.email?.split('@')[0] || 'Player';
  const slug = await uniqueSlug(slugify(name));
  const { data, error } = await supabase
    .from('players')
    .insert({
      ...profileToPlayerFields(profile),
      full_name: name,
      slug,
      user_id: profile.user_id,
      is_active: false,
      allow_editing: true,
    } as any)
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

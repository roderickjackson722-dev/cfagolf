import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3.25.76';

const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' };

const httpLink = (label: string) =>
  z.string()
    .trim()
    .min(1, `Enter the ${label}`)
    .max(500)
    .url()
    .refine((value) => {
      try {
        const url = new URL(value);
        return url.protocol === 'https:' || url.protocol === 'http:';
      } catch {
        return false;
      }
    }, 'Enter a valid http or https link');

const numericText = (maximum: number) =>
  z.string()
    .trim()
    .min(1)
    .max(10)
    .regex(/^\d+(\.\d{1,2})?$/)
    .refine((value) => Number(value) >= 0 && Number(value) <= maximum);

const applicationSchema = z.object({
  playerName: z.string().trim().min(1).max(100),
  gradeLevel: z.string().trim().min(1).max(30),
  gpa: numericText(10),
  scoringAverage: numericText(200),
  swingVideoLink: httpLink('swing video link'),
  parentName: z.string().trim().min(1).max(100),
  parentEmail: z.string().trim().min(1).max(255).email(),
  parentPhone: z.string().trim().min(7).max(25).regex(/^[0-9+().\-\s]+$/),
}).strict();

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({
      error: 'Please check the application fields and try again.',
      fields: parsed.error.flatten().fieldErrors,
    }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const values = parsed.data;
  const { data, error } = await supabaseAdmin
    .from('guidance_applications')
    .insert({
      player_name: values.playerName,
      grade_level: values.gradeLevel,
      gpa: Number(values.gpa),
      scoring_average: Number(values.scoringAverage),
      swing_video_link: values.swingVideoLink,
      parent_name: values.parentName,
      parent_email: values.parentEmail,
      parent_phone: values.parentPhone,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Guidance application insert failed:', error.code);
    return new Response(JSON.stringify({ error: 'Unable to save the application. Please try again.' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }

  return new Response(JSON.stringify({ success: true, id: data.id }), {
    status: 200,
    headers: jsonHeaders,
  });
});

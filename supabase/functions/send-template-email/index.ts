import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { to, subject, html, text, cc, bcc, replyTo } = await req.json();
    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: 'to, subject, html required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const norm = (v: unknown): string[] | undefined => {
      if (!v) return undefined;
      const arr = Array.isArray(v) ? v : [v];
      const cleaned = arr
        .map((x) => String(x).trim())
        .filter((x) => x.length > 0 && /.+@.+\..+/.test(x));
      return cleaned.length ? cleaned : undefined;
    };

    const toArr = norm(to);
    const ccArr = norm(cc);
    const bccArr = norm(bcc);

    if (!toArr) {
      return new Response(JSON.stringify({ error: 'Invalid "to" address' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload: Record<string, any> = {
      from: 'Coach Rod at CFA <contact@cfa.golf>',
      to: toArr,
      subject,
      html,
      text,
      reply_to: replyTo || 'contact@cfa.golf',
    };
    if (ccArr) payload.cc = ccArr;
    if (bccArr) payload.bcc = bccArr;

    console.log('[send-template-email] sending', {
      to: toArr, cc: ccArr, bcc: bccArr, subject,
    });

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await r.json();
    console.log('[send-template-email] resend response', r.status, data);

    if (!r.ok) {
      return new Response(JSON.stringify({ error: data.message || 'Send failed', details: data }), {
        status: r.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({
      success: true,
      id: data.id,
      delivered: { to: toArr, cc: ccArr || [], bcc: bccArr || [] },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[send-template-email] error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

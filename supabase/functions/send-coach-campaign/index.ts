const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface EmailRequest {
  recipients: {
    highSchoolId: string;
    coachName: string;
    coachEmail: string;
    schoolName: string;
  }[];
  subject: string;
  body: string;
  templateId?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Database not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { recipients, subject, body, templateId } = await req.json() as EmailRequest;

    if (!recipients?.length || !subject || !body) {
      return new Response(
        JSON.stringify({ success: false, error: 'Recipients, subject, and body are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const recipient of recipients) {
      try {
        // Personalize the email
        const personalizedSubject = subject
          .replace(/\{\{coach_name\}\}/gi, recipient.coachName)
          .replace(/\{\{school_name\}\}/gi, recipient.schoolName);

        const personalizedBody = body
          .replace(/\{\{coach_name\}\}/gi, recipient.coachName)
          .replace(/\{\{school_name\}\}/gi, recipient.schoolName);

        // Convert newlines to HTML paragraphs
        const htmlBody = personalizedBody
          .split('\n\n')
          .map((p: string) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
          .join('');

        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Rod at CFA <contact@cfa.golf>',
            to: [recipient.coachEmail],
            subject: personalizedSubject,
            html: `
              <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                ${htmlBody}
              </div>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const errData = await emailResponse.json();
          errors.push(`${recipient.schoolName}: ${errData.message || 'Send failed'}`);
          failed++;
          continue;
        }

        // Log the outreach
        await supabase.from('hs_coach_outreach').insert({
          high_school_id: recipient.highSchoolId,
          outreach_type: 'email',
          subject: personalizedSubject,
          body: personalizedBody,
          status: 'sent',
        });

        // Update school CRM fields
        await supabase.from('high_schools').update({
          last_contacted_at: new Date().toISOString(),
          contact_status: 'contacted',
          total_emails_sent: (await supabase.from('high_schools').select('total_emails_sent').eq('id', recipient.highSchoolId).single()).data?.total_emails_sent + 1 || 1,
        }).eq('id', recipient.highSchoolId);

        sent++;

        // Rate limit: small delay between emails
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (err) {
        errors.push(`${recipient.schoolName}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent, failed, errors: errors.slice(0, 10) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Campaign error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, and text or html' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set — email not sent');
    return res.status(200).json({ sent: false, reason: 'RESEND_API_KEY not configured' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Edu-Alt-Tech <noreply@edualttech.com>',
        to: [to],
        subject,
        text: text || '',
        html: html || undefined,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Resend error:', response.status, errBody);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    const data = await response.json();
    return res.status(200).json({ sent: true, id: data.id });
  } catch (err: any) {
    console.error('Send email error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}

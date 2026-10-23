const EMAIL_TO = 'companyflow0@gmail.com';
const clean = (value, max = 300) => typeof value === 'string' ? value.trim().replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, max) : '';
const emailOk = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;

async function getGoogleAccessToken() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) throw new Error('Google OAuth is not configured');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET, refresh_token: GOOGLE_REFRESH_TOKEN, grant_type: 'refresh_token' }),
    signal: AbortSignal.timeout(15000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) throw new Error('Google authorization failed');
  return payload.access_token;
}

export default async (request) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  const origin = request.headers.get('origin');
  if (origin) { try { if (new URL(origin).host !== new URL(request.url).host) return Response.json({ error: 'Origin not allowed' }, { status: 403 }); } catch { return Response.json({ error: 'Origin not allowed' }, { status: 403 }); } }
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const name = clean(body?.name, 120);
  const email = clean(body?.email, 254);
  const company = clean(body?.company, 160);
  const service = clean(body?.service, 120);
  const budget = clean(body?.budget, 80);
  const details = clean(body?.details, 5000);
  if (!name || !emailOk(email) || !service || details.length < 10) return Response.json({ error: 'Please provide your name, a valid email, service, and a project description of at least 10 characters.' }, { status: 400 });
  const content = [
    'New project enquiry from the CompanyFlow website assistant', '',
    `Name: ${name}`, `Email: ${email}`, `Company: ${company || 'Not provided'}`,
    `Service: ${service}`, `Budget: ${budget || 'Not specified'}`, '', 'Project details:', details,
    '', `Received: ${new Date().toISOString()}`,
  ].join('\n');
  try {
    const token = await getGoogleAccessToken();
    const subject = `CompanyFlow project enquiry: ${service}`;
    const mime = [
      `To: ${EMAIL_TO}`,
      `Reply-To: ${email}`,
      `Subject: =?UTF-8?B?${Buffer.from(subject, 'utf8').toString('base64')}?=`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset="UTF-8"',
      'Content-Transfer-Encoding: base64', '',
      Buffer.from(content, 'utf8').toString('base64').match(/.{1,76}/g)?.join('\r\n') || '',
    ].join('\r\n');
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: Buffer.from(mime, 'utf8').toString('base64url') }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return Response.json({ error: 'We could not send your enquiry right now. Please email companyflow0@gmail.com directly.' }, { status: 502 });
    return Response.json({ success: true, message: 'Your project enquiry has been emailed to the CompanyFlow team.' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const notConfigured = String(error?.message || '').includes('not configured');
    return Response.json({ error: notConfigured ? 'Google email and calendar are not configured yet.' : 'Email service unavailable. Please email companyflow0@gmail.com directly.' }, { status: notConfigured ? 503 : 502 });
  }
};

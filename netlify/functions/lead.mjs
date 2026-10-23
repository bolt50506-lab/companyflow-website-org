const clean = (value, max = 300) => typeof value === 'string' ? value.trim().replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, max) : '';
const emailOk = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;

export default async (request) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  const origin = request.headers.get('origin');
  if (origin) { try { if (new URL(origin).host !== new URL(request.url).host) return Response.json({ error: 'Origin not allowed' }, { status: 403 }); } catch { return Response.json({ error: 'Origin not allowed' }, { status: 403 }); } }
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const name = clean(body?.name, 120);
  const email = clean(body?.email, 254);
  const company = clean(body?.company, 160);
  const service = clean(body?.service ?? body?.type, 120) || 'General enquiry';
  const budget = clean(body?.budget, 80);
  const details = clean(body?.details ?? body?.message, 5000);
  if (!name || !emailOk(email) || details.length < 10) return Response.json({ error: 'Please provide your name, a valid email, and a message of at least 10 characters.' }, { status: 400 });
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return Response.json({ error: 'The enquiry service is not configured yet. Please email companyflow0@gmail.com.' }, { status: 503 });
  const form = new FormData();
  form.set('access_key', accessKey);
  form.set('subject', 'CompanyFlow enquiry: ' + service);
  form.set('from_name', 'CompanyFlow website — ' + name);
  form.set('name', name); form.set('email', email); form.set('company', company || 'Not provided');
  form.set('service', service); form.set('budget', budget || 'Not specified'); form.set('message', details);
  form.set('to', 'companyflow0@gmail.com'); form.set('replyto', email); form.set('botcheck', '');
  try {
    const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: form, signal: AbortSignal.timeout(15000) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success !== true) return Response.json({ error: 'We could not send your enquiry right now. Please email companyflow0@gmail.com directly.' }, { status: 502 });
    return Response.json({ success: true, message: 'Thanks — your enquiry has been sent to the CompanyFlow team.' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Email service unavailable. Please email companyflow0@gmail.com directly.' }, { status: 502 }); }
};

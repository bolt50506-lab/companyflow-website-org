const TZ = process.env.GOOGLE_TIME_ZONE || 'Europe/London';
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';
const ALLOWED_ORIGIN = (request) => {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).host === new URL(request.url).host; } catch { return false; }
};
const clean = (value, max = 250) => typeof value === 'string' ? value.trim().replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, max) : '';
const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;

async function getAccessToken() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) throw new Error('Google Calendar credentials are not configured');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET, refresh_token: GOOGLE_REFRESH_TOKEN, grant_type: 'refresh_token' }),
    signal: AbortSignal.timeout(15000),
  });
  const payload = await response.json();
  if (!response.ok || !payload.access_token) throw new Error('Google authorization failed');
  return payload.access_token;
}
async function googleRequest(path, token, method = 'GET', body) {
  const response = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(15000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Google Calendar request failed (${response.status})`);
  return payload;
}
function dayBounds(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Please select a valid date');
  const [year, month, day] = date.split('-').map(Number);
  const start = new Date(Date.UTC(year, month - 1, day));
  if (start.getUTCFullYear() !== year || start.getUTCMonth() !== month - 1 || start.getUTCDate() !== day) throw new Error('Please select a valid date');
  return { year, month, day };
}
function londonIso(date, hour, minute) {
  // The current site uses a UK studio location. This handles UK daylight-saving offsets.
  const dateTime = new Date(`${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`);
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(dateTime);
  const val = Object.fromEntries(parts.map(p => [p.type, p.value]));
  const localAsUtc = Date.UTC(Number(val.year), Number(val.month) - 1, Number(val.day), Number(val.hour), Number(val.minute));
  const offsetMinutes = Math.round((localAsUtc - dateTime.getTime()) / 60000);
  return new Date(dateTime.getTime() - offsetMinutes * 60000).toISOString();
}
function getSlots(date) {
  dayBounds(date);
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  const todayParts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const todayValues = Object.fromEntries(todayParts.map(part => [part.type, part.value]));
  const today = `${todayValues.year}-${todayValues.month}-${todayValues.day}`;
  if (weekday === 0 || weekday === 6 || date < today) return [];
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    for (const minute of [0, 30]) {
      const start = londonIso(date, hour, minute);
      const end = new Date(new Date(start).getTime() + 30 * 60_000).toISOString();
      if (new Date(start).getTime() > Date.now() + 10 * 60_000) slots.push({ start, end, label: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}` });
    }
  }
  return slots;
}
async function listAvailableSlots(date, token) {
  const candidates = getSlots(date);
  if (!candidates.length) return [];
  const timeMin = candidates[0].start;
  const timeMax = candidates[candidates.length - 1].end;
  const freeBusy = await googleRequest('/freeBusy', token, 'POST', { timeMin, timeMax, timeZone: TZ, items: [{ id: CALENDAR_ID }] });
  const busy = freeBusy?.calendars?.[CALENDAR_ID]?.busy || [];
  return candidates.filter(slot => !busy.some(period => new Date(period.start) < new Date(slot.end) && new Date(period.end) > new Date(slot.start)));
}

export default async (request) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  if (!ALLOWED_ORIGIN(request)) return Response.json({ error: 'Origin not allowed' }, { status: 403 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }
  try {
    const token = await getAccessToken();
    if (body?.action === 'availability') {
      const date = clean(body.date, 10);
      const slots = await listAvailableSlots(date, token);
      return Response.json({ slots, timeZone: TZ }, { headers: { 'Cache-Control': 'no-store' } });
    }
    if (body?.action !== 'book') return Response.json({ error: 'Unknown action' }, { status: 400 });
    const name = clean(body.name, 120);
    const email = clean(body.email, 254);
    const company = clean(body.company, 160);
    const topic = clean(body.topic, 500);
    const start = new Date(body.start);
    if (!name || !isEmail(email) || !topic || !body.start || Number.isNaN(start.getTime())) return Response.json({ error: 'Please provide your name, valid email, topic, and an available time.' }, { status: 400 });
    const end = new Date(start.getTime() + 30 * 60_000);
    const localParts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(start);
    const localValues = Object.fromEntries(localParts.map(part => [part.type, part.value]));
    const localDate = `${localValues.year}-${localValues.month}-${localValues.day}`;
    const available = await listAvailableSlots(localDate, token);
    if (!available.some(slot => slot.start === start.toISOString())) return Response.json({ error: 'That time is no longer available or is outside the booking hours. Please select another slot.' }, { status: 409 });
    const event = await googleRequest(`/calendars/${encodeURIComponent(CALENDAR_ID)}/events?sendUpdates=all`, token, 'POST', {
      summary: `CompanyFlow consultation — ${name}`,
      description: `CompanyFlow website assistant booking\nName: ${name}\nEmail: ${email}\nCompany: ${company || 'Not provided'}\nTopic: ${topic}`,
      start: { dateTime: start.toISOString(), timeZone: TZ },
      end: { dateTime: end.toISOString(), timeZone: TZ },
      attendees: [{ email, displayName: name }],
      reminders: { useDefault: true },
    });
    return Response.json({ success: true, eventId: event.id, htmlLink: event.htmlLink, start: event.start?.dateTime || start.toISOString(), message: 'Your consultation is booked. Google Calendar will send the invitation if attendee invitations are enabled.' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const message = String(error?.message || 'Calendar service unavailable');
    const notConfigured = message.includes('not configured');
    return Response.json({ error: notConfigured ? 'Google Calendar is not configured yet.' : 'We could not access Google Calendar. Please contact companyflow0@gmail.com to arrange a meeting.' }, { status: notConfigured ? 503 : 502 });
  }
};

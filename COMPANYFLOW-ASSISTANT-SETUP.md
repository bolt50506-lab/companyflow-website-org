# CompanyFlow assistant: Groq, project enquiries and Google Calendar

This update preserves the existing chat widget styling and adds three workflows:

- Groq-powered answers using a server-side CompanyFlow-only system prompt and a limited set of verified facts from the website.
- Project enquiry form that sends an email to `companyflow0@gmail.com` through the Gmail API, with the visitor's email as Reply-To.
- Appointment booking that checks Google Calendar free/busy, offers 30-minute weekday slots from 09:00 to 17:00 UK time, checks availability again before creating the event, and invites the visitor by email.

No production site was deployed or modified.

## 1. Groq environment variables

In Netlify, open **Site configuration → Environment variables** and add these values for the deploy context you intend to test:

- `GROQ_API_KEY`: your Groq API key.
- `GROQ_MODEL`: `openai/gpt-oss-20b` (the model selected previously).

Keep the key server-side. Do not add it to frontend code or use a `VITE_` prefix. Redeploy the preview after setting variables so the function can read them.

## 2. Google OAuth for Gmail + Calendar

Use a Google Cloud project and enable **Google Calendar API** and **Gmail API**. Configure the OAuth consent screen and create an OAuth 2.0 Client ID for a web application. Generate a refresh token for the Google account that owns the CompanyFlow calendar (ideally `companyflow0@gmail.com`) with offline access and these scopes:

- `https://www.googleapis.com/auth/calendar`
- `https://www.googleapis.com/auth/gmail.send`

Store the following as Netlify environment variables, available to Functions:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_CALENDAR_ID` — use `primary` to book into the connected Google account's primary calendar, or set the exact calendar ID.
- `GOOGLE_TIME_ZONE` — `Europe/London` by default.

Do not commit the real credentials. `.env.example` contains placeholders only. If Google's OAuth consent app is in Testing mode, refresh-token behavior can be limited; configure the consent screen appropriately for the account and scope before relying on bookings.

## 3. What the website does

- The chat endpoint is `/.netlify/functions/chat` and calls `https://api.groq.com/openai/v1/chat/completions`.
- The enquiry endpoint is `/.netlify/functions/lead`; it validates fields and sends a plain-text email through Gmail API.
- The calendar endpoint is `/.netlify/functions/calendar`; it checks free/busy before showing times and again before creating an event.
- Calendar slots are currently 30 minutes, weekdays, 09:00–17:00 in `Europe/London`. Adjust `getSlots()` in `netlify/functions/calendar.mjs` if the business schedule changes.

The assistant prompt is designed to stay within CompanyFlow topics and use only the supplied company facts. Model prompts cannot provide a mathematical guarantee against every off-topic or incorrect response; the prompt avoids inventing missing details and the separate forms handle real submissions.

## 4. Preview validation checklist

1. Set the server-side environment variables on a Netlify Deploy Preview or test site, not production.
2. Test CompanyFlow questions and an unrelated question; confirm unrelated questions are politely redirected.
3. Submit a test project enquiry and verify the email arrives at `companyflow0@gmail.com` and Reply-To is the visitor.
4. Check a weekday with free time, book a test consultation, and confirm the event appears in Google Calendar and the visitor receives an invitation.
5. Test a slot that becomes busy, invalid form values, and missing credentials. The UI should show a clear error and must not claim success.
6. Run `npm run build` and `npm run lint`, then test the deploy preview before deciding whether to publish anything.

## 5. Privacy

The chat sends the last ten chat messages to Groq. Enquiry details are emailed to the CompanyFlow inbox. Booking name, email, company (if provided), and topic are stored in the calendar event and shared with the attendee. Update the site's privacy notice if needed before collecting real customer data.

# CompanyFlow assistant: Groq, Web3Forms enquiries, and Cal.com bookings

The website uses three workflows:

- Groq-powered assistant replies through a server-side Netlify Function.
- Project enquiries are submitted by a server-side function to Web3Forms, with the visitor email as reply-to.
- Consultation bookings use the Cal.com booking page: https://cal.com/company-flow-1ort2e/15min.

## 1. Netlify environment variables

In Netlify, open **Site configuration → Environment variables** and set:

- `GROQ_API_KEY`: your Groq API key (server-side only).
- `GROQ_MODEL`: `openai/gpt-oss-20b` (optional; current default).
- `WEB3FORMS_ACCESS_KEY`: the access key from your Web3Forms dashboard.

Keep credentials in Netlify environment variables. Do not commit real credentials. Redeploy after changing environment variables so Functions can read them.

## 2. What the website does

- Chat endpoint: `/.netlify/functions/chat`; calls Groq.
- Enquiry endpoint: `/.netlify/functions/lead`; validates fields and forwards enquiries to Web3Forms.
- Booking: the assistant opens the Cal.com booking page. Google OAuth and the custom Google Calendar API integration are no longer required for this flow.

## 3. Testing checklist

1. Ask the assistant a CompanyFlow-related question and confirm it replies.
2. Submit a test project enquiry from the chat assistant and Contact page; verify it reaches the inbox configured in Web3Forms.
3. Open **Book a call**, choose a slot in Cal.com, and confirm Cal.com completes the booking and sends its confirmation.
4. Test invalid email and empty/short project details; the form should show an error rather than claim success.
5. Run `npm run build` and `npm run lint` after code changes.

## 4. Privacy

The chat sends the last ten chat messages to Groq. Enquiry details are forwarded to Web3Forms and delivered to its configured destination. Booking information is handled by Cal.com under its own service and privacy terms. Update the site's privacy notice as needed before collecting customer data.

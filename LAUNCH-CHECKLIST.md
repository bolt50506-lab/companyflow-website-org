# CompanyFlow launch and form delivery checklist

## What is implemented in this project

- Contact enquiries submit to a Netlify Form named `contact-form`.
- Careers applications submit to `job-application`, including the selected CV/resume (PDF/DOC/DOCX, max 8 MB).
- Newsletter sign-ups submit to `newsletter-form`. This records sign-ups in Netlify Forms only; it does not yet add them to an email marketing platform or send newsletter campaigns.
- Static form declarations are included in `index.html` so Netlify can detect React forms during deployment.
- If Netlify Forms is not available or the host returns the app HTML instead of a form acknowledgement, the contact/application/newsletter form opens a prefilled email instead. The UI tells the visitor to send that email; it does not falsely claim the form was submitted.
- WhatsApp contact button is present globally and links to `https://wa.me/923407465567`.
- Chat assistant uses a server-side Netlify Function with a CompanyFlow-only system prompt and verified website facts. If Groq is unavailable, it falls back to a small local FAQ response set.
- The chat includes a project-enquiry form that emails `companyflow0@gmail.com` through the Gmail API, plus Google Calendar availability and appointment booking. These workflows require Google OAuth credentials and the correct Gmail/Calendar scopes.

## Required setup on Netlify before launch

1. Deploy this project as a Netlify site. Build command: `npm run build`; publish directory: `dist`; `netlify.toml` configures both.
2. Submit a real test enquiry and a test application from the deployed site. Confirm both appear in **Netlify dashboard → Forms → Submissions**. Do not assume a local Vite preview tests Netlify Forms.
3. Configure email alerts in **Site configuration → Notifications → Emails and webhooks** (wording can vary) for form submissions. Use `companyflow0@gmail.com` as the recipient. Form acceptance and email notification delivery are separate things.
4. Confirm `job-application` stores the uploaded CV in the submission, and review the site's file upload/storage/privacy policy before inviting applicants. Remove test submissions afterward.
5. Follow `COMPANYFLOW-ASSISTANT-SETUP.md` to set `GROQ_API_KEY` and `GROQ_MODEL` (`openai/gpt-oss-20b`) as server-side Netlify environment variables scoped to Functions. Never put the API key in `VITE_*` variables or frontend source.
6. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID`, and `GOOGLE_TIME_ZONE` for Gmail notifications and Calendar booking. The OAuth token must include `https://www.googleapis.com/auth/gmail.send` and `https://www.googleapis.com/auth/calendar`.
7. Test with a Netlify Deploy Preview before production. Verify Groq answers, an enquiry email reaches `companyflow0@gmail.com`, free/busy times match the connected calendar, and a test event/invitation is created correctly. The function has a basic per-IP in-memory rate limit, which is best-effort rather than complete abuse prevention.
7. Publish a privacy notice before collecting CVs and contact details. It should explain the controller, purpose, lawful basis, retention period, recipients/processors, and applicant/contact rights; do not collect applications until this notice is in place.
9. Test mobile and desktop layouts, keyboard navigation, reduced motion, the WhatsApp link, every nav/footer link, contact form validation, CV upload size/type, form notifications, and assistant behavior when credentials are missing.

## Build/test status in this working session

The earlier package manifest declared `lenis` but the lockfile did not contain it, which would prevent a clean `npm ci`. The unused third-party dependency has been removed and native smooth scrolling retained. A full Vite production build, ESLint run, dependency audit, and live form delivery test still need to be run in an environment with npm registry access before production release.

## SEO status and remaining limitations

- Internal navigation now uses clean path URLs (`/company`, `/solutions/...`, `/case-studies/...`, `/resources/blog/...`) rather than hash fragments. Legacy `#/...` links redirect to the equivalent path in the app.
- Netlify is configured to serve clean routes, and the build generates a static HTML entry with route-specific metadata for every URL in the 52-URL sitemap.
- Titles, descriptions, canonicals, social metadata, and page structured data are updated per route. The React page content itself is still rendered client-side, so a full server-rendered HTML implementation could further improve compatibility with crawlers that do not execute JavaScript.
- A high Google position cannot be guaranteed. After deployment, verify the sitemap in Google Search Console, request indexing for key service pages, check canonical selection and crawl errors, and measure impressions/clicks over time. This was not changed in this pass to avoid disturbing existing navigation/layout.

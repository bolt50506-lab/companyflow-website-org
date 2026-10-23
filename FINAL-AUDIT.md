# CompanyFlow final pre-launch audit — v19

## Fix made during audit
- `package.json` declared `lenis`, but `package-lock.json` did not include it. This manifest/lockfile mismatch would make clean, reproducible installs fail. Removed the unmatched dependency and kept native smooth scrolling with reduced-motion support. The website's page/reveal/hero animations remain in place.

## Checks completed
- ZIP integrity: passed.
- Package manifest and lockfile root dependency declarations: match.
- TypeScript/TSX syntax transpilation: 35 source files, zero syntax diagnostics.
- Netlify Function and route-generation `.mjs` syntax: passed `node --check`.
- Internal `@/` source imports: no missing imports found.
- Sitemap XML: 52 unique URLs, no hash-fragment URLs.
- Route generator smoke test: produced 52 static HTML entry points; representative service, blog, case-study, and contact routes included canonical URLs and noscript fallback markup.
- Netlify config syntax had previously been checked with Python TOML parsing.
- No production deployment was performed.

## Not yet verified — do not treat these as passed
- Full `npm ci`, `npm run typecheck`, `npm run lint`, and production `npm run build`: package installation could not complete because the npm registry/cache was unavailable in this environment.
- Browser-level navigation, mobile layout, animation appearance, and real direct-route HTTP responses.
- Groq replies using a real `GROQ_API_KEY`.
- Gmail delivery and Google Calendar availability/event invitations using valid OAuth credentials.
- Netlify Forms submissions, notifications, and CV uploads on a deployed preview.

## Required before launch
1. On a machine with registry access, run `npm ci`, `npm run typecheck`, `npm run lint`, and `npm run build`; resolve any errors before deploy.
2. Deploy a Netlify Deploy Preview, not production. Check navigation from nested routes, browser back/forward, refreshes on all clean URLs, mobile/desktop, and reduced-motion behavior.
3. Configure server-side Netlify environment variables from `.env.example`; never expose API/OAuth secrets in frontend code.
4. Test a Groq response, a project enquiry email to `companyflow0@gmail.com`, a real calendar availability check and test booking/invitation, contact form, newsletter form, and CV upload. Remove test submissions afterward.
5. Publish an accurate privacy notice before collecting contact details or CVs. The site currently needs its privacy policy/content reviewed and approved by the business; this audit does not invent retention periods or legal bases.
6. Confirm Google Calendar time zone, office hours, meeting ownership, and invitation delivery, then request approval before deploying to production.

## Scope note
This is a source and configuration audit, not a guarantee that all integrations work in production. No credentials were supplied to the audit environment, and no live site was changed.

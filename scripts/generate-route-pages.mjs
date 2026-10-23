import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const sitemap = await readFile(path.join(root, 'public/sitemap.xml'), 'utf8');
const baseHtml = await readFile(path.join(dist, 'index.html'), 'utf8');
const siteUrl = 'https://www.companyflow.co.uk';
const paths = [...sitemap.matchAll(/<loc>https:\/\/www\.companyflow\.co\.uk([^<]*)<\/loc>/g)]
  .map(match => decodeURI(match[1] || '/'));

function humanize(slug) {
  return slug.split('/').filter(Boolean).map(part => part.split('-').map(word => word ? word[0].toUpperCase() + word.slice(1) : '').join(' ')).join(' | ');
}
function details(route) {
  const parts = route.split('/').filter(Boolean);
  const [section, child] = parts;
  if (!section) return {
    title: 'CompanyFlow | Custom Software, Websites, ERP & CRM',
    description: 'CompanyFlow designs and develops custom software, business websites, e-commerce stores, ERP and CRM systems, and AI automation for growing businesses.'
  };
  if (section === 'company') return { title: 'About CompanyFlow | How We Build Better Software', description: 'Meet CompanyFlow, learn about our approach, team, values, and how we turn business needs into useful digital products.' };
  if (section === 'contact') return { title: 'Contact CompanyFlow | Discuss Your Software Project', description: 'Tell CompanyFlow about your software, website, e-commerce, ERP, CRM, or automation project and discuss the next steps.' };
  if (section === 'solutions') return { title: `${humanize(child || 'software-development-services')} Services | CompanyFlow`, description: `Explore CompanyFlow ${humanize(child || 'software development').toLowerCase()} services, including practical planning, thoughtful design, and software built around business needs.` };
  if (section === 'case-studies') return { title: child ? `${humanize(child)} | CompanyFlow Project` : 'Case Studies | CompanyFlow Digital Projects', description: 'Explore CompanyFlow digital project examples, product design approaches, and software implementation concepts across business sectors.' };
  if (section === 'resources' && child === 'blog') return { title: parts[2] ? `${humanize(parts[2])} | CompanyFlow Journal` : 'Software Engineering & Product Design Blog | CompanyFlow', description: 'Practical articles on software engineering, product design, AI automation, e-commerce, and building digital products.' };
  if (section === 'resources' && child === 'careers') return { title: 'Careers at CompanyFlow | Opportunities', description: 'Explore career opportunities and ways to collaborate with CompanyFlow.' };
  return { title: 'Resources | CompanyFlow', description: 'Read CompanyFlow insights on engineering, design, AI, and digital product development, or explore career opportunities.' };
}
function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
function replaceMeta(html, key, value, attr = 'name') {
  const safe = escapeHtml(value);
  const pattern = new RegExp(`<meta\\s+${attr}=["']${key}["']\\s+content=["'][^"']*["']\\s*\\/?>`, 'i');
  const alternate = new RegExp(`<meta\\s+content=["'][^"']*["']\\s+${attr}=["']${key}["']\\s*\\/?>`, 'i');
  if (pattern.test(html)) return html.replace(pattern, `<meta ${attr}="${key}" content="${safe}" />`);
  if (alternate.test(html)) return html.replace(alternate, `<meta ${attr}="${key}" content="${safe}" />`);
  return html.replace('</head>', `  <meta ${attr}="${key}" content="${safe}" />\n</head>`);
}

let generated = 0;
for (const routePath of new Set(paths)) {
  const route = routePath === '/' ? '/' : routePath.replace(/\/+$/, '');
  const { title, description } = details(route);
  const canonical = `${siteUrl}${route === '/' ? '/' : `${route}/`}`;
  let html = baseHtml.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, 'description', description, 'name');
  html = replaceMeta(html, 'og:title', title, 'property');
  html = replaceMeta(html, 'og:description', description, 'property');
  html = replaceMeta(html, 'og:url', canonical, 'property');
  html = replaceMeta(html, 'twitter:title', title, 'name');
  html = replaceMeta(html, 'twitter:description', description, 'name');
  const canonicalTag = `<link rel="canonical" href="${canonical}" />`;
  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, canonicalTag);
  else html = html.replace('</head>', `  ${canonicalTag}\n</head>`);
  const schema = {
    '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: canonical,
    isPartOf: { '@type': 'WebSite', name: 'CompanyFlow', url: `${siteUrl}/` },
    publisher: { '@type': 'Organization', name: 'CompanyFlow', url: `${siteUrl}/` }
  };
  html = html.replace('</head>', `  <script type="application/ld+json" data-companyflow-prerender="true">${JSON.stringify(schema)}</script>\n</head>`);
  const fallback = `<noscript><main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><p>CompanyFlow builds practical digital products, custom software, business websites, e-commerce stores, ERP and CRM systems, and AI automation.</p><p><a href="/company/">About CompanyFlow</a> · <a href="/solutions/">Our services</a> · <a href="/case-studies/">Project examples</a> · <a href="/contact/">Contact us</a></p></main></noscript>`;
  html = html.replace('<div id="root"></div>', `${fallback}\n    <div id="root"></div>`);
  if (route === '/') {
    await writeFile(path.join(dist, 'index.html'), html);
  } else {
    const targetDir = path.join(dist, ...route.split('/').filter(Boolean));
    await mkdir(targetDir, { recursive: true });
    await writeFile(path.join(targetDir, 'index.html'), html);
  }
  generated++;
}
console.log(`Generated static route HTML shells for ${generated} clean-route HTML entry points from sitemap.xml`);

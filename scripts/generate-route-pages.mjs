import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const sitemap = await readFile(path.join(root, 'public/sitemap.xml'), 'utf8');
const baseHtml = await readFile(path.join(dist, 'index.html'), 'utf8');
const siteUrl = 'https://www.companyflow.co.uk';
const paths = [...sitemap.matchAll(/<loc>https:\/\/www\.companyflow\.co\.uk([^<]*)<\/loc>/g)]
  .map(match => decodeURI(match[1] || '/'));

const services = {
  'web-development': ['Web Development Services', 'CompanyFlow builds fast, accessible business websites and web applications tailored to customers, workflows and growth goals.'],
  'mobile-app-development': ['Mobile App Development', 'Plan and build iOS and Android apps with thoughtful UX, reliable integrations and maintainable cross-platform technology.'],
  'ui-ux-design': ['UI/UX Design Services', 'Improve product usability with research, prototypes, interface design, accessible components and practical design systems.'],
  'cloud-devops': ['Cloud & DevOps Services', 'Improve delivery reliability with cloud architecture, CI/CD pipelines, infrastructure automation, monitoring and migration support.'],
  'ai-automation': ['AI & Workflow Automation', 'Automate repetitive and document-heavy workflows with carefully scoped AI, integrations, validation rules and human review.'],
  'growth-engineering': ['Growth Engineering Services', 'Improve digital conversion journeys with analytics, experimentation, funnel reviews and marketing workflow automation.'],
  'custom-software': ['Custom Software Development', 'Build custom business software, internal tools, portals, workflow applications and integrations around how your team works.'],
  'erp-systems': ['ERP Development & Integration', 'Connect inventory, orders, purchasing, finance and operations with ERP implementation, customisation and integrations.'],
  'crm-solutions': ['CRM Development & Customisation', 'Organise leads, customer relationships and sales workflows with CRM implementation, tailored features and integrations.'],
  'ecommerce-shopify': ['E-commerce & Shopify Development', 'Build and improve online stores with Shopify development, storefront UX, integrations and performance-focused improvements.'],
  'saas-product-development': ['SaaS Product Development', 'Turn a product idea into a maintainable SaaS platform with product planning, UX, application development and scalable foundations.'],
  'data-analytics': ['Data Analytics & Business Intelligence', 'Turn operational data into useful decisions with reporting, dashboards, data integration and business intelligence solutions.']
};
const blogs = {
  'shipping-daily-without-breaking-things': ['Shipping Daily Without Breaking Things', 'Improve release confidence with automated tests, staged deployments, monitoring and rollback planning.'],
  'design-systems-that-actually-get-used': ['Design Systems That Teams Actually Use', 'Explore how clear ownership, reusable components, accessible patterns and documentation improve design-system adoption.'],
  'ai-claims-automation-without-the-hype': ['AI Claims Automation Without the Hype', 'A practical overview of document extraction, validation rules, human review and evaluation for AI-assisted claims workflows.'],
  'headless-commerce-why-we-stopped-using-shopify': ['Headless Commerce: Choosing the Right Architecture', 'Understand trade-offs between hosted commerce platforms and headless architectures before choosing a store technology.'],
  'the-real-cost-of-technical-debt': ['The Real Cost of Technical Debt', 'Understand how technical debt affects delivery, reliability and maintenance, and how to prioritise improvements.'],
  'accessibility-as-a-feature-not-a-bug-fix': ['Accessibility as a Feature, Not a Bug Fix', 'Learn how accessible interaction patterns, semantic markup and keyboard support improve digital products.']
};
const caseTitles = {
  'secure-access':'Secure Access Biometric Sign-In App','floraison':'Floraison Floral E-commerce Store',
  'meridianrx':'MeridianRx Online Pharmacy Storefront','aldera':'Aldera Real Estate Platform',
  'noor-adorn':'Noor Adorn E-commerce Store','nexora-erp':'Nexora ERP System',
  'labstack':'LabStacks Diagnostic Lab Management System','metro-mart':'Metro Mart E-commerce Platform',
  'corex-hr-dashboard':'Corex HR Dashboard','vault-payments':'Vault Payments Platform',
  'medi-track':'Medi-Track Healthcare Platform','bloom-commerce':'Bloom Commerce Store',
  'flowdesk-saas':'Flowdesk SaaS Platform','cargo-sync':'Cargo Sync Logistics Platform',
  'keycard-access':'Keycard Access Management','cloud-migrate-pinnacle':'Pinnacle Cloud Migration',
  'atlas-ai-assistant':'Atlas AI Assistant','pulse-growth':'Pulse Growth Platform',
  'orbital-design-system':'Orbital Design System','ridge-mobile-banking':'Ridge Mobile Banking App',
  'forge-internal-tools':'Forge Internal Tools','summit-crm':'Summit CRM Platform',
  'harvest-erp':'Harvest ERP System','helix-lims':'Helix Laboratory Information Management System',
  'luma-shopify':'Luma Shopify Store','tidewater-bi':'Tidewater Business Intelligence'
};
const pretty = value => value.split('-').map(word => word ? word[0].toUpperCase() + word.slice(1) : '').join(' ');
function details(route) {
  const [section, child, detail] = route.split('/').filter(Boolean);
  if (!section) return ['CompanyFlow | Custom Software & Website Development', 'CompanyFlow builds custom software, business websites, e-commerce stores, ERP and CRM systems, and workflow automation for growing businesses.'];
  if (section === 'company') return ['About CompanyFlow | Our Software Development Approach', 'Learn about CompanyFlow and how we plan, design, build and support practical digital products for businesses.'];
  if (section === 'contact') return ['Contact CompanyFlow | Start a Software Project', 'Discuss a custom software, website, e-commerce, ERP, CRM or automation project with CompanyFlow and outline your goals.'];
  if (section === 'solutions' && child && services[child]) return [services[child][0] + ' | CompanyFlow', services[child][1]];
  if (section === 'solutions') return ['Software Development Services | CompanyFlow', 'Explore custom software, web and mobile development, ERP, CRM, e-commerce, AI automation, cloud and data services from CompanyFlow.'];
  if (section === 'case-studies' && child) {
    const name = caseTitles[child] || pretty(child);
    return [name + ' | CompanyFlow Case Study', 'Explore the ' + name + ' project example, including goals, design approach, implementation choices and relevant technologies.'];
  }
  if (section === 'case-studies') return ['Software & Digital Product Case Studies | CompanyFlow', 'Explore CompanyFlow project examples across business software, e-commerce, healthcare, SaaS and digital product development.'];
  if (section === 'resources' && child === 'blog' && detail && blogs[detail]) return [blogs[detail][0] + ' | CompanyFlow Journal', blogs[detail][1]];
  if (section === 'resources' && child === 'blog') return ['Software Engineering & Product Design Blog | CompanyFlow', 'Read practical guidance on software engineering, product design, AI automation, e-commerce and digital product development.'];
  if (section === 'resources' && child === 'careers') return ['Careers at CompanyFlow | Work With Our Team', 'Explore opportunities and ways to collaborate with CompanyFlow across software development, product design and digital delivery.'];
  return ['CompanyFlow Resources | Engineering, Design & Careers', 'Explore CompanyFlow articles, software engineering insights, product design resources and career opportunities.'];
}
function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
function replaceMeta(html, key, value, attr = 'name') {
  const safe = escapeHtml(value);
  const pattern = new RegExp(\`<meta\\s+\${attr}=["']\${key}["']\\s+content=["'][^"']*["']\\s*\\/?>\`, 'i');
  const alternate = new RegExp(\`<meta\\s+content=["'][^"']*["']\\s+\${attr}=["']\${key}["']\\s*\\/?>\`, 'i');
  if (pattern.test(html)) return html.replace(pattern, \`<meta \${attr}="\${key}" content="\${safe}" />\`);
  if (alternate.test(html)) return html.replace(alternate, \`<meta \${attr}="\${key}" content="\${safe}" />\`);
  return html.replace('</head>', \`  <meta \${attr}="\${key}" content="\${safe}" />\n</head>\`);
}
let generated = 0;
for (const routePath of new Set(paths)) {
  const route = routePath === '/' ? '/' : routePath.replace(/\/+$/, '');
  const [title, description] = details(route);
  const canonical = \`\${siteUrl}\${route === '/' ? '/' : \`\${route}/\`}\`;
  let html = baseHtml.replace(/<title>[^<]*<\/title>/i, \`<title>\${escapeHtml(title)}</title>\`);
  html = replaceMeta(html, 'description', description);
  html = replaceMeta(html, 'og:title', title, 'property');
  html = replaceMeta(html, 'og:description', description, 'property');
  html = replaceMeta(html, 'og:url', canonical, 'property');
  html = replaceMeta(html, 'twitter:title', title);
  html = replaceMeta(html, 'twitter:description', description);
  const canonicalTag = \`<link rel="canonical" href="\${canonical}" />\`;
  if (/<link\\s+rel=["']canonical["'][^>]*>/i.test(html)) html = html.replace(/<link\\s+rel=["']canonical["'][^>]*>/i, canonicalTag);
  else html = html.replace('</head>', \`  \${canonicalTag}\n</head>\`);
  const [section, child, detail] = route.split('/').filter(Boolean);
  const schema = {
    '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: canonical,
    isPartOf: { '@type': 'WebSite', name: 'CompanyFlow', url: siteUrl + '/' },
    publisher: { '@type': 'Organization', name: 'CompanyFlow', url: siteUrl + '/' }
  };
  if (section === 'solutions' && child) schema.mainEntity = {
    '@type': 'Service', name: title.replace(' | CompanyFlow', ''), description,
    provider: { '@type': 'Organization', name: 'CompanyFlow', url: siteUrl + '/' }
  };
  if (section === 'resources' && child === 'blog' && detail && blogs[detail]) schema.mainEntity = {
    '@type': 'Article', headline: blogs[detail][0], description,
    mainEntityOfPage: canonical, publisher: { '@type': 'Organization', name: 'CompanyFlow', url: siteUrl + '/' }
  };
  html = html.replace(/<script type="application\/ld\+json" data-companyflow-prerender="true">[\s\S]*?<\/script>\s*/g, '');
  html = html.replace('</head>', \`  <script type="application/ld+json" data-companyflow-prerender="true">\${JSON.stringify(schema)}</script>\n</head>\`);
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, '');
  const fallback = \`<noscript><main><h1>\${escapeHtml(title)}</h1><p>\${escapeHtml(description)}</p><p>CompanyFlow builds custom software, business websites, e-commerce stores, ERP and CRM systems, and workflow automation.</p><p><a href="/company/">About CompanyFlow</a> · <a href="/solutions/">Our services</a> · <a href="/case-studies/">Project examples</a> · <a href="/contact/">Contact us</a></p></main></noscript>\`;
  html = html.replace('<div id="root"></div>', \`\${fallback}\n    <div id="root"></div>\`);
  if (route === '/') await writeFile(path.join(dist, 'index.html'), html);
  else {
    const targetDir = path.join(dist, ...route.split('/').filter(Boolean));
    await mkdir(targetDir, { recursive: true });
    await writeFile(path.join(targetDir, 'index.html'), html);
  }
  generated++;
}
console.log(\`Generated static HTML, unique metadata, canonicals and page schema for \${generated} sitemap routes.\`);

import { solutions } from '@/data/solutions';
import { blogPosts, careers } from '@/data/content';
import { caseStudies } from '@/data/caseStudies';

const SITE_URL = 'https://www.companyflow.co.uk';
const DEFAULT_TITLE = 'CompanyFlow | Custom Software, Websites, ERP & CRM';
const DEFAULT_DESCRIPTION = 'CompanyFlow designs and develops custom software, business websites, e-commerce stores, ERP and CRM systems, and AI automation for growing businesses.';

type SeoDetails = { title: string; description: string };

function getSeoDetails(route: string): SeoDetails {
  const [section, child, detail] = route.split('/').filter(Boolean);
  const services: Record<string, [string, string]> = {
    'web-development': ['Web Development Services', 'CompanyFlow builds fast, accessible business websites and web applications tailored to customers, workflows and growth goals.'],
    'mobile-app-development': ['Mobile App Development', 'Plan and build iOS and Android apps with thoughtful UX, reliable integrations and maintainable cross-platform technology.'],
    'ui-ux-design': ['UI/UX Design Services', 'Improve product usability with research, prototypes, interface design, accessible components and practical design systems.'],
    'cloud-devops': ['Cloud & DevOps Services', 'Improve delivery reliability with cloud architecture, CI/CD pipelines, infrastructure automation, monitoring and migration support.'],
    'ai-automation': ['AI & Workflow Automation', 'Automate repetitive workflows with carefully scoped AI, integrations, validation rules and human review.'],
    'growth-engineering': ['Growth Engineering Services', 'Improve digital conversion journeys with analytics, experimentation, funnel reviews and marketing workflow automation.'],
    'custom-software': ['Custom Software Development', 'Build custom business software, internal tools, portals, workflow applications and integrations around how your team works.'],
    'erp-systems': ['ERP Development & Integration', 'Connect inventory, orders, purchasing, finance and operations with ERP implementation, customisation and integrations.'],
    'crm-solutions': ['CRM Development & Customisation', 'Organise leads, customer relationships and sales workflows with CRM implementation, tailored features and integrations.'],
    'ecommerce-shopify': ['E-commerce & Shopify Development', 'Build and improve online stores with Shopify development, storefront UX, integrations and performance-focused improvements.'],
    'saas-product-development': ['SaaS Product Development', 'Turn a product idea into a maintainable SaaS platform with product planning, UX, application development and scalable foundations.'],
    'data-analytics': ['Data Analytics & Business Intelligence', 'Turn operational data into useful decisions with reporting, dashboards, data integration and business intelligence solutions.']
  };
  const blogs: Record<string, [string, string]> = {
    'shipping-daily-without-breaking-things': ['Shipping Daily Without Breaking Things', 'Improve release confidence with automated tests, staged deployments, monitoring and rollback planning.'],
    'design-systems-that-actually-get-used': ['Design Systems That Teams Actually Use', 'Explore how clear ownership, reusable components, accessible patterns and documentation improve design-system adoption.'],
    'ai-claims-automation-without-the-hype': ['AI Claims Automation Without the Hype', 'A practical overview of document extraction, validation rules, human review and evaluation for AI-assisted claims workflows.'],
    'headless-commerce-why-we-stopped-using-shopify': ['Headless Commerce: Choosing the Right Architecture', 'Understand trade-offs between hosted commerce platforms and headless architectures before choosing a store technology.'],
    'the-real-cost-of-technical-debt': ['The Real Cost of Technical Debt', 'Understand how technical debt affects delivery, reliability and maintenance, and how to prioritise improvements.'],
    'accessibility-as-a-feature-not-a-bug-fix': ['Accessibility as a Feature, Not a Bug Fix', 'Learn how accessible interaction patterns, semantic markup and keyboard support improve digital products.']
  };
  const caseTitles: Record<string, string> = {
    'secure-access': 'Secure Access Biometric Sign-In App', 'floraison': 'Floraison Floral E-commerce Store',
    'meridianrx': 'MeridianRx Online Pharmacy Storefront', 'aldera': 'Aldera Real Estate Platform',
    'noor-adorn': 'Noor Adorn E-commerce Store', 'nexora-erp': 'Nexora ERP System',
    'labstack': 'LabStacks Diagnostic Lab Management System', 'metro-mart': 'Metro Mart E-commerce Platform',
    'corex-hr-dashboard': 'Corex HR Dashboard', 'vault-payments': 'Vault Payments Platform',
    'medi-track': 'Medi-Track Healthcare Platform', 'bloom-commerce': 'Bloom Commerce Store',
    'flowdesk-saas': 'Flowdesk SaaS Platform', 'cargo-sync': 'Cargo Sync Logistics Platform',
    'keycard-access': 'Keycard Access Management', 'cloud-migrate-pinnacle': 'Pinnacle Cloud Migration',
    'atlas-ai-assistant': 'Atlas AI Assistant', 'pulse-growth': 'Pulse Growth Platform',
    'orbital-design-system': 'Orbital Design System', 'ridge-mobile-banking': 'Ridge Mobile Banking App',
    'forge-internal-tools': 'Forge Internal Tools', 'summit-crm': 'Summit CRM Platform',
    'harvest-erp': 'Harvest ERP System', 'helix-lims': 'Helix Laboratory Information Management System',
    'luma-shopify': 'Luma Shopify Store', 'tidewater-bi': 'Tidewater Business Intelligence'
  };
  if (!section) return { title: 'CompanyFlow | Custom Software & Website Development', description: 'CompanyFlow builds custom software, business websites, e-commerce stores, ERP and CRM systems, and workflow automation for growing businesses.' };
  if (section === 'company') return { title: 'About CompanyFlow | Our Software Development Approach', description: 'Learn about CompanyFlow and how we plan, design, build and support practical digital products for businesses.' };
  if (section === 'contact') return { title: 'Contact CompanyFlow | Start a Software Project', description: 'Discuss a custom software, website, e-commerce, ERP, CRM or automation project with CompanyFlow and outline your goals.' };
  if (section === 'solutions' && child && services[child]) return { title: services[child][0] + ' | CompanyFlow', description: services[child][1] };
  if (section === 'solutions') return { title: 'Software Development Services | CompanyFlow', description: 'Explore custom software, web and mobile development, ERP, CRM, e-commerce, AI automation, cloud and data services from CompanyFlow.' };
  if (section === 'case-studies' && child) { const name = caseTitles[child] || child.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); return { title: name + ' | CompanyFlow Case Study', description: 'Explore the ' + name + ' project example, including goals, design approach, implementation choices and relevant technologies.' }; }
  if (section === 'case-studies') return { title: 'Software & Digital Product Case Studies | CompanyFlow', description: 'Explore CompanyFlow project examples across business software, e-commerce, healthcare, SaaS and digital product development.' };
  if (section === 'resources' && child === 'blog' && detail && blogs[detail]) return { title: blogs[detail][0] + ' | CompanyFlow Journal', description: blogs[detail][1] };
  if (section === 'resources' && child === 'blog') return { title: 'Software Engineering & Product Design Blog | CompanyFlow', description: 'Read practical guidance on software engineering, product design, AI automation, e-commerce and digital product development.' };
  if (section === 'resources' && child === 'careers') return { title: 'Careers at CompanyFlow | Work With Our Team', description: 'Explore opportunities and ways to collaborate with CompanyFlow across software development, product design and digital delivery.' };
  return { title: 'CompanyFlow Resources | Engineering, Design & Careers', description: 'Explore CompanyFlow articles, software engineering insights, product design resources and career opportunities.' };
}
function normalizeDescription(value: string): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= 160) return clean;
  const candidate = clean.slice(0, 157);
  const boundary = candidate.lastIndexOf(' ');
  return `${(boundary > 110 ? candidate.slice(0, boundary) : candidate).replace(/[,:;–—-]+$/, '').trim()}…`;
}

function setMeta(attribute: 'name' | 'property', key: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = value;
}

export function updateSeo(route: string) {
  const details = getSeoDetails(route);
  const title = details.title;
  const description = normalizeDescription(details.description);
  document.title = title;
  setMeta('name', 'description', description);
  setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:site_name', 'CompanyFlow');
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  const normalizedPath = route === '/' ? '/' : `/${route.split('/').filter(Boolean).map(encodeURIComponent).join('/')}`;
  const canonicalUrl = `${SITE_URL}${normalizedPath === '/' ? '/' : `${normalizedPath}/`}`;
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  // Each clean pathname has its own canonical URL.
  canonical.href = canonicalUrl;

  // Add crawlable page-level structured data without duplicating the Organization schema.
  let pageSchema = document.head.querySelector<HTMLScriptElement>('script[data-companyflow-page-schema="true"], script[data-companyflow-prerender="true"]');
  if (!pageSchema) {
    pageSchema = document.createElement('script');
    pageSchema.type = 'application/ld+json';
    pageSchema.dataset.companyflowPageSchema = 'true';
    document.head.appendChild(pageSchema);
  }
  const parts = route.split('/').filter(Boolean);
  const [section, child, detail] = parts;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: canonicalUrl,
    isPartOf: { '@type': 'WebSite', name: 'CompanyFlow', url: `${SITE_URL}/` },
    publisher: { '@type': 'Organization', name: 'CompanyFlow', url: `${SITE_URL}/` },
  };
  const solution = section === 'solutions' ? solutions.find(item => item.slug === child) : undefined;
  const post = section === 'resources' && child === 'blog' && detail ? blogPosts.find(item => item.slug === detail) : undefined;
  const study = section === 'case-studies' && child ? caseStudies.find(item => item.slug === child) : undefined;
  if (solution) {
    schema.mainEntity = { '@type': 'Service', name: solution.title, description: solution.description, provider: { '@type': 'Organization', name: 'CompanyFlow', url: `${SITE_URL}/` } };
  } else if (post) {
    schema.mainEntity = { '@type': 'Article', headline: post.title, description: post.excerpt, datePublished: post.date, author: { '@type': 'Organization', name: 'CompanyFlow Editorial' }, publisher: { '@type': 'Organization', name: 'CompanyFlow', url: `${SITE_URL}/` } };
  } else if (study) {
    schema.mainEntity = { '@type': 'CreativeWork', name: study.project, description: study.description, creator: { '@type': 'Organization', name: 'CompanyFlow' } };
  }
  pageSchema.textContent = JSON.stringify(schema);
}

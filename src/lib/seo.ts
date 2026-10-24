import { solutions } from '@/data/solutions';
import { blogPosts, careers } from '@/data/content';
import { caseStudies } from '@/data/caseStudies';

const SITE_URL = 'https://www.companyflow.co.uk';
const DEFAULT_TITLE = 'CompanyFlow | Custom Software, Websites, ERP & CRM';
const DEFAULT_DESCRIPTION = 'CompanyFlow designs and develops custom software, business websites, e-commerce stores, ERP and CRM systems, and AI automation for growing businesses.';

type SeoDetails = { title: string; description: string };

function getSeoDetails(route: string): SeoDetails {
  const parts = route.split('/').filter(Boolean);
  const [section, child, detail] = parts;

  if (!section) return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
  if (section === 'company') return {
    title: 'About CompanyFlow | How We Build Better Software',
    description: 'Meet CompanyFlow, learn about our approach, team, values, and how we turn business needs into useful digital products.',
  };
  if (section === 'contact') return {
    title: 'Contact CompanyFlow | Discuss Your Software Project',
    description: 'Tell CompanyFlow about your software, website, e-commerce, ERP, CRM, or automation project and discuss the next steps.',
  };
  if (section === 'case-studies') {
    const study = caseStudies.find(item => item.slug === child);
    if (study) return {
      title: `${study.project} | CompanyFlow Project`,
      description: `${study.description} Explore the ${study.category.toLowerCase()} project overview and technologies used.`,
    };
    return {
      title: 'Case Studies | CompanyFlow Digital Projects',
      description: 'Explore CompanyFlow project examples across business software, e-commerce, healthcare, SaaS, and digital product development.',
    };
  }
  if (section === 'solutions') {
    const solution = solutions.find(item => item.slug === child);
    if (solution) return {
      title: `${solution.title} Services | CompanyFlow`,
      description: solution.description,
    };
    return {
      title: 'Software Development Services | CompanyFlow',
      description: 'Explore CompanyFlow services including custom software, web development, mobile apps, ERP, CRM, e-commerce, cloud, and AI automation.',
    };
  }
  if (section === 'resources') {
    if (child === 'blog' && detail) {
      const post = blogPosts.find(item => item.slug === detail);
      if (post) return { title: `${post.title} | CompanyFlow Journal`, description: post.excerpt };
    }
    if (child === 'blog') return {
      title: 'Software Engineering & Product Design Blog | CompanyFlow',
      description: 'Practical articles on software engineering, product design, AI automation, e-commerce, and building digital products.',
    };
    if (child === 'careers') {
      const career = careers.find(item => item.slug === detail);
      if (career) return { title: `${career.title} Careers | CompanyFlow`, description: career.description };
      return { title: 'Careers at CompanyFlow | Opportunities', description: 'Explore career opportunities and ways to collaborate with CompanyFlow.' };
    }
    return { title: 'Resources | CompanyFlow', description: 'Read CompanyFlow insights on engineering, design, AI, and digital product development, or explore career opportunities.' };
  }
  return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
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

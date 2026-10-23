export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  readTime: string;
  date: string;
  author: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'shipping-daily-without-breaking-things',
    title: 'Shipping daily without breaking things',
    category: 'Engineering',
    excerpt: 'How we set up CI/CD pipelines with canary deploys and automated rollback so teams can ship multiple times a day with confidence.',
    readTime: '6 min read',
    date: '2026-10-12',
    author: 'Marcus Lindqvist',
    image: 'https://images.pexels.com/photos/17489163/pexels-photo-17489163.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    content: [
      'The fear of deploying is the single biggest productivity killer in software teams. When deploys are risky, teams batch changes, which makes each deploy riskier. It is a vicious cycle.',
      'The solution is not to deploy less often. It is to make deployments safe enough to do them constantly. We have helped twelve teams go from monthly deploys to daily deploys without increasing incidents. The recipe is always the same: automated tests, canary releases, and fast rollback.',
      'Start with a deployment pipeline that runs your full test suite on every push. Not just unit tests: integration tests, visual regression, and smoke tests in a staging environment that mirrors production. If the suite takes more than 10 minutes, parallelize it. Developers will not wait 30 minutes for a pipeline.',
      'Next, add canary deploys. Instead of replacing all instances at once, route 5% of traffic to the new version. Monitor error rates and latency for 10 minutes. If everything looks normal, ramp to 100%. If not, roll back automatically. This catches issues that tests miss without affecting most users.',
      'Finally, make rollback a one-button operation. If a deploy causes problems, you should be able to revert in under 60 seconds. This is not a nice-to-have; it is the psychological safety net that makes daily deploys possible. When rollback is easy, developers ship without fear.',
    ],
  },
  {
    slug: 'design-systems-that-actually-get-used',
    title: 'Design systems that actually get used',
    category: 'Design',
    excerpt: 'Why most design systems die within two years, and what the surviving ones do differently.',
    readTime: '8 min read',
    date: '2026-09-28',
    author: 'Yuki Tanaka',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    content: [
      'We have audited over 30 design systems in the past three years. Roughly two-thirds of them were abandoned within 18 months of launch. The components existed in Figma, but nobody used them. Engineers built their own buttons. Designers copied old files. The system was technically perfect and practically dead.',
      'The pattern is consistent: a design team spends three months building a beautiful system, publishes it to Figma and Storybook, sends an announcement email, and then waits. Adoption never comes. The system drifts. Six months later, someone proposes rebuilding it from scratch.',
      'The systems that survive do one thing differently: they are owned. Not by a committee, but by a person or a small team whose job includes maintaining the system, answering questions, reviewing pull requests, and evangelizing it. Without an owner, a design system is a museum exhibit.',
      'Surviving systems also make adoption the path of least resistance. If your component library is harder to use than copying an old file, people will copy the old file. Make installation a single command. Make documentation searchable. Make props intuitive. Visit teams in person and help them migrate. Remove friction everywhere you find it.',
      'Finally, treat the system as a product. Track adoption metrics. Collect feedback. Prioritize the component requests teams actually have. A design system that serves its users grows. One that serves the ego of its creators does not.',
    ],
  },
  {
    slug: 'ai-claims-automation-without-the-hype',
    title: 'AI claims automation without the hype',
    category: 'AI & Automation',
    excerpt: 'A practical guide to automating document-heavy workflows with LLMs, based on a real deployment processing 15,000 claims per month.',
    readTime: '7 min read',
    date: '2026-09-15',
    author: 'Thomas Graff',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    content: [
      'When we started working with Atlas Insurance on claims automation, the temptation was to throw an LLM at the entire pipeline and hope for the best. That approach fails in production. Documents are messy, edge cases are endless, and a 5% error rate at 15,000 claims per month means 750 mistakes. Some of those mistakes cost real money.',
      'The approach that actually works is a layered pipeline. First, OCR extracts text from scanned documents. Then, an LLM extracts structured data such as claimant name, policy number, incident date, and claimed amount into a schema. Then, a rules engine validates that data against business logic. Only then does a human adjuster review flagged cases.',
      'The key insight is that the LLM does not make decisions. It extracts information. Decisions are made by deterministic code that you can test, audit, and explain. This separation is what makes the system trustworthy enough for production.',
      `We also learned that prompt engineering matters less than evaluation infrastructure. Before deploying any change to the model or prompt, we run it against a test set of 500 annotated claims. If accuracy drops below 97%, the change does not ship. This test set is the project's most valuable artifact.`,
      'The result: 73% of claims are now processed without human intervention, and the remaining 27% are the complex cases that actually need adjuster judgment. Average processing time dropped from 4.5 days to 6 hours. The adjusters are happier because they do meaningful work instead of data entry.',
    ],
  },
  {
    slug: 'headless-commerce-why-we-stopped-using-shopify',
    title: 'Headless commerce: why we stopped defaulting to Shopify',
    category: 'Engineering',
    excerpt: 'When a store outgrows Shopify, a headless architecture gives you control over performance, checkout, and customer data.',
    readTime: '5 min read',
    date: '2026-08-30',
    author: 'Priya Raman',
    image: 'https://images.pexels.com/photos/6214474/pexels-photo-6214474.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    content: [
      'Shopify is an excellent platform for getting a store live quickly. But once you hit a certain scale, the constraints can become painful. Flash sales may crash the store, checkout flows may need customization, and you may want greater control over customer data.',
      `Headless commerce separates the storefront from the backend. You build a custom frontend with Next.js, connect it to a commerce engine via API, and own the entire customer experience. The result is faster pages, custom checkout, and data that lives in your database, not a third party's.`,
      'The tradeoff is complexity. You are now responsible for hosting, performance monitoring, and security. But for brands doing $1M+ in monthly revenue, the performance gains and conversion improvements pay for the added complexity many times over.',
    ],
  },
  {
    slug: 'the-real-cost-of-technical-debt',
    title: 'The real cost of technical debt',
    category: 'Engineering',
    excerpt: 'Technical debt is not just slow code. It is slow teams, missed deadlines, and developers who quit. Here is how to measure and manage it.',
    readTime: '6 min read',
    date: '2026-08-14',
    author: 'Dana Whitfield',
    image: 'https://images.pexels.com/photos/577195/pexels-photo-577195.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    content: [
      'Technical debt is the most misunderstood concept in engineering. Teams treat it as a code quality issue, but its real cost is measured in people, not milliseconds. Slow builds, flaky tests, and incomprehensible codebases do not just delay features. They burn out developers.',
      'The first sign of unmanageable debt is not a performance problem. It is when your most experienced engineers spend more time explaining the codebase than writing code. When every change requires a meeting to understand which system owns which data. When new hires take three months to ship their first feature.',
      'We measure debt with three metrics: cycle time (how long from first commit to production), change failure rate (how often deploys cause incidents), and time to onboard (how long before a new engineer ships independently). When any of these trend upward, debt is accumulating.',
      'Paying down debt is not about rewriting everything. It is about making incremental improvements that compound. Pick the most painful area, improve it measurably, and repeat. The goal is not a perfect codebase. It is a codebase where change is easy enough that the team can keep moving.',
    ],
  },
  {
    slug: 'accessibility-as-a-feature-not-a-bug-fix',
    title: 'Accessibility as a feature, not a bug fix',
    category: 'Design',
    excerpt: 'Why we treat WCAG compliance as a design requirement from day one, and how it improves the product for every user.',
    readTime: '4 min read',
    date: '2026-07-22',
    author: 'Yuki Tanaka',
    image: 'https://images.pexels.com/photos/273230/pexels-photo-273230.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    content: [
      'Accessibility is often treated as a compliance checklist at the end of a project. This is the most expensive way to do it. Retrofitting accessibility into a finished product means reworking components, retesting every screen, and arguing with stakeholders about what is "good enough."',
      'When accessibility is a design requirement from the start, it costs almost nothing. Semantic HTML is accessible by default. Color contrast is a design token, not an afterthought. Focus states are part of the component, not a patch.',
      'The surprising part is that accessibility improvements benefit every user, not just those with disabilities. Captioned videos are used by people watching on mute. High-contrast text is easier to read in sunlight. Keyboard navigation is faster for power users. Accessible design is simply good design.',
    ],
  },
];

export interface Career {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export const careers: Career[] = [
  {
    slug: 'senior-frontend-engineer',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote (EU/US)',
    type: 'Full-time',
    description: 'We are looking for a senior frontend engineer who cares deeply about performance, accessibility, and the craft of building interfaces that feel effortless.',
    responsibilities: [
      'Lead frontend development on client projects from discovery to launch',
      'Build reusable components and patterns within our design system',
      'Collaborate with designers to translate designs into pixel-perfect, accessible UIs',
      'Mentor mid-level engineers through code review and pairing',
    ],
    requirements: [
      '5+ years of professional experience with React and TypeScript',
      'Deep understanding of web performance, accessibility, and browser internals',
      'Experience with design systems and component libraries',
      'Strong communication skills; you will interact with clients regularly',
    ],
  },
  {
    slug: 'product-designer',
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote (EU/US)',
    type: 'Full-time',
    description: 'We need a product designer who can take a project from research to high-fidelity prototypes, and who cares about the handoff to engineering as much as the pixels.',
    responsibilities: [
      'Lead design on client projects, from user research to final handoff',
      'Build and maintain design system components in Figma',
      'Run usability tests and iterate based on findings',
      'Work closely with engineers to ensure design quality in production',
    ],
    requirements: [
      '4+ years of product design experience, ideally in SaaS or fintech',
      'Fluency in Figma, prototyping, and design systems',
      'Understanding of WCAG 2.1 and accessible design patterns',
      'Portfolio showing end-to-end product thinking, not just visuals',
    ],
  },
  {
    slug: 'devops-engineer',
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Remote (Global)',
    type: 'Full-time',
    description: 'We are hiring a DevOps engineer to build and maintain cloud infrastructure for our clients, with a focus on reliability, security, and automation.',
    responsibilities: [
      'Design and implement cloud infrastructure using Terraform',
      'Build CI/CD pipelines with automated testing and canary deploys',
      'Set up monitoring, alerting, and incident response processes',
      'Conduct security reviews and ensure compliance with industry standards',
    ],
    requirements: [
      '4+ years of experience with AWS, Docker, and Kubernetes',
      'Strong Terraform and infrastructure-as-code skills',
      'Experience with observability tools (Prometheus, Grafana, OpenTelemetry)',
      'Security mindset; you think about attack vectors by default',
    ],
  },
  {
    slug: 'ai-engineer',
    title: 'AI Engineer',
    department: 'Engineering',
    location: 'Remote (EU/US)',
    type: 'Full-time',
    description: 'We are looking for an AI engineer to build production AI systems rather than demos. If you care about evaluation, reliability, and real-world deployment, we want to talk.',
    responsibilities: [
      'Design and build AI-powered systems for document processing and automation',
      'Build evaluation infrastructure and maintain test sets',
      'Integrate LLMs, OCR, and custom models into production workflows',
      'Work with clients to define success metrics and measure them',
    ],
    requirements: [
      '3+ years of experience with Python and production ML systems',
      'Experience with LLMs, RAG pipelines, and prompt engineering at scale',
      'Strong understanding of evaluation methodology and statistical rigor',
      'Ability to explain AI systems to non-technical stakeholders',
    ],
  },
  {
    slug: 'project-manager',
    title: 'Technical Project Manager',
    department: 'Delivery',
    location: 'Remote (US)',
    type: 'Full-time',
    description: 'We need a technical project manager who can run multiple client engagements, keep teams unblocked, and communicate clearly with both engineers and executives.',
    responsibilities: [
      'Manage 2-3 concurrent client projects from kickoff to launch',
      'Run sprint planning, standups, and retrospectives',
      'Maintain project timelines, scopes, and budgets',
      'Serve as the primary client contact for project status',
    ],
    requirements: [
      '4+ years of project management in a software agency or product team',
      'Technical enough to understand engineering tradeoffs and estimate feasibility',
      'Exceptional written and verbal communication',
      'Calm under pressure; you are the steady hand when things get complex',
    ],
  },
];

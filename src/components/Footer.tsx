import { useState } from 'react';
import { ArrowRight, Twitter, Linkedin, Github, Dribbble } from 'lucide-react';
import { solutions } from '@/data/solutions';
import { openEmailFallback, submitNetlifyForm } from '@/lib/forms';

const footerNav = [
  {
    title: 'Pages',
    links: [
      { label: 'Home', path: '/' },
      { label: 'Company', path: '/company' },
      { label: 'Case Studies', path: '/case-studies' },
      { label: 'Contact', path: '/contact' },
    ],
  },
  {
    title: 'Solutions',
    links: solutions.map(sol => ({ label: sol.short, path: `/solutions/${sol.slug}` })),
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', path: '/resources/blog' },
      { label: 'Careers', path: '/resources/careers' },
    ],
  },
];

const socials = [
  { name: 'Twitter', href: 'https://twitter.com', Icon: Twitter },
  { name: 'LinkedIn', href: 'https://linkedin.com', Icon: Linkedin },
  { name: 'GitHub', href: 'https://github.com', Icon: Github },
  { name: 'Dribbble', href: 'https://dribbble.com', Icon: Dribbble },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'sending' | 'success' | 'fallback'>('idle');

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubscribeStatus('sending');
    const accepted = await submitNetlifyForm('newsletter-form', { email, 'bot-field': '' });
    if (accepted) { setSubscribeStatus('success'); return; }
    openEmailFallback('CompanyFlow newsletter subscription', `Please add this email address to the CompanyFlow newsletter: ${email}`);
    setSubscribeStatus('fallback');
  }

  return (
    <footer className="relative z-10 border-t border-line bg-bg-surface/80">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-[5vw] py-16">
        <div>
          <a href="/" className="text-2xl font-bold tracking-tight">
            CompanyFlow<span className="text-burgundy-light">.</span>
          </a>
          <p className="text-ink-muted text-sm mt-4 max-w-xs leading-relaxed">
            A premium software studio building web platforms, mobile apps, and intelligent systems for ambitious companies.
          </p>
          <div className="flex gap-3 mt-6">
            {socials.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                data-cursor={name}
                className="icon-btn w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink-muted hover:text-ink hover:border-burgundy-light"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {footerNav.map(col => (
          <div key={col.title}>
            <h4 className="font-mono text-xs uppercase tracking-widest text-burgundy-light mb-4">{col.title}</h4>
            <div className="flex flex-col gap-2">
              {col.links.map(link => (
                <a
                  key={link.path}
                  href={link.path}
                  data-cursor="Open"
                  className="flink text-sm text-ink-muted hover:text-ink w-fit"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest text-burgundy-light mb-4">Newsletter</h4>
          <p className="text-sm text-ink-muted mb-4">Monthly notes on engineering, design, and AI. No spam.</p>
          {subscribeStatus === 'success' ? (
            <p className="text-sm text-burgundy-light">Thanks. Your email was recorded. Newsletter confirmation emails are not configured automatically.</p>
          ) : (
            <form name="newsletter-form" onSubmit={handleSubscribe} className="flex gap-2">
              <input type="hidden" name="form-name" value="newsletter-form" />
              <div className="hidden" aria-hidden="true"><label>Do not fill this out<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></div>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 min-w-0 px-4 py-2.5 rounded-full bg-bg border border-line text-sm text-ink placeholder:text-ink-dim focus:outline-none focus:border-burgundy-light transition-colors"
              />
              <button type="submit" disabled={subscribeStatus === 'sending'} aria-label="Subscribe" className="px-4 py-2.5 rounded-full bg-burgundy text-onburg text-sm font-medium hover:bg-burgundy-light transition-[background-color,transform] active:scale-90 hover:scale-105 disabled:opacity-50">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
          {subscribeStatus === 'fallback' && <p role="status" className="mt-2 text-xs text-ink-muted">Your email app should open. Send the prepared message to complete the request, or email companyflow0@gmail.com.</p>}
          <div className="mt-6 space-y-1 text-sm text-ink-muted">
            <p>companyflow0@gmail.com</p>
            <p>Birmingham, United Kingdom</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-[5vw] py-6 border-t border-line text-xs text-ink-muted">
        <span>© 2026 CompanyFlow. All rights reserved.</span>
        <span className="font-mono uppercase tracking-widest">Built with taste, not templates</span>
      </div>
    </footer>
  );
}

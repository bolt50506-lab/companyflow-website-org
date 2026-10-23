import { useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { MagneticButton } from '@/components/MagneticButton';
import { ArrowRight, Check } from 'lucide-react';


const budgets = ['< $25k', '$25k – $50k', '$50k – $100k', '$100k+'];
const projectTypes = ['Web App', 'Mobile App', 'Custom Software', 'ERP', 'CRM', 'Shopify / E-commerce', 'UI/UX Design', 'Cloud / DevOps', 'AI / Automation', 'Data & BI', 'Not sure yet'];

export function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'fallback'>('idle');
  const [form, setForm] = useState({ name: '', email: '', company: '', budget: '', type: '', message: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch('/.netlify/functions/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, company: form.company, budget: form.budget, type: form.type, message: form.message }),
      });
      const result = await response.json() as { success?: boolean; error?: string };
      if (!response.ok || !result.success) throw new Error(result.error || 'Could not send your enquiry.');
      setStatus('success');
    } catch {
      setStatus('fallback');
    }
  };

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="grain">
      <PageHero label="Contact" title="Let's build" italicWord="something." subtitle="Tell us about your project. We'll get back within two business days." />

      <section className="px-[5vw] py-20 border-t border-line">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16">
          {/* Form */}
          <Reveal>
            {status === 'success' ? (
              <div className="border border-line rounded-3xl p-12 bg-bg-surface text-center">
                <div className="w-16 h-16 rounded-full bg-burgundy/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-burgundy-light" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-3">Enquiry received.</h3>
                <p className="text-ink-muted">Thanks, {form.name || 'there'}. Your message was accepted by the website form service. Our team will review it.</p>
              </div>
            ) : (
              <form name="contact-form" onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="form-name" value="contact-form" />
                <div className="hidden" aria-hidden="true"><label>Do not fill this out<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Name">
                    <input required value={form.name} onChange={e => update('name', e.target.value)} className="input" placeholder="Jane Doe" data-cursor="Type" />
                  </Field>
                  <Field label="Email">
                    <input required type="email" value={form.email} onChange={e => update('email', e.target.value)} className="input" placeholder="jane@company.com" data-cursor="Type" />
                  </Field>
                </div>
                <Field label="Company">
                  <input value={form.company} onChange={e => update('company', e.target.value)} className="input" placeholder="Acme Inc." data-cursor="Type" />
                </Field>

                <Field label="Project type">
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => update('type', t)}
                        data-cursor="Select"
                        className={`px-4 py-2 rounded-full text-sm border transition-[background-color,border-color,color,transform] duration-300 active:scale-95 hover:-translate-y-0.5 ${
                          form.type === t ? 'bg-burgundy border-burgundy text-onburg' : 'border-line text-ink-muted hover:border-burgundy-light'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Budget">
                  <div className="flex flex-wrap gap-2">
                    {budgets.map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => update('budget', b)}
                        data-cursor="Select"
                        className={`px-4 py-2 rounded-full text-sm border transition-[background-color,border-color,color,transform] duration-300 active:scale-95 hover:-translate-y-0.5 ${
                          form.budget === b ? 'bg-burgundy border-burgundy text-onburg' : 'border-line text-ink-muted hover:border-burgundy-light'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Tell us about your project">
                  <textarea required value={form.message} onChange={e => update('message', e.target.value)} rows={5} className="input resize-none" placeholder="What are you building? What problem does it solve?" data-cursor="Type" />
                </Field>

                {status === 'fallback' && <p role="status" className="text-sm text-ink-muted">We couldn't send your enquiry just now. Please email companyflow0@gmail.com directly.</p>}
                <MagneticButton type="submit" className="px-7 py-4 text-base w-full justify-center" data-cursor="Send">
                  {status === 'sending' ? 'Sending…' : 'Send message'} <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </form>
            )}
          </Reveal>

          {/* Sidebar */}
          <Reveal delay={100}>
            <div className="lg:sticky lg:top-32 space-y-10">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-burgundy-light mb-3">Email</h3>
                <a href="mailto:companyflow0@gmail.com" className="text-lg hover:text-burgundy-light transition-colors" data-cursor="Email">companyflow0@gmail.com</a>
              </div>
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-burgundy-light mb-3">Studio</h3>
                <p className="text-ink-muted">Birmingham, United Kingdom</p>
              </div>
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-burgundy-light mb-3">Response time</h3>
                <p className="text-ink-muted">Within two business days. For urgent inquiries, mark your subject line as "Time-sensitive."</p>
              </div>
              <div className="pt-6 border-t border-line">
                <h3 className="font-mono text-xs uppercase tracking-widest text-burgundy-light mb-3">Follow</h3>
                <div className="flex gap-3">
                  {[['GitHub', 'https://github.com'], ['LinkedIn', 'https://linkedin.com'], ['Dribbble', 'https://dribbble.com'], ['X', 'https://x.com']].map(([s, url]) => (
                    <a key={s} href={url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full border border-line text-sm text-ink-muted hover:border-burgundy-light hover:text-ink transition-colors" data-cursor="Open">{s}</a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-widest text-ink-muted block mb-3">{label}</span>
      {children}
    </label>
  );
}

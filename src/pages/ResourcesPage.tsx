import { Reveal, SplitHeading } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { MagneticButton } from '@/components/MagneticButton';
import { useHashRoute } from '@/lib/router';
import { blogPosts, careers } from '@/data/content';
import { useState } from 'react';
import { ArrowRight, ArrowLeft, Clock, MapPin, Briefcase, X, Upload } from 'lucide-react';
import { openEmailFallback, submitNetlifyForm } from '@/lib/forms';

export function ResourcesPage() {
  const { route } = useHashRoute();
  const parts = route.split('/').filter(Boolean);

  if (parts.length >= 3 && parts[1] === 'blog' && parts[2]) {
    return <BlogDetail slug={parts[2]} />;
  }
  if (parts[1] === 'blog') return <BlogList />;
  if (parts[1] === 'careers') return <CareersList />;
  return <ResourcesIndex />;
}

function ResourcesIndex() {
  return (
    <div className="grain">
      <PageHero label="Resources" title="Ideas and" italicWord="opportunities." subtitle="Read our thinking on engineering, design, and AI, or join the team." />
      <section className="px-[5vw] py-20 border-t border-line">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Reveal>
            <a href="/resources/blog" data-cursor="Open" className="group block border border-line rounded-3xl p-10 bg-bg-surface hover:border-burgundy-light transition-all">
              <h3 className="text-3xl font-bold tracking-tight mb-3">Blog</h3>
              <p className="text-ink-muted">Essays on engineering, design, AI, and the business of building software.</p>
              <span className="inline-flex items-center gap-2 mt-6 text-sm font-medium group-hover:gap-3 transition-all">Read articles <ArrowRight className="w-4 h-4 text-burgundy-light" /></span>
            </a>
          </Reveal>
          <Reveal delay={80}>
            <a href="/resources/careers" data-cursor="Open" className="group block border border-line rounded-3xl p-10 bg-bg-surface hover:border-burgundy-light transition-all">
              <h3 className="text-3xl font-bold tracking-tight mb-3">Careers</h3>
              <p className="text-ink-muted">Join a senior-only studio that values craft, autonomy, and plain-spoken communication.</p>
              <span className="inline-flex items-center gap-2 mt-6 text-sm font-medium group-hover:gap-3 transition-all">See open roles <ArrowRight className="w-4 h-4 text-burgundy-light" /></span>
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function BlogList() {
  return (
    <div className="grain">
      <PageHero label="Blog" title="Notes from the" italicWord="studio." subtitle="Essays on engineering, design, AI, and the business of building software." />
      <section className="px-[5vw] py-20 border-t border-line">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 60}>
              <a href={`/resources/blog/${post.slug}`} data-cursor="Read" className="group block border border-line rounded-3xl overflow-hidden bg-bg-surface hover:border-burgundy-light transition-all hover:-translate-y-1.5 h-full">
                <div className="h-48 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs text-burgundy-light">{post.category}</span>
                    <span className="text-xs text-ink-dim flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight mb-2 group-hover:text-burgundy-light transition-colors">{post.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{post.excerpt}</p>
                  <div className="mt-4 text-xs text-ink-dim font-mono">{post.date} · {post.author}</div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

function BlogDetail({ slug }: { slug: string }) {
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return <div className="pt-40 px-[5vw]"><p>Post not found.</p><a href="/resources/blog" className="text-burgundy-light mt-4 inline-block">← Back to blog</a></div>;

  return (
    <div className="grain">
      <article className="pt-32 pb-20">
        <div className="px-[5vw] max-w-3xl mx-auto">
          <a href="/resources/blog" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </a>
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs text-burgundy-light">{post.category}</span>
            <span className="text-xs text-ink-dim flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
          </div>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-tight mb-6">{post.title}</h1>
          <div className="text-sm text-ink-muted mb-10 font-mono">{post.date} · {post.author}</div>
          <div className="rounded-3xl overflow-hidden mb-10 border border-line">
            <img src={post.image} alt={post.title} className="w-full" />
          </div>
          <div className="space-y-6">
            {post.content.map((para, i) => (
              <Reveal key={i}>
                <p className={`leading-relaxed ${i === 0 ? 'text-xl' : 'text-base'} text-ink-muted`}>{para}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </article>
      <section className="px-[5vw] py-16 border-t border-line">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold tracking-tight mb-6">More articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.filter(p => p.slug !== slug).slice(0, 2).map(p => (
              <a key={p.slug} href={`/resources/blog/${p.slug}`} data-cursor="Read" className="group border border-line rounded-2xl p-6 bg-bg-surface hover:border-burgundy-light transition-colors">
                <span className="font-mono text-xs text-burgundy-light">{p.category}</span>
                <h4 className="text-lg font-semibold mt-2 group-hover:text-burgundy-light transition-colors">{p.title}</h4>
                <p className="text-sm text-ink-muted mt-2">{p.excerpt}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CareersList() {
  const perks = ['Remote-first', 'Senior-only team', '4-day work week', 'Conference budget', 'Hardware of choice', 'Equity options'];
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [appStatus, setAppStatus] = useState<'idle' | 'sending' | 'success' | 'fallback' | 'error'>('idle');
  const [appError, setAppError] = useState('');

  async function submitApplication(event: React.FormEvent<HTMLFormElement>, job: typeof careers[number]) {
    event.preventDefault();
    setAppError('');
    const form = event.currentTarget;
    const data = new FormData(form);
    const resume = data.get('resume');
    if (!(resume instanceof File) || resume.size === 0) {
      setAppError('Please attach your CV or resume.');
      return;
    }
    if (resume.size > 8 * 1024 * 1024) {
      setAppError('Your file is larger than 8 MB. Please choose a smaller PDF, DOC, or DOCX file.');
      return;
    }
    setAppStatus('sending');
    const values = {
      'job-title': job.title,
      name: String(data.get('name') || ''),
      email: String(data.get('email') || ''),
      phone: String(data.get('phone') || ''),
      portfolio: String(data.get('portfolio') || ''),
      'cover-note': String(data.get('cover-note') || ''),
      resume,
      'bot-field': '',
    };
    const accepted = await submitNetlifyForm('job-application', values);
    if (accepted) { setAppStatus('success'); form.reset(); return; }
    const emailBody = `Job: ${job.title}\nName: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone || 'Not provided'}\nPortfolio/LinkedIn: ${values.portfolio || 'Not provided'}\n\nCover note:\n${values['cover-note'] || 'Not provided'}\n\nResume file selected: ${resume.name}\nPlease attach this file manually before sending.`;
    openEmailFallback(`Job application: ${job.title}`, emailBody);
    setAppStatus('fallback');
  }

  return (
    <div className="grain">
      <PageHero label="Careers" title="Build things" italicWord="that matter." subtitle="We are a senior-only studio. We hire experienced people, give them real autonomy, and trust them to do great work." />
      <section className="px-[5vw] py-20 border-t border-line">
        <SplitHeading text="Why work here." className="text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-tight mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {perks.map((p, i) => <Reveal key={p} delay={i * 40}><div className="border border-line rounded-2xl p-6 bg-bg-surface hover:border-burgundy-light transition-colors"><div className="text-lg font-semibold tracking-tight">{p}</div></div></Reveal>)}
        </div>
      </section>
      <section className="px-[5vw] py-20 border-t border-line">
        <SplitHeading text="Open roles." className="text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-tight mb-12" />
        <div className="flex flex-col gap-4">
          {careers.map((job, i) => (
            <Reveal key={job.slug} delay={i * 40}>
              <div className="border border-line rounded-3xl p-6 md:p-8 bg-bg-surface hover:border-burgundy-light transition-all">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] items-center gap-4">
                  <div><h3 className="text-xl font-semibold tracking-tight">{job.title}</h3><p className="text-sm text-ink-muted mt-1">{job.description}</p></div>
                  <span className="hidden md:flex items-center gap-1.5 font-mono text-xs text-ink-muted"><Briefcase className="w-3.5 h-3.5" />{job.department}</span>
                  <span className="hidden md:flex items-center gap-1.5 font-mono text-xs text-ink-muted"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                  <span className="font-mono text-xs px-3 py-1.5 rounded-full border border-line text-ink-muted w-fit">{job.type}</span>
                </div>
                <div className="mt-6 pt-5 border-t border-line">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div><h4 className="font-mono text-xs uppercase tracking-widest text-burgundy-light mb-2">Responsibilities</h4><ul className="space-y-1 text-sm text-ink-muted">{job.responsibilities.map(r => <li key={r}>• {r}</li>)}</ul></div>
                    <div><h4 className="font-mono text-xs uppercase tracking-widest text-burgundy-light mb-2">Requirements</h4><ul className="space-y-1 text-sm text-ink-muted">{job.requirements.map(r => <li key={r}>• {r}</li>)}</ul></div>
                  </div>
                  <button type="button" onClick={() => { setSelectedJob(selectedJob === job.slug ? null : job.slug); setAppStatus('idle'); setAppError(''); }} className="inline-flex items-center gap-2 rounded-full bg-burgundy px-5 py-3 text-sm font-medium text-white hover:bg-burgundy-light transition-colors" aria-expanded={selectedJob === job.slug}>
                    {selectedJob === job.slug ? 'Close application' : 'Apply now'} {selectedJob === job.slug ? <X className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </button>
                  {selectedJob === job.slug && <div className="mt-6 rounded-2xl border border-line bg-bg p-5 md:p-7">
                    {appStatus === 'success' ? <div role="status" className="py-4"><h4 className="text-xl font-semibold mb-2">Application received</h4><p className="text-sm text-ink-muted">The website form service accepted your application for {job.title}. Please keep a copy of your details.</p></div> : <>
                      <h4 className="text-xl font-semibold mb-1">Apply for {job.title}</h4><p className="text-sm text-ink-muted mb-5">Attach a CV or resume (PDF, DOC, or DOCX, maximum 8 MB). Applications are submitted through the website form service when enabled.</p>
                      <form name="job-application" onSubmit={e => submitApplication(e, job)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="hidden" name="form-name" value="job-application" /><input type="hidden" name="job-title" value={job.title} />
                        <div className="hidden" aria-hidden="true"><label>Do not fill this out<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></div>
                        <label className="text-sm text-ink-muted">Full name<input required name="name" autoComplete="name" className="input mt-2" placeholder="Your full name" /></label>
                        <label className="text-sm text-ink-muted">Email address<input required type="email" name="email" autoComplete="email" className="input mt-2" placeholder="you@example.com" /></label>
                        <label className="text-sm text-ink-muted">Phone (optional)<input name="phone" type="tel" autoComplete="tel" className="input mt-2" placeholder="Country code + number" /></label>
                        <label className="text-sm text-ink-muted">Portfolio or LinkedIn (optional)<input name="portfolio" type="url" className="input mt-2" placeholder="https://" /></label>
                        <label className="md:col-span-2 text-sm text-ink-muted">CV / Resume<input required name="resume" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="input mt-2 file:mr-3 file:rounded-full file:border-0 file:bg-burgundy file:px-3 file:py-2 file:text-white" /></label>
                        <label className="md:col-span-2 text-sm text-ink-muted">Short cover note (optional)<textarea name="cover-note" rows={4} maxLength={4000} className="input mt-2 resize-y" placeholder="Tell us briefly why this role interests you." /></label>
                        {appError && <p role="alert" className="md:col-span-2 text-sm text-red-400">{appError}</p>}
                        {appStatus === 'fallback' && <p role="status" className="md:col-span-2 text-sm text-ink-muted">Your email app should open with your application details. Please attach the selected CV manually and send the email to complete your application. If it does not open, email companyflow0@gmail.com.</p>}
                        <div className="md:col-span-2 flex flex-wrap items-center gap-3"><button disabled={appStatus === 'sending'} type="submit" className="inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-white hover:bg-burgundy-light disabled:opacity-50">{appStatus === 'sending' ? 'Submitting…' : 'Submit application'} <Upload className="h-4 w-4" /></button><p className="text-xs text-ink-dim">Your details are used to review this application.</p></div>
                      </form>
                    </>}
                  </div>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

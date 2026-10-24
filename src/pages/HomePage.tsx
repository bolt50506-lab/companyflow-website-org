import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Reveal, SplitHeading, SectionLabel, CountUp, TextWriteReveal } from '@/components/Reveal';
import { MagneticButton } from '@/components/MagneticButton';
import { Marquee } from '@/components/Marquee';
import { SpotlightMarquee } from '@/components/SpotlightMarquee';
import { stats, processSteps } from '@/data/team';
import { solutions } from '@/data/solutions';
import { caseStudies } from '@/data/caseStudies';
import { getIcon } from '@/lib/icons';
import { BusinessSoftware } from '@/components/BusinessSoftware';
import { HeroImage } from '@/components/HeroImage';

const featuredSlugs = ['floraison', 'vault-payments', 'meridianrx', 'summit-crm', 'aldera', 'harvest-erp', 'nexora-erp', 'noor-adorn', 'labstack', 'metro-mart'];
const featuredProjects = featuredSlugs
  .map(slug => caseStudies.find(c => c.slug === slug))
  .filter((c): c is (typeof caseStudies)[number] => Boolean(c));

const numberWords = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen'];

export function HomePage() {
  return (
    <div className="grain">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-end px-[5vw] pb-16 pt-32">
        <HeroImage />
        <div className="hero-in flex items-center gap-3 mb-8" style={{ animationDelay: '0ms' }}>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-blink" />
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            Open to discussing your next project
          </span>
        </div>
        <h1 style={{ animationDelay: '120ms' }} className="hero-in text-[clamp(2.8rem,9vw,8.5rem)] font-bold leading-[0.92] tracking-tight max-w-5xl text-balance">
          Custom software,{' '}
          <span className="font-display italic text-burgundy-light">engineered</span>{' '}
          with taste.
        </h1>
        <div className="flex flex-wrap items-end justify-between gap-8 mt-12">
          <div style={{ animationDelay: '320ms' }} className="hero-in max-w-md">
            <TextWriteReveal className="text-lg text-ink-muted leading-relaxed" text="Good software should make work simpler. We bring product thinking, thoughtful design, and practical engineering together to help turn a business need into a useful digital experience." />
          </div>
          <div style={{ animationDelay: '440ms' }} className="hero-in flex gap-3">
            <MagneticButton href="/contact" className="px-7 py-4 text-base" data-cursor="Start">
              Start a project <ArrowRight className="w-4 h-4" />
            </MagneticButton>
            <MagneticButton href="/case-studies" variant="outline" className="px-7 py-4 text-base" data-cursor="View">
              See our work
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-[5vw] py-20 border-t border-line">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="border-t border-burgundy-light/30 pt-4">
                <div className="text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-tight tabular-nums"><CountUp value={s.value} /></div>
                <div className="font-mono text-xs uppercase tracking-widest text-ink-muted mt-2">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Client marquee */}
      <Marquee />

      {/* Featured projects: spotlight marquee */}
      <section className="py-24">
        <div className="px-[5vw] mb-12">
          <SectionLabel className="mb-4">Selected work</SectionLabel>
          <SplitHeading text="Things we've built." className="text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight" />
        </div>
        <SpotlightMarquee items={featuredProjects} />
        <div className="mt-8 px-[5vw] flex flex-wrap items-center justify-between gap-4">
          <a href="/case-studies" data-cursor="View all" className="inline-flex items-center gap-2 text-sm font-medium border-b border-line hover:border-burgundy-light pb-1 transition-colors">
            View all case studies <ArrowUpRight className="w-4 h-4" />
          </a>
          <MagneticButton href="/contact" className="px-5 py-3 text-sm" data-cursor="Start">
            Start a project <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>
      </section>

      {/* ERP / CRM / custom software */}
      <BusinessSoftware />

      {/* Services overview */}
      <section className="py-24 px-[5vw] border-t border-line">
        <SectionLabel className="mb-6">What we do</SectionLabel>
        <SplitHeading text={`${numberWords[solutions.length] ?? solutions.length} disciplines, one team.`} className="text-[clamp(2rem,5.5vw,5rem)] font-bold tracking-tight mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((s, i) => {
            const Icon = getIcon(s.icon);
            return (
              <Reveal key={s.slug} delay={i * 60}>
                <a
                  href={`/solutions/${s.slug}`}
                  data-cursor="Open"
                  className="block group border border-line rounded-3xl p-8 bg-bg-surface hover:border-burgundy-light transition-[transform,border-color] duration-500 hover:-translate-y-1.5 h-full"
                >
                  <div className="icon-tile w-12 h-12 rounded-2xl bg-burgundy/15 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-burgundy-light" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight mb-2">{s.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed mb-4">{s.tagline}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-4 h-4 text-burgundy-light" />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-[5vw] border-t border-line">
        <SectionLabel className="mb-6">How we work</SectionLabel>
        <SplitHeading text="From discovery to support." className="text-[clamp(2rem,5.5vw,5rem)] font-bold tracking-tight mb-16" />
        <div className="flex flex-col gap-0">
          {processSteps.map((step, i) => (
            <Reveal key={step.num} delay={i * 50}>
              <div className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr_1fr] gap-4 py-8 border-t border-line group hover:bg-bg-surface/30 transition-colors -mx-[5vw] px-[5vw]">
                <span className="font-mono text-sm text-ink-muted">{step.num}</span>
                <h3 className="text-[clamp(1.5rem,4vw,3rem)] font-bold tracking-tight group-hover:translate-x-3 transition-transform duration-500">{step.title}</h3>
                <p className="text-ink-muted leading-relaxed max-w-md">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Engagement principles */}
      <section className="py-24 px-[5vw] border-t border-line">
        <SectionLabel className="mb-6">Working together</SectionLabel>
        <SplitHeading text="Clear work. Shared decisions." className="text-[clamp(2rem,5.5vw,5rem)] font-bold tracking-tight mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'A clear scope', desc: 'Agree on the problem, priorities, deliverables and constraints before implementation begins.' },
            { title: 'Visible progress', desc: 'Review working increments, discuss trade-offs and keep decisions connected to your business goals.' },
            { title: 'A considered handover', desc: 'Receive practical documentation and a clear path for operating, maintaining and extending the product.' },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="h-full border border-line rounded-3xl p-8 bg-bg-surface">
                <div className="font-mono text-xs text-burgundy-light mb-5">0{i + 1}</div>
                <h3 className="text-2xl font-semibold tracking-tight mb-3">{item.title}</h3>
                <p className="text-ink-muted leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-[5vw] border-t border-line text-center">
        <SplitHeading text="Got a project?" italicWords={[2, 3]} className="text-[clamp(2.5rem,8vw,8rem)] font-bold tracking-tight" />
        <div className="mt-8">
          <a href="/contact" data-cursor="Email" className="inline-block text-[clamp(1.2rem,4vw,3rem)] font-semibold border-b-2 border-burgundy-light pb-2 hover:text-burgundy-light transition-colors">
            companyflow0@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}

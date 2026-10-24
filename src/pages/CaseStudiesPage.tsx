import { useState } from 'react';
import { Reveal, SplitHeading } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { MagneticButton } from '@/components/MagneticButton';
import { useHashRoute } from '@/lib/router';
import { caseStudies, type CaseStudy } from '@/data/caseStudies';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const categories = ['All', ...Array.from(new Set(caseStudies.map(c => c.category)))];

export function CaseStudiesPage() {
  const { route } = useHashRoute();
  const parts = route.split('/').filter(Boolean);

  if (parts.length >= 2 && parts[1]) {
    const study = caseStudies.find(c => c.slug === parts[1]);
    if (study) return <CaseStudyDetail study={study} />;
  }

  return <CaseStudiesGrid />;
}

function CaseStudiesGrid() {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? caseStudies : caseStudies.filter(c => c.category === filter);

  return (
    <div className="grain">
      <PageHero label="Case Studies" title="Selected projects," italicWord="built around real workflows." subtitle={`Explore ${caseStudies.length} project examples across business software, e-commerce, healthcare, SaaS, logistics and digital products.`} />
      
      {/* Filter bar */}
      <section className="px-[5vw] py-8 border-t border-line sticky top-16 z-30 bg-bg/90">
        <div className="case-study-filters flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              data-cursor="Filter"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-[background-color,border-color,color,transform] duration-300 active:scale-95 hover:-translate-y-0.5 border ${
                filter === cat
                  ? 'bg-burgundy text-onburg border-burgundy'
                  : 'border-line text-ink-muted hover:border-burgundy-light hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-[5vw] py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((study, i) => (
            <Reveal key={`${filter}-${study.slug}`} delay={(i % 3) * 60}>
              <a
                href={`/case-studies/${study.slug}`}
                data-cursor="View"
                className="group block border border-line rounded-3xl overflow-hidden bg-bg-surface hover:border-burgundy-light transition-[transform,border-color] duration-500 hover:-translate-y-2 h-full"
              >
                <div className="h-52 overflow-hidden bg-bg-surface2 relative">
                  <img src={study.image} alt={study.project} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-bg/85 font-mono text-xs text-burgundy-light border border-line">{study.category}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold tracking-tight mb-1">{study.project}</h3>
                  <p className="text-sm text-ink-muted mb-3">{study.industry}</p>
                  <p className="text-sm text-ink-muted leading-relaxed">{study.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {study.tech.slice(0, 4).map(t => (
                      <span key={t} className="px-2.5 py-1 rounded-full border border-line font-mono text-[10px] text-ink-muted">{t}</span>
                    ))}
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

function CaseStudyDetail({ study }: { study: CaseStudy }) {
  return (
    <div className="grain">
      <section className="pt-32 pb-12 px-[5vw]">
        <a href="/case-studies" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> All case studies
        </a>
        <span className="font-mono text-xs uppercase tracking-widest text-burgundy-light">{study.category} · {study.industry}</span>
        <h1 className="text-[clamp(2rem,6vw,5rem)] font-bold leading-tight tracking-tight mt-4 max-w-4xl">{study.project}</h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-muted leading-relaxed">{study.description}</p>
      </section>

      <section className="px-[5vw]">
        <div className="rounded-3xl overflow-hidden border border-line max-h-[60vh]">
          <img src={study.image} alt={study.project} className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Overview / Challenge / Solution */}
      <section className="px-[5vw] py-16 border-t border-line">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-burgundy-light mb-4">Overview</h3>
            <p className="text-ink-muted leading-relaxed">{study.overview}</p>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-burgundy-light mb-4">Challenge</h3>
            <p className="text-ink-muted leading-relaxed">{study.challenge}</p>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-burgundy-light mb-4">Solution</h3>
            <p className="text-ink-muted leading-relaxed">{study.solution}</p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-[5vw] py-16 border-t border-line">
        <h3 className="font-mono text-xs uppercase tracking-widest text-burgundy-light mb-6">Gallery</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {study.gallery.map((img, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="rounded-2xl overflow-hidden border border-line aspect-video">
                <img src={img} alt={`${study.project} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="px-[5vw] py-16 border-t border-line">
        <h3 className="font-mono text-xs uppercase tracking-widest text-burgundy-light mb-6">Tech stack</h3>
        <div className="flex flex-wrap gap-3">
          {study.tech.map(t => (
            <div key={t} className="px-5 py-3 rounded-full border border-line bg-bg-surface font-mono text-sm" data-cursor={t}>{t}</div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-[5vw] border-t border-line text-center">
        <SplitHeading text="Your project could be next." italicWords={[3, 4]} className="text-[clamp(2rem,6vw,5rem)] font-bold tracking-tight" />
        <div className="mt-8">
          <MagneticButton href="/contact" className="px-7 py-4 text-base" data-cursor="Start">
            Start a project <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}

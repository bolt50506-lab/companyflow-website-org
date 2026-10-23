import { useHashRoute } from '@/lib/router';
import { Reveal, SplitHeading, SectionLabel } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { MagneticButton } from '@/components/MagneticButton';
import { solutions } from '@/data/solutions';
import { caseStudies } from '@/data/caseStudies';
import { getIcon } from '@/lib/icons';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export function SolutionsPage() {
  const { route } = useHashRoute();
  const slug = route.split('/').filter(Boolean).pop();
  const solution = solutions.find(s => s.slug === slug);

  if (!solution) {
    return (
      <div className="grain">
        <PageHero label="Solutions" title="What we can" italicWord="build for you." />
        <div className="px-[5vw] py-20 border-t border-line">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((s, i) => {
              const Icon = getIcon(s.icon);
              return (
                <Reveal key={s.slug} delay={i * 60}>
                  <a href={`/solutions/${s.slug}`} data-cursor="Open" className="block group border border-line rounded-3xl p-8 bg-bg-surface hover:border-burgundy-light transition-[transform,border-color] duration-500 hover:-translate-y-1.5 h-full">
                    <div className="icon-tile w-12 h-12 rounded-2xl bg-burgundy/15 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-burgundy-light" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight mb-2">{s.title}</h3>
                    <p className="text-sm text-ink-muted leading-relaxed">{s.tagline}</p>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const Icon = getIcon(solution.icon);
  const byCategory = caseStudies.filter(c => solution.categories.includes(c.category));
  const byTech = caseStudies.filter(c => !byCategory.includes(c) && solution.techStack.some(t => c.tech.includes(t)));
  const related = [...byCategory, ...byTech].slice(0, 3);

  return (
    <div className="grain">
      <section className="min-h-[70vh] flex flex-col justify-end pt-32 pb-16 px-[5vw]">
        <a href="/solutions" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> All solutions
        </a>
        <SectionLabel className="mb-6">{solution.short}</SectionLabel>
        <div className="flex items-start gap-6">
          <div className="hidden md:flex w-20 h-20 rounded-3xl bg-burgundy/15 items-center justify-center flex-none animate-float">
            <Icon className="w-10 h-10 text-burgundy-light" />
          </div>
          <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight">
            {solution.title}
          </h1>
        </div>
        <p className="mt-8 max-w-2xl text-lg text-ink-muted leading-relaxed">{solution.description}</p>
      </section>

      {/* Capabilities */}
      <section className="px-[5vw] py-20 border-t border-line">
        <SectionLabel className="mb-6">Capabilities</SectionLabel>
        <SplitHeading text="What we do." className="text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line rounded-3xl overflow-hidden">
          {solution.capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 50}>
              <div className="bg-bg p-8 hover:bg-bg-surface transition-colors">
                <div className="font-mono text-xs text-burgundy-light mb-3">0{i + 1}</div>
                <h3 className="text-xl font-semibold tracking-tight mb-2">{c.title}</h3>
                <p className="text-ink-muted leading-relaxed">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="px-[5vw] py-20 border-t border-line">
        <SectionLabel className="mb-6">Tech stack</SectionLabel>
        <SplitHeading text="Tools we build with." className="text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight mb-12" />
        <div className="flex flex-wrap gap-3">
          {solution.techStack.map((t, i) => (
            <Reveal key={t} delay={i * 40}>
              <div className="px-5 py-3 rounded-full border border-line bg-bg-surface font-mono text-sm hover:border-burgundy-light transition-colors" data-cursor={t}>
                {t}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Related case studies */}
      {related.length > 0 && (
        <section className="px-[5vw] py-20 border-t border-line">
          <SectionLabel className="mb-6">Related work</SectionLabel>
          <SplitHeading text="Proof, not promises." className="text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <a href={`/case-studies/${p.slug}`} data-cursor="View" className="group block border border-line rounded-3xl overflow-hidden bg-bg-surface hover:border-burgundy-light transition-[transform,border-color] duration-500 hover:-translate-y-1.5">
                  <div className="h-40 overflow-hidden">
                    <img src={p.image} alt={p.project} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5">
                    <span className="font-mono text-xs text-burgundy-light">{p.category}</span>
                    <h3 className="text-lg font-semibold mt-2 tracking-tight">{p.project}</h3>
                    <p className="text-sm text-ink-muted mt-2">{p.description}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-32 px-[5vw] border-t border-line text-center">
        <SplitHeading text="Let's build it." italicWords={[1, 2]} className="text-[clamp(2rem,6vw,5rem)] font-bold tracking-tight" />
        <div className="mt-8">
          <MagneticButton href="/contact" className="px-7 py-4 text-base" data-cursor="Start">
            Start a project <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}

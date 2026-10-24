import { Reveal, SplitHeading, SectionLabel, TextWriteReveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { MagneticButton } from '@/components/MagneticButton';
import { teamMembers, officeGallery, values, timeline } from '@/data/team';
import { ArrowRight } from 'lucide-react';

export function CompanyPage() {
  return (
    <div className="grain">
      <PageHero
        label="Company"
        title="A senior team,"
        italicWord="built for the long run."
        subtitle="We are an independent software studio combining product thinking, thoughtful design and practical engineering. You work directly with the people building your product, from discovery through launch and support."
      />

      {/* Mission */}
      <section className="px-[5vw] py-20 border-t border-line">
        <div className="max-w-3xl">
          <Reveal>
            <TextWriteReveal className="text-[clamp(1.3rem,3vw,2rem)] leading-relaxed text-ink-muted" text="Most agencies sell you a project and disappear. We hand you a product your team can run, edit, and grow without needing us for every small change. We measure success by how little you need us after launch." />
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-[5vw] py-20 border-t border-line">
        <SectionLabel className="mb-6">Our story</SectionLabel>
        <SplitHeading text="From a laptop to a studio." className="text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight mb-16" />
        <div className="flex flex-col gap-0">
          {timeline.map((t, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr_2fr] gap-4 py-8 border-t border-line">
                <span className="font-mono text-sm text-burgundy-light">{t.year}</span>
                <h3 className="text-lg md:text-xl font-semibold tracking-tight">{t.title}</h3>
                <p className="text-ink-muted leading-relaxed">{t.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="px-[5vw] py-20 border-t border-line">
        <SectionLabel className="mb-6">What we believe</SectionLabel>
        <SplitHeading text="Four principles." className="text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 60}>
              <div className="border border-line rounded-3xl p-8 bg-bg-surface hover:border-burgundy-light transition-colors">
                <div className="font-mono text-xs text-burgundy-light mb-4">0{i + 1}</div>
                <h3 className="text-2xl font-semibold tracking-tight mb-3">{v.title}</h3>
                <p className="text-ink-muted leading-relaxed">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="px-[5vw] py-20 border-t border-line">
        <SectionLabel className="mb-6">The team</SectionLabel>
        <SplitHeading text="People behind your product." className="text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight mb-16" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teamMembers.map((m, i) => (
            <Reveal key={m.name} delay={i * 50}>
              <div className="group" data-cursor="View">
                <div className="aspect-square rounded-2xl overflow-hidden bg-bg-surface2 border border-line mb-4">
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                </div>
                <h3 className="font-semibold tracking-tight">{m.name}</h3>
                <p className="text-sm text-ink-muted">{m.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Office gallery */}
      <section className="px-[5vw] py-20 border-t border-line">
        <SectionLabel className="mb-6">Culture</SectionLabel>
        <SplitHeading text="Where we work." className="text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {officeGallery.map((img, i) => (
            <Reveal key={i} delay={i * 40}>
              <div className={`overflow-hidden rounded-2xl border border-line ${i === 0 ? 'col-span-2 md:col-span-2 row-span-2 aspect-[16/10]' : 'aspect-[4/3]'}`}>
                <img src={img} alt="Office" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-[5vw] border-t border-line text-center">
        <SplitHeading text="Want to join us?" italicWords={[2, 3]} className="text-[clamp(2rem,6vw,5rem)] font-bold tracking-tight" />
        <p className="mt-6 text-ink-muted max-w-md mx-auto">We're always looking for senior people who care about craft.</p>
        <div className="mt-8">
          <MagneticButton href="/resources/careers" className="px-7 py-4 text-base" data-cursor="Open">
            See open roles <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}

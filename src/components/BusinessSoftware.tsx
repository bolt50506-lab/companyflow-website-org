import { ArrowUpRight } from 'lucide-react';
import { Reveal, SectionLabel, SplitHeading } from '@/components/Reveal';
import { useInView } from '@/lib/hooks';

/** Three animated mini-mockups: CRM pipeline, ERP dashboard, custom workflow. */
function CrmMock() {
  const cols = ['New', 'Qualified', 'Won'];
  return (
    <div className="relative h-full grid grid-cols-3 gap-2 p-3">
      {cols.map((c, i) => (
        <div key={c} className="rounded-xl bg-bg/60 border border-line p-2 flex flex-col gap-1.5">
          <div className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">{c}</div>
          {i === 0 && <div className="h-6 rounded-md bg-ink/10" />}
          {i === 1 && <div className="h-6 rounded-md bg-ink/10" />}
          {i === 2 && <div className="h-6 rounded-md bg-burgundy-light/30" />}
          <div className="h-6 rounded-md bg-ink/5" />
        </div>
      ))}
      <div className="absolute left-3 top-[38px] w-[calc((100%-1.5rem-1rem)/3-1rem)] pointer-events-none">
        <div className="bs-card-move h-6 rounded-md bg-burgundy-light shadow-lg shadow-burgundy/40 ml-2" />
      </div>
    </div>
  );
}

function ErpMock({ inView }: { inView: boolean }) {
  const bars = [46, 72, 58, 90, 66, 100];
  return (
    <div className={`h-full p-4 flex flex-col justify-between ${inView ? 'bs-in' : ''}`}>
      <div className="flex gap-2">
        {['Stock', 'Orders', 'Finance'].map(t => (
          <span key={t} className="px-2 py-0.5 rounded-full border border-line font-mono text-[9px] uppercase tracking-wider text-ink-muted">
            {t}
          </span>
        ))}
      </div>
      <div className="flex items-end gap-2 h-20">
        {bars.map((h, i) => (
          <div
            key={i}
            className="bs-bar flex-1 rounded-t-md bg-gradient-to-t from-burgundy to-burgundy-light"
            style={{ height: `${h}%`, '--d': `${i * 0.1}s` } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

function CustomMock() {
  return (
    <svg viewBox="0 0 300 140" className="w-full h-full" aria-hidden="true">
      <g fill="none" stroke="rgb(var(--burg-l))" strokeWidth="1.5" opacity="0.9">
        <path className="bs-dash" d="M60 70 C 100 20, 120 20, 150 70" />
        <path className="bs-dash" d="M150 70 C 180 120, 200 120, 240 70" />
        <path className="bs-dash" d="M60 70 L 240 70" opacity="0.4" />
      </g>
      {[60, 150, 240].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="70" r="16" fill="rgb(var(--bg-surface2))" stroke="rgb(var(--burg-l))" strokeWidth="1.5" />
          <circle className="bs-node" cx={x} cy="70" r="9" fill="rgb(var(--burg-l))" style={{ animationDelay: `${i * 0.5}s` }} />
        </g>
      ))}
    </svg>
  );
}

const cards = [
  { title: 'CRM', text: 'Pipelines, lead capture and follow-ups your whole team will use.', href: '/solutions/crm-solutions', cursor: 'CRM', mock: 'crm' },
  { title: 'ERP', text: 'Inventory, production, orders and finance on one live system.', href: '/solutions/erp-systems', cursor: 'ERP', mock: 'erp' },
  { title: 'Custom software', text: 'Tools and portals built around how your business really works.', href: '/solutions/custom-software', cursor: 'Custom', mock: 'custom' },
] as const;

export function BusinessSoftware() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section className="py-24 px-[5vw] border-t border-line">
      <SectionLabel>Business software</SectionLabel>
      <SplitHeading text="Software that runs your business." className="text-[clamp(2rem,5.5vw,5rem)] font-bold tracking-tight mb-6" />
      <p className="max-w-xl text-ink-muted text-lg leading-relaxed mb-14">
        ERP, CRM and custom systems that replace spreadsheets, chat groups and disconnected tools with one source of truth.
      </p>
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 80}>
            <a
              href={c.href}
              data-cursor={c.cursor}
              className="group block h-full border border-line rounded-3xl overflow-hidden bg-bg-surface hover:border-burgundy-light transition-[transform,border-color] duration-500 hover:-translate-y-2"
            >
              <div className="h-44 bg-bg-surface2 border-b border-line overflow-hidden">
                {c.mock === 'crm' && <CrmMock />}
                {c.mock === 'erp' && <ErpMock inView={inView} />}
                {c.mock === 'custom' && <CustomMock />}
              </div>
              <div className="p-7">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold tracking-tight">{c.title}</h3>
                  <ArrowUpRight className="w-5 h-5 text-burgundy-light transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <p className="text-sm text-ink-muted leading-relaxed mt-3">{c.text}</p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

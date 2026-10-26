import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowDownRight, ArrowUpRight, Check, CircleHelp, FileSpreadsheet, Inbox,
  MousePointer2, Search, X,
} from 'lucide-react';
import { Reveal, SectionLabel } from '@/components/Reveal';
import { MagneticButton } from '@/components/MagneticButton';

function useActiveAnimation<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, active };
}

function AnimationFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, active } = useActiveAnimation<HTMLDivElement>();
  return <div ref={ref} aria-hidden="true" className={`wps-illustration ${active ? 'is-active' : ''} ${className}`}>{children}</div>;
}

function AdoptionCard() {
  return (
    <div className="wps-adoption relative min-h-[420px] md:min-h-[450px] lg:row-span-2 lg:col-span-2 overflow-hidden rounded-[28px] border border-line bg-bg-surface p-6 md:p-8">
      <div className="wps-adoption-glow" aria-hidden="true" />
      <div className="relative z-10 max-w-[270px]">
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Great product.<br /><span className="text-burgundy-light">Zero</span> adoption?</h3>
        <p className="mt-3 max-w-[220px] text-sm leading-relaxed text-ink-muted">A brilliant system means nothing if nobody uses it.</p>
      </div>
      {/* Add the transparent cut-out at public/stressed-woman-laptop.webp when ready. */}
      <img
        src="/stressed-woman-laptop.webp"
        alt="Frustrated woman looking at a laptop with no results"
        loading="lazy"
        decoding="async"
        width={600}
        height={800}
        className="wps-woman pointer-events-none absolute bottom-0 right-[-2%] z-[2] h-[76%] max-w-[72%] object-contain object-bottom"
        onError={(event) => { event.currentTarget.style.display = 'none'; }}
      />
      <div className="wps-signups absolute bottom-5 left-5 z-10 flex items-center gap-3 rounded-2xl border border-black/5 bg-white/95 px-4 py-3 text-[#242124] shadow-xl md:bottom-7 md:left-7">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f9e2e8] text-[#a3294a]"><Inbox size={20} /></span>
        <span className="block text-left">
          <span className="block text-[10px] font-medium text-gray-500">New sign-ups this week</span>
          <span className="wps-zero block text-xl font-bold leading-tight">0<span className="wps-status-dot ml-2 inline-block h-2 w-2 rounded-full bg-red-500 align-middle" /></span>
        </span>
      </div>
    </div>
  );
}

function SpeedIllustration() {
  return <AnimationFrame className="wps-speed">
    <div className="flex items-start justify-between gap-2">
      <div><strong className="wps-speed-number text-3xl font-bold tracking-tight text-red-500">6.4s</strong><p className="text-[10px] text-gray-500">Page load time</p></div>
      <span className="wps-leaving inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-[9px] font-semibold text-red-700">Visitors leaving <ArrowDownRight size={12} /></span>
    </div>
    <svg viewBox="0 0 240 96" className="mt-2 w-full" role="presentation">
      <path d="M35 82 A85 85 0 0 1 205 82" fill="none" stroke="#22a06b" strokeWidth="13" strokeLinecap="round" strokeDasharray="55 212" />
      <path d="M35 82 A85 85 0 0 1 205 82" fill="none" stroke="#f2b84b" strokeWidth="13" strokeLinecap="butt" strokeDasharray="65 202" strokeDashoffset="-57" />
      <path d="M35 82 A85 85 0 0 1 205 82" fill="none" stroke="#df4b51" strokeWidth="13" strokeLinecap="round" strokeDasharray="80 187" strokeDashoffset="-124" />
      <g className="wps-gauge-needle"><path d="M120 82 L184 35" stroke="#1e1e22" strokeWidth="4" strokeLinecap="round" /><circle cx="120" cy="82" r="7" fill="#1e1e22" /></g>
    </svg>
  </AnimationFrame>;
}

function ReportsIllustration() {
  return <AnimationFrame className="wps-reports">
    <div className="flex h-7 items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 text-gray-400 shadow-sm">
      <Search size={13} /><span className="wps-typing text-[10px]">Search reports</span><span className="wps-caret ml-auto h-3 w-px bg-rose-500" />
    </div>
    <div className="mt-3 space-y-2">
      {[0, 1, 2].map((row) => <div key={row} className={`wps-report-row flex items-center gap-2 rounded-md bg-white/90 px-2 py-1.5 `} style={{ animationDelay: `${row * 220}ms` }}>
        <span className={`h-2 w-2 rounded-full ${row === 1 ? 'bg-emerald-500' : row === 2 ? 'bg-orange-400' : 'bg-sky-500'}`} />
        <span className="h-1.5 w-[38%] rounded-full bg-gray-300" /><span className="h-1.5 flex-1 rounded-full bg-gray-200" />
      </div>)}
    </div>
    <div className="my-2 flex items-center gap-2 text-[8px] font-bold tracking-widest text-gray-400"><span className="h-px flex-1 bg-gray-200" />PAGE 3<span className="h-px flex-1 bg-gray-200" /></div>
    <div className="wps-flag-row flex items-center gap-2 rounded-md border border-dashed border-red-400 bg-red-50 px-2 py-2 text-[10px] text-gray-700">
      <FileSpreadsheet size={13} className="text-red-500" /><span className="font-medium">yoursite.com</span><span className="wps-rank ml-auto rounded bg-red-600 px-1.5 py-0.5 font-bold text-white">#27</span>
    </div>
  </AnimationFrame>;
}

function RetroIllustration() {
  return <AnimationFrame className="wps-retro">
    <div className="overflow-hidden rounded-md border border-gray-300 bg-[#f1f1f1] shadow-sm">
      <div className="flex h-5 items-center gap-1 border-b border-gray-300 bg-gray-200 px-2"><i className="h-1.5 w-1.5 rounded-full bg-gray-400" /><i className="h-1.5 w-1.5 rounded-full bg-gray-400" /><i className="h-1.5 w-1.5 rounded-full bg-gray-400" /></div>
      <div className="wps-retro-stripes flex min-h-[75px] items-center justify-center gap-2 px-2">
        <span className="wps-retro-text text-center font-display text-sm italic text-blue-700 underline">Welcome to Our Website!!</span>
      </div>
      <div className="flex items-center justify-center gap-2 border-t border-gray-300 bg-gray-100 py-2">
        <span className="rounded border border-gray-400 bg-gray-200 px-2 py-1 text-[9px] text-gray-700 shadow-[inset_1px_1px_white]">Click Here</span>
        <span className="bg-black px-2 py-1 font-mono text-xs tracking-widest text-green-400"><span className="wps-counter">000127</span></span>
      </div>
    </div>
    <div className="mt-3 flex items-center gap-2 text-[9px] text-gray-500"><span>Trust</span><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200"><span className="wps-trust block h-full w-[22%] rounded-full bg-red-500" /></span><strong className="text-red-500">Low</strong></div>
  </AnimationFrame>;
}

function ExperienceIllustration() {
  return <AnimationFrame className="wps-experience">
    <div className="flex gap-1.5">
      {['Home', 'About', 'More⌄'].map((label) => <span key={label} className="rounded-md bg-gray-100 px-2 py-1 text-[9px] text-gray-500">{label}</span>)}
    </div>
    <svg viewBox="0 0 240 105" className="mt-1 w-full overflow-visible">
      <path className="wps-ux-path" d="M18 15 C40 20 30 65 68 53 S80 18 111 35 S134 88 165 63 S190 40 218 80" fill="none" stroke="#5794d5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="340" strokeDashoffset="340" />
      {[['68','53'],['111','35'],['165','63']].map(([cx,cy]) => <g key={cx} className="wps-question-node"><circle cx={cx} cy={cy} r="9" fill="#f3a34b" /><text x={cx} y={Number(cy)+3.5} textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">?</text></g>)}
    </svg>
    <span className="wps-left-site absolute bottom-1 right-0 inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[9px] font-semibold text-red-700"><X size={11} />Left site</span>
  </AnimationFrame>;
}

function CTAIllustration() {
  return <AnimationFrame className="wps-cta-illustration">
    <div className="wps-question-bubble absolute right-1 top-0 rounded-lg bg-[#171519] px-3 py-2 text-[10px] font-medium text-white shadow-lg">Where do I click?</div>
    <div className="pt-9">
      <div className="h-3 w-2/3 rounded-sm bg-gray-800" /><div className="mt-2 h-1.5 w-1/3 rounded-full bg-gray-300" />
      <div className="mt-5 flex flex-wrap gap-2">
        {['Learn more', 'Click here', 'Read more'].map((label) => <span key={label} className="wps-cta-option rounded-full border border-dashed border-gray-400 px-2.5 py-2 text-[9px] text-gray-600">{label}</span>)}
      </div>
      <MousePointer2 className="wps-mouse-pointer absolute bottom-0 left-1/2 h-6 w-6 fill-white text-gray-900 drop-shadow" />
    </div>
  </AnimationFrame>;
}

type IssueCardData = {
  title: string;
  description: string;
  Illustration: () => JSX.Element;
};

const issueCards: IssueCardData[] = [
  { title: 'Slow Loading Speed', description: 'Slow systems drive your team and customers away.', Illustration: SpeedIllustration },
  { title: 'Messy Data & Reports', description: 'Scattered spreadsheets keep decisions in the dark.', Illustration: ReportsIllustration },
  { title: 'Outdated Interface', description: 'Clunky screens kill trust and daily usage.', Illustration: RetroIllustration },
  { title: 'Poor User Experience', description: 'Confusing flows frustrate everyone who touches them.', Illustration: ExperienceIllustration },
];

function IssueCard({ card, index }: { card: IssueCardData; index: number }) {
  const Illustration = card.Illustration;
  return <Reveal delay={index * 80} className="h-full">
    <article className="wps-issue-card h-full rounded-[26px] border border-line bg-bg-surface p-5 md:p-6">
      <Illustration />
      <h3 className="mt-5 text-lg font-bold tracking-tight">{card.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{card.description}</p>
    </article>
  </Reveal>;
}

function WideCTAProblemCard() {
  return <Reveal delay={4 * 80} className="h-full">
    <article className="wps-issue-card grid h-full grid-cols-1 items-center gap-5 rounded-[26px] border border-line bg-bg-surface p-6 md:grid-cols-2 md:p-7">
      <div><h3 className="text-xl font-bold tracking-tight">Weak Call-to-Action</h3><p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">Unclear next steps leave users unsure what to do.</p></div>
      <CTAIllustration />
    </article>
  </Reveal>;
}

function AuditCard() {
  return <Reveal delay={5 * 80} className="h-full">
    <article className="wps-audit-card relative flex h-full min-h-[245px] flex-col items-start justify-center overflow-hidden rounded-[26px] border border-white/10 p-6 md:p-7">
      <div className="wps-audit-glow" aria-hidden="true" />
      <p className="relative z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-[#d9a3ac]">Free system audit</p>
      <h3 className="relative z-10 mt-3 max-w-md text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">Which of these is costing you money?</h3>
      <p className="relative z-10 mt-3 max-w-sm text-sm leading-relaxed text-white/65">We'll review your setup and reply within 24 hours.</p>
      <MagneticButton href="/contact" variant="outline" className="wps-audit-button relative z-10 mt-6 min-h-12 gap-4 border-0 bg-white py-2 pl-5 pr-2 text-sm text-[#171216] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy-light">
        Find My Leaks <span className="wps-audit-arrow flex h-9 w-9 items-center justify-center rounded-full bg-burgundy text-white"><ArrowUpRight size={18} /></span>
      </MagneticButton>
    </article>
  </Reveal>;
}

export function WhyProjectsStall() {
  return (
    <section className="relative z-10 border-t border-line px-[5vw] py-24">
      <div className="mb-10 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <SectionLabel className="wps-facing-label mb-5">Facing Issues</SectionLabel>
          <h2 className="max-w-3xl text-balance text-[clamp(2.2rem,5.1vw,4.8rem)] font-bold leading-[0.98] tracking-[-0.045em]">
            Why Most Software Projects<br className="hidden sm:block" /> Don't Deliver <span className="font-display italic text-burgundy-light">Real Results</span>
          </h2>
        </div>
        <p className="max-w-[320px] text-sm leading-relaxed text-ink-muted md:pb-1">If your team can't trust the system, can't find what they need, or can't see the next step, work slows down and money leaks.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Reveal delay={0} className="h-full md:col-span-2 lg:row-span-2">
          <AdoptionCard />
        </Reveal>
        {issueCards.map((card, index) => <div key={card.title} className="h-full">{/* card has its own staggered reveal */}<IssueCard card={card} index={index + 1} /></div>)}
        <div className="h-full md:col-span-2 lg:col-span-2"><WideCTAProblemCard /></div>
        <div className="h-full md:col-span-2 lg:col-span-2"><AuditCard /></div>
      </div>
    </section>
  );
}

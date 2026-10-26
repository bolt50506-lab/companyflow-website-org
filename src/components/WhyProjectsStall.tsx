import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, ChevronDown, Inbox, Search, X } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { AuditModal } from '@/components/AuditModal';

/* ─────────────────────────────────────────────────────────────
   "Facing Issues" bento section.
   - Sits between "What we do" and "How we work" on the home page.
   - Uses only theme tokens for card surfaces, so it follows dark / light mode.
   - Mini illustrations keep fixed light colours on purpose (they are "screens").
   - All loops run only while their card is on screen and stop for reduced motion.
   Woman photo: /public/stressed-woman-laptop.webp (transparent cut-out, ~3:4).
   ───────────────────────────────────────────────────────────── */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** true while the element is on screen (turns off again when it leaves, so loops pause) */
function useActive<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.15 });
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return { ref, active };
}

/** 0 → 1 sweep, hold, quick reset. Drives the gauge needle and the "6.4s" number together. */
function useSpeedLoop(active: boolean) {
  const [p, setP] = useState(() => (prefersReducedMotion() ? 1 : 0));
  useEffect(() => {
    if (prefersReducedMotion()) {
      setP(1);
      return;
    }
    if (!active) return;
    const SWEEP = 2400;
    const HOLD = 1500;
    const RESET = 500;
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const start = performance.now();
    let raf = 0;
    let last = -1;
    const tick = (now: number) => {
      const t = (now - start) % (SWEEP + HOLD + RESET);
      let v = 1;
      if (t < SWEEP) v = ease(t / SWEEP);
      else if (t > SWEEP + HOLD) v = 1 - ease((t - SWEEP - HOLD) / RESET);
      const q = Math.round(v * 128) / 128;
      if (q !== last) {
        last = q;
        setP(q);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return p;
}

/** visitor counter that slowly ticks up: 000127, 000128 … */
function useTicker(active: boolean) {
  const [n, setN] = useState(127);
  useEffect(() => {
    if (!active || prefersReducedMotion()) return;
    const id = window.setInterval(() => setN(v => (v >= 142 ? 127 : v + 1)), 900);
    return () => window.clearInterval(id);
  }, [active]);
  return String(n).padStart(6, '0');
}

function Card({ className = '', children }: { className?: string; children: (active: boolean) => ReactNode }) {
  const { ref, active } = useActive<HTMLElement>();
  return (
    <article
      ref={ref}
      className={`wps-card ${active ? 'is-active' : ''} relative h-full overflow-hidden rounded-[26px] border border-line ${className}`}
    >
      {children(active)}
    </article>
  );
}

/* ───────────── Big card: "Great traffic. Zero enquiries?" ───────────── */

function HeroCard() {
  return (
    <Card className="wps-hero min-h-[440px] rounded-[28px] sm:min-h-[460px] lg:min-h-0">
      {() => (
        <>
          <div className="wps-hero-glow" aria-hidden="true" />
          <h3 className="relative z-10 p-6 text-[1.55rem] font-bold leading-[1.1] tracking-[-0.03em] sm:p-8 sm:text-[1.8rem]">
            Great traffic. <span className="text-red-500">Zero</span>
            <br />
            enquiries?
          </h3>

          <img
            src="/stressed-woman-laptop.webp"
            alt="Worried woman holding a tablet that shows a page that can't be reached"
            width={532}
            height={716}
            loading="lazy"
            decoding="async"
            className="wps-woman pointer-events-none absolute bottom-0 right-0 z-[2] h-[76%] w-auto max-w-[80%] object-contain object-bottom sm:right-[6%] sm:h-[84%] lg:right-0"
            onError={e => {
              e.currentTarget.style.display = 'none';
            }}
          />

          <div className="wps-badge absolute bottom-5 left-5 z-10 flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-3.5 py-3 text-[#1b1a1d] shadow-[0_14px_34px_-14px_rgba(0,0,0,.45)] sm:bottom-7 sm:left-7">
            <span className="wps-badge-icon flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-red-500">
              <Inbox size={17} />
            </span>
            <span className="block leading-tight">
              <span className="block text-[10px] font-medium text-gray-500">New enquiries this week</span>
              <span className="block text-[17px] font-bold">0</span>
            </span>
          </div>
        </>
      )}
    </Card>
  );
}

/* ───────────── Mini illustrations ───────────── */

const polar = (deg: number, r = 78): [number, number] => [120 + r * Math.cos((deg * Math.PI) / 180), 92 - r * Math.sin((deg * Math.PI) / 180)];
const arc = (from: number, to: number) => {
  const [x1, y1] = polar(from);
  const [x2, y2] = polar(to);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} A78 78 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};

function SpeedMini({ active }: { active: boolean }) {
  const p = useSpeedLoop(active);
  const angle = -64 + 116 * p;
  return (
    <div className="relative h-[118px]" aria-hidden="true">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[1.65rem] font-bold leading-none tracking-tight text-red-500 tabular-nums">{(p * 6.4).toFixed(1)}s</div>
          <div className="mt-1.5 text-[9px] text-ink-muted">Page load time</div>
        </div>
        <span className="wps-leaving inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-red-100 px-2 py-1 text-[8.5px] font-semibold text-red-600">
          <ArrowDownRight size={10} strokeWidth={2.6} />
          Visitors leaving
        </span>
      </div>
      <svg viewBox="0 0 240 102" className="absolute bottom-0 left-1/2 w-[62%] max-w-[176px] -translate-x-1/2 text-ink">
        <path d={arc(180, 128)} fill="none" stroke="#22b45e" strokeWidth="11" strokeLinecap="round" />
        <path d={arc(118, 86)} fill="none" stroke="#f5a623" strokeWidth="11" strokeLinecap="round" />
        <path d={arc(76, 0)} fill="none" stroke="#e5484d" strokeWidth="11" strokeLinecap="round" />
        <g transform={`rotate(${angle} 120 92)`}>
          <line x1="120" y1="92" x2="120" y2="32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </g>
        <circle cx="120" cy="92" r="7" fill="#fff" stroke="currentColor" strokeWidth="3.5" />
      </svg>
    </div>
  );
}

function SeoMini() {
  return (
    <div className="relative h-[118px] overflow-hidden rounded-xl bg-white p-2.5 shadow-sm" aria-hidden="true">
      <div className="flex h-6 items-center gap-1.5 rounded-full border border-gray-200 px-2 text-gray-500">
        <Search size={10} className="shrink-0" />
        <span className="wps-type whitespace-nowrap text-[9px] text-gray-600">web design san diego</span>
        <span className="wps-caret h-2.5 w-px bg-gray-500" />
      </div>
      <div className="wps-results mt-2.5 space-y-1.5">
        {['bg-amber-400', 'bg-green-500'].map((dot, i) => (
          <div key={dot} className="flex items-start gap-1.5">
            <i className={`mt-px h-2 w-2 shrink-0 rounded-full ${dot}`} />
            <div className="flex-1 space-y-[3px]">
              <b className="wps-skel block h-1 rounded-full bg-indigo-400" style={{ width: i === 0 ? '78%' : '66%' }} />
              <b className="block h-[3px] rounded-full bg-gray-200" />
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 text-[7px] font-bold tracking-[0.18em] text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          PAGE 3
          <span className="h-px flex-1 bg-gray-200" />
        </div>
      </div>
      <div className="wps-flag absolute inset-x-2.5 bottom-[-4px] flex items-center gap-1.5 rounded-md border border-dashed border-red-400 bg-red-50 px-2 pb-2 pt-1.5 text-[9px] font-medium text-gray-700">
        <i className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
        yoursite.com
        <span className="wps-rank ml-auto rounded bg-red-500 px-1 py-px text-[8px] font-bold text-white">#27</span>
      </div>
    </div>
  );
}

function RetroMini({ active }: { active: boolean }) {
  const count = useTicker(active);
  return (
    <div aria-hidden="true">
      <div className="h-[84px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex h-3.5 items-center gap-[3px] bg-gray-100 px-2">
          <i className="h-[5px] w-[5px] rounded-full bg-gray-300" />
          <i className="h-[5px] w-[5px] rounded-full bg-gray-300" />
          <i className="h-[5px] w-[5px] rounded-full bg-gray-300" />
        </div>
        <div className="wps-stripes flex h-[calc(100%-14px)] flex-col items-center justify-center gap-2 px-2">
          <span
            className="wps-flicker text-center text-[11px] font-bold italic text-blue-700 underline"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            Welcome to Our Website!!
          </span>
          <div className="flex items-center gap-1.5">
            <span className="border border-gray-500 bg-gray-300 px-1.5 py-px text-[8px] text-black shadow-[inset_1px_1px_#fff,inset_-1px_-1px_#8a8a8a]">Click Here</span>
            <span className="bg-black px-1.5 py-px font-mono text-[8px] tracking-[0.12em] text-green-400">{count}</span>
          </div>
        </div>
      </div>
      <div className="mt-2.5 flex items-center gap-2 text-[9px] text-ink-muted">
        <span>Trust</span>
        <span className="h-[5px] flex-1 overflow-hidden rounded-full bg-ink/15">
          <span className="wps-trust block h-full rounded-full bg-red-500" />
        </span>
        <strong className="font-semibold text-red-500">Low</strong>
      </div>
    </div>
  );
}

const UX_PATH = 'M14 24 C 38 4, 78 8, 82 32 C 86 58, 40 64, 60 78 C 82 92, 130 70, 132 46 C 134 22, 170 20, 190 48';
const UX_NODES: Array<[number, number]> = [
  [82, 32],
  [60, 78],
  [132, 46],
];

function UxMini() {
  return (
    <div className="relative h-[118px] overflow-hidden rounded-xl bg-white p-2.5 shadow-sm" aria-hidden="true">
      <div className="relative z-10 flex gap-1">
        {['Home', 'About'].map(l => (
          <span key={l} className="rounded bg-gray-100 px-1.5 py-[3px] text-[8px] text-gray-500">{l}</span>
        ))}
        <span className="inline-flex items-center gap-0.5 rounded bg-gray-100 px-1.5 py-[3px] text-[8px] text-gray-500">
          More <ChevronDown size={7} />
        </span>
      </div>
      <svg viewBox="0 0 220 90" className="absolute inset-x-0 bottom-0 h-[88px] w-full">
        <path className="wps-ux-path" d={UX_PATH} pathLength={100} fill="none" stroke="#4f7cf0" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" />
        {UX_NODES.map(([x, y], i) => (
          <g key={i} className={`wps-node wps-node-${i + 1}`} style={{ transformOrigin: `${x}px ${y}px` }}>
            <circle cx={x} cy={y} r="8" fill="#f5a623" />
            <text x={x} y={y + 3.4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">?</text>
          </g>
        ))}
      </svg>
      <span className="wps-left-site absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-[8.5px] font-semibold text-white shadow">
        <X size={9} strokeWidth={3} />
        Left site
      </span>
    </div>
  );
}

function CtaMini() {
  return (
    <div className="relative w-full max-w-[250px] rounded-xl bg-white p-3.5 pt-5 shadow-sm" aria-hidden="true">
      <span className="wps-bubble absolute -top-2.5 right-2.5 rounded-lg bg-[#111] px-2.5 py-1.5 text-[8.5px] font-bold text-white shadow-md">
        Where do I click?
      </span>
      <div className="h-2 w-[72%] rounded-full bg-gray-700" />
      <div className="mt-2 h-1 w-[92%] rounded-full bg-gray-200" />
      <div className="relative mt-3.5">
        <div className="grid grid-cols-3 gap-1.5">
          {['Learn more', 'Click here', 'Read more'].map((l, i) => (
            <span
              key={l}
              className={`wps-cta-btn wps-cta-btn-${i + 1} whitespace-nowrap rounded-full border border-dashed border-gray-300 px-1 py-[5px] text-center text-[8px] text-gray-400`}
            >
              {l}
            </span>
          ))}
        </div>
        <div className="wps-cursor pointer-events-none absolute inset-x-0 top-[62%]">
          <svg width="13" height="16" viewBox="0 0 13 16" className="drop-shadow">
            <path d="M1 1 L1 12.2 L3.9 9.6 L6 14.6 L8 13.7 L5.9 8.8 L9.8 8.6 Z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Small cards ───────────── */

type SmallCardData = {
  title: string;
  description: string;
  Mini: (props: { active: boolean }) => ReactNode;
};

const smallCards: SmallCardData[] = [
  { title: 'Slow Loading Speed', description: 'Slow-loading pages drive potential customers away.', Mini: SpeedMini },
  { title: 'SEO Mistakes', description: 'Poor optimization keeps your business hidden.', Mini: () => <SeoMini /> },
  { title: 'Outdated Design', description: 'Lack of trust and credibility turns clients away.', Mini: RetroMini },
  { title: 'Poor User Experience', description: 'Confusing navigation frustrates visitors.', Mini: () => <UxMini /> },
];

function SmallCard({ data }: { data: SmallCardData }) {
  const { Mini } = data;
  return (
    <Card className="flex flex-col p-[18px]">
      {active => (
        <>
          <div className="flex flex-1 flex-col justify-center">
            <Mini active={active} />
          </div>
          <h3 className="mt-3.5 text-[15px] font-semibold leading-tight tracking-tight">{data.title}</h3>
          <p className="mt-1 text-[12px] leading-snug text-ink-muted">{data.description}</p>
        </>
      )}
    </Card>
  );
}

function CtaCard() {
  return (
    <Card className="flex flex-col justify-between gap-6 p-[18px] sm:flex-row sm:items-center sm:p-6 lg:py-4">
      {() => (
        <>
          <div className="sm:max-w-[230px]">
            <h3 className="text-[15px] font-semibold leading-tight tracking-tight">Weak Call-to-Action</h3>
            <p className="mt-1 text-[12px] leading-snug text-ink-muted">Unclear CTAs leave visitors unsure what to do.</p>
          </div>
          <div className="flex justify-center sm:justify-end sm:pr-1">
            <CtaMini />
          </div>
        </>
      )}
    </Card>
  );
}

function AuditCard({ onOpen }: { onOpen: () => void }) {
  return (
    <Card className="wps-audit flex flex-col justify-center border-white/10 p-6 sm:p-7">
      {() => (
        <>
          <div className="wps-audit-glow" aria-hidden="true" />
          <p className="relative z-10 font-mono text-[9.5px] font-medium uppercase tracking-[0.2em] text-[#e2a4af]">Free website audit</p>
          <h3 className="relative z-10 mt-2.5 max-w-[420px] text-[1.35rem] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[1.5rem]">
            Which of these is costing you leads?
          </h3>
          <p className="relative z-10 mt-1.5 text-[12px] font-medium leading-snug text-white/75">We’ll check your site and tell you, within 24 hours.</p>
          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            data-cursor="Open"
            className="wps-audit-btn group relative z-10 mt-5 inline-flex min-h-[46px] w-fit items-center gap-4 overflow-hidden rounded-full bg-white py-1.5 pl-5 pr-1.5 text-[13px] font-medium text-[#111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy-light"
          >
            Find My Leaks
            <span className="wps-arrow flex h-[34px] w-[34px] items-center justify-center rounded-full bg-burgundy text-white">
              <ArrowUpRight size={16} />
            </span>
          </button>
        </>
      )}
    </Card>
  );
}

/* ───────────── Section ───────────── */

export function WhyProjectsStall() {
  const [auditOpen, setAuditOpen] = useState(false);
  return (
    <section className="border-t border-line px-[5vw] py-24">
      <Reveal className="mb-10 flex flex-col justify-between gap-5 md:mb-12 md:flex-row md:items-end md:gap-10">
        <div>
          <span className="relative mb-4 inline-block font-display text-[1.05rem] italic text-burgundy-light">
            Facing Issues
            <svg className="absolute left-0 top-full -mt-0.5 h-2 w-[68px]" viewBox="0 0 68 8" fill="none" aria-hidden="true">
              <path d="M1 6.5 C 18 1.5, 44 1, 67 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </span>
          <h2 className="text-balance text-[clamp(1.95rem,4.3vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.04em]">
            Why Most Websites
            <br className="hidden sm:block" /> Don’t Convert Visitors into Clients
          </h2>
        </div>
        <p className="max-w-[320px] text-[13px] leading-relaxed text-ink-muted md:pb-1.5">
          If visitors don’t understand your offer, trust your business, or see a clear next step, they leave without taking action.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[minmax(222px,auto)_minmax(222px,auto)_minmax(155px,auto)]">
        <Reveal className="h-full sm:col-span-2 lg:row-span-2">
          <HeroCard />
        </Reveal>
        {smallCards.map((c, i) => (
          <Reveal key={c.title} delay={(i + 1) * 80} className="h-full">
            <SmallCard data={c} />
          </Reveal>
        ))}
        <Reveal delay={400} className="h-full sm:col-span-2">
          <CtaCard />
        </Reveal>
        <Reveal delay={480} className="h-full sm:col-span-2">
          <AuditCard onOpen={() => setAuditOpen(true)} />
        </Reveal>
      </div>
      <AuditModal open={auditOpen} onClose={() => setAuditOpen(false)} />
    </section>
  );
}

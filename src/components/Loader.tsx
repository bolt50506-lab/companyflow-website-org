import { useEffect, useRef, useState } from 'react';

const WORDS = ['Designing', 'Engineering', 'Polishing', 'Shipping'];
const MIN_MS = 2600;
const CURVE_VH = 17;

const preload = (src: string) =>
  new Promise<void>(res => {
    const i = new Image();
    i.onload = i.onerror = () => res();
    i.src = src;
  });

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Intro loader. Progress is time-based (smooth) but waits for fonts + hero image,
 * so the 100% is real. The wordmark fills with colour as it loads, and the
 * curtain lifts away with a curved edge.
 *  - onReveal: fired as the curtain starts lifting (page entrance animations start)
 *  - onComplete: fired once the curtain is fully gone (unmount)
 */
export function Loader({ onReveal, onComplete }: { onReveal?: () => void; onComplete?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const cols = useRef<Array<HTMLDivElement | null>>([]);
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minMs = reduce ? 500 : MIN_MS;
    let raf = 0;
    let assetsReady = false;
    let finished = false;
    let shown = 0;
    const timers: number[] = [];
    const start = performance.now();
    let prev = start;

    Promise.race([
      Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), preload('/hero-team.webp')]),
      new Promise(r => timers.push(window.setTimeout(r, 6000))),
    ]).then(() => {
      assetsReady = true;
    });

    const wordIv = window.setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 700);

    const apply = (p: number) => {
      const n = Math.round(p);
      const digits = [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
      digits.forEach((d, i) => {
        const el = cols.current[i];
        if (el) el.style.transform = `translate3d(0, -${d * 10}%, 0)`;
      });
      const hundreds = cols.current[0]?.parentElement;
      if (hundreds) hundreds.style.opacity = n >= 100 ? '1' : '0';
      if (fillRef.current) fillRef.current.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p / 100})`;
    };

    const finish = () => {
      timers.push(
        window.setTimeout(() => {
          const root = rootRef.current;
          if (!root) return;
          root.classList.add('ld-leave');
          root.style.transition = 'transform 1.15s cubic-bezier(0.76,0,0.24,1)';
          root.style.transform = `translate3d(0, calc(-100% - ${CURVE_VH}vh), 0)`;
          timers.push(window.setTimeout(() => onReveal?.(), 350));
          timers.push(window.setTimeout(() => onComplete?.(), 1250));
        }, reduce ? 0 : 450),
      );
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / minMs);
      let target = easeInOut(t) * 100;
      if (!assetsReady) target = Math.min(target, 92);
      const dt = Math.min(0.1, (now - prev) / 1000);
      prev = now;
      shown += (target - shown) * (1 - Math.exp(-dt * 14));
      if (target >= 100 && shown > 99.4) shown = 100;
      apply(shown);
      if (shown >= 100 && !finished) {
        finished = true;
        window.clearInterval(wordIv);
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    apply(0);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(wordIv);
      timers.forEach(clearTimeout);
    };
  }, [onReveal, onComplete]);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[200]" style={{ willChange: 'transform' }}>
      <div className="absolute inset-0 overflow-hidden bg-bg text-ink">
        {/* ambient light */}
        <div
          aria-hidden="true"
          className="ld-orb-a absolute -left-[12vw] -top-[18vh] h-[60vw] w-[60vw] max-h-[900px] max-w-[900px] rounded-full bg-burgundy opacity-50 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="ld-orb-b absolute -bottom-[22vh] -right-[10vw] h-[45vw] w-[45vw] max-h-[700px] max-w-[700px] rounded-full bg-[#c8893b] opacity-[0.22] blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgb(var(--line) / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--line) / 0.06) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            WebkitMaskImage: 'radial-gradient(ellipse at center, #000 15%, transparent 70%)',
            maskImage: 'radial-gradient(ellipse at center, #000 15%, transparent 70%)',
          }}
        />

        <div className="ld-content absolute inset-0 flex flex-col justify-between p-[5vw]">
          {/* top bar */}
          <div className="ld-fade flex items-center justify-between" style={{ animationDelay: '0.1s' }}>
            <span className="text-lg font-bold tracking-tight">
              CompanyFlow<span className="text-burgundy-light">.</span>
            </span>
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-muted">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-green-500" />
              Loading experience
            </span>
          </div>

          {/* wordmark that fills with colour as it loads */}
          <div className="relative">
            <div className="overflow-hidden py-[0.06em]" style={{ fontSize: 'clamp(2.6rem, 12vw, 10.5rem)' }}>
              <div className="ld-rise relative leading-[0.95]">
                <div
                  aria-hidden="true"
                  className="select-none whitespace-nowrap font-bold tracking-tighter opacity-30"
                  style={{ WebkitTextFillColor: 'transparent', WebkitTextStroke: '1.5px currentColor' }}
                >
                  CompanyFlow<span className="font-display italic">.</span>
                </div>
                <div
                  ref={fillRef}
                  className="absolute inset-0 select-none whitespace-nowrap font-bold tracking-tighter"
                  style={{ clipPath: 'inset(0 100% 0 0)', willChange: 'clip-path' }}
                >
                  CompanyFlow<span className="font-display italic text-burgundy-light">.</span>
                </div>
              </div>
            </div>
            <div
              className="ld-fade mt-5 max-w-md text-sm leading-relaxed text-ink-muted md:text-base"
              style={{ animationDelay: '0.6s' }}
            >
              Software, engineered with taste.
            </div>
          </div>

          {/* bottom row */}
          <div className="flex items-end justify-between">
            <div className="ld-fade font-mono text-xs uppercase tracking-widest text-ink-muted" style={{ animationDelay: '0.5s' }}>
              <span className="mb-2 block text-[10px] opacity-60">Currently</span>
              <span className="block h-[1.4em] overflow-hidden">
                <span key={wordIdx} className="ld-word inline-block text-ink">
                  {WORDS[wordIdx]}
                  <span className="text-burgundy-light">…</span>
                </span>
              </span>
            </div>

            <div
              className="flex items-start font-bold leading-none tracking-tighter"
              style={{ fontSize: 'clamp(3.2rem, 14vw, 10rem)' }}
              aria-label="Loading progress"
            >
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="relative h-[0.9em] w-[0.6em] overflow-hidden text-center"
                  style={i === 0 ? { opacity: 0, transition: 'opacity .3s ease' } : undefined}
                >
                  <div
                    ref={el => {
                      cols.current[i] = el;
                    }}
                    style={{ transition: 'transform .5s cubic-bezier(0.22,1,0.36,1)', willChange: 'transform' }}
                  >
                    {Array.from({ length: 10 }, (_, d) => (
                      <div key={d} className="h-[0.9em] leading-[0.9em]">
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <span className="ml-2 mt-[0.12em] font-mono text-[0.16em] font-normal tracking-widest text-ink-muted">%</span>
            </div>
          </div>
        </div>

        {/* progress hairline */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-line">
          <div
            ref={barRef}
            className="h-full origin-left bg-gradient-to-r from-burgundy via-burgundy-light to-[#d9a15b] shadow-[0_0_18px_rgba(168,56,74,0.9)]"
            style={{ transform: 'scaleX(0)', willChange: 'transform' }}
          />
        </div>
      </div>

      {/* curved lower edge of the curtain */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-full w-full bg-bg"
        style={{
          height: `${CURVE_VH}vh`,
          borderBottomLeftRadius: '50% 100%',
          borderBottomRightRadius: '50% 100%',
        }}
      />
    </div>
  );
}

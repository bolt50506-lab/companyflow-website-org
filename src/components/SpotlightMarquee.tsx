import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import type { CaseStudy } from '@/data/caseStudies';

const SPEED = 55; // px per second

interface Props {
  items: CaseStudy[];
}

export function SpotlightMarquee({ items }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const list = [...items, ...items];
  const n = list.length;

  const [playing, setPlaying] = useState(
    () => typeof window === 'undefined' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [active, setActive] = useState(0);

  const s = useRef({ off: 0, cur: 0, drag: false, lx: 0, moved: 0, hover: false, playing: true, active: 0 });

  useEffect(() => {
    s.current.playing = playing;
  }, [playing]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const st = s.current;
    let raf = 0;
    let last = performance.now();

    const layout = () => {
      const W = stage.clientWidth;
      const small = W < 640;
      const step = small ? 200 : 290;
      const total = n * step;
      stage.style.setProperty('--sw', `${small ? 230 : 300}px`);
      stage.style.setProperty('--sh', `${small ? 330 : 400}px`);

      let best = Infinity;
      let bi = 0;
      for (let i = 0; i < n; i++) {
        const c = cardRefs.current[i];
        if (!c) continue;
        let x = (((i * step + st.off) % total) + total) % total;
        if (x > total / 2) x -= total;
        const a = Math.abs(x);
        const t = Math.min(a / (step * 1.4), 1);
        c.style.transform = `translate(-50%,-50%) translateX(${x}px) scale(${1 - 0.3 * t})`;
        c.style.opacity = String(1 - 0.55 * t);
        c.style.filter = t > 0.02 ? `blur(${2.6 * t}px) brightness(${1 - 0.25 * t})` : 'none';
        c.style.zIndex = String(1000 - Math.round(a));
        if (a < best) {
          best = a;
          bi = i;
        }
      }
      const idx = bi % items.length;
      if (idx !== st.active) {
        st.active = idx;
        setActive(idx);
      }
    };

    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const target = st.playing && !st.hover && !st.drag ? SPEED : 0;
      st.cur += (target - st.cur) * Math.min(1, dt * 6);
      if (!st.drag) st.off -= st.cur * dt;
      layout();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    layout();
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 });
    io.observe(stage);

    const onMove = (e: PointerEvent) => {
      if (!st.drag) return;
      const dx = e.clientX - st.lx;
      st.lx = e.clientX;
      st.off += dx;
      st.moved += Math.abs(dx);
    };
    const onUp = () => {
      st.drag = false;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('resize', layout);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('resize', layout);
    };
  }, [n, items.length]);

  const current = items[active];

  return (
    <div>
      <div
        ref={stageRef}
        onPointerDown={e => {
          s.current.drag = true;
          s.current.lx = e.clientX;
          s.current.moved = 0;
        }}
        onPointerEnter={e => {
          if (e.pointerType === 'mouse') s.current.hover = true;
        }}
        onPointerLeave={() => {
          s.current.hover = false;
        }}
        onClickCapture={e => {
          if (s.current.moved > 6) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className="relative h-[clamp(400px,52vw,520px)] overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{
          touchAction: 'pan-y',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
          maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
        }}
      >
        {list.map((p, i) => (
          <a
            key={i}
            ref={el => {
              cardRefs.current[i] = el;
            }}
            href={`/case-studies/${p.slug}`}
            data-cursor="View"
            draggable={false}
            aria-hidden={i >= items.length ? true : undefined}
            tabIndex={i >= items.length ? -1 : 0}
            className="absolute left-1/2 top-1/2 w-[var(--sw,300px)] h-[var(--sh,400px)] rounded-3xl overflow-hidden border border-line bg-bg-surface will-change-transform shadow-[0_24px_60px_-24px_rgba(0,0,0,0.65)]"
          >
            <img
              src={p.card ?? p.image}
              alt={i >= items.length ? '' : p.project}
              draggable={false}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-onburg">
              <span className="font-mono text-[11px] uppercase tracking-widest opacity-80">{p.category}</span>
              <div className="flex items-end justify-between gap-3 mt-2">
                <h3 className="text-lg font-semibold tracking-tight leading-snug line-clamp-2">{p.project}</h3>
                <ArrowUpRight className="w-5 h-5 shrink-0 text-burgundy-light" />
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="flex items-center justify-center gap-5 mt-6 px-[5vw]">
        <button
          onClick={() => setPlaying(p => !p)}
          data-cursor={playing ? 'Pause' : 'Play'}
          aria-label={playing ? 'Pause carousel' : 'Play carousel'}
          className="icon-btn w-11 h-11 rounded-full border border-line flex items-center justify-center hover:border-burgundy-light"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <div className="min-w-0 text-center" aria-live="off">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">{current?.client}</div>
          <div className="font-semibold tracking-tight truncate max-w-[70vw]">{current?.project.split(', ')[0]}</div>
        </div>
        <span className="hidden sm:block font-mono text-[11px] uppercase tracking-widest text-ink-dim">Drag to explore</span>
      </div>
    </div>
  );
}

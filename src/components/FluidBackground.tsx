import { useEffect, useRef } from 'react';
import { useTheme } from '@/lib/theme';
import { createFluid } from '@/lib/fluid';

/**
 * Site-wide fluid ink background (burgundy + camel).
 * Sits behind all content, reacts to the pointer, and flows with page scroll.
 */
export function FluidBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const light = theme === 'light';

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sim = createFluid(canvas);
    if (!sim) return;

    const onVisibility = () => sim.pause(document.hidden);
    let last = window.scrollY;
    let lastStir = 0;
    const onScroll = () => {
      const now = performance.now();
      if (now - lastStir < 90) return;
      const d = window.scrollY - last;
      last = window.scrollY;
      if (Math.abs(d) > 1) {
        lastStir = now;
        sim.stir(Math.max(-60, Math.min(60, d)));
      }
    };
    const onReveal = () => {
      for (let i = 0; i < 6; i++) window.setTimeout(() => sim.stir((Math.random() - 0.5) * 120), i * 110);
    };
    window.addEventListener('sw-reveal', onReveal);
    const onBurst = (e: Event) => {
      const d = (e as CustomEvent<{ x: number; y: number }>).detail;
      if (d) sim.burst(d.x, d.y);
    };
    window.addEventListener('sw-burst', onBurst);

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('sw-reveal', onReveal);
      window.removeEventListener('sw-burst', onBurst);
      sim.destroy();
    };
  }, []);

  return (
    <>
      <canvas
        ref={ref}
        aria-hidden="true"
        className="fixed left-0 top-0 z-0 pointer-events-none w-screen h-screen"
        style={{
          height: '100lvh',
          mixBlendMode: light ? 'multiply' : 'normal',
          opacity: light ? 0.55 : 1,
          transition: 'opacity 0.4s ease',
        }}
      />
      {/* slow drifting colour glows: cheap compositor-only layer that adds depth */}
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="amb amb-a" />
        <div className="amb amb-b" />
        <div className="amb amb-c" />
      </div>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: light
            ? 'rgba(243,236,233,0.25)'
            : 'radial-gradient(115% 95% at 50% 46%, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.5) 30%, rgba(10,10,10,0.32) 100%)',
        }}
      />
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/lib/theme';

/**
 * Custom pointer: a soft rounded arrow with a magenta → plum gradient.
 * Position + tilt are written straight to the DOM from one rAF loop (no React
 * re-renders per frame, no layout work), so it stays glued to the mouse.
 */
export function Cursor() {
  const posRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const [label, setLabel] = useState('');
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.documentElement.classList.add('cursor-none');

    let cx = -100, cy = -100, lx = -100, ly = -100, prevX = 0, tilt = 0, raf = 0;

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      if (!visibleRef.current) {
        visibleRef.current = true;
        lx = cx;
        ly = cy;
        setVisible(true);
      }
    };

    const loop = () => {
      if (posRef.current) posRef.current.style.transform = `translate3d(${cx - 4}px, ${cy - 4}px, 0)`;
      lx += (cx - lx) * 0.2;
      ly += (cy - ly) * 0.2;
      if (labelRef.current) labelRef.current.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      const vx = cx - prevX;
      prevX = cx;
      tilt += (Math.max(-14, Math.min(14, vx * 0.7)) - tilt) * 0.2;
      if (tiltRef.current) tiltRef.current.style.transform = `rotate(${tilt.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest('a, button, input, select, textarea, [data-cursor]');
      if (interactive) {
        setLabel(interactive.getAttribute('data-cursor') || '');
        setActive(true);
      } else {
        setActive(false);
        setLabel('');
      }
    };
    const onDown = (e: MouseEvent) => {
      setPressed(true);
      const ring = document.createElement('div');
      ring.className = 'cur-ring';
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      document.body.appendChild(ring);
      window.setTimeout(() => ring.remove(), 750);
      window.dispatchEvent(new CustomEvent('sw-burst', { detail: { x: e.clientX, y: e.clientY } }));
    };
    const onUp = () => setPressed(false);
    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      document.documentElement.classList.remove('cursor-none');
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const glow =
    theme === 'light'
      ? 'drop-shadow(0 2px 6px rgba(60,10,30,0.35))'
      : 'drop-shadow(0 0 1.2px rgba(255,235,225,0.9)) drop-shadow(0 3px 8px rgba(0,0,0,0.5))';
  const scale = pressed ? 0.82 : active ? 1.14 : 1;

  return (
    <>
      <div
        ref={posRef}
        className="fixed left-0 top-0 z-[150] pointer-events-none w-[30px] h-[30px] transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0, filter: glow, willChange: 'transform' }}
      >
        <div
          style={{
            transform: `scale(${scale}) rotate(${active ? -10 : 0}deg)`,
            transformOrigin: '15% 15%',
            transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <div ref={tiltRef} style={{ transformOrigin: '15% 15%' }}>
            <svg viewBox="0 0 24 24" className="block w-[30px] h-[30px]">
              <defs>
                <linearGradient id="sw-cursor-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ff0a9e" />
                  <stop offset="0.45" stopColor="#8a2160" />
                  <stop offset="1" stopColor="#4d3141" />
                </linearGradient>
              </defs>
              <path
                d="M3.6 3.8L20.4 10.3L12.6 13.1L9.3 20.7Z"
                fill="url(#sw-cursor-grad)"
                stroke="url(#sw-cursor-grad)"
                strokeWidth="2.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div
        ref={labelRef}
        className="fixed left-0 top-0 z-[149] pointer-events-none"
        style={{ opacity: visible && label ? 1 : 0, transition: 'opacity 0.25s ease', willChange: 'transform' }}
      >
        <span
          className="absolute whitespace-nowrap rounded-full bg-burgundy px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-onburg"
          style={{
            left: 22,
            top: 24,
            transform: label ? 'scale(1)' : 'scale(0.6)',
            transformOrigin: 'left top',
            transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {label}
        </span>
      </div>
    </>
  );
}

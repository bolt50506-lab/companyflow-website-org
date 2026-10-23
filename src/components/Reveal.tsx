import { type ReactNode, type ElementType, useEffect, useState } from 'react';
import { useInView } from '@/lib/hooks';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
  y?: number;
}

export function Reveal({ children, delay = 0, className = '', as: Tag = 'div', y = 24 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate3d(0,0,0)' : `translate3d(0,${y}px,0)`,
        willChange: inView ? 'auto' : 'transform, opacity',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}


interface TextWriteRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

/** Reveals copy word by word while keeping all text available to search engines and assistive technology. */
export function TextWriteReveal({ text, className = '', delay = 0 }: TextWriteRevealProps) {
  const { ref, inView } = useInView<HTMLParagraphElement>();
  const words = text.trim().split(/\s+/);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${i}-${word}`}
          className="text-write-word inline-block align-baseline"
          style={{
            marginInlineEnd: i < words.length - 1 ? '0.27em' : 0,
            opacity: reduceMotion || inView ? 1 : 0,
            transform: reduceMotion || inView ? 'translate3d(0,0,0)' : 'translate3d(0,0.7em,0)',
            filter: reduceMotion || inView ? 'blur(0)' : 'blur(2px)',
            transition: reduceMotion ? 'none' : `opacity 0.48s ease ${delay + i * 38}ms, transform 0.62s cubic-bezier(0.16,1,0.3,1) ${delay + i * 38}ms, filter 0.48s ease ${delay + i * 38}ms`,
            willChange: reduceMotion || inView ? 'auto' : 'opacity, transform, filter',
          }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}

interface SplitHeadingProps {
  text: string;
  className?: string;
  italicWords?: number[];
  delay?: number;
}

export function SplitHeading({ text, className = '', italicWords = [], delay = 0 }: SplitHeadingProps) {
  const { ref, inView } = useInView<HTMLHeadingElement>();
  const words = text.split(' ');

  return (
    <h2 ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span
            className={`inline-block ${italicWords.includes(i) ? 'font-display italic text-burgundy-light' : ''}`}
            style={{
              transform: inView ? 'translateY(0)' : 'translateY(100%)',
              opacity: inView ? 1 : 0,
              transition: `transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay + i * 60}ms, opacity 0.6s ease ${delay + i * 60}ms`,
            }}
          >
            {word}
          </span>
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </h2>
  );
}

/** Eyebrow label: the line draws itself, then the text slides in. */
export function SectionLabel({ children, className = 'mb-6' }: { children: ReactNode; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`flex items-center gap-3 ${className}`}>
      <span
        className="h-px bg-burgundy-light"
        style={{ width: inView ? 32 : 0, transition: 'width 0.9s cubic-bezier(0.16,1,0.3,1)' }}
      />
      <span
        className="font-mono text-xs uppercase tracking-widest text-burgundy-light"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translate3d(0,0,0)' : 'translate3d(-10px,0,0)',
          transition: 'opacity 0.7s ease 0.2s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s',
        }}
      >
        {children}
      </span>
    </div>
  );
}

/** Counts up to a value like "180+", "98%" or "12" when it scrolls into view. */
export function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const m = value.match(/^(\d+)(.*)$/);
  const target = m ? parseInt(m[1], 10) : 0;
  const suffix = m ? m[2] : '';
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || !m) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, target, duration]);

  if (!m) return <span>{value}</span>;
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

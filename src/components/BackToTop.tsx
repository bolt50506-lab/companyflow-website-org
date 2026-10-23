import { useEffect, useState } from 'react';
import { useScrollProgress } from '@/lib/hooks';
import { scrollToTop } from '@/lib/smoothScroll';

export function BackToTop() {
  const { progress } = useScrollProgress();
  const [show, setShow] = useState(false);
  const circumference = 2 * Math.PI * 20;

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => scrollToTop()}
      data-cursor="Top"
      aria-label="Back to top"
      className={`back-to-top fixed right-5 bottom-5 z-[60] w-14 h-14 rounded-full bg-bg/90 border border-line flex items-center justify-center transition-[opacity,transform] duration-500 ${
        show ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-5 pointer-events-none'
      }`}
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="20" fill="none" strokeWidth="2" className="stroke-line" />
        <circle
          cx="22" cy="22" r="20" fill="none" strokeWidth="2"
          className="stroke-burgundy-light"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress * circumference}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-lg">↑</span>
    </button>
  );
}

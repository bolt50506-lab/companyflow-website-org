/**
 * Hero visual (right side): pops in as the loader lifts, then floats gently.
 * Reflows above the headline on phones and stays on the right on desktop.
 */
export function HeroImage() {
  return (
    <div
      className="hero-image absolute right-[3vw] top-[13%] h-[min(66vh,44vw,620px)] pointer-events-none z-[1]"
      style={{ aspectRatio: '902 / 936' }}
    >
      <style>{`
        @keyframes hi-pop {
          0%   { opacity: 0; transform: translate3d(0,50px,0) scale(.6); }
          55%  { opacity: 1; transform: translate3d(0,-8px,0) scale(1.05); }
          78%  { transform: translate3d(0,3px,0) scale(.985); }
          100% { opacity: 1; transform: translate3d(0,0,0) scale(1); }
        }
        @keyframes hi-float { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-12px,0); } }
        .hi-pop { opacity: 0; transform-origin: 50% 65%; will-change: transform, opacity; }
        html[data-ready='true'] .hi-pop { animation: hi-pop 1.1s cubic-bezier(.22,1,.36,1) .6s both; }
        .hi-float { will-change: transform; }
        html[data-ready='true'] .hi-float { animation: hi-float 7s ease-in-out 1.9s infinite; }
      `}</style>
      <div className="hi-pop w-full h-full">
        <div className="hi-float w-full h-full">
          <img
            src="/hero-team.webp"
            alt="Our founder with 180+ projects delivered and 12+ years of experience"
            className="w-full h-full object-contain select-none"
            draggable={false}
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}

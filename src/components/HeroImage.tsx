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
          0%   { opacity: 0; transform: translate3d(0,24px,0) scale(.97); filter: blur(6px); }
          100% { opacity: 1; transform: translate3d(0,0,0) scale(1); filter: blur(0); }
        }
        @keyframes hi-float { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-7px,0); } }
        .hi-pop { opacity: 0; transform-origin: 50% 65%; will-change: transform, opacity; }
        html[data-ready='true'] .hi-pop { animation: hi-pop 1.25s cubic-bezier(.16,1,.3,1) .35s both; }
        .hi-float { will-change: transform; }
        html[data-ready='true'] .hi-float { animation: hi-float 9s ease-in-out 1.6s infinite; }
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

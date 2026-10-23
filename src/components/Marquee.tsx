import { clientLogos } from '@/data/team';

export function Marquee() {
  return (
    <div className="relative z-10 border-y border-line overflow-hidden py-8 bg-bg-surface/60">
      <div className="flex w-max animate-marquee will-change-transform">
        {[...clientLogos, ...clientLogos].map((logo, i) => (
          <span
            key={i}
            className="mx-8 font-mono text-sm text-ink-muted whitespace-nowrap hover:text-ink transition-colors"
          >
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}

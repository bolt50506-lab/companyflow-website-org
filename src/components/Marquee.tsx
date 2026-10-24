import { technologyNames } from '@/data/team';

export function Marquee() {
  return (
    <div aria-label="Technologies and platforms CompanyFlow works with" className="relative z-10 border-y border-line overflow-hidden py-8 bg-bg-surface/60">
      <p className="sr-only">Technologies and platforms we work with</p>
      <div className="flex w-max animate-marquee will-change-transform">
        {[...technologyNames, ...technologyNames].map((logo, i) => (
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

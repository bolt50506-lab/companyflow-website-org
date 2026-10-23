import { SectionLabel } from '@/components/Reveal';

interface PageHeroProps {
  label: string;
  title: string;
  italicWord?: string;
  subtitle?: string;
}

export function PageHero({ label, title, italicWord, subtitle }: PageHeroProps) {
  return (
    <section className="min-h-[70vh] flex flex-col justify-end pt-32 pb-16 px-[5vw]">
      <SectionLabel className="mb-6">{label}</SectionLabel>
      <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.95] tracking-tight max-w-4xl">
        {title}{' '}
        {italicWord && <span className="font-display italic text-burgundy-light">{italicWord}</span>}
      </h1>
      {subtitle && (
        <p className="mt-6 max-w-xl text-lg text-ink-muted leading-relaxed">{subtitle}</p>
      )}
    </section>
  );
}

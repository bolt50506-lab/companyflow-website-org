import { useTheme } from '@/lib/theme';

/**
 * Quiet ambient background for the luxury-tech visual system.
 * A restrained CSS 3D orb replaces the high-motion fluid simulation.
 */
export function FluidBackground() {
  const { theme } = useTheme();
  const light = theme === 'light';

  return (
    <div
      aria-hidden="true"
      className={`premium-background ${light ? 'is-light' : ''}`}
    >
      <div className="premium-orb-wrap">
        <div className="premium-orb" />
        <div className="premium-orb-ring" />
      </div>
    </div>
  );
}

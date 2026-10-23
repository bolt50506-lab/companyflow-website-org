import { useEffect, useRef } from 'react';
import { useTheme } from '@/lib/theme';

/** Cursor-responsive luxury burgundy 3D light sculpture. */
export function FluidBackground() {
  const { theme } = useTheme();
  const light = theme === 'light';
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    let frame = 0;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    const move = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const render = () => {
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;
      scene.style.setProperty('--pointer-x', currentX.toFixed(3));
      scene.style.setProperty('--pointer-y', currentY.toFixed(3));
      frame = window.requestAnimationFrame(render);
    };
    window.addEventListener('pointermove', move, { passive: true });
    frame = window.requestAnimationFrame(render);
    return () => {
      window.removeEventListener('pointermove', move);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={sceneRef} aria-hidden="true" className={`premium-background ${light ? 'is-light' : ''}`}>
      <div className="premium-cursor-glow" />
      <div className="premium-orb-wrap">
        <div className="premium-orb">
          <span className="premium-orb-highlight" />
          <span className="premium-orb-core" />
        </div>
        <div className="premium-orb-ring premium-orb-ring-a" />
        <div className="premium-orb-ring premium-orb-ring-b" />
        <div className="premium-orb-halo" />
      </div>
    </div>
  );
}

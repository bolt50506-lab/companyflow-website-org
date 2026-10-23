import { type ReactNode, useRef } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'solid' | 'outline';
  className?: string;
  type?: 'button' | 'submit';
  target?: string;
  rel?: string;
  'data-cursor'?: string;
}

const COLORS = 'background-color .3s ease, border-color .3s ease, color .3s ease, scale .25s ease';
const TRANS_MOVE = `transform .25s cubic-bezier(.22,1,.36,1), ${COLORS}`;
const TRANS_LEAVE = `transform .8s cubic-bezier(.22,1,.36,1), ${COLORS}`;

/**
 * Primary button. Magnetic pull towards the cursor, a liquid fill that grows from the
 * point where the pointer enters, a light sweep (solid), the arrow icon sliding forward,
 * a press-down state and a click ripple.
 */
export function MagneticButton({
  children,
  onClick,
  href,
  variant = 'solid',
  className = '',
  type = 'button',
  target,
  rel,
  'data-cursor': cursorLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  const placeFill = (e: React.MouseEvent) => {
    const el = ref.current;
    const f = fillRef.current;
    if (!el || !f) return;
    const r = el.getBoundingClientRect();
    f.style.left = `${e.clientX - r.left}px`;
    f.style.top = `${e.clientY - r.top}px`;
  };

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transition = TRANS_MOVE;
    el.style.transform = `translate3d(${x * 0.25}px, ${y * 0.35}px, 0)`;
  };

  const handleLeave = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    placeFill(e); // fill retreats towards the exit point
    el.style.transition = TRANS_LEAVE;
    el.style.transform = '';
  };

  const handleClick = (e: React.MouseEvent) => {
    const el = ref.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      const dot = document.createElement('span');
      dot.className = 'mb-ripple';
      dot.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      el.appendChild(dot);
      window.setTimeout(() => dot.remove(), 700);
    }
    onClick?.();
  };

  const baseClass = `mb group relative inline-flex items-center gap-2 rounded-full font-medium overflow-hidden will-change-transform ${
    variant === 'solid'
      ? 'mb-solid bg-burgundy text-onburg'
      : 'mb-outline border border-line text-ink hover:border-burgundy-light'
  } ${className}`;

  const inner = (
    <>
      <span ref={fillRef} aria-hidden="true" className="mb-fill" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        data-cursor={cursorLabel}
        className={baseClass}
        onMouseEnter={placeFill}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={handleClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      data-cursor={cursorLabel}
      className={baseClass}
      onMouseEnter={placeFill}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      {inner}
    </button>
  );
}

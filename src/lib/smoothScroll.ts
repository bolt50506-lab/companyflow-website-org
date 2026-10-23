/**
 * Use the browser's native smooth scrolling without a third-party runtime.
 * This keeps route transitions and anchor scrolling functional while honoring
 * the site's CSS and the user's reduced-motion preference.
 */
export function startSmoothScroll(): () => void {
  return () => {};
}

export function scrollToTop(immediate = false) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({
    top: 0,
    behavior: immediate || reducedMotion ? 'auto' : 'smooth',
  });
}

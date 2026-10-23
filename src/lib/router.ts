import { useEffect, useState, useCallback } from 'react';
import { scrollToTop } from '@/lib/smoothScroll';

function normalizePath(path: string) {
  const clean = `/${path}`.replace(/\/+/g, '/');
  if (clean === '/') return '/';
  return clean.replace(/\/+$/, '');
}

function currentPath() {
  // Accept legacy hash routes from any pathname, not just the homepage.
  // For example, /solutions/custom-software#/resources/blog should resolve to /resources/blog.
  const legacy = window.location.hash.match(/^#(\/.*)$/)?.[1];
  if (legacy) return normalizePath(decodeURI(legacy));
  return normalizePath(decodeURI(window.location.pathname));
}

export function useHashRoute() {
  // Kept under the old hook name to avoid touching unrelated page code. Routes are now
  // real pathname URLs, so each page can be crawled and linked independently.
  const [route, setRoute] = useState(currentPath);

  useEffect(() => {
    // Backwards compatibility: normalize old hash routes from any current pathname.
    const legacy = window.location.hash.match(/^#(\/.*)$/)?.[1];
    if (legacy) {
      const path = normalizePath(decodeURI(legacy));
      window.history.replaceState({}, '', `${path}${window.location.search}`);
      setRoute(path);
    }

    const onChange = () => {
      setRoute(currentPath());
      scrollToTop(true);
    };
    window.addEventListener('popstate', onChange);
    window.addEventListener('companyflow:navigate', onChange);
    return () => {
      window.removeEventListener('popstate', onChange);
      window.removeEventListener('companyflow:navigate', onChange);
    };
  }, []);

  const navigate = useCallback((path: string) => {
    const next = normalizePath(path);
    if (next !== currentPath()) {
      window.history.pushState({}, '', next);
      window.dispatchEvent(new Event('companyflow:navigate'));
      scrollToTop(true);
    }
  }, []);

  return { route, navigate };
}

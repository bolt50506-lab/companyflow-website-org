import { useState, useEffect, useCallback } from 'react';
import { startSmoothScroll } from '@/lib/smoothScroll';
import { ThemeProvider } from '@/lib/theme';
import { useHashRoute } from '@/lib/router';
import { Loader } from '@/components/Loader';
import { Cursor } from '@/components/Cursor';
import { FluidBackground } from '@/components/FluidBackground';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';
import { ChatAssistant } from '@/components/ChatAssistant';
import { HomePage } from '@/pages/HomePage';
import { CompanyPage } from '@/pages/CompanyPage';
import { SolutionsPage } from '@/pages/SolutionsPage';
import { ResourcesPage } from '@/pages/ResourcesPage';
import { CaseStudiesPage } from '@/pages/CaseStudiesPage';
import { ContactPage } from '@/pages/ContactPage';
import { updateSeo } from '@/lib/seo';
import '@/styles/scroll-driven.css';

function Routes() {
  const { route } = useHashRoute();
  const parts = route.split('/').filter(Boolean);
  const top = parts[0] || '';

  if (top === 'company') return <CompanyPage />;
  if (top === 'solutions') return <SolutionsPage />;
  if (top === 'resources') return <ResourcesPage />;
  if (top === 'case-studies') return <CaseStudiesPage />;
  if (top === 'contact') return <ContactPage />;
  return <HomePage />;
}

function Page() {
  const { route } = useHashRoute();

  useEffect(() => {
    updateSeo(route);
  }, [route]);

  return (
    <div key={route.split('/').filter(Boolean)[0] || 'home'} className="page-enter">
      <Routes />
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      document.body.style.overflow = 'hidden';
      return;
    }
    document.body.style.overflow = '';
    return startSmoothScroll();
  }, [loaded]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      document.documentElement.dataset.ready = 'true';
    }, 9000);
    return () => window.clearTimeout(t);
  }, []);

  // Keep client-side transitions smooth while exposing clean, crawlable pathname URLs.
  useEffect(() => {
    const onInternalLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(target instanceof HTMLAnchorElement)) return;
      if (target.target && target.target !== '_self') return;
      if (target.hasAttribute('download')) return;
      const url = new URL(target.href, window.location.href);
      if (url.origin !== window.location.origin || !url.pathname.startsWith('/')) return;
      const legacyRoute = url.hash.match(/^#(\/.*)$/)?.[1];
      // A hash beginning with / is an old-style app route, even when attached to
      // a non-root pathname. Ordinary #section anchors should keep native behavior.
      if (!legacyRoute && url.hash) return;
      const nextUrl = legacyRoute
        ? `${legacyRoute}${url.search}`
        : `${url.pathname}${url.search}`;
      const currentUrl = `${window.location.pathname}${window.location.search}`;
      if (nextUrl === currentUrl && !window.location.hash) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      window.history.pushState({}, '', nextUrl);
      window.dispatchEvent(new Event('companyflow:navigate'));
    };
    document.addEventListener('click', onInternalLink);
    return () => document.removeEventListener('click', onInternalLink);
  }, []);

  const onReveal = useCallback(() => {
    document.documentElement.dataset.ready = 'true';
    window.dispatchEvent(new Event('sw-reveal'));
  }, []);
  const onComplete = useCallback(() => setLoaded(true), []);

  return (
    <ThemeProvider>
      {!loaded && <Loader onReveal={onReveal} onComplete={onComplete} />}
      <Cursor />
      <FluidBackground />
      <Header />
      <main className="relative z-[2]">
        <Page />
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppWidget />
      <ChatAssistant />
    </ThemeProvider>
  );
}

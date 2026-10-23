import { useEffect, useRef, useState } from 'react';
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { useHashRoute } from '@/lib/router';
import { solutions } from '@/data/solutions';
import { getIcon } from '@/lib/icons';
import { MagneticButton } from '@/components/MagneticButton';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Company', path: '/company' },
  { label: 'Solutions', path: '/solutions', dropdown: true },
  { label: 'Resources', path: '/resources', dropdown: true },
  { label: 'Case Studies', path: '/case-studies' },
];

const solutionLinks = solutions.map(s => ({ label: s.short, path: `/solutions/${s.slug}`, icon: s.icon }));

const resourceLinks = [
  { label: 'Blog', path: '/resources/blog', icon: '' },
  { label: 'Careers', path: '/resources/careers', icon: '' },
];

const linksFor = (label: string) => (label === 'Solutions' ? solutionLinks : resourceLinks);

export function Header() {
  const { theme, toggle } = useTheme();
  const { route } = useHashRoute();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const lastY = useRef(0);
  const barRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => (path === '/' ? route === '/' || route === '' : route === path || route.startsWith(path + '/'));

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - lastY.current) > 4) {
        setHidden(y > lastY.current && y > 220 && !menuOpen);
        lastY.current = y;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [menuOpen]);

  // close menus on navigation, lock page scroll while the mobile menu is open, Escape closes
  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [route]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[60] transition-[transform,background-color,padding,border-color] duration-500 ease-out will-change-transform ${
          hidden ? '-translate-y-full' : ''
        } ${scrolled ? 'bg-bg/90 backdrop-blur-md border-b border-line py-3' : 'py-5'}`}
      >
        {/* scroll progress */}
        <div
          ref={barRef}
          aria-hidden="true"
          className="absolute left-0 top-0 h-[2px] w-full origin-left bg-gradient-to-r from-burgundy via-burgundy-light to-[#d9a15b]"
          style={{ transform: 'scaleX(0)' }}
        />
        <div className="flex items-center justify-between px-[5vw]">
          <a href="/" className="text-xl font-bold tracking-tight" data-cursor="Home">
            CompanyFlow<span className="text-burgundy-light">.</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 relative">
            {navItems.map(item => (
              <div
                key={item.path}
                className="relative"
                onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <a
                  href={item.path}
                  data-cursor="Open"
                  data-active={isActive(item.path)}
                  onFocus={() => item.dropdown && setOpenDropdown(item.label)}
                  className={`nav-link px-4 py-2 text-sm font-medium hover:text-ink transition-colors flex items-center gap-1 ${
                    isActive(item.path) ? 'text-ink' : 'text-ink-muted'
                  }`}
                >
                  {item.label}
                  {item.dropdown && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${openDropdown === item.label ? 'rotate-180' : ''}`}
                    />
                  )}
                </a>
                {item.dropdown && openDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2 animate-drop-in origin-top-left">
                    <div
                      className={`bg-bg-surface border border-line rounded-2xl p-2 shadow-2xl ${
                        item.label === 'Solutions' ? 'grid grid-cols-2 gap-1 w-[540px]' : 'min-w-[220px]'
                      }`}
                    >
                      {linksFor(item.label).map(link => {
                        const Icon = link.icon ? getIcon(link.icon) : null;
                        return (
                          <a
                            key={link.path}
                            href={link.path}
                            data-cursor="Open"
                            className="group flex items-center gap-3 px-3 py-2.5 text-sm text-ink-muted hover:text-ink hover:bg-bg-surface2 rounded-xl transition-colors"
                          >
                            {Icon && (
                              <span className="w-8 h-8 rounded-lg bg-burgundy/15 flex items-center justify-center flex-none transition-all duration-300 group-hover:bg-burgundy group-hover:scale-110 group-hover:-rotate-6">
                                <Icon className="w-4 h-4 text-burgundy-light transition-colors group-hover:text-onburg" />
                              </span>
                            )}
                            <span className="transition-transform duration-300 group-hover:translate-x-0.5">{link.label}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              data-cursor={theme === 'dark' ? 'Light' : 'Dark'}
              aria-label="Toggle theme"
              className="icon-btn w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink-muted hover:text-ink hover:border-burgundy-light"
            >
              <span className="relative block w-4 h-4">
                <Sun
                  className={`absolute inset-0 w-4 h-4 transition-all duration-500 ${
                    theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
                  }`}
                />
                <Moon
                  className={`absolute inset-0 w-4 h-4 transition-all duration-500 ${
                    theme === 'dark' ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                  }`}
                />
              </span>
            </button>
            <MagneticButton href="/contact" data-cursor="Start" className="hidden lg:inline-flex px-5 py-2.5 text-sm">
              Start a project
            </MagneticButton>
            <button
              onClick={() => setMenuOpen(true)}
              className="icon-btn lg:hidden w-9 h-9 flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[70] bg-bg flex flex-col p-[5vw] lg:hidden overflow-y-auto animate-drop-in">
          <div className="flex items-center justify-between py-4">
            <span className="text-xl font-bold">
              CompanyFlow<span className="text-burgundy-light">.</span>
            </span>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="icon-btn w-9 h-9 flex items-center justify-center">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-1 mt-8">
            {navItems.map((item, idx) => (
              <div key={item.path} className="animate-menu-in" style={{ animationDelay: `${80 + idx * 60}ms` }}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between py-3 text-2xl font-display"
                      aria-expanded={mobileExpanded === item.label}
                    >
                      {item.label}
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileExpanded === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileExpanded === item.label && (
                      <div className="pl-4 flex flex-col gap-1 pb-2 animate-drop-in">
                        <a href={item.path} onClick={() => setMenuOpen(false)} className="py-2 text-sm text-burgundy-light">
                          All {item.label.toLowerCase()} →
                        </a>
                        {linksFor(item.label).map(link => (
                          <a key={link.path} href={link.path} onClick={() => setMenuOpen(false)} className="py-2 text-sm text-ink-muted">
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a href={item.path} onClick={() => setMenuOpen(false)} className="block py-3 text-2xl font-display">
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </nav>
          <a
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="animate-menu-in inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-burgundy text-onburg font-medium"
            style={{ animationDelay: '420ms' }}
          >
            Start a project
          </a>
        </div>
      )}
    </>
  );
}

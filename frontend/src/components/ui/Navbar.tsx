import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Menu, X, Search, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { Profile } from '../../types';

interface NavbarProps {
  profile: Profile;
  onOpenCommandPalette?: () => void;
}

const NAV_ITEMS = [
  { name: 'About', href: '#about' },
  { name: 'Journey', href: '#journey' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ profile, onOpenCommandPalette }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === '/';

  // Calculate scroll progress & active section
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);

      if (isHome) {
        const sections = ['hero', 'about', 'journey', 'skills', 'experience', 'projects', 'contact'];
        for (const s of sections) {
          const el = document.getElementById(s);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 150) {
              setActiveSection(s);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const focusable = mobileMenuRef.current?.querySelectorAll<HTMLElement>('a, button');
      focusable?.[0]?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    if (!isHome) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        {/* Floating Pill Container */}
        <div className="relative pointer-events-auto max-w-content w-full flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full bg-bg-card/85 backdrop-blur-xl border border-border shadow-lg shadow-black/10 transition-all duration-300">
          {/* Scroll progress line at bottom of pill */}
          <div
            className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-primary to-secondary rounded-full origin-left transition-all duration-75"
            style={{ width: `${scrollProgress}%` }}
          />

          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label={`${profile.name || 'Portfolio'} - Home`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary p-[1.5px] transition-transform duration-200 group-hover:scale-105 shadow-sm">
              <div className="w-full h-full bg-bg rounded-full flex items-center justify-center font-display font-bold text-xs text-primary">
                {profile.name ? profile.name.charAt(0) : 'A'}
              </div>
            </div>
            <span className="font-display font-bold text-sm sm:text-base text-text-primary group-hover:text-primary transition-colors tracking-tight hidden xs:inline">
              {profile.name}
            </span>
          </Link>

          {/* Desktop Navigation Items */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = isHome && activeSection === item.href.substring(1);
              return (
                <a
                  key={item.name}
                  href={isHome ? item.href : `/${item.href}`}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              title="Command Palette (Ctrl+K)"
              aria-label="Open Command Palette"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono text-text-muted hover:text-text-primary hover:bg-white/5 border border-border/60 transition-colors focus:outline-none"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-[11px]">⌘K</span>
            </button>


            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent hover:border-border transition-colors focus:outline-none"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-primary" />
              )}
            </button>

            {/* Resume Button */}
            <a
              href={profile.resumeUrl}
              download={`${profile.name.replace(/\s+/g, '_')}_Resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-primary hover:bg-primary-light transition-all shadow-sm"
            >
              <span>Resume</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 rounded-full text-text-secondary hover:text-text-primary focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Animated Slide-in Menu with Focus Trap */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md md:hidden flex justify-end animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            ref={mobileMenuRef}
            className="w-4/5 max-w-sm h-full bg-bg-card border-l border-border p-6 flex flex-col justify-between shadow-2xl glass-panel animate-in slide-in-from-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <span className="font-display font-bold text-lg text-text-primary">Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-2">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.name}
                    href={isHome ? item.href : `/${item.href}`}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-text-primary hover:bg-white/5 transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border space-y-3">
              <a
                href={profile.resumeUrl}
                download={`${profile.name.replace(/\s+/g, '_')}_Resume.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-primary text-center block"
              >
                Download Resume (PDF)
              </a>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

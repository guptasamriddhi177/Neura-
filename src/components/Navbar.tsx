import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LANDING_CONTENT } from '../data/landingContent.ts';
import { NuMascot } from './NuMascot.tsx';

interface NavbarProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPath }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      setMobileOpen(false);
      if (currentPath !== '/') {
        e.preventDefault();
        onNavigate('/');
        setTimeout(() => {
          const el = document.querySelector(href);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      }
      return;
    }
    e.preventDefault();
    setMobileOpen(false);
    onNavigate(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFFDF8]/95 backdrop-blur border-b-2 border-[#14342B]/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand mark */}
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14342B] rounded-lg"
          >
            <NuMascot
              mood="happy"
              variant="chalk"
              className="w-9 h-9 rounded-xl p-0.5 bg-[#14342B] border-2 border-[#14342B]"
            />
            <span className="font-display text-2xl font-bold tracking-tight text-[#14342B]">
              Neura
            </span>
          </a>

          {/* Zone 2: Concise single-line navigation links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-6 text-[15px] font-semibold text-[#14342B]/85"
          >
            {LANDING_CONTENT.navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="hover:text-[#14342B] hover:underline underline-offset-4 decoration-2 decoration-[#FFC83D] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14342B] rounded"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Demo link + Primary CTA */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <a
              href="/demo"
              onClick={(e) => handleLinkClick(e, '/demo')}
              className="text-[15px] font-bold text-[#14342B] hover:underline underline-offset-4 decoration-2 decoration-[#5CB8FF] whitespace-nowrap shrink-0 px-2 py-2 rounded focus-visible:outline-2 focus-visible:outline-[#14342B]"
            >
              Try a demo
            </a>
            <a
              href="/signin"
              onClick={(e) => handleLinkClick(e, '/signin')}
              className="sketch-btn inline-flex items-center justify-center px-5 py-2 rounded-full bg-[#FFC83D] text-[#14342B] font-bold text-[15px] hover:bg-[#f5bc28] transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14342B]"
            >
              Start free
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border-2 border-[#14342B] bg-[#FFF8EC] text-[#14342B] hover:bg-[#FFC83D]/30 focus-visible:outline-2 focus-visible:outline-[#14342B]"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t-2 border-[#14342B]/15 bg-[#FFFDF8] px-4 py-4 space-y-2">
            {LANDING_CONTENT.navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="block px-3 py-2.5 rounded-xl text-base font-semibold text-[#14342B] hover:bg-[#CFE09B]/35"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 border-t border-[#14342B]/15 flex items-center gap-3">
              <a
                href="/demo"
                onClick={(e) => handleLinkClick(e, '/demo')}
                className="flex-1 text-center py-2.5 rounded-full border-2 border-[#14342B] bg-white text-[#14342B] font-bold"
              >
                Try a demo
              </a>
              <a
                href="/signin"
                onClick={(e) => handleLinkClick(e, '/signin')}
                className="sketch-btn flex-1 text-center py-2.5 rounded-full bg-[#FFC83D] text-[#14342B] font-bold"
              >
                Start free
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom CTA */}
      {currentPath === '/' && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#FFFDF8]/95 backdrop-blur border-t-2 border-[#14342B]/15 px-4 py-2 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-[#14342B]/85 truncate">
            Ages 5–12 · Free early access
          </span>
          <a
            href="/signin"
            onClick={(e) => handleLinkClick(e, '/signin')}
            className="sketch-btn inline-flex items-center justify-center px-5 py-1.5 rounded-full bg-[#FFC83D] text-[#14342B] font-bold text-sm whitespace-nowrap shrink-0"
          >
            Start free
          </a>
        </div>
      )}
    </>
  );
};

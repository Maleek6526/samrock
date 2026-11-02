'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Shield, Sun, Moon } from 'lucide-react';
import { brandMark } from '@/lib/site';
import { applyTheme, useSiteSettings, useTheme } from '@/lib/store';

const navLinks = [
  { name: 'Beats', href: '#beats' },
  { name: 'Discography', href: '#discography' },
  { name: 'Services', href: '#services' },
  { name: 'About & Gear', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

const iconButton =
  'p-2.5 rounded-xl bg-surface-3 border border-hairline text-strong hover:border-brand hover:text-brand transition';
const primaryButton =
  'inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-solid to-brand-strong text-brand-contrast font-semibold shadow-lg shadow-brand/20 hover:opacity-95 transition';
const secondaryButton =
  'inline-flex items-center justify-center rounded-xl bg-surface-3 border border-hairline text-strong hover:border-brand hover:text-brand font-semibold transition';

export default function Navbar() {
  const settings = useSiteSettings();
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isDarkMode = theme === 'dark';

  const toggleTheme = useCallback(() => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-hairline bg-surface/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-hairline shadow-sm transition group-hover:border-brand sm:h-12 sm:w-12">
              <Image
                src="/logo.jpg"
                alt=""
                width={48}
                height={48}
                priority
                className="h-full w-full object-cover"
              />
            </div>
            <span className="flex flex-col">
              <span className="text-lg font-extrabold tracking-wider text-strong transition group-hover:text-brand sm:text-xl">
                {brandMark(settings.producerName)}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-silver sm:text-[11px]">
                Music Productions
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-silver transition hover:text-brand"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              aria-pressed={isDarkMode}
              title="Toggle dark / light mode"
              className={iconButton}
            >
              {isDarkMode ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-surface-3 px-3.5 py-2 text-xs font-semibold text-strong transition hover:border-brand hover:text-brand"
            >
              <Shield size={14} aria-hidden="true" />
              Admin
            </Link>

            <a href="#contact" className={`${primaryButton} px-5 py-2.5 text-sm`}>
              Book Session
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              aria-pressed={isDarkMode}
              className="rounded-lg border border-hairline bg-surface-3 p-2 text-strong"
            >
              {isDarkMode ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              className="rounded-lg border border-hairline bg-surface-3 p-2 text-strong"
            >
              {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          id="mobile-nav"
          className="space-y-3 border-b border-hairline bg-surface px-4 pb-6 pt-2 backdrop-blur-xl md:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block border-b border-hairline py-2 text-base font-medium text-silver transition hover:text-brand"
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className={`${secondaryButton} w-full py-2.5 text-sm`}
            >
              Admin Dashboard
            </Link>
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className={`${primaryButton} w-full py-2.5 text-sm`}
            >
              Book Session
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Shield, Sun, Moon } from 'lucide-react';
import { brandMark, navLinks } from '@/lib/site';
import { applyTheme, useSiteSettings, useTheme } from '@/lib/store';

const iconButton =
  'rounded-xs border border-hairline p-2.5 text-strong transition hover:border-brand hover:text-brand';
const compactGhost = 'btn btn-ghost px-4 py-2.5';

export default function Navbar() {
  const settings = useSiteSettings();
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isDarkMode = theme === 'dark';

  const toggleTheme = useCallback(() => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-hairline bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex h-20 items-center justify-between sm:h-24">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xs border border-hairline transition group-hover:border-brand sm:h-12 sm:w-12">
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
              <span className="font-display text-xl leading-none tracking-tight text-strong transition group-hover:text-brand sm:text-2xl">
                {brandMark(settings.producerName)}
              </span>
              <span className="eyebrow mt-1.5 text-silver">Music Productions</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="eyebrow link-underline text-silver transition hover:text-strong"
              >
                {link.name}
              </Link>
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

            <Link href="/admin" className={compactGhost}>
              <Shield size={14} aria-hidden="true" />
              Admin
            </Link>

            <a href="/booking" className="btn btn-primary px-5 py-3">
              Book Session
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              aria-pressed={isDarkMode}
              className="rounded-xs border border-hairline p-2 text-strong"
            >
              {isDarkMode ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              className="rounded-xs border border-hairline p-2 text-strong"
            >
              {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div id="mobile-nav" className="border-b border-hairline bg-surface px-6 pb-8 pt-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="eyebrow block border-b border-hairline py-4 text-silver transition hover:text-strong"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-6">
            <Link href="/admin" onClick={() => setIsOpen(false)} className={`${compactGhost} w-full`}>
              <Shield size={14} aria-hidden="true" />
              Admin Dashboard
            </Link>
            <Link
              href="/booking"
              onClick={() => setIsOpen(false)}
              className="btn btn-primary w-full"
            >
              Book Session
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

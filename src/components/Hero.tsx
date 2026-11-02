'use client';

import React from 'react';
import { Play, Calendar } from 'lucide-react';
import { useSiteSettings } from '@/lib/store';

const genres = [
  'Afrobeats',
  'Reggae',
  'Woro',
  'Trap',
  'Highlife',
  'Dancehall',
  'Mix & Master',
  'Jingles',
];

export default function Hero() {
  const settings = useSiteSettings();

  return (
    <section className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-surface pb-12 pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[140px]"
      />

      <div className="z-10 mx-auto my-auto max-w-5xl space-y-8 px-4 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-surface-2 px-4 py-2 text-xs font-semibold text-brand shadow-lg backdrop-blur-md">
          <span aria-hidden="true" className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
          {settings.statusBadge}
        </p>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-strong sm:text-6xl lg:text-7xl">
          Crafting <span className="text-gradient">Hit Records</span> &amp; Heavy Soundscapes
        </h1>

        <p className="mx-auto max-w-2xl text-base leading-relaxed text-silver sm:text-lg">
          Welcome to <strong className="text-strong">{settings.producerName}</strong>. Professional beat
          making, recording, top-tier mixing &amp; mastering, and custom production tailored for the global
          music scene.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <a
            href="#beats"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-solid to-brand-strong px-8 py-4 text-base font-bold text-brand-contrast shadow-xl shadow-brand/25 transition hover:scale-105 sm:w-auto"
          >
            <Play size={18} fill="currentColor" aria-hidden="true" />
            Explore Beat Store
          </a>
          <a
            href="#contact"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand/30 bg-surface-2 px-8 py-4 text-base font-bold text-strong shadow-lg transition hover:border-brand sm:w-auto"
          >
            <Calendar size={18} className="text-brand" aria-hidden="true" />
            Book Studio Session
          </a>
        </div>
      </div>

      {/* Two identical copies scroll by exactly 50% of their width, so the loop is seamless. */}
      <div className="relative mt-16 w-full overflow-hidden border-t border-hairline bg-surface-3 py-4 backdrop-blur-md">
        <div className="flex w-max animate-marquee items-center">
          {[...genres, ...genres].map((genre, index) => (
            <div
              key={`${genre}-${index}`}
              aria-hidden={index >= genres.length}
              className="flex items-center gap-4 px-6 text-sm font-bold uppercase tracking-widest text-silver"
            >
              <span className="text-brand">•</span>
              <span>{genre}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

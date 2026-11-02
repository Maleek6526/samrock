'use client';
import React, { useState, useEffect } from 'react';
import { Play, Calendar, Sparkles } from 'lucide-react';

export default function Hero() {
  const [settings, setSettings] = useState({
    producerName: 'Samrock Music Productions',
    statusBadge: 'Available for Placements, Beats & Studio Sessions'
  });

  useEffect(() => {
    const saved = localStorage.getItem('siteSettings');
    if (saved) setSettings(JSON.parse(saved));

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'siteSettings') setSettings(JSON.parse(e.newValue || '{}'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const genres = ['Afrobeats', 'Reggae', 'Woro', 'Trap', 'Highlife', 'Dancehall', 'Mix & Master', 'Jingles'];

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-32 pb-12 overflow-hidden bg-white dark:bg-samrock-dark">
      
      {/* Background Glow Effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-samrock-cyan/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center z-10 space-y-8 px-4 my-auto">
        
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-samrock-card border border-samrock-cyan/40 text-xs font-semibold text-samrock-cyan shadow-lg shadow-samrock-cyan/10 backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          {settings.statusBadge}
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-samrock-cyan via-orange-400 to-samrock-silver">Hit Records</span> & Heavy Soundscapes
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Welcome to <strong className="text-gray-900 dark:text-white">{settings.producerName}</strong>. Professional beat making, recording, top-tier mixing & mastering, and custom production tailored for the global music scene.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="#beats"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-samrock-cyan to-orange-600 text-white font-bold text-base shadow-xl shadow-samrock-cyan/25 hover:scale-105 transition"
          >
            <Play size={18} fill="white" />
            Explore Beat Store
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-samrock-card border border-samrock-cyan/30 text-gray-900 dark:text-white font-bold text-base hover:bg-samrock-cyan/10 transition shadow-lg"
          >
            <Calendar size={18} className="text-samrock-cyan" />
            Book Studio Session
          </a>
        </div>

      </div>

      {/* Continuous Animated Slideshow Marquee Ticker */}
      <div className="w-full mt-16 py-4 border-t border-samrock-cyan/20 bg-gray-100/70 dark:bg-samrock-card/40 backdrop-blur-md overflow-hidden relative">
        <div className="flex w-max animate-marquee items-center gap-8">
          {genres.concat(genres).concat(genres).map((genre, idx) => (
            <div key={idx} className="flex items-center gap-4 text-gray-700 dark:text-samrock-silver text-sm font-bold uppercase tracking-widest px-4">
              <span className="text-samrock-cyan">•</span>
              <span>{genre}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

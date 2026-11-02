﻿'use client';
import React, { useState, useEffect } from 'react';
import { Disc, ExternalLink, Award, Play, Pause } from 'lucide-react';
import { Placement, initialPlacements } from '@/data/initialData';
import { useAudio } from '@/context/AudioContext';

export default function Discography() {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const [placements, setPlacements] = useState<Placement[]>(initialPlacements);

  useEffect(() => {
    const savedPlacements = localStorage.getItem('placements');
    if (savedPlacements) setPlacements(JSON.parse(savedPlacements));

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'placements') setPlacements(JSON.parse(e.newValue || '[]'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handlePlayClick = (item: Placement) => {
    if (!item.audioUrl && !item.link) return;
    if (currentTrack?.id === item.id) {
      togglePlay();
    } else {
      playTrack(item);
    }
  };

  return (
    <section id="discography" className="py-24 px-4 bg-white dark:bg-samrock-dark/95 relative border-t border-samrock-cyan/10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white dark:bg-samrock-card border border-samrock-cyan/30 text-xs font-semibold text-samrock-cyan uppercase tracking-widest">
            <Award size={14} /> Credits & Releases
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Major <span className="text-transparent bg-clip-text bg-gradient-to-r from-samrock-cyan to-orange-500">Placements</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            A showcase of hit records produced, recorded, mixed, and mastered at Samrock Music Productions.
          </p>
        </div>

        {/* Placements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {placements.map((item) => {
            const isThisTrackPlaying = currentTrack?.id === item.id && isPlaying;
            const isPlayable = !!(item.audioUrl || item.link);

            return (
              <div 
                key={item.id}
                className="group bg-white dark:bg-samrock-card rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-samrock-cyan/40 transition duration-300 shadow-xl flex flex-col"
              >
                <div className="relative aspect-video sm:aspect-square overflow-hidden bg-gray-900">
                  <img 
                    src={item.coverArt} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {isPlayable && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-[2px]">
                      <button
                        onClick={() => handlePlayClick(item)}
                        className="w-14 h-14 rounded-full bg-samrock-cyan flex items-center justify-center text-white shadow-xl hover:scale-110 transition"
                      >
                        {isThisTrackPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                      </button>
                    </div>
                  )}
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs font-bold text-samrock-cyan border border-samrock-cyan/20">
                    {item.year}
                  </span>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-samrock-cyan transition">{item.title}</h3>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">Artist: {item.artist}</p>
                    <p className="text-xs text-samrock-silver mt-1">Role: <span className="text-samrock-cyan">{item.role}</span></p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPlayable && (
                      <button
                        onClick={() => handlePlayClick(item)}
                        className={`p-2.5 rounded-xl border transition ${
                          isThisTrackPlaying 
                            ? 'bg-samrock-cyan text-white border-samrock-cyan' 
                            : 'bg-gray-50 dark:bg-samrock-dark text-samrock-cyan border-samrock-cyan/30 hover:bg-samrock-cyan/10'
                        }`}
                      >
                        {isThisTrackPlaying ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                    )}
                    <a 
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-samrock-cyan/50 text-xs font-semibold transition"
                    >
                      Stream Release <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

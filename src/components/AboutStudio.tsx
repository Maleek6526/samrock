﻿'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sliders, Cpu, Headphones, ShieldCheck, Terminal, Eye, X } from 'lucide-react';

export default function AboutStudio() {
  const [showFlyer, setShowFlyer] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle body scroll and Escape key
  useEffect(() => {
    if (!showFlyer) return;

    // Prevent scrolling when flyer is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowFlyer(false);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showFlyer]);

  const rigItems = [
    { title: "Universal Audio Apollo x8p", icon: <Cpu size={24} /> },
    { title: "Neumann U87 Ai Microphone", icon: <Sliders size={24} /> },
    { title: "Focal Shape 65 Monitors", icon: <Headphones size={24} /> },
    { title: "Custom Acoustic Treatment", icon: <ShieldCheck size={24} /> },
  ];

  return (
    <section id="about" className="py-24 px-4 bg-white dark:bg-samrock-dark/95 relative border-t border-samrock-cyan/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Text Content */}
        <div className="space-y-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-samrock-cyan to-orange-500">Samrock</span>
          </h2>

          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Crafting Excellence at <span className="text-samrock-cyan">Samrock Music Productions</span>
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              With over a decade of experience in the Nigerian music industry, Samrock has become a cornerstone for artists seeking that signature professional sound. Our studio is more than just a recording space; it's an innovation hub where musical ideas are transformed into global hits.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-samrock-cyan/10 border border-samrock-cyan/20 text-samrock-cyan text-sm font-bold">
                <Terminal size={18} /> Professional Sound Engineering
              </div>
              <button 
                onClick={() => setShowFlyer(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-bold hover:bg-orange-500/20 transition"
              >
                <Eye size={18} /> View Studio Flyer
              </button>
            </div>
          </div>
        </div>

        {/* Studio Rig Grid */}
        <div className="grid grid-cols-2 gap-4">
          {rigItems.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-samrock-card border border-gray-200 dark:border-gray-800 p-6 rounded-2xl hover:border-samrock-cyan transition group">
              <div className="w-12 h-12 rounded-xl bg-samrock-cyan/10 flex items-center justify-center text-samrock-cyan group-hover:scale-110 transition mb-4">
                {item.icon}
              </div>
              <h5 className="font-bold text-gray-900 dark:text-white text-base">{item.title}</h5>
            </div>
          ))}
        </div>
      </div>

      {/* Flyer Modal */}
      {showFlyer && mounted && createPortal(
        <div 
          role="dialog"
          aria-modal="true"
          aria-label="Studio flyer"
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setShowFlyer(false)}
        >
          <div 
            className="relative max-w-lg w-full max-h-[90vh] overflow-hidden rounded-2xl border border-white/20 cursor-default shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowFlyer(false);
              }}
              aria-label="Close flyer"
              title="Close (Esc)"
              className="absolute top-4 right-4 z-[10000] flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-white text-xs font-semibold hover:bg-samrock-cyan hover:text-white transition cursor-pointer"
            >
              <X size={16} /> Close
            </button>
            <div className="overflow-auto max-h-[90vh]">
              <img src="/flyer.jpg" alt="Samrock Music Productions Flyer" className="w-full h-auto" />
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

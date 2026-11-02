'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Cpu, Eye, Headphones, ShieldCheck, Sliders, Terminal, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';

const rigItems = [
  { title: 'Universal Audio Apollo x8p', icon: Cpu },
  { title: 'Neumann U87 Ai Microphone', icon: Sliders },
  { title: 'Focal Shape 65 Monitors', icon: Headphones },
  { title: 'Custom Acoustic Treatment', icon: ShieldCheck },
];

export default function AboutStudio() {
  const [showFlyer, setShowFlyer] = useState(false);

  return (
    <section id="about" className="relative border-t border-hairline bg-surface-3 px-4 py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="space-y-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-strong sm:text-5xl">
            About <span className="text-gradient">Samrock</span>
          </h2>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-strong sm:text-3xl">
              Crafting Excellence at <span className="text-brand">Samrock Music Productions</span>
            </h3>
            <p className="text-lg leading-relaxed text-silver">
              With over a decade of experience in the Nigerian music industry, Samrock has become a
              cornerstone for artists seeking that signature professional sound. Our studio is more than just
              a recording space; it&apos;s an innovation hub where musical ideas are transformed into global
              hits.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-2 rounded-xl border border-brand/20 bg-brand/10 px-4 py-2 text-sm font-bold text-brand">
                <Terminal size={18} aria-hidden="true" /> Professional Sound Engineering
              </span>
              <button
                type="button"
                onClick={() => setShowFlyer(true)}
                className="flex items-center gap-2 rounded-xl border border-brand/30 bg-brand/10 px-4 py-2 text-sm font-bold text-brand transition hover:border-brand"
              >
                <Eye size={18} aria-hidden="true" /> View Studio Flyer
              </button>
            </div>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-4">
          {rigItems.map((item) => {
            const Icon = item.icon;

            return (
              <li
                key={item.title}
                className="group rounded-2xl border border-hairline bg-surface-2 p-6 transition hover:border-brand"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition group-hover:scale-110">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-strong">{item.title}</h3>
              </li>
            );
          })}
        </ul>
      </div>

      <Modal
        open={showFlyer}
        onClose={() => setShowFlyer(false)}
        label="Samrock Music Productions studio flyer"
        className="max-w-lg"
      >
        <div className="relative overflow-hidden rounded-2xl border border-hairline-strong bg-surface-2 shadow-2xl">
          <button
            type="button"
            onClick={() => setShowFlyer(false)}
            aria-label="Close flyer"
            title="Close (Esc)"
            className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-brand"
          >
            <X size={16} aria-hidden="true" /> Close
          </button>
          <div className="max-h-[80vh] overflow-auto">
            <Image
              src="/flyer.jpg"
              alt="Samrock Music Productions studio flyer"
              width={1080}
              height={1350}
              className="h-auto w-full"
            />
          </div>
        </div>
      </Modal>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Cpu, Eye, Headphones, ShieldCheck, Sliders, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import SectionHeading from '@/components/ui/SectionHeading';

const rigItems = [
  { title: 'Universal Audio Apollo x8p', icon: Cpu },
  { title: 'Neumann U87 Ai Microphone', icon: Sliders },
  { title: 'Focal Shape 65 Monitors', icon: Headphones },
  { title: 'Custom Acoustic Treatment', icon: ShieldCheck },
];

export default function AboutStudio() {
  const [showFlyer, setShowFlyer] = useState(false);

  return (
    <section id="about" className="relative border-t border-hairline bg-surface-3 px-6 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="04"
          eyebrow="The studio"
          title={
            <>
              Inside <em className="text-brand">Samrock</em>
            </>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="text-lede text-strong">
              With over a decade in the Nigerian music industry, Samrock has become a cornerstone
              for artists seeking that signature professional sound.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-silver">
              Our studio is more than a recording space; it is an innovation hub where musical ideas
              are transformed into global hits built on two disciplines that never separate:
              engineering and instinct.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-hairline pt-6">
              <span className="eyebrow text-silver">Professional sound engineering</span>
              <button
                type="button"
                onClick={() => setShowFlyer(true)}
                className="link-underline eyebrow inline-flex items-center gap-2 text-brand"
              >
                <Eye size={14} aria-hidden="true" /> View studio flyer
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="eyebrow text-silver">In the room</p>
            <ul className="mt-6 border-t border-hairline">
              {rigItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li
                    key={item.title}
                    className="group flex items-center gap-4 border-b border-hairline py-5"
                  >
                    <Icon
                      size={18}
                      className="shrink-0 text-silver transition group-hover:text-brand"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-strong">{item.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <Modal
        open={showFlyer}
        onClose={() => setShowFlyer(false)}
        label="Samrock Music Productions studio flyer"
        className="max-w-lg"
      >
        <div className="relative overflow-hidden border border-hairline-strong bg-surface-2">
          <button
            type="button"
            onClick={() => setShowFlyer(false)}
            aria-label="Close flyer"
            title="Close (Esc)"
            className="eyebrow absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-xs bg-ink/85 px-3 py-2 text-ink-contrast backdrop-blur-sm transition hover:bg-brand hover:text-brand-contrast"
          >
            <X size={14} aria-hidden="true" /> Close
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

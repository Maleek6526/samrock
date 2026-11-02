'use client';

import React from 'react';
import { ArrowRight, Disc3, Mic2, Radio, Sliders } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import type { ServiceDefinition } from '@/lib/site';

const services: ServiceDefinition[] = [
  {
    title: 'Beat Making & Production',
    description:
      'Custom instrumentals tailored for Afrobeats, Reggae, Woro, and Trap. Built with industry-standard VSTs and hardware.',
    icon: Disc3,
    features: ['Exclusive & Leased Beats', 'Full Track Arrangement', 'Custom Tempo & Key'],
  },
  {
    title: 'Mixing & Mastering',
    description:
      'Professional vocal tuning, EQ, compression, stereo widening, and loudness optimization to make your record radio-ready.',
    icon: Sliders,
    features: ['Vocal Pitch Correction', 'Dynamic Balancing', 'Industry Standard Loudness'],
  },
  {
    title: 'Music Recording & Engineering',
    description:
      'Crystal-clear vocal tracking in a professionally treated acoustic environment using premium studio microphones.',
    icon: Mic2,
    features: ['Acoustic Studio Session', 'Professional Monitoring', 'Vocal Production Coaching'],
  },
  {
    title: 'Jingles & Back Tracks',
    description:
      'Catchy commercial jingles, voiceover backing, and custom audio backtracks for brands, radio, and social media campaigns.',
    icon: Radio,
    features: ['Commercial Rights', 'Fast Turnaround', 'Tailored Brand Messaging'],
  },
];

export default function Services() {
  return (
    <section id="services" className="relative border-t border-hairline bg-surface px-6 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="03"
          eyebrow="Professional expertise"
          title={
            <>
              What the studio <em className="text-brand">delivers</em>
            </>
          }
          description="From raw concept to final master: world-class production and audio engineering, end to end."
        />

        <ol className="mt-12 border-t border-hairline">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <li key={service.title} className="group border-b border-hairline">
                <div className="grid grid-cols-1 gap-x-10 gap-y-5 py-10 md:grid-cols-12">
                  <div className="md:col-span-1">
                    <span className="eyebrow text-brand">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="md:col-span-4">
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="shrink-0 text-silver transition group-hover:text-brand" aria-hidden="true" />
                      <h3 className="font-display text-title text-strong">{service.title}</h3>
                    </div>
                    <a
                      href="#contact"
                      className="link-underline eyebrow mt-5 inline-flex items-center gap-2 text-brand"
                    >
                      Book this service
                      <ArrowRight size={12} aria-hidden="true" />
                    </a>
                  </div>

                  <p className="text-sm leading-relaxed text-silver md:col-span-4">
                    {service.description}
                  </p>

                  <ul className="space-y-2 border-l border-hairline pl-5 md:col-span-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="text-xs leading-relaxed text-silver">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

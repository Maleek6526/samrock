'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, Disc3, Mic2, Radio, Sliders } from 'lucide-react';
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
    <section id="services" className="relative border-t border-hairline bg-surface px-4 py-24">
      <div className="mx-auto max-w-7xl space-y-12">
        <SectionHeading
          eyebrow="Professional Expertise"
          title={
            <>
              Our <span className="text-gradient">Services</span>
            </>
          }
          description="From raw concept to final master, Samrock Music Productions delivers world-class audio engineering and production."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group flex flex-col justify-between gap-6 rounded-2xl border border-hairline bg-surface-2 p-8 shadow-xl transition duration-300 hover:border-brand/40"
              >
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/30 bg-surface-3 text-brand shadow-md">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold text-strong transition group-hover:text-brand">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-silver">{service.description}</p>
                </div>

                <ul className="space-y-3 border-t border-hairline pt-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-silver">
                      <CheckCircle2 size={16} className="shrink-0 text-brand" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-brand transition hover:text-strong"
                  >
                    Book This Service
                    <ArrowRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

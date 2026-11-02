'use client';
import React from 'react';
import { Mic2, Sliders, Radio, Disc3, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Services() {
  const servicesList = [
    {
      title: "Beat Making & Production",
      description: "Custom instrumentals tailored for Afrobeats, Reggae, Woro, and Trap. Built with industry-standard VSTs and hardware.",
      icon: <Disc3 className="text-samrock-cyan" size={24} />,
      features: ["Exclusive & Leased Beats", "Full Track Arrangement", "Custom Tempo & Key"]
    },
    {
      title: "Mixing & Mastering",
      description: "Professional vocal tuning, EQ, compression, stereo widening, and loudness optimization to make your record radio-ready.",
      icon: <Sliders className="text-samrock-cyan" size={24} />,
      features: ["Vocal Pitch Correction", "Dynamic Balancing", "Industry Standard Loudness"]
    },
    {
      title: "Music Recording & Engineering",
      description: "Crystal-clear vocal tracking in a professionally treated acoustic environment using premium studio microphones.",
      icon: <Mic2 className="text-samrock-cyan" size={24} />,
      features: ["Acoustic Studio Session", "Professional Monitoring", "Vocal Production Coaching"]
    },
    {
      title: "Jingles & Back Tracks",
      description: "Catchy commercial jingles, voiceover backing, and custom audio backtracks for brands, radio, and social media campaigns.",
      icon: <Radio className="text-samrock-cyan" size={24} />,
      features: ["Commercial Rights", "Fast Turnaround", "Tailored Brand Messaging"]
    }
  ];

  return (
    <section id="services" className="py-24 px-4 bg-white dark:bg-samrock-dark relative border-t border-samrock-cyan/10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white dark:bg-samrock-card border border-samrock-cyan/30 text-xs font-semibold text-samrock-cyan uppercase tracking-widest">
            Professional Expertise
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-samrock-cyan to-orange-500">Services</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            From raw concept to final master, Samrock Music Productions delivers world-class audio engineering and production.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesList.map((service, index) => (
            <div 
              key={index}
              className="group bg-white dark:bg-samrock-card rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover:border-samrock-cyan/40 transition duration-300 shadow-xl flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-samrock-dark border border-samrock-cyan/30 flex items-center justify-center shadow-md">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-samrock-cyan transition">{service.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{service.description}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                    <CheckCircle2 size={16} className="text-samrock-cyan flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <a 
                  href="#contact"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-samrock-cyan hover:text-gray-900 dark:hover:text-white transition"
                >
                  Book This Service <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

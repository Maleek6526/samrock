'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { serviceDefinitions } from '@/lib/site';

export default function Services() {
  return (
    <section id="services" className="relative border-t border-hairline bg-surface px-6 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="04"
          eyebrow="Professional expertise"
          title={
            <>
              What the studio <em className="text-brand">delivers</em>
            </>
          }
          description="From raw concept to final master: world-class production and audio engineering, end to end."
        />

        <ol className="mt-12 border-t border-hairline">
          {serviceDefinitions.map((service, index) => {
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
                      href={'/booking?line=' + encodeURIComponent(service.title)}
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

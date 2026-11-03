import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import { serviceDefinitions } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Services | Samrock Music Productions',
  description:
    'Beat making, mixing and mastering, recording, jingles, video production and distribution from Samrock Music Productions. Full production for artistes and organisations.',
};

const reasons = [
  'A single partner from first beat to final master',
  'Engineering excellence paired with creative instinct',
  'Release support that keeps your catalogue competitive',
];

const steps = [
  {
    title: 'Discovery & Vision',
    description:
      'We start with a conversation about the record, the artiste and the audience, then map the sound, references and timeline.',
  },
  {
    title: 'Production & Launch',
    description:
      'Beats, recording, mixing and mastering are delivered as one finished record, prepared for release across the major platforms.',
  },
  {
    title: 'Growth & Stewardship',
    description:
      'Beyond release we keep the catalogue visible with distribution, reporting and ongoing support for each artiste.',
  },
];

export default function Page() {
  return (
    <>
      <Navbar />
      <PageShell>
        <PageHeader
          index="03"
          eyebrow="Services"
          title={
            <>
              Everything you need to <em className="text-brand">create with impact</em>.
            </>
          }
          description="Beat making, recording, mixing, mastering, video and distribution: end-to-end production for artistes and organisations."
        />

        <section className="mt-20 border-t border-hairline pt-12">
          <div className="flex items-baseline gap-4">
            <span className="eyebrow text-brand">01</span>
            <span className="eyebrow text-silver">Why choose us</span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-12 md:gap-10">
            <h2 className="font-display text-title text-strong md:col-span-7">
              A studio that treats every record like a release
            </h2>
            <p className="text-lede text-silver md:col-span-5 md:pt-1">
              From the first beat to the final master, we give artistes and organisations one reliable
              partner for the whole catalogue.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-3">
            {reasons.map((reason) => (
              <li key={reason} className="bg-surface p-6 sm:p-8">
                <p className="text-sm font-medium leading-relaxed text-strong">{reason}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 border-t border-hairline pt-12">
          <div className="flex items-baseline gap-4">
            <span className="eyebrow text-brand">02</span>
            <span className="eyebrow text-silver">What we deliver</span>
          </div>

          <ol className="mt-10 border-t border-hairline">
            {serviceDefinitions.map((service, index) => {
              const Icon = service.icon;

              return (
                <li key={service.title} className="group border-b border-hairline">
                  <div className="grid grid-cols-1 gap-x-10 gap-y-5 py-10 md:grid-cols-12">
                    <div className="md:col-span-1">
                      <span className="eyebrow text-brand">{String(index + 1).padStart(2, '0')}</span>
                    </div>

                    <div className="md:col-span-4">
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className="shrink-0 text-silver transition group-hover:text-brand"
                          aria-hidden="true"
                        />
                        <h3 className="font-display text-title text-strong">{service.title}</h3>
                      </div>
                      <Link
                        href={'/booking?line=' + encodeURIComponent(service.title)}
                        className="link-underline eyebrow mt-5 inline-flex items-center gap-2 text-brand"
                      >
                        Book this service
                        <ArrowRight size={12} aria-hidden="true" />
                      </Link>
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
        </section>

        <section className="mt-20 border-t border-hairline pt-12">
          <div className="flex items-baseline gap-4">
            <span className="eyebrow text-brand">03</span>
            <span className="eyebrow text-silver">How we work</span>
          </div>

          <ol className="mt-10 grid grid-cols-1 gap-px border border-hairline bg-hairline md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="bg-surface p-6 sm:p-8">
                <span className="eyebrow text-brand">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 font-display text-title text-strong">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-silver">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-20 border-t border-hairline pt-12">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-title text-strong">Need a custom solution?</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-silver">
                Tell us about your project and we will shape a production plan around it.
              </p>
            </div>
            <Link href="/booking" className="btn btn-primary shrink-0">
              Start a project
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </PageShell>
      <Footer />
    </>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import StatsBand from '@/components/StatsBand';
import StreamingLinks from '@/components/StreamingLinks';
import { useContentSettings } from '@/lib/store';

export default function AboutView() {
  const { about, founder } = useContentSettings();

  return (
    <>
      <Navbar />
      <PageShell>
        <PageHeader
          index="01"
          eyebrow="About"
          title={
            <>
              Building a home for <em className="text-brand">great records</em>.
            </>
          }
          description={about.intro}
        />

        <div className="mt-12">
          <StatsBand />
        </div>

        <section className="mt-20 border-t border-hairline pt-12">
          <div className="flex items-baseline gap-4">
            <span className="eyebrow text-brand">01</span>
            <span className="eyebrow text-silver">Vision</span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-12 md:gap-10">
            <h2 className="font-display text-title text-strong md:col-span-7">{about.visionTitle}</h2>
            <p className="text-lede text-silver md:col-span-5 md:pt-1">{about.visionBody}</p>
          </div>
        </section>

        <section className="mt-20 border-t border-hairline pt-12">
          <div className="flex items-baseline gap-4">
            <span className="eyebrow text-brand">02</span>
            <span className="eyebrow text-silver">The label</span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-12 md:gap-10">
            <h2 className="font-display text-title text-strong md:col-span-7">
              {about.labelStory.title}
            </h2>
            <div className="space-y-5 md:col-span-5 md:pt-1">
              {about.labelStory.body.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-silver">
                  {paragraph}
                </p>
              ))}
              <Link
                href="/demo"
                className="link-underline eyebrow inline-flex items-center gap-2 text-brand"
              >
                Submit a demo
                <ArrowRight size={12} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-20 border-t border-hairline pt-12">
          <div className="flex items-baseline gap-4">
            <span className="eyebrow text-brand">03</span>
            <span className="eyebrow text-silver">What we do</span>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2">
            {about.pillars.map((pillar) => (
              <div key={pillar.title} className="bg-surface p-6 sm:p-8">
                <h3 className="font-display text-title text-strong">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-silver">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-hairline pt-12">
          <div className="flex items-baseline gap-4">
            <span className="eyebrow text-brand">04</span>
            <span className="eyebrow text-silver">Milestones</span>
          </div>

          <ol className="mt-10 grid grid-cols-1 gap-px border-y border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {about.milestones.map((milestone) => (
              <li key={milestone.year} className="bg-surface py-6 sm:px-6">
                <span className="eyebrow text-brand">{milestone.year}</span>
                <p className="mt-3 text-sm leading-relaxed text-silver">{milestone.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-20 border-t border-hairline pt-12">
          <div className="flex items-baseline gap-4">
            <span className="eyebrow text-brand">05</span>
            <span className="eyebrow text-silver">Founder</span>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <div className="media-tone aspect-[4/5] overflow-hidden rounded-xs border border-hairline bg-surface-2">
                {founder.photo ? (
                  <Image
                    src={founder.photo}
                    alt={founder.name}
                    width={600}
                    height={750}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
            </div>

            <div className="md:col-span-8">
              <h2 className="font-display text-title text-strong">{founder.name}</h2>
              <p className="eyebrow mt-3 text-brand">{founder.role}</p>
              <p className="mt-6 text-lede text-silver">{founder.bio}</p>
              <Link
                href="/founder"
                className="link-underline eyebrow mt-8 inline-flex items-center gap-2 text-brand"
              >
                Read founder story
                <ArrowRight size={12} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-20">
          <StreamingLinks />
        </div>

        <section className="mt-20 border-t border-hairline pt-12">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-title text-strong">Ready to start your record?</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-silver">
                Book a session with the studio team and take your idea from first beat to final master.
              </p>
            </div>
            <Link href="/booking" className="btn btn-primary shrink-0">
              Book a session
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </PageShell>
      <Footer />
    </>
  );
}

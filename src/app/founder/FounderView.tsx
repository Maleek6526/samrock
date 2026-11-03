'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import { useContentSettings } from '@/lib/store';

const chipClass =
  'eyebrow inline-flex items-center rounded-xs border border-hairline px-4 py-2.5 text-silver transition hover:border-brand hover:text-brand';

export default function FounderView() {
  const { founder } = useContentSettings();

  const channels = [
    { label: 'Instagram', href: founder.instagram },
    { label: 'Facebook', href: founder.facebook },
    { label: 'YouTube', href: founder.youtube },
  ].filter((channel) => channel.href);

  return (
    <>
      <Navbar />
      <PageShell>
        <PageHeader index="02" eyebrow="Meet the founder" title={founder.name} description={founder.role} />

        <div className="mt-12 grid grid-cols-1 gap-10 border-t border-hairline pt-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="media-tone aspect-[4/5] overflow-hidden rounded-xs border border-hairline bg-surface-2">
              {founder.photo ? (
                <Image
                  src={founder.photo}
                  alt={founder.name}
                  width={700}
                  height={875}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
          </div>

          <div className="md:col-span-7">
            <p className="eyebrow text-silver">Biography</p>
            <p className="mt-5 text-lede text-strong">{founder.bio}</p>
          </div>
        </div>

        <section className="mt-20 border-t border-hairline pt-12">
          <div className="flex items-baseline gap-4">
            <span className="eyebrow text-brand">01</span>
            <span className="eyebrow text-silver">Career journey</span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-12 md:gap-10">
            <h2 className="font-display text-title text-strong md:col-span-4">
              From beat maker to full production house
            </h2>
            <p className="text-sm leading-relaxed text-silver md:col-span-8">{founder.journey}</p>
          </div>
        </section>

        <section className="mt-20 border-t border-hairline pt-12">
          <div className="flex items-baseline gap-4">
            <span className="eyebrow text-brand">02</span>
            <span className="eyebrow text-silver">Mission &amp; vision</span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-12 md:gap-10">
            <h2 className="font-display text-title text-strong md:col-span-4">A reliable creative home</h2>
            <p className="text-sm leading-relaxed text-silver md:col-span-8">{founder.mission}</p>
          </div>
        </section>

        <section className="mt-20 border-t border-hairline pt-12">
          <div className="flex items-baseline gap-4">
            <span className="eyebrow text-brand">03</span>
            <span className="eyebrow text-silver">Key achievements</span>
          </div>

          <ul className="mt-10 border-t border-hairline">
            {founder.achievements.map((achievement, index) => (
              <li
                key={achievement}
                className="grid grid-cols-[auto_1fr] gap-x-6 border-b border-hairline py-5"
              >
                <span className="eyebrow text-brand">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-sm leading-relaxed text-silver">{achievement}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 border-t border-hairline pt-12">
          <div className="flex items-baseline gap-4">
            <span className="eyebrow text-brand">04</span>
            <span className="eyebrow text-silver">About the book</span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-12 md:gap-10">
            <h2 className="font-display text-title text-strong md:col-span-5">{founder.bookTitle}</h2>
            <div className="md:col-span-7">
              <p className="text-lede text-silver">{founder.bookDescription}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`mailto:${founder.email}?subject=${encodeURIComponent('Music business book request')}`}
                  className="btn btn-primary"
                >
                  Buy the book
                </a>
                <Link href="/booking" className="btn btn-ghost">
                  Book a session
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 border-t border-hairline pt-12">
          <h2 className="eyebrow text-silver">Connect</h2>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {channels.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={chipClass}
                >
                  {channel.label}
                </a>
              </li>
            ))}
            {founder.phone ? (
              <li>
                <a href={`tel:${founder.phone}`} className={chipClass}>
                  {founder.phone}
                </a>
              </li>
            ) : null}
            {founder.email ? (
              <li>
                <a href={`mailto:${founder.email}`} className={chipClass}>
                  {founder.email}
                </a>
              </li>
            ) : null}
          </ul>

          <Link
            href="/about"
            className="link-underline eyebrow mt-8 inline-flex items-center gap-2 text-brand"
          >
            Back to about
            <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </section>
      </PageShell>
      <Footer />
    </>
  );
}

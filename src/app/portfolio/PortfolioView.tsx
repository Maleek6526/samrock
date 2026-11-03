'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Layers } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import { useArtists, usePortfolioSpaces } from '@/lib/store';

export default function PortfolioView() {
  const artists = useArtists();
  const spaces = usePortfolioSpaces();

  const currentRoster = artists.filter((artist) => !artist.legacy);
  const legacyRoster = artists.filter((artist) => artist.legacy);

  return (
    <>
      <Navbar />
      <PageShell>
        <PageHeader
          index="05"
          eyebrow="Portfolio"
          title={
            <>
              Creative spaces that elevate every <em className="text-brand">project</em>.
            </>
          }
          description="The artistes on the roster, the legacy voices behind the catalogue and the studio spaces built to carry them."
        />

        <section className="mt-20">
          <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Current roster</span>
            <span className="eyebrow text-brand">
              {currentRoster.length} {currentRoster.length === 1 ? 'artiste' : 'artistes'}
            </span>
          </div>

          <ul className="mt-10 border-t border-hairline">
            {currentRoster.map((artist) => (
              <li key={artist.id} className="border-b border-hairline">
                <div className="grid gap-4 py-6 md:grid-cols-12 md:items-baseline md:gap-6">
                  <h3 className="font-display text-title text-strong md:col-span-3">{artist.name}</h3>
                  <span className="eyebrow text-brand md:col-span-2">{artist.genre}</span>
                  <p className="text-sm leading-relaxed text-silver md:col-span-5">{artist.bio}</p>
                  <div className="md:col-span-2 md:text-right">
                    <Link
                      href={`/booking?artist=${encodeURIComponent(artist.name)}`}
                      className="link-underline eyebrow text-brand"
                    >
                      Book artiste
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {legacyRoster.length > 0 ? (
          <section className="mt-20">
            <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
              <span className="eyebrow text-silver">Legacy artistes</span>
              <span className="eyebrow text-brand">Alumni</span>
            </div>

            <ul className="mt-10 border-t border-hairline">
              {legacyRoster.map((artist) => (
                <li key={artist.id} className="border-b border-hairline">
                  <div className="grid gap-4 py-6 md:grid-cols-12 md:items-baseline md:gap-6">
                    <h3 className="font-display text-title text-strong md:col-span-3">{artist.name}</h3>
                    <span className="eyebrow text-brand md:col-span-2">{artist.genre}</span>
                    <p className="text-sm leading-relaxed text-silver md:col-span-5">{artist.bio}</p>
                    <div className="md:col-span-2 md:text-right">
                      <Link
                        href={`/booking?artist=${encodeURIComponent(artist.name)}`}
                        className="link-underline eyebrow text-brand"
                      >
                        Book artiste
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-20">
          <div className="border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Creative spaces</span>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {spaces.map((space) => (
              <article key={space.id} className="border-t border-hairline pt-5">
                <div className="media-tone relative aspect-video overflow-hidden rounded-xs border border-hairline bg-surface-2">
                  {space.image ? (
                    <Image
                      src={space.image}
                      alt={space.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-silver">
                      <Layers size={24} aria-hidden="true" />
                    </div>
                  )}
                </div>
                <h3 className="mt-6 font-display text-title text-strong">{space.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-silver">{space.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-hairline pt-10">
          <div className="grid gap-8 md:grid-cols-12">
            <h2 className="font-display text-title text-strong md:col-span-7">
              Ready to build your next record?
            </h2>
            <div className="md:col-span-5 md:pt-2">
              <p className="text-sm leading-relaxed text-silver">
                Bring your project to a studio that handles production, recording, mixing and release
                support end to end.
              </p>
              <Link href="/booking" className="btn btn-primary mt-6">
                Start a booking
              </Link>
            </div>
          </div>
        </section>
      </PageShell>
      <Footer />
    </>
  );
}

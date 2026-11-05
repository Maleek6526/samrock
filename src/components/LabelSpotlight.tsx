'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Music } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { useArtists, useReleases } from '@/lib/store';
import { formatDate, slugify } from '@/lib/site';

const MAX_RELEASES = 4;
const MAX_ROSTER = 6;

/**
 * The label's opening statement on the home page: the newest releases and the
 * artistes behind them, ahead of the studio services further down the page.
 */
export default function LabelSpotlight() {
  const releases = useReleases();
  const artists = useArtists();

  const latest = [...releases]
    .sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''))
    .slice(0, MAX_RELEASES);
  const roster = artists.filter((artist) => !artist.legacy).slice(0, MAX_ROSTER);

  if (latest.length === 0 && roster.length === 0) return null;

  return (
    <section id="label" className="relative border-t border-hairline bg-surface-3 px-6 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="02"
          eyebrow="The label"
          title={
            <>
              New <em className="text-brand">music</em> and the artistes behind it
            </>
          }
          description="Fresh releases from Samrock Music Productions, and the roster building with us."
        />

        {latest.length > 0 ? (
          <div className="mt-14">
            <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
              <span className="eyebrow text-silver">Latest releases</span>
              <Link
                href="/releases"
                className="link-underline eyebrow inline-flex items-center gap-1.5 text-brand"
              >
                All releases <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {latest.map((release) => (
                <li key={release.id}>
                  <Link href={`/releases/${release.slug}`} className="group block">
                    <div className="media-tone relative aspect-square overflow-hidden rounded-xs border border-hairline bg-surface-2">
                      {release.coverArt ? (
                        <Image
                          src={release.coverArt}
                          alt={`${release.title} artwork`}
                          fill
                          sizes="(min-width: 1024px) 25vw, 50vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-silver">
                          <Music size={24} aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <h3 className="mt-4 font-display text-title text-strong transition group-hover:text-brand">
                      {release.title}
                    </h3>
                    <p className="mt-1 text-sm text-silver">{release.artist}</p>
                    <p className="eyebrow mt-2 text-silver">
                      {release.type}
                      {release.releaseDate ? ` · ${formatDate(release.releaseDate)}` : ''}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {roster.length > 0 ? (
          <div className="mt-16">
            <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
              <span className="eyebrow text-silver">The roster</span>
              <Link
                href="/artists"
                className="link-underline eyebrow inline-flex items-center gap-1.5 text-brand"
              >
                Full roster <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-x-8 border-t border-hairline sm:grid-cols-2 lg:grid-cols-3">
              {roster.map((artist) => (
                <li key={artist.id} className="border-b border-hairline">
                  <Link
                    href={`/artists/${slugify(artist.name)}`}
                    className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                  >
                    <span className="font-display text-title text-strong transition group-hover:text-brand">
                      {artist.name}
                    </span>
                    <span className="eyebrow text-silver sm:text-right">{artist.genre}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-hairline pt-8 sm:flex-row sm:items-center">
          <div>
            <span className="eyebrow text-brand">A&amp;R</span>
            <p className="mt-3 max-w-xl font-display text-title text-strong">
              Are you an artiste? Send your demo to the label.
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-silver">
              Samrock is always listening. Share your records with the A&amp;R desk and we will take
              it from there.
            </p>
          </div>
          <Link href="/demo" className="btn btn-primary shrink-0">
            Submit a demo
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

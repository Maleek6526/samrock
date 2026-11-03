'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import ArtistCard from '@/components/ArtistCard';
import { useArtists, useContentSettings, useQueryParam, useReleases } from '@/lib/store';
import { contactInfo } from '@/lib/site';

const spotlights = [
  {
    title: 'Behind the Music',
    description: 'Interviews and testimonies from the artistes and worship leaders shaping the catalogue.',
  },
  {
    title: 'Studio Sessions',
    description: 'Songwriting, production and rehearsal moments captured inside the room.',
  },
  {
    title: 'Live Moments',
    description: 'Worship nights, concerts and special events from across the roster.',
  },
];

const bookingLines = [
  {
    title: 'Recording Sessions',
    description: 'Book treated studio time for tracking, overdubs and full production sessions at the Lagos room.',
  },
  {
    title: 'Concerts & Tours',
    description: 'Production and engineering support for live shows, touring sets and stage-ready playback.',
  },
  {
    title: 'Community Outreach',
    description: 'Workshops, church programmes and youth sessions that take the studio into the community.',
  },
];

export default function ArtistsView() {
  const artists = useArtists();
  const releases = useReleases();
  const { pressResources } = useContentSettings();

  // The `?artist=` deep link opens a profile. Closing it hides that profile
  // until a different artist is linked.
  const linkedArtist = useQueryParam('artist');
  const [closedArtist, setClosedArtist] = useState<string | null>(null);
  const artistFilter = closedArtist === linkedArtist ? '' : linkedArtist;

  const currentRoster = artists.filter((artist) => !artist.legacy);
  const legacyRoster = artists.filter((artist) => artist.legacy);

  const selectedArtist = artists.find((artist) => artist.name === artistFilter) ?? null;
  const selectedDiscography = selectedArtist
    ? releases.filter((release) => release.artist === selectedArtist.name)
    : [];

  const featuredReleases = releases.filter((release) => release.featured);
  const discographyHighlights = (featuredReleases.length > 0 ? featuredReleases : releases).slice(0, 4);

  return (
    <>
      <Navbar />
      <PageShell>
        <PageHeader
          index="01"
          eyebrow="The roster"
          title={
            <>
              Meet the <em className="text-brand">voices</em> of Samrock.
            </>
          }
          description="Artistes and worship leaders building records with Samrock Music Productions, from first demo to final master."
        />

        {selectedArtist ? (
          <section className="animate-fade-in-up mt-16 border-t border-hairline pt-10">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div className="media-tone relative aspect-4/5 overflow-hidden rounded-xs border border-hairline bg-surface-2">
                  {selectedArtist.photo ? (
                    <Image
                      src={selectedArtist.photo}
                      alt={selectedArtist.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-silver">
                      <span className="font-display text-display">{selectedArtist.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="flex items-baseline gap-4">
                  <span className="eyebrow text-brand">Artist profile</span>
                  <span className="eyebrow text-silver">{selectedArtist.location}</span>
                </div>

                <p className="eyebrow mt-6 text-brand">{selectedArtist.genre}</p>
                <h2 className="mt-3 font-display text-display text-strong">{selectedArtist.name}</h2>
                <p className="mt-4 max-w-2xl text-lede text-silver">{selectedArtist.bio}</p>

                {selectedArtist.highlights.length > 0 ? (
                  <div className="mt-8">
                    <p className="eyebrow text-silver">Highlights</p>
                    <ul className="mt-4 border-t border-hairline">
                      {selectedArtist.highlights.map((highlight) => (
                        <li key={highlight} className="border-b border-hairline py-3 text-sm text-silver">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-8">
                  <p className="eyebrow text-silver">Discography</p>
                  {selectedDiscography.length > 0 ? (
                    <ul className="mt-4 border-t border-hairline">
                      {selectedDiscography.map((release) => (
                        <li key={release.id} className="border-b border-hairline">
                          <Link
                            href={`/releases/${release.slug}`}
                            className="group flex items-baseline justify-between gap-4 py-3 transition hover:text-brand"
                          >
                            <span className="font-display text-title text-strong transition group-hover:text-brand">
                              {release.title}
                            </span>
                            <span className="eyebrow text-silver">{release.type}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-silver">No releases catalogued for this artiste yet.</p>
                  )}
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/booking?artist=${encodeURIComponent(selectedArtist.name)}`}
                    className="btn btn-primary"
                  >
                    Request booking
                  </Link>
                  <Link
                    href={`/releases?artist=${encodeURIComponent(selectedArtist.name)}`}
                    className="btn btn-ghost"
                  >
                    View discography
                  </Link>
                  <button
                    type="button"
                    onClick={() => setClosedArtist(linkedArtist)}
                    className="btn btn-ghost"
                  >
                    Close profile
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-20">
          <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Current roster</span>
            <span className="eyebrow text-brand">
              {currentRoster.length} {currentRoster.length === 1 ? 'artiste' : 'artistes'}
            </span>
          </div>

          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {currentRoster.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>

        {legacyRoster.length > 0 ? (
          <section className="mt-20">
            <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
              <span className="eyebrow text-silver">Legacy artistes</span>
              <span className="eyebrow text-brand">Alumni</span>
            </div>

            <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {legacyRoster.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  href={`/booking?artist=${encodeURIComponent(artist.name)}`}
                />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-20">
          <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Artiste spotlights</span>
            <span className="eyebrow text-brand">Inside the studio</span>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {spotlights.map((item) => (
              <div key={item.title} className="border-t border-hairline pt-5">
                <h3 className="font-display text-title text-strong">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-silver">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Discography highlights</span>
            <Link href="/releases" className="link-underline eyebrow text-brand">
              View full catalog
            </Link>
          </div>

          <ul className="mt-8 border-t border-hairline">
            {discographyHighlights.map((release) => (
              <li key={release.id} className="border-b border-hairline">
                <Link
                  href={`/releases/${release.slug}`}
                  className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <span className="font-display text-title text-strong transition group-hover:text-brand">
                    {release.title}
                  </span>
                  <span className="text-sm text-silver">{release.artist}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20">
          <div className="border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Tour dates &amp; bookings</span>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {bookingLines.map((line) => (
              <div key={line.title} className="border-t border-hairline pt-5">
                <h3 className="font-display text-title text-strong">{line.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-silver">{line.description}</p>
                <Link
                  href={`/booking?line=${encodeURIComponent(line.title)}`}
                  className="link-underline eyebrow mt-5 inline-flex items-center gap-2 text-brand"
                >
                  Open booking form <ArrowRight size={12} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Press &amp; media resources</span>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {pressResources.map((resource) => (
              <div key={resource.title} className="card p-6">
                <h3 className="font-display text-title text-strong">{resource.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-silver">{resource.description}</p>
                <a
                  href={`mailto:${contactInfo.email}?subject=${encodeURIComponent(resource.subject)}`}
                  className="link-underline eyebrow mt-5 inline-flex items-center gap-2 text-brand"
                >
                  Download <ArrowRight size={12} aria-hidden="true" />
                </a>
              </div>
            ))}
          </div>
        </section>
      </PageShell>
      <Footer />
    </>
  );
}

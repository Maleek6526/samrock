'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import ShareLink from '@/components/ShareLink';
import { useArtists, useReleases } from '@/lib/store';
import { slugify } from '@/lib/site';

/** A single artiste profile: bio, highlights, catalogue and booking actions. */
export default function ArtistDetail() {
  const { slug } = useParams<{ slug: string }>();
  const artists = useArtists();
  const releases = useReleases();

  const artist = artists.find((item) => slugify(item.name) === slug);

  if (!artist) {
    return (
      <>
        <Navbar />
        <PageShell>
          <PageHeader
            index="—"
            eyebrow="The roster"
            title="Artiste not found"
            description="This artiste is not on the roster. Browse the full line-up instead."
          />
          <div className="mt-10">
            <Link href="/artists" className="link-underline eyebrow text-brand">
              Back to artists
            </Link>
          </div>
        </PageShell>
        <Footer />
      </>
    );
  }

  const discography = releases.filter((release) => release.artist === artist.name);

  return (
    <>
      <Navbar />
      <PageShell>
        <div className="flex items-baseline gap-4 border-t border-hairline pt-5">
          <span className="eyebrow text-brand">Artist profile</span>
          <Link href="/artists" className="eyebrow link-underline text-silver">
            Back to artists
          </Link>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="media-tone relative aspect-4/5 overflow-hidden rounded-xs border border-hairline bg-surface-2">
              {artist.photo ? (
                <Image
                  src={artist.photo}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-silver">
                  <span className="font-display text-display">{artist.name.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            {artist.genre || artist.location ? (
              <div className="flex items-baseline gap-4">
                {artist.genre ? <span className="eyebrow text-brand">{artist.genre}</span> : null}
                {artist.location ? (
                  <span className="eyebrow text-silver">{artist.location}</span>
                ) : null}
              </div>
            ) : null}

            <h1 className="mt-6 font-display text-display text-strong">{artist.name}</h1>
            {artist.bio ? (
              <p className="mt-6 max-w-2xl text-lede text-silver">{artist.bio}</p>
            ) : null}

            {artist.highlights.length > 0 ? (
              <div className="mt-8">
                <p className="eyebrow text-silver">Highlights</p>
                <ul className="mt-4 border-t border-hairline">
                  {artist.highlights.map((highlight) => (
                    <li key={highlight} className="border-b border-hairline py-3 text-sm text-silver">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={`/booking?artist=${encodeURIComponent(artist.name)}`}
                className="btn btn-primary"
              >
                Request booking
              </Link>
              <ShareLink url={`/artists/${slug}`} title={artist.name} />
            </div>
          </div>
        </div>

        <section className="mt-20">
          <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Discography</span>
            <Link href="/releases" className="link-underline eyebrow text-brand">
              All releases
            </Link>
          </div>

          {discography.length > 0 ? (
            <ul className="mt-8 border-t border-hairline">
              {discography.map((release) => (
                <li key={release.id} className="border-b border-hairline">
                  <Link
                    href={`/releases/${release.slug}`}
                    className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
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
            <p className="mt-8 text-sm text-silver">
              No releases catalogued for this artiste yet.
            </p>
          )}
        </section>
      </PageShell>
      <Footer />
    </>
  );
}

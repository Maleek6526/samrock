'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AudioPlayer from '@/components/AudioPlayer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import ReleaseCard from '@/components/ReleaseCard';
import StreamingLinks from '@/components/StreamingLinks';
import { AudioProvider } from '@/context/AudioContext';
import { useQueryParam, useReleases } from '@/lib/store';

export default function ReleasesView() {
  const releases = useReleases();

  // The `?artist=` deep link filters the catalogue until it is cleared.
  const linkedArtist = useQueryParam('artist');
  const [clearedArtist, setClearedArtist] = useState<string | null>(null);
  const artistFilter = clearedArtist === linkedArtist ? '' : linkedArtist;

  const filteredReleases = artistFilter
    ? releases.filter((release) => release.artist === artistFilter)
    : releases;

  // Only streamable releases belong in the skip queue.
  const queue = useMemo(
    () => releases.filter((release) => release.audioUrl || release.link),
    [releases]
  );

  return (
    <AudioProvider>
      <Navbar />
      <PageShell>
        <PageHeader
          index="02"
          eyebrow="Latest releases"
          title={
            <>
              Releases from the <em className="text-brand">studio</em>.
            </>
          }
          description="Singles and records produced, recorded, mixed and mastered at Samrock Music Productions."
        />

        {artistFilter ? (
          <div className="mt-10 flex flex-wrap items-baseline justify-between gap-4 border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Showing releases for {artistFilter}</span>
            <button
              type="button"
              onClick={() => setClearedArtist(linkedArtist)}
              className="link-underline eyebrow text-brand"
            >
              Clear filter
            </button>
          </div>
        ) : null}

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {filteredReleases.map((release) => (
            <ReleaseCard key={release.id} release={release} queue={queue} />
          ))}
        </div>

        <div className="mt-12">
          <StreamingLinks />
        </div>

        <section className="mt-20 border-t border-hairline pt-10">
          <div className="grid gap-8 md:grid-cols-12">
            <h2 className="font-display text-title text-strong md:col-span-7">
              Need this sound on your record?
            </h2>
            <div className="md:col-span-5 md:pt-2">
              <p className="text-sm leading-relaxed text-silver">
                Book a studio session, beat or mixing package and put the Samrock sound behind your next
                release.
              </p>
              <Link href="/booking" className="btn btn-primary mt-6">
                Start a booking
              </Link>
            </div>
          </div>
        </section>
      </PageShell>
      <Footer />
      <AudioPlayer />
    </AudioProvider>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Music } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AudioPlayer from '@/components/AudioPlayer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import ReleaseCard from '@/components/ReleaseCard';
import ShareLink from '@/components/ShareLink';
import { AudioProvider } from '@/context/AudioContext';
import { useReleases } from '@/lib/store';
import { formatDate } from '@/lib/site';

export default function ReleaseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const releases = useReleases();
  const release = releases.find((item) => item.slug === slug);

  if (!release) {
    return (
      <>
        <Navbar />
        <PageShell>
          <PageHeader
            index="—"
            eyebrow="Release"
            title="Release not found"
            description="This record is not in the catalogue. Browse the full studio output instead."
          />
          <div className="mt-10">
            <Link href="/releases" className="link-underline eyebrow text-brand">
              Back to releases
            </Link>
          </div>
        </PageShell>
        <Footer />
      </>
    );
  }

  const sameArtist = releases
    .filter((item) => item.id !== release.id && item.artist === release.artist)
    .slice(0, 4);
  const relatedReleases =
    sameArtist.length > 0
      ? sameArtist
      : releases.filter((item) => item.id !== release.id).slice(0, 4);

  // Only streamable releases belong in the skip queue.
  const queue = releases.filter((item) => item.audioUrl || item.link);
  const listenUrl = release.listenUrl || release.link;

  return (
    <AudioProvider>
      <Navbar />
      <PageShell>
        <div className="flex items-baseline gap-4 border-t border-hairline pt-5">
          <span className="eyebrow text-brand">Release</span>
          <Link href="/releases" className="eyebrow link-underline text-silver">
            Back to releases
          </Link>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="media-tone relative aspect-square overflow-hidden rounded-xs border border-hairline bg-surface-2">
              {release.coverArt ? (
                <Image
                  src={release.coverArt}
                  alt={`${release.title} artwork`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-silver">
                  <Music size={28} aria-hidden="true" />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-baseline gap-4">
              <span className="eyebrow text-brand">{release.type}</span>
              <span className="eyebrow text-silver">{formatDate(release.releaseDate)}</span>
            </div>

            <h1 className="mt-6 font-display text-display text-strong">{release.title}</h1>
            <p className="mt-3 text-lede text-silver">{release.artist}</p>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-silver">{release.description}</p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              {listenUrl ? (
                <a
                  href={listenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Listen now
                </a>
              ) : null}
              <ShareLink url={'/releases/' + slug} title={release.title} />
            </div>
          </div>
        </div>

        <section className="mt-20">
          <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Related releases</span>
            <Link href="/releases" className="link-underline eyebrow text-brand">
              View all
            </Link>
          </div>

          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {relatedReleases.map((item) => (
              <ReleaseCard key={item.id} release={item} queue={queue} />
            ))}
          </div>
        </section>
      </PageShell>
      <Footer />
      <AudioPlayer />
    </AudioProvider>
  );
}

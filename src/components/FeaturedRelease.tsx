'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Music, Pause, Play } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { useAudio } from '@/context/AudioContext';
import { useReleases } from '@/lib/store';
import { formatDate } from '@/lib/site';

/**
 * A single, larger spotlight for the label's featured release, sitting directly
 * beneath the hero so the newest marquee record leads the page.
 */
export default function FeaturedRelease() {
  const releases = useReleases();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const featured = releases.filter((release) => release.featured);
  const release = (featured.length > 0 ? featured : releases)
    .slice()
    .sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''))[0];

  if (!release) return null;

  const listenUrl = release.listenUrl || release.link;
  const isPlayable = Boolean(release.audioUrl || release.link);
  const isThisPlaying = currentTrack?.id === release.id && isPlaying;
  const queue = releases.filter((item) => item.audioUrl || item.link);

  return (
    <section
      id="featured"
      className="relative border-t border-hairline bg-surface-3 px-6 py-24 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="01"
          eyebrow="Featured release"
          title={
            <>
              Out now from the <em className="text-brand">label</em>
            </>
          }
          description="The record we are pushing right now, with everything you need to listen and share it."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
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
                  <Music size={32} aria-hidden="true" />
                </div>
              )}

              {isPlayable ? (
                <button
                  type="button"
                  onClick={() =>
                    currentTrack?.id === release.id ? togglePlay() : playTrack(release, queue)
                  }
                  aria-label={isThisPlaying ? `Pause ${release.title}` : `Play ${release.title}`}
                  className={`absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-xs border transition ${
                    isThisPlaying
                      ? 'border-brand bg-brand text-brand-contrast'
                      : 'border-transparent bg-ink text-ink-contrast hover:bg-brand hover:text-brand-contrast'
                  }`}
                >
                  {isThisPlaying ? (
                    <Pause size={20} aria-hidden="true" />
                  ) : (
                    <Play size={20} className="ml-0.5" aria-hidden="true" />
                  )}
                </button>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-7 lg:pt-2">
            <div className="flex items-baseline gap-4">
              <span className="eyebrow text-brand">{release.type}</span>
              <span className="eyebrow text-silver">{formatDate(release.releaseDate)}</span>
            </div>

            <h3 className="mt-6 font-display text-display text-strong">{release.title}</h3>
            <p className="mt-3 text-lede text-silver">{release.artist}</p>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-silver">
              {release.description}
            </p>

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
              <Link
                href={`/releases/${release.slug}`}
                className="link-underline eyebrow inline-flex items-center gap-2 text-brand"
              >
                View release <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

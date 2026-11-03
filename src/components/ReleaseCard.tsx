'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Music, Pause, Play } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { formatDate } from '@/lib/site';
import type { Release } from '@/data/initialData';

/** Release tile with an always-visible play button when the record is streamable. */
export default function ReleaseCard({ release, queue = [] }: { release: Release; queue?: Release[] }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const isThisPlaying = currentTrack?.id === release.id && isPlaying;
  const isPlayable = Boolean(release.audioUrl || release.link);

  return (
    <article className="group border-t border-hairline pt-5">
      <div className="media-tone relative aspect-square overflow-hidden rounded-xs border border-hairline bg-surface-2">
        {release.coverArt ? (
          <Image
            src={release.coverArt}
            alt={`${release.title} artwork`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-silver">
            <Music size={24} aria-hidden="true" />
          </div>
        )}

        {isPlayable ? (
          <button
            type="button"
            onClick={() =>
              currentTrack?.id === release.id ? togglePlay() : playTrack(release, queue)
            }
            aria-label={isThisPlaying ? `Pause ${release.title}` : `Play ${release.title}`}
            className={`absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-xs border transition ${
              isThisPlaying
                ? 'border-brand bg-brand text-brand-contrast'
                : 'border-transparent bg-ink text-ink-contrast hover:bg-brand hover:text-brand-contrast'
            }`}
          >
            {isThisPlaying ? (
              <Pause size={16} aria-hidden="true" />
            ) : (
              <Play size={16} className="ml-0.5" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>

      <span className="eyebrow mt-5 block text-silver">
        {release.type} · {formatDate(release.releaseDate)}
      </span>
      <h3 className="mt-2 font-display text-title text-strong">
        <Link href={`/releases/${release.slug}`} className="transition hover:text-brand">
          {release.title}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-silver">{release.artist}</p>
    </article>
  );
}

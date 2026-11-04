'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { ExternalLink, Music, Pause, Play } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { usePlacements } from '@/lib/store';
import SectionHeading from '@/components/ui/SectionHeading';
import type { Placement } from '@/data/initialData';

const coverSizes = '96px';

export default function Discography() {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const placements = usePlacements();

  // Only streamable releases belong in the skip queue.
  const queue = useMemo(
    () => placements.filter((placement) => placement.audioUrl || placement.link),
    [placements]
  );

  const handlePlayClick = (item: Placement) => {
    if (!item.audioUrl && !item.link) return;
    if (currentTrack?.id === item.id) togglePlay();
    else playTrack(item, queue);
  };

  return (
    <section id="discography" className="relative border-t border-hairline bg-surface-3 px-6 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="03"
          eyebrow="Credits &amp; Releases"
          title={
            <>
              Major <em className="text-brand">placements</em>
            </>
          }
          description="Records produced, recorded, mixed and mastered at Samrock Music Productions."
        />

        <ul className="mt-12 border-t border-hairline">
          {placements.map((item) => {
            const isThisTrackPlaying = currentTrack?.id === item.id && isPlaying;
            const isPlayable = Boolean(item.audioUrl || item.link);

            return (
              <li key={item.id} className="border-b border-hairline">
                <div className="group grid grid-cols-1 items-center gap-x-8 gap-y-5 py-7 sm:grid-cols-12">
                  <span className="eyebrow text-silver sm:col-span-1">{item.year}</span>

                  <div className="sm:col-span-2">
                    <div className="media-tone relative aspect-square w-24 overflow-hidden bg-surface-2">
                      {item.coverArt ? (
                        <Image
                          src={item.coverArt}
                          alt={`${item.title} artwork`}
                          fill
                          sizes={coverSizes}
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-silver">
                          <Music size={24} aria-hidden="true" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <h3 className="font-display text-title text-strong transition group-hover:text-brand">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-silver">{item.artist}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="eyebrow text-silver">{item.role}</span>
                  </div>

                  <div className="flex items-center gap-4 sm:col-span-3 sm:justify-end">
                    {isPlayable && (
                      <button
                        type="button"
                        onClick={() => handlePlayClick(item)}
                        aria-label={isThisTrackPlaying ? `Pause ${item.title}` : `Play ${item.title}`}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xs border transition ${
                          isThisTrackPlaying
                            ? 'border-brand bg-brand text-brand-contrast'
                            : 'border-hairline-strong text-strong hover:border-brand hover:text-brand'
                        }`}
                      >
                        {isThisTrackPlaying ? (
                          <Pause size={16} aria-hidden="true" />
                        ) : (
                          <Play size={16} className="ml-0.5" aria-hidden="true" />
                        )}
                      </button>
                    )}

                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline eyebrow inline-flex items-center gap-2 text-brand"
                      >
                        Stream release
                        <ExternalLink size={12} aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

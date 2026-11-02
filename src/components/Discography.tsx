'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Award, ExternalLink, Music, Pause, Play } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { usePlacements } from '@/lib/store';
import SectionHeading from '@/components/ui/SectionHeading';
import type { Placement } from '@/data/initialData';

const coverSizes = '(max-width: 768px) 100vw, 33vw';

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
    <section id="discography" className="relative border-t border-hairline bg-surface-3 px-4 py-24">
      <div className="mx-auto max-w-7xl space-y-12">
        <SectionHeading
          eyebrow="Credits &amp; Releases"
          icon={Award}
          title={
            <>
              Major <span className="text-gradient">Placements</span>
            </>
          }
          description="A showcase of hit records produced, recorded, mixed, and mastered at Samrock Music Productions."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {placements.map((item) => {
            const isThisTrackPlaying = currentTrack?.id === item.id && isPlaying;
            const isPlayable = Boolean(item.audioUrl || item.link);

            return (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-2 shadow-xl transition duration-300 hover:border-brand/40"
              >
                <div className="relative aspect-video overflow-hidden bg-surface-3 sm:aspect-square">
                  {item.coverArt ? (
                    <Image
                      src={item.coverArt}
                      alt={`${item.title} artwork`}
                      fill
                      sizes={coverSizes}
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-silver">
                      <Music size={44} aria-hidden="true" />
                    </div>
                  )}

                  {isPlayable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition group-hover:opacity-100 focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() => handlePlayClick(item)}
                        aria-label={isThisTrackPlaying ? `Pause ${item.title}` : `Play ${item.title}`}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-solid text-brand-contrast shadow-xl transition hover:scale-110"
                      >
                        {isThisTrackPlaying ? (
                          <Pause size={24} aria-hidden="true" />
                        ) : (
                          <Play size={24} className="ml-1" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  )}

                  <span className="absolute right-3 top-3 rounded-lg border border-brand/20 bg-black/60 px-3 py-1 text-xs font-bold text-brand backdrop-blur-md">
                    {item.year}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                  <div>
                    <h3 className="text-xl font-bold text-strong transition group-hover:text-brand">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-silver">Artist: {item.artist}</p>
                    <p className="mt-1 text-xs text-silver">
                      Role: <span className="text-brand">{item.role}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPlayable && (
                      <button
                        type="button"
                        onClick={() => handlePlayClick(item)}
                        aria-label={isThisTrackPlaying ? `Pause ${item.title}` : `Play ${item.title}`}
                        className={`rounded-xl border p-2.5 transition ${
                          isThisTrackPlaying
                            ? 'border-brand-solid bg-brand-solid text-brand-contrast'
                            : 'border-hairline bg-surface-3 text-brand hover:border-brand'
                        }`}
                      >
                        {isThisTrackPlaying ? (
                          <Pause size={18} aria-hidden="true" />
                        ) : (
                          <Play size={18} aria-hidden="true" />
                        )}
                      </button>
                    )}
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-hairline bg-surface-3 py-2.5 text-xs font-semibold text-silver transition hover:border-brand hover:text-brand"
                      >
                        Stream Release
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

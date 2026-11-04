'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Music, Pause, Play, X } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { useBeats } from '@/lib/store';
import SectionHeading from '@/components/ui/SectionHeading';
import Modal from '@/components/ui/Modal';
import type { Beat } from '@/data/initialData';

const genres = ['All', 'Afrobeats', 'Reggae', 'Woro', 'Trap', 'Highlife'];

const coverSizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';

/** Prices come from localStorage, so they can be missing or non-numeric. */
function formatPrice(value: number) {
  return Number.isFinite(value) ? `₦${value.toLocaleString('en-NG')}` : 'Price on request';
}

export default function BeatStore() {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const beats = useBeats();
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedBeat, setSelectedBeat] = useState<Beat | null>(null);

  const filteredBeats = useMemo(
    () =>
      selectedGenre === 'All'
        ? beats
        : beats.filter((beat) => beat.genre.toLowerCase() === selectedGenre.toLowerCase()),
    [beats, selectedGenre]
  );

  const handlePlayClick = (beat: Beat) => {
    if (currentTrack?.id === beat.id) togglePlay();
    else playTrack(beat, filteredBeats);
  };

  return (
    <section id="beats" className="relative bg-surface px-6 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="02"
          eyebrow="Catalog"
          title={
            <>
              Explore the <em className="text-brand">catalog</em>
            </>
          }
          description="Instrumentals built at Samrock Music Productions. Preview a track, then secure the lease that fits the release."
        />

        <div className="mt-12 flex flex-wrap items-center gap-2">
          {genres.map((genre) => {
            const isActive = selectedGenre === genre;
            return (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre)}
                aria-pressed={isActive}
                className={`eyebrow rounded-xs border px-4 py-2.5 transition ${
                  isActive
                    ? 'border-ink bg-ink text-ink-contrast'
                    : 'border-hairline text-silver hover:border-brand hover:text-brand'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {filteredBeats.length === 0 ? (
          <p className="mt-12 border-y border-hairline py-20 text-center text-sm text-silver">
            No beats in this genre yet.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBeats.map((beat) => {
              const isThisTrackPlaying = currentTrack?.id === beat.id && isPlaying;

              return (
                <article key={beat.id} className="group flex flex-col">
                  <div className="media-tone relative aspect-square overflow-hidden bg-surface-3">
                    {beat.coverArt ? (
                      <Image
                        src={beat.coverArt}
                        alt={`${beat.title} artwork`}
                        fill
                        sizes={coverSizes}
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-silver">
                        <Music size={44} aria-hidden="true" />
                      </div>
                    )}

                    <span className="eyebrow absolute left-3 top-3 bg-surface/85 px-2.5 py-1.5 text-strong backdrop-blur-sm">
                      {beat.genre}
                    </span>

                    {/* Always rendered, so it stays a real tap target on touch devices. */}
                    <button
                      type="button"
                      onClick={() => handlePlayClick(beat)}
                      aria-label={isThisTrackPlaying ? `Pause ${beat.title}` : `Play ${beat.title}`}
                      className={`absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-xs transition ${
                        isThisTrackPlaying
                          ? 'bg-brand text-brand-contrast'
                          : 'bg-ink text-ink-contrast hover:bg-brand hover:text-brand-contrast'
                      }`}
                    >
                      {isThisTrackPlaying ? (
                        <Pause size={18} aria-hidden="true" />
                      ) : (
                        <Play size={18} className="ml-0.5" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-title text-strong transition group-hover:text-brand">
                      {beat.title}
                    </h3>
                    <span className="shrink-0 text-sm font-medium tabular-nums text-strong">
                      {formatPrice(beat.price)}
                    </span>
                  </div>

                  <dl className="mt-3 flex items-center gap-6 border-t border-hairline pt-3">
                    <div className="flex items-baseline gap-2">
                      <dt className="eyebrow text-silver">BPM</dt>
                      <dd className="text-xs tabular-nums text-strong">{beat.bpm}</dd>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <dt className="eyebrow text-silver">Key</dt>
                      <dd className="text-xs text-strong">{beat.key}</dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    onClick={() => setSelectedBeat(beat)}
                    className="eyebrow mt-4 self-start text-brand transition hover:text-strong"
                  >
                    License this beat
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={selectedBeat !== null}
        onClose={() => setSelectedBeat(null)}
        label={selectedBeat ? `License ${selectedBeat.title}` : 'License beat'}
        className="max-w-lg"
      >
        {selectedBeat && (
          <div className="border border-hairline-strong bg-surface-2 p-6 text-strong sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-hairline pb-5">
              <div>
                <p className="eyebrow text-brand">License</p>
                <h3 className="mt-3 font-display text-title text-strong">{selectedBeat.title}</h3>
                <p className="mt-1 text-xs text-silver">{selectedBeat.genre}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBeat(null)}
                aria-label="Close license options"
                className="-mr-1 -mt-1 shrink-0 rounded-xs border border-hairline p-2 text-silver transition hover:border-brand hover:text-brand"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 divide-y divide-hairline border-y border-hairline">
              <div className="flex items-start justify-between gap-6 py-5">
                <div>
                  <p className="text-sm font-medium text-strong">MP3 Lease</p>
                  <p className="mt-1 text-xs leading-relaxed text-silver">
                    High-quality MP3 file. Instant delivery for non-commercial singles.
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums text-brand">
                  {formatPrice(selectedBeat.price)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-6 py-5">
                <div>
                  <p className="text-sm font-medium text-strong">WAV + Trackouts (Stems)</p>
                  <p className="mt-1 text-xs leading-relaxed text-silver">
                    WAV file plus individual stem tracks for professional mixing and mastering.
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums text-brand">
                  {formatPrice(selectedBeat.price * 2)}
                </span>
              </div>
            </div>

            <a
              href="#contact"
              onClick={() => setSelectedBeat(null)}
              className="btn btn-primary mt-6 w-full"
            >
              Inquire &amp; secure license
            </a>
          </div>
        )}
      </Modal>
    </section>
  );
}

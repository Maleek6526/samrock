'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Music, Pause, Play, ShoppingBag, X } from 'lucide-react';
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
    <section id="beats" className="relative bg-surface px-4 py-24">
      <div className="mx-auto max-w-7xl space-y-12">
        <SectionHeading
          eyebrow="Catalog"
          icon={Music}
          title={
            <>
              Explore <span className="text-gradient">Beats</span>
            </>
          }
          description="Stream high-quality instrumental beats crafted at Samrock Music Productions. Select a track to test or secure your license."
        />

        <div className="flex flex-wrap items-center justify-center gap-2">
          {genres.map((genre) => {
            const isActive = selectedGenre === genre;
            return (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre)}
                aria-pressed={isActive}
                className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-solid to-brand-strong text-brand-contrast shadow-lg shadow-brand/20'
                    : 'border border-hairline bg-surface-2 text-silver hover:border-brand hover:text-brand'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {filteredBeats.length === 0 ? (
          <p className="rounded-2xl border border-hairline bg-surface-2 py-16 text-center text-sm text-silver">
            No beats in this genre yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBeats.map((beat) => {
              const isThisTrackPlaying = currentTrack?.id === beat.id && isPlaying;

              return (
                <div
                  key={beat.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-hairline bg-surface-2 shadow-xl transition duration-300 hover:border-brand/40"
                >
                  <div className="relative aspect-square overflow-hidden bg-surface-3">
                    {beat.coverArt ? (
                      <Image
                        src={beat.coverArt}
                        alt={`${beat.title} artwork`}
                        fill
                        sizes={coverSizes}
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-silver">
                        <Music size={44} aria-hidden="true" />
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition group-hover:opacity-100 focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() => handlePlayClick(beat)}
                        aria-label={isThisTrackPlaying ? `Pause ${beat.title}` : `Play ${beat.title}`}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-solid text-brand-contrast shadow-xl transition hover:scale-110"
                      >
                        {isThisTrackPlaying ? (
                          <Pause size={24} aria-hidden="true" />
                        ) : (
                          <Play size={24} className="ml-1" aria-hidden="true" />
                        )}
                      </button>
                    </div>

                    <span className="absolute left-3 top-3 rounded-lg border border-brand/20 bg-black/60 px-3 py-1 text-xs font-bold text-brand backdrop-blur-md">
                      {beat.genre}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                    <div>
                      <h3 className="text-xl font-bold text-strong transition group-hover:text-brand">
                        {beat.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-4 text-xs text-silver">
                        <span>
                          BPM: <strong className="text-strong">{beat.bpm}</strong>
                        </span>
                        <span aria-hidden="true">•</span>
                        <span>
                          Key: <strong className="text-strong">{beat.key}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-hairline pt-4">
                      <span>
                        <span className="block text-xs text-silver">Lease Price</span>
                        <span className="text-lg font-black text-strong">{formatPrice(beat.price)}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePlayClick(beat)}
                          aria-label={isThisTrackPlaying ? `Pause ${beat.title}` : `Play ${beat.title}`}
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
                        <button
                          type="button"
                          onClick={() => setSelectedBeat(beat)}
                          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-solid to-brand-strong px-4 py-2.5 text-xs font-semibold text-brand-contrast shadow-lg transition hover:opacity-90"
                        >
                          <ShoppingBag size={14} aria-hidden="true" />
                          License
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
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
          <div className="space-y-6 rounded-2xl border border-hairline-strong bg-surface-2 p-6 text-strong shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-hairline pb-4">
              <div>
                <h3 className="text-xl font-bold text-strong">License Beat</h3>
                <p className="text-xs text-brand">
                  {selectedBeat.title} ({selectedBeat.genre})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBeat(null)}
                aria-label="Close license options"
                className="rounded-lg border border-hairline bg-surface-3 p-2 text-silver transition hover:border-brand hover:text-brand"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-hairline bg-surface-3 p-4 transition hover:border-brand">
                <div className="flex justify-between text-sm font-bold">
                  <span>MP3 Lease</span>
                  <span className="text-brand">{formatPrice(selectedBeat.price)}</span>
                </div>
                <p className="mt-1 text-xs text-silver">
                  High-quality MP3 file. Instant delivery for non-commercial singles.
                </p>
              </div>

              <div className="rounded-xl border border-hairline bg-surface-3 p-4 transition hover:border-brand">
                <div className="flex justify-between text-sm font-bold">
                  <span>WAV + Trackouts (Stems)</span>
                  <span className="text-brand">{formatPrice(selectedBeat.price * 2)}</span>
                </div>
                <p className="mt-1 text-xs text-silver">
                  WAV file plus individual stem tracks for professional mixing and mastering.
                </p>
              </div>
            </div>

            <a
              href="#contact"
              onClick={() => setSelectedBeat(null)}
              className="block w-full rounded-xl bg-gradient-to-r from-brand-solid to-brand-strong py-3 text-center font-bold text-brand-contrast shadow-lg"
            >
              Inquire &amp; Secure License via WhatsApp
            </a>
          </div>
        )}
      </Modal>
    </section>
  );
}

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { useBeats, useReleases, useSiteSettings } from '@/lib/store';

const genres = [
  'Afrobeats',
  'Reggae',
  'Woro',
  'Trap',
  'Highlife',
  'Dancehall',
  'Mix & Master',
  'Jingles',
];

const backgroundImages = [
  '/hero1.jpg',
  '/hero2.jpg',
  '/hero3.jpg',
  '/hero4.jpg',
  '/hero5.jpg',
];

const dynamicPhrases = [
  'hit records',
  'sonic gold',
  'studio magic',
  'platinum vibes',
  'iconic tracks',
  'masterful sound',
];

export default function Hero() {
  const settings = useSiteSettings();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const releases = useReleases();
  const beats = useBeats();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
      setCurrentPhraseIndex((prev) => (prev + 1) % dynamicPhrases.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // The latest record that can play natively becomes the landing soundtrack.
  // Streaming-only links are skipped because they cannot run in the background.
  const backgroundTrack = useMemo(() => {
    const latestRelease = [...releases]
      .filter((release) => Boolean(release.audioUrl))
      .sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''))[0];
    if (latestRelease) return latestRelease;
    return beats.find((beat) => Boolean(beat.audioUrl)) ?? null;
  }, [releases, beats]);

  // Start it once on arrival, but never override a track the visitor chose.
  useEffect(() => {
    if (startedRef.current || !backgroundTrack || currentTrack) return;
    startedRef.current = true;
    playTrack(backgroundTrack, [backgroundTrack]);
  }, [backgroundTrack, currentTrack, playTrack]);

  const isBackgroundPlaying = Boolean(
    backgroundTrack && currentTrack?.id === backgroundTrack.id && isPlaying
  );

  const handleBackgroundToggle = () => {
    if (!backgroundTrack) return;
    if (currentTrack?.id === backgroundTrack.id) togglePlay();
    else playTrack(backgroundTrack, [backgroundTrack]);
  };

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-surface pt-28">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {backgroundImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
            {/* Stronger overlay for high-fashion readability in both light and dark modes */}
            <div className="absolute inset-0 bg-surface/70 backdrop-blur-[2px] dark:bg-surface/85" />
          </div>
        ))}
      </div>

      {/* The ambient colour glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 z-10 h-[560px] w-[560px] rounded-full bg-brand/[0.07] blur-[160px]"
      />

      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <p className="eyebrow flex items-center gap-3 leading-relaxed text-brand animate-fade-in-up">
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-brand" />
              {settings.statusBadge}
            </p>

            <h1 className="mt-8 font-display text-hero text-strong animate-fade-in-up [animation-delay:90ms]">
              Crafting{' '}
              <span className="relative inline-flex h-[1.25em] items-center overflow-hidden align-bottom">
                {dynamicPhrases.map((phrase, index) => (
                  <em
                    key={phrase}
                    className={`absolute inset-x-0 whitespace-nowrap text-brand transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      index === currentPhraseIndex
                        ? 'translate-y-0 opacity-100'
                        : index < currentPhraseIndex
                        ? '-translate-y-full opacity-0'
                        : 'translate-y-full opacity-0'
                    }`}
                  >
                    {phrase}
                  </em>
                ))}
              </span>
              {' '}and heavy soundscapes
            </h1>
          </div>

          <div className="flex flex-col justify-end lg:col-span-4">
            <p className="text-lede text-strong animate-fade-in-up [animation-delay:180ms]">
              <span className="font-bold">{settings.producerName}</span> builds records end to end:
              beat making, recording, mixing and mastering for artists working across Afrobeats,
              Reggae, Woro and Trap.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row animate-fade-in-up [animation-delay:270ms]">
              <a href="#beats" className="btn btn-primary">
                Explore the catalog
                <ArrowRight size={15} aria-hidden="true" />
              </a>
              <a href="#contact" className="btn btn-ghost">
                Book a session
              </a>
            </div>

            {backgroundTrack ? (
              <button
                type="button"
                onClick={handleBackgroundToggle}
                aria-label={isBackgroundPlaying ? 'Pause background music' : 'Play background music'}
                className="mt-8 flex w-full items-center gap-3 rounded-xs border border-hairline bg-surface/70 px-4 py-3 text-left backdrop-blur-sm transition hover:border-brand animate-fade-in-up [animation-delay:360ms]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs border border-hairline text-brand">
                  {isBackgroundPlaying ? (
                    <Pause size={15} aria-hidden="true" />
                  ) : (
                    <Play size={15} className="ml-0.5" aria-hidden="true" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="eyebrow block text-silver">
                    {isBackgroundPlaying ? 'Now playing' : 'Background music'}
                  </span>
                  <span className="block truncate text-sm text-strong">
                    {backgroundTrack.title} — {backgroundTrack.artist}
                  </span>
                </span>
                {isBackgroundPlaying ? (
                  <span aria-hidden="true" className="flex h-4 shrink-0 items-end gap-0.5">
                    <span className="h-[50%] w-0.5 animate-pulse rounded-full bg-brand" />
                    <span className="h-full w-0.5 animate-pulse rounded-full bg-brand [animation-delay:150ms]" />
                    <span className="h-[40%] w-0.5 animate-pulse rounded-full bg-brand [animation-delay:300ms]" />
                  </span>
                ) : null}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Marquee loop */}
      <div className="relative z-20 mt-16 w-full overflow-hidden border-y border-hairline py-4">
        <div className="flex w-max animate-marquee items-center">
          {[...genres, ...genres].map((genre, index) => (
            <div
              key={`${genre}-${index}`}
              aria-hidden={index >= genres.length}
              className="eyebrow flex items-center gap-8 px-8 text-silver"
            >
              <span className="text-brand">/</span>
              <span>{genre}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

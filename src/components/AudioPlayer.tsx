'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ExternalLink,
  Music,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { getEmbedUrl, getStreamPlatform } from '@/lib/embeds';

function formatTime(time: number) {
  if (!Number.isFinite(time) || time <= 0) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export default function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    canSkip,
    togglePlay,
    pause,
    stop,
    playNext,
    playPrevious,
  } = useAudio();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Keyed by track so a new track reports 0:00 without needing a reset effect.
  const [playback, setPlayback] = useState<{
    trackId?: string;
    currentTime: number;
    duration: number;
  }>({ currentTime: 0, duration: 0 });
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const source = currentTrack?.audioUrl || currentTrack?.link || null;
  const platform = getStreamPlatform(source);
  const embedUrl = platform ? getEmbedUrl(source) : null;
  const trackId = currentTrack?.id;

  const currentTime = playback.trackId === trackId ? playback.currentTime : 0;
  const duration = playback.trackId === trackId ? playback.duration : 0;

  // Drive the native element; streaming links are handed to the official embed.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || embedUrl) return;

    if (isPlaying) {
      audio.play().catch(() => {
        // Browsers may block autoplay until the user interacts.
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, trackId, embedUrl]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setPlayback({
      trackId,
      currentTime: audio.currentTime,
      duration: Number.isFinite(audio.duration) ? audio.duration : 0,
    });
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(event.target.value);
    setPlayback({ trackId, currentTime: time, duration });
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setVolume(value);
    setIsMuted(value === 0);
    if (audioRef.current) {
      audioRef.current.volume = value;
      audioRef.current.muted = value === 0;
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) audioRef.current.muted = nextMuted;
  };

  if (!currentTrack) return null;

  if (embedUrl) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-brand/30 bg-black/95 shadow-2xl backdrop-blur-xl animate-slide-up-panel">
        <div className="mx-auto flex max-w-7xl items-center gap-3 p-2 sm:p-3">
          <div className="hidden w-1/4 items-center gap-3 sm:flex">
            {/* eslint-disable-next-line @next/next/no-img-element -- small remote thumbnail, sized by the container */}
            <img
              src={currentTrack.coverArt}
              alt=""
              className="h-12 w-12 rounded-lg border border-brand/30 object-cover"
            />
            <div className="overflow-hidden">
              <h4 className="truncate text-xs font-bold text-white">{currentTrack.title}</h4>
              <p className="flex items-center gap-1 text-[10px] text-brand">
                <ExternalLink size={10} aria-hidden="true" /> Streaming via {platform}
              </p>
            </div>
          </div>

          <div className="relative h-[80px] flex-1 overflow-hidden rounded-xl bg-surface-3 sm:h-[100px]">
            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-2 text-silver">
              <Music className="animate-pulse" size={24} aria-hidden="true" />
              <span className="text-[10px]">Loading stream from {platform}…</span>
            </div>
            <iframe
              key={embedUrl}
              src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1&auto_play=true`}
              title={`${currentTrack.title} on ${platform}`}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="relative z-10 h-full w-full border-0"
            />
          </div>

          <button
            type="button"
            onClick={stop}
            aria-label="Close player"
            className="shrink-0 rounded-full bg-brand-solid p-2 text-brand-contrast shadow-lg transition hover:scale-105"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-brand/20 bg-surface-2/95 px-4 py-3 text-strong shadow-2xl backdrop-blur-md">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={pause}
      />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        {/* Track info */}
        <div className="flex w-full items-center gap-3 md:w-1/4">
          {/* eslint-disable-next-line @next/next/no-img-element -- small remote thumbnail, sized by the container */}
          <img
            src={currentTrack.coverArt}
            alt=""
            className="h-12 w-12 rounded-lg border border-brand/30 object-cover shadow-md"
          />
          <div className="overflow-hidden">
            <h4 className="truncate text-sm font-bold text-strong">{currentTrack.title}</h4>
            <p className="flex items-center gap-1 text-xs text-brand">
              <Music size={12} aria-hidden="true" /> Samrock Production
            </p>
          </div>
        </div>

        {/* Transport + scrubber */}
        <div className="flex w-full flex-col items-center gap-1 md:w-2/4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={playPrevious}
              disabled={!canSkip}
              aria-label="Previous track"
              className="text-silver transition hover:text-strong disabled:cursor-not-allowed disabled:opacity-30"
            >
              <SkipBack size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-solid to-brand-strong text-brand-contrast shadow-lg transition hover:scale-105"
            >
              {isPlaying ? (
                <Pause size={20} aria-hidden="true" />
              ) : (
                <Play size={20} className="ml-0.5" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={playNext}
              disabled={!canSkip}
              aria-label="Next track"
              className="text-silver transition hover:text-strong disabled:cursor-not-allowed disabled:opacity-30"
            >
              <SkipForward size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="flex w-full items-center gap-2 text-xs text-silver">
            <span className="w-9 shrink-0 text-right tabular-nums">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={Math.min(currentTime, duration || 100)}
              onChange={handleSeek}
              aria-label="Seek"
              className="w-full"
            />
            <span className="w-9 shrink-0 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden w-1/4 items-center justify-end gap-2 md:flex">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted || volume === 0 ? 'Unmute' : 'Mute'}
            className="text-silver transition hover:text-brand"
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={18} aria-hidden="true" />
            ) : (
              <Volume2 size={18} aria-hidden="true" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label="Volume"
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
}

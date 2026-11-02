'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Track } from '@/data/initialData';

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  /** True when the current track came from a list, so skipping makes sense. */
  canSkip: boolean;
  /** `queue` lets the player skip within the list the track was started from. */
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  pause: () => void;
  stop: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

function isPlayable(track: Track) {
  return Boolean(track.audioUrl || track.link);
}

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);

  const playTrack = useCallback((track: Track, nextQueue?: Track[]) => {
    if (!isPlayable(track)) return;

    const list = nextQueue && nextQueue.length > 0 ? nextQueue : [track];
    const index = list.findIndex((item) => item.id === track.id);

    setQueue(list);
    setQueueIndex(index >= 0 ? index : 0);
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((playing) => !playing);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentTrack(null);
    setQueue([]);
    setQueueIndex(0);
  }, []);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    const next = (queueIndex + 1) % queue.length;
    setQueueIndex(next);
    setCurrentTrack(queue[next]);
    setIsPlaying(true);
  }, [queue, queueIndex]);

  const playPrevious = useCallback(() => {
    if (queue.length === 0) return;
    const previous = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(previous);
    setCurrentTrack(queue[previous]);
    setIsPlaying(true);
  }, [queue, queueIndex]);

  const value = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      canSkip: queue.length > 1,
      playTrack,
      togglePlay,
      pause,
      stop,
      playNext,
      playPrevious,
    }),
    [currentTrack, isPlaying, queue.length, playTrack, togglePlay, pause, stop, playNext, playPrevious]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};

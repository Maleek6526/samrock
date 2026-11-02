'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Beat, Track, initialBeats } from '@/data/initialData';

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  beats: Beat[];
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beats, setBeats] = useState<Beat[]>(initialBeats);

  useEffect(() => {
    // Sync beats with localStorage if admin made changes
    const savedBeats = localStorage.getItem('beats');
    if (savedBeats) setBeats(JSON.parse(savedBeats));

    // Optional: Listen for storage events to sync across tabs if needed
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'beats') setBeats(JSON.parse(e.newValue || '[]'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const playTrack = (track: Track) => {
    if (!track.audioUrl && !(track as any).link) return;
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <AudioContext.Provider value={{ currentTrack, isPlaying, playTrack, togglePlay, beats }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};

'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, X, Music, ExternalLink } from 'lucide-react';

export default function AudioPlayer() {
  const { currentTrack, isPlaying, togglePlay, playTrack } = useAudio();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Helper to detect and transform streaming links
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    
    try {
      const cleanUrl = url.trim();
      if (!cleanUrl.startsWith('http')) return null;

      const urlObj = new URL(cleanUrl);
      const hostname = urlObj.hostname.replace('www.', '');
      const path = urlObj.pathname;

      if (hostname === 'spotify.com' || hostname === 'open.spotify.com') {
        const embedPath = path.startsWith('/embed') ? path : `/embed${path}`;
        return `https://open.spotify.com${embedPath}${urlObj.search}`;
      }
      
      if (hostname === 'music.apple.com') {
        const embedHost = hostname.startsWith('embed.') ? hostname : `embed.${hostname}`;
        return `https://${embedHost}${path}${urlObj.search}`;
      }

      if (hostname === 'audiomack.com') {
        if (path.includes('/embed/')) return cleanUrl;
        
        // Transform /artist/song/title to /embed/song/artist/title
        if (path.includes('/song/')) {
          const parts = path.split('/').filter(p => p && p !== 'song');
          if (parts.length >= 2) {
            return `https://audiomack.com/embed/song/${parts[0]}/${parts[1]}${urlObj.search}`;
          }
        }
        
        // Default to simple embed for profiles or other structures
        const embedPath = path.startsWith('/embed') ? path : `/embed${path}`;
        return `https://audiomack.com${embedPath}${urlObj.search}`;
      }
    } catch (e) {
      console.error("URL parsing error:", e);
    }
    return null;
  };

  const embedUrl = currentTrack ? getEmbedUrl(currentTrack.audioUrl || (currentTrack as any).link) : null;

  useEffect(() => {
    if (audioRef.current && !embedUrl) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.log("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, embedUrl]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentTrack) return null;

  // If it's a streaming link, render the official embed
  if (embedUrl) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-xl border-t border-samrock-cyan/30 shadow-2xl animate-in slide-in-from-bottom-full duration-500">
        <div className="max-w-7xl mx-auto relative group">
          <button 
            onClick={() => playTrack(null as any)}
            className="absolute -top-12 right-4 p-2 bg-samrock-cyan text-white rounded-full shadow-lg hover:scale-110 transition z-50"
            title="Close Player"
          >
            <X size={20} />
          </button>
          
          <div className="w-full flex items-center gap-4 p-2">
            <div className="hidden sm:flex items-center gap-3 w-1/4 pl-4">
              <img 
                src={currentTrack.coverArt} 
                alt={currentTrack.title} 
                className="w-12 h-12 rounded-lg object-cover border border-samrock-cyan/30"
              />
              <div className="overflow-hidden">
                <h4 className="font-bold text-xs truncate text-white">{currentTrack.title}</h4>
                <p className="text-[10px] text-samrock-cyan flex items-center gap-1">
                  <ExternalLink size={10} /> Streaming via {embedUrl.includes('spotify') ? 'Spotify' : embedUrl.includes('apple') ? 'Apple Music' : 'Audiomack'}
                </p>
              </div>
            </div>
            
            <div className="flex-1 h-[80px] sm:h-[100px] overflow-hidden rounded-xl bg-samrock-dark relative">
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Music className="animate-pulse" size={24} />
                  <span className="text-[10px]">Loading stream from {embedUrl.includes('spotify') ? 'Spotify' : embedUrl.includes('apple') ? 'Apple' : 'Audiomack'}...</span>
                </div>
              </div>
              <iframe
                src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1&auto_play=true&theme=dark`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="w-full h-full relative z-10"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-samrock-dark/95 backdrop-blur-md border-t border-samrock-cyan/20 text-gray-900 dark:text-white px-4 py-3 shadow-2xl">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => togglePlay()}
      />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Track Info */}
        <div className="flex items-center gap-3 w-full md:w-1/4">
          <img 
            src={currentTrack.coverArt} 
            alt={currentTrack.title} 
            className="w-12 h-12 rounded-lg object-cover border border-samrock-cyan/30 shadow-md"
          />
          <div className="overflow-hidden">
            <h4 className="font-bold text-sm truncate text-gray-900 dark:text-white">{currentTrack.title}</h4>
            <p className="text-xs text-samrock-cyan flex items-center gap-1"><Music size={12} /> Samrock Production</p>
          </div>
        </div>

        {/* Playback Controls & Scrubber */}
        <div className="flex flex-col items-center w-full md:w-2/4 gap-1">
          <div className="flex items-center gap-4">
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"><SkipBack size={18} /></button>
            <button 
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-samrock-cyan to-orange-600 flex items-center justify-center text-white shadow-lg hover:scale-105 transition"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"><SkipForward size={18} /></button>
          </div>

          <div className="flex items-center gap-2 w-full text-xs text-gray-500 dark:text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <input 
              type="range" 
              min={0} 
              max={duration || 100} 
              value={currentTime} 
              onChange={handleSeek}
              className="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-samrock-cyan"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="hidden md:flex items-center gap-2 w-1/4 justify-end">
          <button onClick={toggleMute} className="text-gray-500 dark:text-gray-400 hover:text-samrock-cyan transition">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input 
            type="range" 
            min={0} 
            max={1} 
            step={0.01} 
            value={isMuted ? 0 : volume} 
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-samrock-cyan"
          />
        </div>

      </div>
    </div>
  );
}

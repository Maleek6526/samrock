'use client';
import React, { useState } from 'react';
import { initialBeats, Beat } from '@/data/initialData';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, ShoppingBag, Music, Disc } from 'lucide-react';

export default function BeatStore() {
  const { currentTrack, isPlaying, playTrack, togglePlay, beats } = useAudio();
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedBeatForModal, setSelectedBeatForModal] = useState<Beat | null>(null);

  const genres = ['All', 'Afrobeats', 'Reggae', 'Woro', 'Trap', 'Highlife'];

  const filteredBeats = selectedGenre === 'All' 
    ? beats 
    : beats.filter((b) => b.genre.toLowerCase() === selectedGenre.toLowerCase());

  const handlePlayClick = (beat: Beat) => { 
    if (currentTrack?.id === beat.id) {
      togglePlay();
    } else {
      playTrack(beat);
    }
  };

  return (
    <section id="beats" className="py-24 px-4 bg-white dark:bg-samrock-dark relative">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white dark:bg-samrock-card border border-samrock-cyan/30 text-xs font-semibold text-samrock-cyan uppercase tracking-widest">
            <Music size={14} /> Catalog
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-samrock-cyan to-orange-500">Beats</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            Stream high-quality instrumental beats crafted at Samrock Music Productions. Select a track to test or secure your license.
          </p>
        </div>

        {/* Genre Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
                selectedGenre === genre
                  ? 'bg-gradient-to-r from-samrock-cyan to-orange-600 text-white shadow-lg shadow-samrock-cyan/20'
                  : 'bg-white dark:bg-samrock-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Beats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBeats.map((beat) => {
            const isThisTrackPlaying = currentTrack?.id === beat.id && isPlaying;

            return (
              <div 
                key={beat.id}
                className="group bg-white dark:bg-samrock-card/90 rounded-2xl border border-gray-200 dark:border-gray-800/80 overflow-hidden hover:border-samrock-cyan/40 transition duration-300 shadow-xl flex flex-col justify-between"
              >
                {/* Cover Art & Play Overlay */}
                <div className="relative aspect-square overflow-hidden bg-gray-900">
                  <img 
                    src={beat.coverArt} 
                    alt={beat.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-[2px]">
                    <button
                      onClick={() => handlePlayClick(beat)}
                      className="w-14 h-14 rounded-full bg-samrock-cyan flex items-center justify-center text-white shadow-xl hover:scale-110 transition"
                    >
                      {isThisTrackPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                    </button>
                  </div>
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs font-bold text-samrock-cyan border border-samrock-cyan/20">
                    {beat.genre}
                  </span>
                </div>

                {/* Track Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-samrock-cyan transition">{beat.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>BPM: <strong className="text-gray-900 dark:text-white">{beat.bpm}</strong></span>
                      <span>•</span>
                      <span>Key: <strong className="text-gray-900 dark:text-white">{beat.key}</strong></span>
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">Lease Price</span>
                      <span className="text-lg font-black text-gray-900 dark:text-white">₦{beat.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayClick(beat)}
                        className={`p-2.5 rounded-xl border transition ${
                          isThisTrackPlaying 
                            ? 'bg-samrock-cyan text-white border-samrock-cyan' 
                            : 'bg-gray-50 dark:bg-samrock-dark text-samrock-cyan border-samrock-cyan/30 hover:bg-samrock-cyan/10'
                        }`}
                      >
                        {isThisTrackPlaying ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <button
                        onClick={() => setSelectedBeatForModal(beat)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-samrock-cyan to-orange-600 text-white font-semibold text-xs shadow-lg hover:opacity-90 transition"
                      >
                        <ShoppingBag size={14} />
                        License
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* License Modal */}
      {selectedBeatForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-samrock-card border border-samrock-cyan/30 rounded-2xl max-w-lg w-full p-6 text-gray-900 dark:text-white space-y-6 relative shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">License Beat</h3>
                <p className="text-xs text-samrock-cyan">{selectedBeatForModal.title} ({selectedBeatForModal.genre})</p>
              </div>
              <button 
                onClick={() => setSelectedBeatForModal(null)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 hover:border-samrock-cyan transition cursor-pointer">
                <div className="flex justify-between font-bold text-sm">
                  <span>MP3 Lease</span>
                  <span className="text-samrock-cyan">₦{selectedBeatForModal.price.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">High-quality MP3 file. Instant delivery for non-commercial singles.</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 hover:border-samrock-cyan transition cursor-pointer">
                <div className="flex justify-between font-bold text-sm">
                  <span>WAV + Trackouts (Stems)</span>
                  <span className="text-samrock-cyan">₦{(selectedBeatForModal.price * 2).toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">WAV file + individual stem tracks for professional mixing and mastering.</p>
              </div>
            </div>

            <div className="pt-2">
              <a 
                href="#contact"
                onClick={() => setSelectedBeatForModal(null)}
                className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-samrock-cyan to-orange-600 text-white font-bold shadow-lg"
              >
                Inquire & Secure License via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

import React from 'react';
import { AudioProvider } from '@/context/AudioContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BeatStore from '@/components/BeatStore';
import Discography from '@/components/Discography';
import Services from '@/components/Services';
import AboutStudio from '@/components/AboutStudio';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import AudioPlayer from '@/components/AudioPlayer';

export default function Home() {
  return (
    <AudioProvider>
      <main className="min-h-screen bg-white dark:bg-samrock-dark text-gray-900 dark:text-white selection:bg-samrock-cyan selection:text-white">
        <Navbar />
        <Hero />
        <BeatStore />
        <Discography />
        <Services />
        <AboutStudio />
        <ContactForm />
        <Footer />
        <AudioPlayer />
      </main>
    </AudioProvider>
  );
}
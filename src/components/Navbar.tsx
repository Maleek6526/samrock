'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Shield, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [settings, setSettings] = useState({
    producerName: 'SAMROCK',
  });

  useEffect(() => {
    // Sync state with HTML class on initial load
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    const saved = localStorage.getItem('siteSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings({ producerName: parsed.producerName.split(' ')[0].toUpperCase() });
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'siteSettings') {
        const parsed = JSON.parse(e.newValue || '{}');
        if (parsed.producerName) setSettings({ producerName: parsed.producerName.split(' ')[0].toUpperCase() });
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const navLinks = [
    { name: 'Beats', href: '#beats' },
    { name: 'Discography', href: '#discography' },
    { name: 'Services', href: '#services' },
    { name: 'About & Gear', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-samrock-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-samrock-cyan/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 relative overflow-hidden rounded-xl border border-samrock-cyan/20 group-hover:border-samrock-cyan/50 transition shadow-sm">
              <img 
                src="/logo.jpg" 
                alt="Samrock Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-wider text-gray-900 dark:text-white text-lg sm:text-xl group-hover:text-samrock-cyan transition">{settings.producerName}</span>
              <span className="text-[10px] sm:text-[11px] tracking-widest text-gray-500 dark:text-samrock-silver uppercase font-bold">Music Productions</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-samrock-cyan transition"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right CTA / Theme Toggle / Admin */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-samrock-card border border-gray-300 dark:border-samrock-cyan/30 text-gray-700 dark:text-samrock-cyan hover:bg-samrock-cyan hover:text-white transition shadow-sm cursor-pointer"
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link 
              href="/admin" 
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-samrock-card border border-gray-300 dark:border-samrock-cyan/30 text-xs font-semibold text-gray-700 dark:text-samrock-cyan hover:bg-samrock-cyan hover:text-white transition shadow-sm"
            >
              <Shield size={14} />
              Admin
            </Link>
            
            <a 
              href="#contact" 
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-samrock-cyan to-orange-600 text-white font-semibold text-sm shadow-lg shadow-samrock-cyan/25 hover:opacity-95 hover:scale-105 transition"
            >
              Book Session
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-samrock-card border border-gray-300 dark:border-samrock-cyan/30 text-gray-700 dark:text-samrock-cyan cursor-pointer"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-samrock-dark border-b border-gray-200 dark:border-samrock-cyan/20 px-4 pt-2 pb-6 space-y-3 backdrop-blur-xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-samrock-cyan border-b border-gray-100 dark:border-gray-800"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link 
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-2.5 rounded-xl bg-gray-100 dark:bg-samrock-card border border-gray-300 dark:border-samrock-cyan/30 text-gray-800 dark:text-samrock-cyan font-semibold text-sm"
            >
              Admin Dashboard
            </Link>
            <a 
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-samrock-cyan to-orange-600 text-white font-semibold shadow-lg"
            >
              Book Session
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

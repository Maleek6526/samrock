'use client';

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, Send, X } from 'lucide-react';
import { useAudioSafe } from '@/context/AudioContext';
import {
  useAnnouncements,
  useArtists,
  useBeats,
  useContentSettings,
  usePortfolioSpaces,
  useReleases,
  useSiteSettings,
  useStudioEvents,
} from '@/lib/store';
import { brandMark, contactInfo, formatDate, serviceDefinitions } from '@/lib/site';

/* -------------------------------------------------------------------------- */
/*  Prose helpers                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The assistant answers in plain prose. Any markdown symbol or bullet dash is
 * stripped so the message never renders an asterisk or a leading dash.
 */
function toPlainProse(input: string) {
  return input
    .replace(/[*_`#]/g, '')
    .replace(/^\s*[•\u2013\u2014-]\s+/gm, '')
    .replace(/\s+[\u2013\u2014]\s+/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function joinList(items: string[], conjunction = 'and') {
  const clean = items.filter(Boolean);
  if (clean.length === 0) return '';
  if (clean.length === 1) return clean[0];
  if (clean.length === 2) return `${clean[0]} ${conjunction} ${clean[1]}`;
  return `${clean.slice(0, -1).join(', ')} ${conjunction} ${clean[clean.length - 1]}`;
}

function naira(value: number) {
  return `\u20a6${value.toLocaleString('en-NG')}`;
}

/* -------------------------------------------------------------------------- */
/*  Data + intent matching                                                    */
/* -------------------------------------------------------------------------- */

interface AssistantData {
  brand: string;
  email: string;
  whatsapp: string;
  phones: string[];
  services: string[];
  beatCount: number;
  beatFloor: number;
  releaseTitles: string[];
  releaseCount: number;
  roster: string[];
  legacy: string[];
  upcomingEvents: { title: string; date: string; location: string }[];
  newsTitles: string[];
  spaces: string[];
  labelStory: string;
  aboutIntro: string;
  founderName: string;
}

const SUGGESTIONS = [
  'What services do you offer?',
  'How do I submit a demo?',
  'How do I book a session?',
  'Who is on the roster?',
  'How can I contact the studio?',
];

function renderEvent(event: { title: string; date: string; location: string }) {
  const when = event.date ? formatDate(event.date) : 'a date to be announced';
  const where = event.location ? ` at ${event.location}` : '';
  return `${event.title} on ${when}${where}`;
}

/**
 * A small, self contained rule engine. It only ever talks about Samrock Music
 * Productions, drawing every fact from the same data the site renders.
 */
function composeReply(question: string, data: AssistantData): string {
  const text = ` ${question.toLowerCase()} `;
  const has = (...words: string[]) => words.some((word) => text.includes(` ${word}`) || text.includes(`${word} `));

  // Greetings and courtesies.
  if (/^\s*(hi|hey|hello|yo|good (morning|afternoon|evening))\b/.test(question.toLowerCase())) {
    return `Hello. I am the ${data.brand} assistant. I know this website inside out, so ask me about our services, the roster, releases, events, booking or how to submit a demo.`;
  }
  if (has('thank', 'thanks', 'appreciate')) {
    return `You are welcome. If you have another question about ${data.brand}, just ask.`;
  }

  // Off topic guard for obviously unrelated asks.
  if (has('weather', 'football', 'politics', 'code', 'programming', 'recipe', 'translate', 'joke')) {
    return `I only know about the ${data.brand} website, so I can help with our services, the roster, releases, events, booking and demos. Ask me about any of those.`;
  }

  // Demo and A and R.
  if (has('demo', 'a&r', 'ar desk', 'submit', 'pitch', 'sign me', 'get signed', 'send my music', 'audition')) {
    return `We are always listening. Send two or three of your strongest records through the demo page and the A and R desk will review them. Share your links and a short note about the artiste, and if the record is a fit the label will reach out to talk development, production and release.`;
  }

  // Contact details.
  if (has('contact', 'email', 'mail', 'phone', 'call', 'whatsapp', 'reach', 'message us', 'address', 'location', 'where are you', 'located')) {
    return `You can reach the studio by email at ${data.email}, by phone on ${joinList(data.phones)} or on WhatsApp. The studio is based in Lagos, Nigeria, and the full contact details sit on the contact page.`;
  }

  // Booking.
  if (has('book', 'booking', 'session', 'studio time', 'appointment', 'schedule', 'reserve', 'hire')) {
    return `You can book studio time for recording, mixing, mastering, production or a custom project. Open the booking page, choose a category and send the request form with your references and a target date. We reply with availability and a scope for the session.`;
  }

  // Pricing.
  if (has('price', 'pricing', 'cost', 'how much', 'rate', 'budget', 'pay', 'payment', 'fee', 'lease')) {
    const floor = data.beatFloor > 0 ? ` Beats start from ${naira(data.beatFloor)}.` : '';
    return `Beat prices are listed on each record in the catalog.${floor} Studio sessions, mixing and mastering are quoted per project, so send a booking request or a message and the studio will give you a figure.`;
  }

  // Beats and the catalog.
  if (has('beat', 'beats', 'instrumental', 'catalog', 'catalogue', 'store')) {
    return `The beat store holds ${data.beatCount} ${data.beatCount === 1 ? 'instrumental' : 'instrumentals'} built at the studio. You can preview and play each one on the home page in the catalog section, then book a session or reach out to secure a lease.`;
  }

  // Streaming and social.
  if (has('spotify', 'apple', 'audiomack', 'youtube', 'soundcloud', 'boomplay', 'tidal', 'deezer', 'streaming', 'platforms', 'social', 'instagram', 'facebook', 'tiktok', 'threads', 'stream my')) {
    return `Our music is on Spotify, Apple Music, YouTube, Audiomack, Amazon Music, Deezer, Boomplay, Tidal and SoundCloud. The streaming links sit on the about page, and our social handles are linked in the footer.`;
  }

  // Releases.
  if (has('release', 'releases', 'song', 'songs', 'album', 'single', 'music', 'discography', 'listen', 'stream')) {
    return `The catalogue currently holds ${data.releaseCount} releases. Recent records include ${joinList(data.releaseTitles.slice(0, 3))}. Open the releases page for the full list and the listening links.`;
  }

  // Roster.
  if (has('artist', 'artiste', 'roster', 'line up', 'who is on', 'signed', 'singers')) {
    const legacyNote = data.legacy.length > 0 ? ` Alumni on the roster include ${joinList(data.legacy)}.` : '';
    return `The current roster is ${joinList(data.roster)}.${legacyNote} Open the artists page to read each profile, their highlights and their discography.`;
  }

  // Events.
  if (has('event', 'events', 'show', 'concert', 'masterclass', 'workshop', 'upcoming', 'recap')) {
    if (data.upcomingEvents.length === 0) {
      return `There are no events on the calendar right now. Past sessions and recaps are kept on the events page, so check back for the next masterclass or live recording.`;
    }
    return `Upcoming at the studio, ${joinList(data.upcomingEvents.slice(0, 3).map(renderEvent))}. Full details and recaps of past sessions are on the events page.`;
  }

  // News.
  if (has('news', 'announcement', 'announcements', 'latest', 'update', 'blog')) {
    if (data.newsTitles.length === 0) {
      return `There are no announcements yet. When the label posts news it appears on the announcements page.`;
    }
    return `The latest news from the label is ${joinList(data.newsTitles.slice(0, 3))}. You can read the full posts on the announcements page.`;
  }

  // Portfolio and spaces.
  if (has('portfolio', 'spaces', 'room', 'rooms', 'facilities', 'gear', 'equipment')) {
    return `The portfolio lists ${data.spaces.length} ${data.spaces.length === 1 ? 'space' : 'spaces'} at the studio, including ${joinList(data.spaces.slice(0, 3))}. Open the portfolio page to see each one.`;
  }

  // Services.
  if (has('service', 'services', 'offer', 'what do you do', 'help with', 'mixing', 'mastering', 'recording', 'production', 'jingle', 'distribution', 'video', 'engineering')) {
    return `The studio offers ${joinList(data.services)}. You can read about each service on the services page, and start a project from the booking page.`;
  }

  // About the label and the founder.
  if (has('about', 'who are you', 'founder', 'story', 'history', 'label', 'samrock', 'you do', 'this site', 'website')) {
    return `${data.labelStory} ${data.aboutIntro} The founder is ${data.founderName}. The about page tells the full story.`;
  }

  // Generic fallback.
  return `I can help with the ${data.brand} website. Ask me about our services, the beat store, releases, the roster, events, booking, demos or how to contact the studio.`;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const OPENING_MESSAGE =
  'Hello. I am the Samrock assistant and I only know this website. Ask me about our services, the roster, releases, events, booking or how to submit a demo.';

export default function SamrockAssistant() {
  const isClient = useIsClient();
  const settings = useSiteSettings();
  const content = useContentSettings();
  const beats = useBeats();
  const releases = useReleases();
  const artists = useArtists();
  const events = useStudioEvents();
  const announcements = useAnnouncements();
  const spaces = usePortfolioSpaces();
  const audio = useAudioSafe();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: 'assistant', text: OPENING_MESSAGE },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  const data = useMemo<AssistantData>(() => {
    const upcoming = events
      .filter((event) => event.status === 'upcoming')
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    const prices = beats.map((beat) => beat.price).filter((price) => price > 0);

    return {
      brand: brandMark(settings.producerName),
      email: settings.email || contactInfo.email,
      whatsapp: settings.whatsappNumber,
      phones: [...contactInfo.phones],
      services: serviceDefinitions.map((service) => service.title),
      beatCount: beats.length,
      beatFloor: prices.length > 0 ? Math.min(...prices) : 0,
      releaseTitles: releases.map((release) => release.title),
      releaseCount: releases.length,
      roster: artists.filter((artist) => !artist.legacy).map((artist) => artist.name),
      legacy: artists.filter((artist) => artist.legacy).map((artist) => artist.name),
      upcomingEvents: upcoming.map((event) => ({
        title: event.title,
        date: event.date,
        location: event.location,
      })),
      newsTitles: announcements.map((announcement) => announcement.title),
      spaces: spaces.map((space) => space.title),
      labelStory: content.about.labelStory.body.join(' '),
      aboutIntro: content.about.intro,
      founderName: content.founder.name,
    };
  }, [settings, content, beats, releases, artists, events, announcements, spaces]);

  const playerActive = Boolean(audio?.currentTrack);

  // Focus the input when the panel opens and lock background scroll.
  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Keep the latest message in view.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, isOpen]);

  // Escape closes the panel.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const send = (raw: string) => {
    const question = raw.trim();
    if (!question) return;

    const reply = toPlainProse(composeReply(question, data));
    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: 'user', text: question },
      { id: nextId.current++, role: 'assistant', text: reply },
    ]);
    setInput('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    send(input);
  };

  const launcherOffset = playerActive ? 'bottom-24' : 'bottom-5';

  if (!isClient) return null;

  return createPortal(
    <>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close Samrock assistant' : 'Open Samrock assistant'}
        aria-expanded={isOpen}
        className={`fixed right-4 z-50 flex h-14 w-14 items-center justify-center rounded-xs border border-hairline bg-surface text-brand transition hover:border-brand sm:right-6 ${launcherOffset}`}
      >
        {isOpen ? <X size={22} aria-hidden="true" /> : <MessageCircle size={22} aria-hidden="true" />}
      </button>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Samrock assistant"
          className={`fixed inset-x-3 z-50 flex flex-col overflow-hidden rounded-xs border border-hairline bg-surface animate-fade-in-up sm:inset-x-auto sm:right-6 sm:w-[26rem] ${
            playerActive ? 'bottom-24' : 'bottom-5'
          }`}
          style={{ maxHeight: 'calc(100dvh - 7.5rem)' }}
        >
          <header className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-4">
            <div>
              <p className="font-display text-lg leading-none text-strong">
                {brandMark(settings.producerName)} Assistant
              </p>
              <p className="eyebrow mt-1.5 text-silver">Samrock only</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Samrock assistant"
              className="rounded-xs border border-hairline p-2 text-silver transition hover:border-brand hover:text-brand"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`max-w-[85%] rounded-xs border px-4 py-3 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'border-brand/40 bg-brand/10 text-strong'
                      : 'border-hairline bg-surface-2 text-silver'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}

            {messages.length === 1 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="eyebrow rounded-xs border border-hairline px-3 py-2 text-silver transition hover:border-brand hover:text-brand"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}

            <div ref={endRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-3 border-t border-hairline px-5 py-4">
            <label htmlFor="assistant-input" className="sr-only">
              Ask the Samrock assistant
            </label>
            <input
              id="assistant-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about Samrock..."
              autoComplete="off"
              className="field h-11 flex-1 py-0"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!input.trim()}
              className="btn btn-primary h-11 px-4 disabled:opacity-50"
            >
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
        </div>
      ) : null}
    </>,
    document.body
  );
}

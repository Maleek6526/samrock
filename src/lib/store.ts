import { useSyncExternalStore } from 'react';
import { defaultContentSettings, defaultSiteSettings, type ContentSettings, type SiteSettings } from './site';
import {
  initialAnnouncements,
  initialArtists,
  initialBeats,
  initialBookings,
  initialEvents,
  initialPlacements,
  initialPortfolioSpaces,
  initialReleases,
  initialSubscribers,
  initialVideos,
  type Announcement,
  type Artist,
  type Beat,
  type BookingRequest,
  type Placement,
  type PortfolioSpace,
  type Release,
  type StudioEvent,
  type Subscriber,
  type VideoItem,
} from '@/data/initialData';

export const STORAGE_KEYS = {
  settings: 'siteSettings',
  content: 'siteContent',
  beats: 'beats',
  placements: 'placements',
  artists: 'artists',
  releases: 'releases',
  events: 'events',
  announcements: 'announcements',
  portfolioSpaces: 'portfolioSpaces',
  videos: 'videos',
  subscribers: 'subscribers',
  bookings: 'bookings',
  password: 'adminPassword',
  theme: 'theme',
} as const;

const INTERNAL_EVENT = 'samrock:store-change';

const listeners = new Set<() => void>();
const snapshots = new Map<string, unknown>();

let bound = false;

function isBrowser() {
  return typeof window !== 'undefined';
}

function invalidate(key?: string | null) {
  if (key) snapshots.delete(key);
  else snapshots.clear();
}

/**
 * The native `storage` event only fires in *other* tabs, and writing on this
 * tab should update every subscriber immediately, so both sources are funnelled
 * through one listener set.
 */
function handleStorageEvent(event: StorageEvent) {
  invalidate(event.key);
  listeners.forEach((listener) => listener());
}

function handleInternalEvent(event: Event) {
  const detail = (event as CustomEvent<{ key?: string }>).detail;
  invalidate(detail?.key);
  listeners.forEach((listener) => listener());
}

function bindWindowListeners() {
  if (!isBrowser() || bound) return;
  bound = true;
  window.addEventListener('storage', handleStorageEvent);
  window.addEventListener(INTERNAL_EVENT, handleInternalEvent);
}

function unbindWindowListeners() {
  if (!isBrowser() || !bound) return;
  bound = false;
  window.removeEventListener('storage', handleStorageEvent);
  window.removeEventListener(INTERNAL_EVENT, handleInternalEvent);
}

function subscribe(listener: () => void) {
  bindWindowListeners();
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) unbindWindowListeners();
  };
}

function readRaw(key: string): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Merges stored values over the defaults so older records keep working. */
function readObjectSnapshot<T extends object>(key: string, fallback: T): T {
  const cached = snapshots.get(key);
  if (cached) return cached as T;

  const raw = readRaw(key);
  if (!raw) return fallback;

  let value = fallback;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      value = { ...fallback, ...(parsed as Partial<T>) };
    }
  } catch {
    value = fallback;
  }

  snapshots.set(key, value);
  return value;
}

function readArraySnapshot<T>(key: string, fallback: T[]): T[] {
  const cached = snapshots.get(key);
  if (cached) return cached as T[];

  const raw = readRaw(key);
  if (!raw) return fallback;

  let value = fallback;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) value = parsed as T[];
  } catch {
    value = fallback;
  }

  snapshots.set(key, value);
  return value;
}

function writeValue<T>(key: string, value: T) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
  window.dispatchEvent(new CustomEvent(INTERNAL_EVENT, { detail: { key } }));
}

export function readString(key: string, fallback: string) {
  return readRaw(key) ?? fallback;
}

export function writeString(key: string, value: string) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode); the UI stays usable.
  }
}

function subscribeToLocation(onStoreChange: () => void) {
  window.addEventListener('popstate', onStoreChange);
  return () => window.removeEventListener('popstate', onStoreChange);
}

/**
 * Reads a deep-link query parameter (e.g. `?artist=`, `?service=`) as an
 * external store. The server snapshot is always empty, so the markup matches
 * on hydration and the browser value streams in immediately afterwards. This
 * keeps us off `useSearchParams`, which would force a Suspense boundary under
 * Cache Components.
 */
export function useQueryParam(key: string): string {
  return useSyncExternalStore(
    subscribeToLocation,
    () => new URLSearchParams(window.location.search).get(key) ?? '',
    () => ''
  );
}

export function useSiteSettings(): SiteSettings {
  return useSyncExternalStore(
    subscribe,
    () => readObjectSnapshot(STORAGE_KEYS.settings, defaultSiteSettings),
    () => defaultSiteSettings
  );
}

export function useBeats(): Beat[] {
  return useSyncExternalStore(
    subscribe,
    () => readArraySnapshot(STORAGE_KEYS.beats, initialBeats),
    () => initialBeats
  );
}

export function usePlacements(): Placement[] {
  return useSyncExternalStore(
    subscribe,
    () => readArraySnapshot(STORAGE_KEYS.placements, initialPlacements),
    () => initialPlacements
  );
}

/**
 * The theme lives on `document.documentElement` (set by the blocking script in
 * layout.tsx) and in localStorage. Absence of the key means dark, which matches
 * the `className="dark"` default in the layout.
 */
export function useTheme(): 'light' | 'dark' {
  return useSyncExternalStore(
    subscribe,
    () => (readString(STORAGE_KEYS.theme, 'dark') === 'light' ? 'light' : 'dark'),
    () => 'dark'
  );
}

export function applyTheme(theme: 'light' | 'dark') {
  if (!isBrowser()) return;
  writeString(STORAGE_KEYS.theme, theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
  window.dispatchEvent(new CustomEvent(INTERNAL_EVENT, { detail: { key: STORAGE_KEYS.theme } }));
}

/** One-shot readers for consumers that keep their own draft copy (the admin). */
export function readSiteSettings(): SiteSettings {
  return readObjectSnapshot(STORAGE_KEYS.settings, defaultSiteSettings);
}

export function readBeats(): Beat[] {
  return readArraySnapshot(STORAGE_KEYS.beats, initialBeats);
}

export function readPlacements(): Placement[] {
  return readArraySnapshot(STORAGE_KEYS.placements, initialPlacements);
}

export function saveSiteSettings(settings: SiteSettings) {
  writeValue(STORAGE_KEYS.settings, settings);
}

export function saveBeats(beats: Beat[]) {
  writeValue(STORAGE_KEYS.beats, beats);
}

export function savePlacements(placements: Placement[]) {
  writeValue(STORAGE_KEYS.placements, placements);
}

/* -------------------------------------------------------------------------- */
/*  Editable long-form content                                                */
/* -------------------------------------------------------------------------- */

export function useContentSettings(): ContentSettings {
  return useSyncExternalStore(
    subscribe,
    () => readObjectSnapshot(STORAGE_KEYS.content, defaultContentSettings),
    () => defaultContentSettings
  );
}

export function readContentSettings(): ContentSettings {
  return readObjectSnapshot(STORAGE_KEYS.content, defaultContentSettings);
}

export function saveContentSettings(content: ContentSettings) {
  writeValue(STORAGE_KEYS.content, content);
}

/* -------------------------------------------------------------------------- */
/*  Collections                                                               */
/* -------------------------------------------------------------------------- */

function useCollection<T>(key: string, fallback: T[]): T[] {
  return useSyncExternalStore(
    subscribe,
    () => readArraySnapshot(key, fallback),
    () => fallback
  );
}

function readCollection<T>(key: string, fallback: T[]): T[] {
  return readArraySnapshot(key, fallback);
}

export function useArtists(): Artist[] {
  return useCollection(STORAGE_KEYS.artists, initialArtists);
}

export function useReleases(): Release[] {
  return useCollection(STORAGE_KEYS.releases, initialReleases);
}

export function useStudioEvents(): StudioEvent[] {
  return useCollection(STORAGE_KEYS.events, initialEvents);
}

export function useAnnouncements(): Announcement[] {
  return useCollection(STORAGE_KEYS.announcements, initialAnnouncements);
}

export function usePortfolioSpaces(): PortfolioSpace[] {
  return useCollection(STORAGE_KEYS.portfolioSpaces, initialPortfolioSpaces);
}

export function useVideos(): VideoItem[] {
  return useCollection(STORAGE_KEYS.videos, initialVideos);
}

export function useSubscribers(): Subscriber[] {
  return useCollection(STORAGE_KEYS.subscribers, initialSubscribers);
}

export function useBookings(): BookingRequest[] {
  return useCollection(STORAGE_KEYS.bookings, initialBookings);
}

export function readArtists(): Artist[] {
  return readCollection(STORAGE_KEYS.artists, initialArtists);
}

export function readReleases(): Release[] {
  return readCollection(STORAGE_KEYS.releases, initialReleases);
}

export function readStudioEvents(): StudioEvent[] {
  return readCollection(STORAGE_KEYS.events, initialEvents);
}

export function readAnnouncements(): Announcement[] {
  return readCollection(STORAGE_KEYS.announcements, initialAnnouncements);
}

export function readPortfolioSpaces(): PortfolioSpace[] {
  return readCollection(STORAGE_KEYS.portfolioSpaces, initialPortfolioSpaces);
}

export function readVideos(): VideoItem[] {
  return readCollection(STORAGE_KEYS.videos, initialVideos);
}

export function readSubscribers(): Subscriber[] {
  return readCollection(STORAGE_KEYS.subscribers, initialSubscribers);
}

export function readBookings(): BookingRequest[] {
  return readCollection(STORAGE_KEYS.bookings, initialBookings);
}

export function saveArtists(value: Artist[]) {
  writeValue(STORAGE_KEYS.artists, value);
}

export function saveReleases(value: Release[]) {
  writeValue(STORAGE_KEYS.releases, value);
}

export function saveStudioEvents(value: StudioEvent[]) {
  writeValue(STORAGE_KEYS.events, value);
}

export function saveAnnouncements(value: Announcement[]) {
  writeValue(STORAGE_KEYS.announcements, value);
}

export function savePortfolioSpaces(value: PortfolioSpace[]) {
  writeValue(STORAGE_KEYS.portfolioSpaces, value);
}

export function saveVideos(value: VideoItem[]) {
  writeValue(STORAGE_KEYS.videos, value);
}

export function saveSubscribers(value: Subscriber[]) {
  writeValue(STORAGE_KEYS.subscribers, value);
}

export function saveBookings(value: BookingRequest[]) {
  writeValue(STORAGE_KEYS.bookings, value);
}

/* -------------------------------------------------------------------------- */
/*  Record helpers                                                            */
/* -------------------------------------------------------------------------- */

/** Generates a short unique id for client-created records. */
export function createId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Adds a newsletter subscriber, ignoring duplicates. Returns true when added. */
export function addSubscriber(email: string): boolean {
  const normalised = email.trim().toLowerCase();
  if (!normalised || !normalised.includes('@')) return false;

  const current = readSubscribers();
  if (current.some((item) => item.email.toLowerCase() === normalised)) return false;

  writeValue(STORAGE_KEYS.subscribers, [
    ...current,
    { id: createId('sub'), email: normalised, date: new Date().toISOString() },
  ]);
  return true;
}

/** Records a booking request submitted from the public booking form. */
export function addBooking(request: Omit<BookingRequest, 'id' | 'createdAt'>): BookingRequest {
  const entry: BookingRequest = { ...request, id: createId('bk'), createdAt: new Date().toISOString() };
  writeValue(STORAGE_KEYS.bookings, [entry, ...readBookings()]);
  return entry;
}

/** Builds a downloadable JSON snapshot of every stored collection. */
export function buildExportPayload() {
  return {
    exportedAt: new Date().toISOString(),
    settings: readSiteSettings(),
    content: readContentSettings(),
    beats: readBeats(),
    placements: readPlacements(),
    artists: readArtists(),
    releases: readReleases(),
    events: readStudioEvents(),
    announcements: readAnnouncements(),
    portfolioSpaces: readPortfolioSpaces(),
    videos: readVideos(),
    subscribers: readSubscribers(),
    bookings: readBookings(),
  };
}

/** Triggers a browser download for a text payload. */
export function downloadFile(filename: string, contents: string, mime = 'application/json') {
  if (!isBrowser()) return;
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/** Serialises records to CSV. */
export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const escape = (value: unknown) => {
    const text = value == null ? '' : Array.isArray(value) ? value.join('; ') : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [headers.join(','), ...rows.map((row) => headers.map((header) => escape(row[header])).join(','))].join('\n');
}

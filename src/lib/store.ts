import { useSyncExternalStore } from 'react';
import { defaultSiteSettings, type SiteSettings } from './site';
import { initialBeats, initialPlacements, type Beat, type Placement } from '@/data/initialData';

export const STORAGE_KEYS = {
  settings: 'siteSettings',
  beats: 'beats',
  placements: 'placements',
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

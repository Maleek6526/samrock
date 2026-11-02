'use client';

import React, { useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  Disc,
  Eye,
  EyeOff,
  Lock,
  Music,
  Plus,
  Save,
  Settings,
  Shield,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Beat, Placement } from '@/data/initialData';
import { type SiteSettings } from '@/lib/site';
import {
  STORAGE_KEYS,
  readBeats,
  readPlacements,
  readSiteSettings,
  readString,
  saveBeats,
  savePlacements,
  saveSiteSettings,
  writeString,
} from '@/lib/store';

/** Prototype-only default. The live value is persisted in localStorage. */
const DEFAULT_ADMIN_PASSWORD = 'samrock123';

const GENRES = ['Afrobeats', 'Reggae', 'Woro', 'Trap', 'Highlife'] as const;

const TABS = [
  { id: 'general', label: 'Profile Settings', Icon: Settings },
  { id: 'beats', label: 'Beat Store', Icon: Music },
  { id: 'placements', label: 'Placements', Icon: Disc },
] as const;

type TabId = (typeof TABS)[number]['id'];

/**
 * Numeric fields are edited as text so an empty input stays empty instead of
 * collapsing to `NaN` (which used to render as "₦NaN" across the site).
 */
type BeatDraft = Omit<Beat, 'bpm' | 'price'> & { bpm: number | ''; price: number | '' };

const panelClass = 'border border-hairline bg-surface p-6 sm:p-8';
const fieldClass =
  'w-full rounded-xs border border-hairline bg-surface-2 px-3.5 py-3 text-sm text-strong transition placeholder:text-silver focus:border-brand focus:outline-none';
const labelClass = 'eyebrow block text-silver';
const primaryButton = 'btn btn-primary';
const ghostButton = 'btn btn-ghost';
const dangerButton = 'btn border border-danger/40 text-danger hover:border-danger hover:bg-danger/10';

function numberFromInput(raw: string): number | '' {
  if (raw.trim() === '') return '';
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : '';
}

function toStoredBeats(drafts: BeatDraft[]): Beat[] {
  return drafts.map((draft) => ({
    ...draft,
    bpm: typeof draft.bpm === 'number' ? draft.bpm : 0,
    price: typeof draft.price === 'number' ? draft.price : 0,
  }));
}

function SaveState({ dirty }: { dirty: boolean }) {
  return (
    <span className="eyebrow" role="status" aria-live="polite">
      {dirty ? (
        <span className="text-brand">Unsaved changes</span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-silver">
          <CheckCircle size={13} aria-hidden="true" /> Saved
        </span>
      )}
    </span>
  );
}

const emptySubscribe = () => () => {};

/** The dashboard seeds its draft from localStorage, so it must mount client-side only. */
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function AdminPage() {
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm font-medium text-silver" role="status">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState(() =>
    readString(STORAGE_KEYS.password, DEFAULT_ADMIN_PASSWORD)
  );
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [recovery, setRecovery] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<TabId>('general');

  // Drafts. Nothing is written to localStorage until the matching Save button is pressed.
  const [settings, setSettings] = useState<SiteSettings>(readSiteSettings);
  const [savedSettings, setSavedSettings] = useState<SiteSettings>(readSiteSettings);
  const [beats, setBeats] = useState<BeatDraft[]>(readBeats);
  const [savedBeats, setSavedBeats] = useState<Beat[]>(readBeats);
  const [placements, setPlacements] = useState<Placement[]>(readPlacements);
  const [savedPlacements, setSavedPlacements] = useState<Placement[]>(readPlacements);

  const settingsDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [settings, savedSettings]
  );
  const beatsDirty = useMemo(
    () => JSON.stringify(toStoredBeats(beats)) !== JSON.stringify(savedBeats),
    [beats, savedBeats]
  );
  const placementsDirty = useMemo(
    () => JSON.stringify(placements) !== JSON.stringify(savedPlacements),
    [placements, savedPlacements]
  );

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (password === storedPassword) {
      setIsAuthenticated(true);
      setLoginError(false);
      setPassword('');
    } else {
      setLoginError(true);
    }
  };

  const handleForgotPassword = async () => {
    if (recovery === 'sending') return;
    setRecovery('sending');

    try {
      // Recovery is emailed only, to the studio's own inbox. The WhatsApp channel
      // is skipped so the credential never lands in a chat thread.
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Admin Recovery',
          artistName: 'Admin Security',
          email: settings.email,
          phone: settings.whatsappNumber,
          service: 'Password Recovery',
          budget: 'N/A',
          channel: 'email',
          message: `A password recovery was requested from the admin dashboard.\n\nCurrent admin password: ${storedPassword}\n\nIf this was not you, open the dashboard and change the password immediately.`,
        }),
      });

      const data = await response.json().catch(() => null);
      setRecovery(response.ok && data?.success ? 'sent' : 'error');
    } catch (error) {
      console.error(error);
      setRecovery('error');
    }

    window.setTimeout(() => setRecovery('idle'), 6000);
  };

  const handleSaveSettings = (event: React.FormEvent) => {
    event.preventDefault();
    saveSiteSettings(settings);
    setSavedSettings(settings);
    toast.success('Profile settings saved.');
  };

  const handleChangePassword = (event: React.FormEvent) => {
    event.preventDefault();
    const next = newPassword.trim();
    if (next.length < 6) {
      toast.error('Use at least 6 characters for the admin password.');
      return;
    }
    writeString(STORAGE_KEYS.password, next);
    setStoredPassword(next);
    setNewPassword('');
    toast.success('Admin password updated.');
  };

  const handleSaveBeats = () => {
    if (beats.some((beat) => beat.bpm === '' || beat.price === '')) {
      toast.error('Set a BPM and a price for every beat before saving.');
      return;
    }
    const stored = toStoredBeats(beats);
    saveBeats(stored);
    setSavedBeats(stored);
    toast.success('Beat store saved.');
  };

  const handleSavePlacements = () => {
    savePlacements(placements);
    setSavedPlacements(placements);
    toast.success('Placements saved.');
  };

  const addBeat = () => {
    setBeats((current) => [
      ...current,
      {
        id: `beat-${Date.now()}`,
        title: 'New Beat',
        artist: 'Samrock',
        genre: 'Afrobeats',
        bpm: 100,
        key: 'Cmaj',
        price: 25000,
        audioUrl: '',
        coverArt: '',
      },
    ]);
    toast.info('New beat added. Save the inventory to publish it.');
  };

  const updateBeat = (id: string, patch: Partial<BeatDraft>) => {
    setBeats((current) => current.map((beat) => (beat.id === id ? { ...beat, ...patch } : beat)));
  };

  const removeBeat = (id: string) => {
    setBeats((current) => current.filter((beat) => beat.id !== id));
  };

  const confirmRemoveBeat = (id: string) => {
    const beat = beats.find((item) => item.id === id);
    toast.warning(`Remove "${beat?.title || 'this beat'}" from the inventory?`, {
      action: { label: 'Remove', onClick: () => removeBeat(id) },
    });
  };

  const addPlacement = () => {
    setPlacements((current) => [
      ...current,
      {
        id: `placement-${Date.now()}`,
        title: 'New Release',
        artist: 'Unknown Artist',
        role: 'Producer',
        year: String(new Date().getFullYear()),
        coverArt: '',
        link: '',
        audioUrl: '',
      },
    ]);
    toast.info('New placement added. Save the records to publish it.');
  };

  const updatePlacement = (id: string, patch: Partial<Placement>) => {
    setPlacements((current) =>
      current.map((placement) => (placement.id === id ? { ...placement, ...patch } : placement))
    );
  };

  const removePlacement = (id: string) => {
    setPlacements((current) => current.filter((placement) => placement.id !== id));
  };

  const confirmRemovePlacement = (id: string) => {
    const placement = placements.find((item) => item.id === id);
    toast.warning(`Remove "${placement?.title || 'this placement'}" from the records?`, {
      action: { label: 'Remove', onClick: () => removePlacement(id) },
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-md border border-hairline bg-surface p-6 sm:p-8">
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xs border border-hairline text-brand">
              <Lock size={20} aria-hidden="true" />
            </div>
            <h1 className="font-display text-2xl tracking-tight text-strong">Admin Login</h1>
            <p className="text-xs leading-relaxed text-silver">
              Enter your secure password to manage the Samrock portfolio.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div className="space-y-2.5">
              <label htmlFor="admin-password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter admin password..."
                  aria-invalid={loginError}
                  className={`${fieldClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-xs p-1.5 text-silver transition hover:text-brand"
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
            </div>

            {loginError && (
              <p role="alert" className="text-xs font-medium text-danger">
                Incorrect password. Please try again.
              </p>
            )}

            <button type="submit" className={`${primaryButton} w-full`}>
              Login to Dashboard
            </button>
          </form>

          <div className="mt-6 space-y-4 border-t border-hairline pt-5 text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={recovery === 'sending'}
              className="eyebrow text-brand transition hover:text-strong disabled:opacity-50"
            >
              {recovery === 'idle' && 'Forgotten your password?'}
              {recovery === 'sending' && 'Sending recovery email...'}
              {recovery === 'sent' && 'Recovery email sent to the studio inbox'}
              {recovery === 'error' && 'Could not send. Check your connection.'}
            </button>
            <div>
              <Link
                href="/"
                className="eyebrow inline-flex items-center gap-2 text-silver transition hover:text-strong"
              >
                <ArrowLeft size={13} aria-hidden="true" /> Back to portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 sm:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col items-center justify-between gap-6 border-b border-hairline pb-8 sm:flex-row">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-xs border border-hairline text-brand">
              <Shield size={22} aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-display text-2xl tracking-tight text-strong sm:text-3xl">
                Admin Dashboard
              </h1>
              <p className="eyebrow mt-2 text-brand">Portfolio Manager</p>
            </div>
          </div>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Link href="/" className={`${ghostButton} flex-1 sm:flex-none text-xs`}>
              View Site
            </Link>
            <button
              type="button"
              onClick={() => setIsAuthenticated(false)}
              className={`${dangerButton} flex-1 sm:flex-none text-xs`}
            >
              Logout
            </button>
          </div>
        </header>

        <div
          role="tablist"
          aria-label="Dashboard sections"
          className="flex gap-4 overflow-x-auto border-b border-hairline pb-px sm:gap-8"
        >
          {TABS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                id={`tab-${id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${id}`}
                onClick={() => setActiveTab(id)}
                className={`eyebrow flex items-center gap-2 whitespace-nowrap border-b-2 px-2 pb-4 transition-colors ${
                  isActive
                    ? 'border-brand text-brand'
                    : 'border-transparent text-silver hover:text-strong'
                }`}
              >
                <Icon size={15} aria-hidden="true" /> {label}
              </button>
            );
          })}
        </div>

        <div
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="animate-fade-in"
        >
          {activeTab === 'general' && (
            <div className="space-y-8">
              <form onSubmit={handleSaveSettings} className={`${panelClass} space-y-8`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
                  <h2 className="font-display text-xl text-strong">General Profile</h2>
                  <SaveState dirty={settingsDirty} />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 sm:gap-8">
                  <div className="space-y-2">
                    <label htmlFor="setting-brand" className={labelClass}>
                      Brand Name
                    </label>
                    <input
                      id="setting-brand"
                      type="text"
                      value={settings.producerName}
                      onChange={(event) =>
                        setSettings({ ...settings, producerName: event.target.value })
                      }
                      className={fieldClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="setting-whatsapp" className={labelClass}>
                      WhatsApp Contact
                    </label>
                    <input
                      id="setting-whatsapp"
                      type="tel"
                      value={settings.whatsappNumber}
                      onChange={(event) =>
                        setSettings({ ...settings, whatsappNumber: event.target.value })
                      }
                      className={fieldClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="setting-email" className={labelClass}>
                      Notification Email
                    </label>
                    <input
                      id="setting-email"
                      type="email"
                      value={settings.email}
                      onChange={(event) => setSettings({ ...settings, email: event.target.value })}
                      className={fieldClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="setting-status" className={labelClass}>
                      Status Banner
                    </label>
                    <input
                      id="setting-status"
                      type="text"
                      value={settings.statusBadge}
                      onChange={(event) =>
                        setSettings({ ...settings, statusBadge: event.target.value })
                      }
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={!settingsDirty} className={primaryButton}>
                    <Save size={18} aria-hidden="true" /> Save Profile Changes
                  </button>
                </div>
              </form>

              <form onSubmit={handleChangePassword} className={`${panelClass} space-y-6`}>
                <h2 className="border-b border-hairline pb-4 font-display text-xl text-strong">
                  Security &amp; Access
                </h2>
                <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-2 sm:gap-8">
                  <div className="space-y-2">
                    <label htmlFor="admin-new-password" className={labelClass}>
                      New Admin Password
                    </label>
                    <div className="relative">
                      <input
                        id="admin-new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="At least 6 characters..."
                        className={`${fieldClass} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((value) => !value)}
                        aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                        aria-pressed={showNewPassword}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-xs p-1.5 text-silver transition hover:text-brand"
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} aria-hidden="true" />
                        ) : (
                          <Eye size={18} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className={ghostButton}>
                    <Lock size={18} aria-hidden="true" /> Update Password
                  </button>
                </div>
                <p className="text-xs italic text-silver">
                  Changes take effect immediately. Recovery sends the current password to the studio
                  email address above.
                </p>
              </form>

              <section className={`${panelClass} space-y-6`}>
                <h2 className="border-b border-hairline pb-4 font-display text-xl text-strong">
                  Marketing Assets
                </h2>
                <div className="flex flex-col items-center justify-between gap-5 border border-hairline bg-surface-2 p-6 sm:flex-row">
                  <div className="text-center sm:text-left">
                    <h3 className="text-sm font-medium text-strong">Official Studio Flyer</h3>
                    <p className="mt-1.5 text-xs text-silver">High-resolution promotional material.</p>
                  </div>
                  <a
                    href="/flyer.jpg"
                    target="_blank"
                    rel="noreferrer"
                    className={`${ghostButton} w-full text-xs sm:w-auto`}
                  >
                    <Eye size={18} aria-hidden="true" /> View Asset
                  </a>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'beats' && (
            <div className="space-y-8">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <h2 className="font-display text-2xl tracking-tight text-strong">
                  Beat Store Inventory
                </h2>
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <SaveState dirty={beatsDirty} />
                  <button type="button" onClick={addBeat} className={`${ghostButton} w-full text-xs sm:w-auto`}>
                    <Plus size={18} aria-hidden="true" /> Add New Track
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBeats}
                    disabled={!beatsDirty}
                    className={`${primaryButton} w-full sm:w-auto`}
                  >
                    <Save size={18} aria-hidden="true" /> Save Inventory
                  </button>
                </div>
              </div>

              {beats.length === 0 ? (
                <p className="border border-dashed border-hairline bg-surface-2 p-12 text-center text-sm text-silver">
                  No beats yet. Add your first track to build the store.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                  {beats.map((beat) => (
                    <div key={beat.id} className={`${panelClass} space-y-8`}>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 sm:gap-8">
                        <div className="space-y-2">
                          <label htmlFor={`beat-title-${beat.id}`} className={labelClass}>
                            Track Title
                          </label>
                          <input
                            id={`beat-title-${beat.id}`}
                            type="text"
                            value={beat.title}
                            onChange={(event) => updateBeat(beat.id, { title: event.target.value })}
                            className={fieldClass}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor={`beat-genre-${beat.id}`} className={labelClass}>
                            Genre
                          </label>
                          <select
                            id={`beat-genre-${beat.id}`}
                            value={beat.genre}
                            onChange={(event) => updateBeat(beat.id, { genre: event.target.value })}
                            className={fieldClass}
                          >
                            {GENRES.map((genre) => (
                              <option key={genre} value={genre}>
                                {genre}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor={`beat-price-${beat.id}`} className={labelClass}>
                            Price (₦)
                          </label>
                          <input
                            id={`beat-price-${beat.id}`}
                            type="number"
                            min={0}
                            inputMode="numeric"
                            value={beat.price}
                            onChange={(event) =>
                              updateBeat(beat.id, { price: numberFromInput(event.target.value) })
                            }
                            className={fieldClass}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 sm:gap-8">
                        <div className="space-y-2">
                          <label htmlFor={`beat-audio-${beat.id}`} className={labelClass}>
                            Audio File URL
                          </label>
                          <input
                            id={`beat-audio-${beat.id}`}
                            type="url"
                            value={beat.audioUrl ?? ''}
                            onChange={(event) =>
                              updateBeat(beat.id, { audioUrl: event.target.value })
                            }
                            placeholder="Direct link to mp3..."
                            className={fieldClass}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor={`beat-cover-${beat.id}`} className={labelClass}>
                            Cover Image URL
                          </label>
                          <input
                            id={`beat-cover-${beat.id}`}
                            type="url"
                            value={beat.coverArt}
                            onChange={(event) => updateBeat(beat.id, { coverArt: event.target.value })}
                            placeholder="Link to artwork..."
                            className={fieldClass}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-between gap-6 border-t border-hairline pt-6 sm:flex-row">
                        <div className="flex w-full justify-center gap-8 sm:w-auto sm:justify-start">
                          <div className="flex flex-col gap-1">
                            <label
                              htmlFor={`beat-bpm-${beat.id}`}
                              className="eyebrow text-silver"
                            >
                              BPM
                            </label>
                            <input
                              id={`beat-bpm-${beat.id}`}
                              type="number"
                              min={1}
                              inputMode="numeric"
                              value={beat.bpm}
                              onChange={(event) =>
                                updateBeat(beat.id, { bpm: numberFromInput(event.target.value) })
                              }
                              className="w-20 rounded-xs border border-hairline bg-surface-3 px-2 py-2 text-center text-sm font-medium text-strong focus:border-brand focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label
                              htmlFor={`beat-key-${beat.id}`}
                              className="eyebrow text-silver"
                            >
                              Musical Key
                            </label>
                            <input
                              id={`beat-key-${beat.id}`}
                              type="text"
                              value={beat.key}
                              onChange={(event) => updateBeat(beat.id, { key: event.target.value })}
                              className="w-24 rounded-xs border border-hairline bg-surface-3 px-2 py-2 text-center text-sm font-medium text-strong focus:border-brand focus:outline-none"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => confirmRemoveBeat(beat.id)}
                          className={`${dangerButton} w-full text-xs sm:w-auto`}
                        >
                          <Trash2 size={16} aria-hidden="true" /> Remove Track
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'placements' && (
            <div className="space-y-8">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <h2 className="font-display text-2xl tracking-tight text-strong">
                  Placement Records
                </h2>
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <SaveState dirty={placementsDirty} />
                  <button
                    type="button"
                    onClick={addPlacement}
                    className={`${ghostButton} w-full text-xs sm:w-auto`}
                  >
                    <Plus size={18} aria-hidden="true" /> New Entry
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePlacements}
                    disabled={!placementsDirty}
                    className={`${primaryButton} w-full sm:w-auto`}
                  >
                    <Save size={18} aria-hidden="true" /> Save Records
                  </button>
                </div>
              </div>

              {placements.length === 0 ? (
                <p className="border border-dashed border-hairline bg-surface-2 p-12 text-center text-sm text-silver">
                  No placements yet. Add your first release credit.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                  {placements.map((item) => (
                    <div key={item.id} className={`${panelClass} space-y-8`}>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 sm:gap-8">
                        <div className="space-y-2">
                          <label htmlFor={`placement-title-${item.id}`} className={labelClass}>
                            Song Title
                          </label>
                          <input
                            id={`placement-title-${item.id}`}
                            type="text"
                            value={item.title}
                            onChange={(event) =>
                              updatePlacement(item.id, { title: event.target.value })
                            }
                            className={fieldClass}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor={`placement-artist-${item.id}`} className={labelClass}>
                            Artist
                          </label>
                          <input
                            id={`placement-artist-${item.id}`}
                            type="text"
                            value={item.artist}
                            onChange={(event) =>
                              updatePlacement(item.id, { artist: event.target.value })
                            }
                            className={fieldClass}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor={`placement-year-${item.id}`} className={labelClass}>
                            Release Year
                          </label>
                          <input
                            id={`placement-year-${item.id}`}
                            type="text"
                            value={item.year}
                            onChange={(event) => updatePlacement(item.id, { year: event.target.value })}
                            className={fieldClass}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 sm:gap-8">
                        <div className="space-y-2">
                          <label htmlFor={`placement-link-${item.id}`} className={labelClass}>
                            Stream URL
                          </label>
                          <input
                            id={`placement-link-${item.id}`}
                            type="url"
                            value={item.link}
                            onChange={(event) => updatePlacement(item.id, { link: event.target.value })}
                            placeholder="Spotify / Apple Music / Audiomack link..."
                            className={fieldClass}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor={`placement-cover-${item.id}`} className={labelClass}>
                            Cover URL
                          </label>
                          <input
                            id={`placement-cover-${item.id}`}
                            type="url"
                            value={item.coverArt}
                            onChange={(event) =>
                              updatePlacement(item.id, { coverArt: event.target.value })
                            }
                            placeholder="Artwork link..."
                            className={fieldClass}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-2 sm:gap-8">
                        <div className="space-y-2">
                          <label htmlFor={`placement-audio-${item.id}`} className={labelClass}>
                            Audio File URL (Optional)
                          </label>
                          <input
                            id={`placement-audio-${item.id}`}
                            type="url"
                            value={item.audioUrl ?? ''}
                            onChange={(event) =>
                              updatePlacement(item.id, { audioUrl: event.target.value })
                            }
                            placeholder="Direct link to mp3..."
                            className={fieldClass}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor={`placement-role-${item.id}`} className={labelClass}>
                            Samrock&apos;s Role
                          </label>
                          <input
                            id={`placement-role-${item.id}`}
                            type="text"
                            value={item.role}
                            onChange={(event) => updatePlacement(item.id, { role: event.target.value })}
                            placeholder="e.g. Producer &amp; Mixing"
                            className={fieldClass}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-6 border-t border-hairline pt-6 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={() => confirmRemovePlacement(item.id)}
                          className={`${dangerButton} w-full text-xs sm:w-auto`}
                        >
                          <Trash2 size={16} aria-hidden="true" /> Remove Entry
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

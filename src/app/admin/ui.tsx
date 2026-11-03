'use client';

import React, { useSyncExternalStore } from 'react';
import { CheckCircle } from 'lucide-react';

/** Shared class names so every dashboard panel matches the Editorial Noir system. */
export const panelClass = 'border border-hairline bg-surface p-6 sm:p-8';
export const fieldClass =
  'w-full rounded-xs border border-hairline bg-surface-2 px-3.5 py-3 text-sm text-strong transition placeholder:text-silver focus:border-brand focus:outline-none';
export const labelClass = 'eyebrow block text-silver';
export const primaryButton = 'btn btn-primary';
export const ghostButton = 'btn btn-ghost';
export const dangerButton =
  'btn border border-danger/40 text-danger hover:border-danger hover:bg-danger/10';

/** Numeric fields are edited as text so an empty input stays empty instead of collapsing to NaN. */
export function numberFromInput(raw: string): number | '' {
  if (raw.trim() === '') return '';
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : '';
}

export function SaveState({ dirty }: { dirty: boolean }) {
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

/** The dashboard seeds its drafts from localStorage, so it must mount client-side only. */
export function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

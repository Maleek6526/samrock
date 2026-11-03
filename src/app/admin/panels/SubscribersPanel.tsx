'use client';

import React, { useState } from 'react';
import { Download, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  dangerButton,
  fieldClass,
  ghostButton,
  labelClass,
  panelClass,
  primaryButton,
} from '@/app/admin/ui';
import { createId, downloadFile, readSubscribers, saveSubscribers, toCsv } from '@/lib/store';
import { formatDate } from '@/lib/site';
import type { Subscriber } from '@/data/initialData';

/** Mailing list captured from the footer newsletter form. */
export default function SubscribersPanel() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(readSubscribers);
  const [email, setEmail] = useState('');

  const persist = (next: Subscriber[]) => {
    setSubscribers(next);
    saveSubscribers(next);
  };

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    const normalised = email.trim().toLowerCase();
    if (!normalised.includes('@')) {
      toast.error('Enter a valid email address.');
      return;
    }
    if (subscribers.some((item) => item.email === normalised)) {
      toast.info('That email is already on the list.');
      return;
    }
    persist([{ id: createId('sub'), email: normalised, date: new Date().toISOString() }, ...subscribers]);
    setEmail('');
    toast.success('Subscriber added.');
  };

  const remove = (id: string) => {
    persist(subscribers.filter((item) => item.id !== id));
    toast.success('Subscriber removed.');
  };

  const exportCsv = () => {
    if (subscribers.length === 0) {
      toast.info('No subscribers to export yet.');
      return;
    }
    downloadFile(
      'samrock-subscribers.csv',
      toCsv(subscribers as unknown as Record<string, unknown>[]),
      'text/csv'
    );
    toast.success('Subscribers exported.');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h2 className="font-display text-2xl tracking-tight text-strong">Newsletter Subscribers</h2>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <span className="eyebrow text-silver">{subscribers.length} total</span>
          <button type="button" onClick={exportCsv} className={`${ghostButton} w-full text-xs sm:w-auto`}>
            <Download size={16} aria-hidden="true" /> Export CSV
          </button>
        </div>
      </div>

      <form onSubmit={handleAdd} className={`${panelClass} space-y-4`}>
        <div className="space-y-2">
          <label htmlFor="admin-subscriber-email" className={labelClass}>
            Add a subscriber manually
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="admin-subscriber-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              className={`${fieldClass} sm:flex-1`}
            />
            <button type="submit" className={`${primaryButton} shrink-0`}>
              <Plus size={16} aria-hidden="true" /> Add
            </button>
          </div>
        </div>
      </form>

      {subscribers.length === 0 ? (
        <p className="border border-dashed border-hairline bg-surface-2 p-12 text-center text-sm text-silver">
          No subscribers yet. Sign-ups from the footer form appear here.
        </p>
      ) : (
        <ul className="border-t border-hairline">
          {subscribers.map((subscriber) => (
            <li
              key={subscriber.id}
              className="flex flex-col gap-3 border-b border-hairline py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-sm text-strong">{subscriber.email}</span>
              <div className="flex items-center gap-5">
                <span className="eyebrow text-silver">{formatDate(subscriber.date)}</span>
                <button
                  type="button"
                  onClick={() => remove(subscriber.id)}
                  aria-label={`Remove ${subscriber.email}`}
                  className={`${dangerButton} text-xs`}
                >
                  <Trash2 size={14} aria-hidden="true" /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

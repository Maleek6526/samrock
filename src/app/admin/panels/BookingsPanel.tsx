'use client';

import React, { useState } from 'react';
import { Download, Mail, MessageCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { dangerButton, ghostButton } from '@/app/admin/ui';
import { downloadFile, readBookings, saveBookings, toCsv } from '@/lib/store';
import { formatDate } from '@/lib/site';
import type { BookingRequest } from '@/data/initialData';

const FIELDS: { key: keyof BookingRequest; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'organization', label: 'Organisation' },
  { key: 'artist', label: 'Artiste' },
  { key: 'category', label: 'Category' },
  { key: 'service', label: 'Service line' },
  { key: 'duration', label: 'Duration' },
  { key: 'preferredDate', label: 'Preferred date' },
  { key: 'reason', label: 'Reason' },
  { key: 'details', label: 'Details' },
];

/** Booking requests captured from the public booking form. */
export default function BookingsPanel() {
  const [bookings, setBookings] = useState<BookingRequest[]>(readBookings);

  const remove = (id: string) => {
    const next = bookings.filter((item) => item.id !== id);
    setBookings(next);
    saveBookings(next);
    toast.success('Booking request removed.');
  };

  const exportCsv = () => {
    if (bookings.length === 0) {
      toast.info('No bookings to export yet.');
      return;
    }
    downloadFile(
      'samrock-bookings.csv',
      toCsv(bookings as unknown as Record<string, unknown>[]),
      'text/csv'
    );
    toast.success('Bookings exported.');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h2 className="font-display text-2xl tracking-tight text-strong">Booking Requests</h2>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <span className="eyebrow text-silver">{bookings.length} total</span>
          <button type="button" onClick={exportCsv} className={`${ghostButton} w-full text-xs sm:w-auto`}>
            <Download size={16} aria-hidden="true" /> Export CSV
          </button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <p className="border border-dashed border-hairline bg-surface-2 p-12 text-center text-sm text-silver">
          No booking requests yet. Submissions from the booking form appear here.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {bookings.map((booking) => (
            <div key={booking.id} className="border border-hairline bg-surface p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-hairline pb-4">
                <div>
                  <h3 className="font-display text-xl text-strong">{booking.name}</h3>
                  <span className="eyebrow mt-1 block text-silver">
                    {formatDate(booking.createdAt)} &middot; {booking.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${booking.email}`}
                    aria-label={`Email ${booking.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xs border border-hairline text-silver transition hover:border-brand hover:text-brand"
                  >
                    <Mail size={16} aria-hidden="true" />
                  </a>
                  <a
                    href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${booking.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xs border border-hairline text-silver transition hover:border-brand hover:text-brand"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <dl className="mt-6 border-t border-hairline">
                {FIELDS.map((field) => (
                  <div
                    key={field.key}
                    className="flex flex-col gap-1 border-b border-hairline py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <dt className="eyebrow shrink-0 text-silver">{field.label}</dt>
                    <dd className="text-sm text-strong sm:text-right">
                      {booking[field.key] || '—'}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={() => remove(booking.id)}
                  className={`${dangerButton} w-full text-xs sm:w-auto`}
                >
                  <Trash2 size={16} aria-hidden="true" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

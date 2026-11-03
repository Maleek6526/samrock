'use client';

import React, { useMemo, useState } from 'react';
import { CheckCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { addBooking, useArtists, useQueryParam } from '@/lib/store';
import {
  bookingCategories,
  bookingDurations,
  bookingServiceLines,
  contactInfo,
} from '@/lib/site';

const labelClass = 'eyebrow block text-silver';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  artist: '',
  category: bookingCategories[0] as string,
  service: bookingServiceLines[0] as string,
  duration: bookingDurations[1] as string,
  preferredDate: '',
  reason: '',
  details: '',
};

type BookingFormState = typeof emptyForm;

/**
 * The full booking request form. Supports deep links from artist profiles and
 * service cards via `?artist=`, `?service=`, `?category=` and `?line=`.
 */
export default function BookingForm() {
  const roster = useArtists();
  const artistNames = useMemo(() => roster.map((artist) => artist.name), [roster]);

  // Deep-link pre-fill. The values come from the URL, so the server renders an
  // empty form and the browser fills it in after hydration. Anything the
  // visitor edits is layered on top via `edits`.
  const linkedArtist = useQueryParam('artist');
  const linkedCategory = useQueryParam('category');
  const linkedLine = useQueryParam('line');
  const linkedService = useQueryParam('service');
  const linkedServiceLine = linkedLine || linkedService;

  const [edits, setEdits] = useState<Partial<BookingFormState>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const form: BookingFormState = {
    ...emptyForm,
    ...(artistNames.includes(linkedArtist) ? { artist: linkedArtist } : {}),
    ...((bookingCategories as readonly string[]).includes(linkedCategory)
      ? { category: linkedCategory }
      : {}),
    ...((bookingServiceLines as readonly string[]).includes(linkedServiceLine)
      ? { service: linkedServiceLine }
      : {}),
    ...edits,
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setEdits((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');

    const composedService = `${form.category} — ${form.service}`;
    const message = [
      `Booking category: ${form.category}`,
      `Service line: ${form.service}`,
      `Expected duration: ${form.duration}`,
      `Preferred date: ${form.preferredDate || 'Flexible'}`,
      `Organisation: ${form.organization || 'N/A'}`,
      `Artiste: ${form.artist || 'Not specified'}`,
      '',
      `Reason for request: ${form.reason || 'N/A'}`,
      '',
      `Additional details: ${form.details || 'N/A'}`,
    ].join('\n');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          artistName: form.artist,
          service: composedService,
          budget: form.duration,
          message,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        addBooking({
          name: form.name,
          email: form.email,
          phone: form.phone,
          organization: form.organization,
          artist: form.artist,
          category: form.category,
          service: form.service,
          duration: form.duration,
          preferredDate: form.preferredDate,
          reason: form.reason,
          details: form.details,
        });
        setStatus('success');
        toast.success('Booking request sent.');
        setEdits({});
      } else {
        setStatus('error');
        toast.error(data?.error || 'Could not send your booking request.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      toast.error('Could not send your booking request.');
    }
  };

  if (status === 'success') {
    return (
      <div className="border border-hairline bg-surface-2 px-6 py-16 text-center" role="status">
        <CheckCircle size={28} className="mx-auto text-success" aria-hidden="true" />
        <h3 className="mt-6 font-display text-title text-strong">Booking request sent</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-silver">
          Your request has been dispatched to the studio. We will confirm availability and next
          steps shortly.
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="btn btn-ghost mt-8">
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <label htmlFor="booking-name" className={labelClass}>
            Full name *
          </label>
          <input
            id="booking-name"
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Maleek Adewale"
            className="field"
          />
        </div>

        <div className="space-y-2.5">
          <label htmlFor="booking-email" className={labelClass}>
            Email address *
          </label>
          <input
            id="booking-email"
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="name@example.com"
            className="field"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <label htmlFor="booking-phone" className={labelClass}>
            Phone number *
          </label>
          <input
            id="booking-phone"
            type="tel"
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder={contactInfo.phones[0]}
            className="field"
          />
        </div>

        <div className="space-y-2.5">
          <label htmlFor="booking-org" className={labelClass}>
            Organization
          </label>
          <input
            id="booking-org"
            type="text"
            name="organization"
            value={form.organization}
            onChange={handleChange}
            placeholder="Church, label or company"
            className="field"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <label htmlFor="booking-artist" className={labelClass}>
            Select artiste
          </label>
          <select
            id="booking-artist"
            name="artist"
            value={form.artist}
            onChange={handleChange}
            className="field"
          >
            <option value="">Choose an artiste</option>
            {artistNames.map((artist) => (
              <option key={artist} value={artist}>
                {artist}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2.5">
          <label htmlFor="booking-category" className={labelClass}>
            Booking category
          </label>
          <select
            id="booking-category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="field"
          >
            {bookingCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <label htmlFor="booking-service" className={labelClass}>
            Service line
          </label>
          <select
            id="booking-service"
            name="service"
            value={form.service}
            onChange={handleChange}
            className="field"
          >
            {bookingServiceLines.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2.5">
          <label htmlFor="booking-duration" className={labelClass}>
            Expected duration
          </label>
          <select
            id="booking-duration"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="field"
          >
            {bookingDurations.map((duration) => (
              <option key={duration} value={duration}>
                {duration}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2.5">
        <label htmlFor="booking-date" className={labelClass}>
          Preferred date
        </label>
        <input
          id="booking-date"
          type="date"
          name="preferredDate"
          value={form.preferredDate}
          onChange={handleChange}
          className="field"
        />
      </div>

      <div className="space-y-2.5">
        <label htmlFor="booking-reason" className={labelClass}>
          Reason for request
        </label>
        <input
          id="booking-reason"
          type="text"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="Reason for this service"
          className="field"
        />
      </div>

      <div className="space-y-2.5">
        <label htmlFor="booking-details" className={labelClass}>
          Additional details
        </label>
        <textarea
          id="booking-details"
          name="details"
          rows={4}
          value={form.details}
          onChange={handleChange}
          placeholder="Describe your project, service needs and any specific notes"
          className="field resize-none"
        />
      </div>

      <p aria-live="polite" className="text-xs font-medium text-danger">
        {status === 'error'
          ? 'Failed to send your request. Please try again or reach us on WhatsApp directly.'
          : ''}
      </p>

      <button type="submit" disabled={status === 'loading'} className="btn btn-primary w-full">
        {status === 'loading' ? (
          <span>Sending request...</span>
        ) : (
          <>
            <Send size={16} aria-hidden="true" /> Request booking
          </>
        )}
      </button>
    </form>
  );
}

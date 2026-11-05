'use client';

import React, { useState } from 'react';
import { CheckCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { demoGenres } from '@/lib/site';
import { addDemo } from '@/lib/store';

const labelClass = 'eyebrow block text-silver';

const emptyForm = {
  stageName: '',
  email: '',
  phone: '',
  genre: demoGenres[0] as string,
  location: '',
  links: '',
  message: '',
  rights: false,
};

type DemoFormState = typeof emptyForm;

/**
 * The A&R demo submission form. Submissions are recorded locally and dispatched
 * to the label inbox so the team can follow up on the strongest records.
 */
export default function DemoForm() {
  const [form, setForm] = useState<DemoFormState>(emptyForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = event.target;
    const value =
      target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value;
    setForm((current) => ({ ...current, [target.name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.rights) {
      toast.error('Confirm you own the rights to the material you are submitting.');
      return;
    }

    setStatus('loading');

    const message = [
      `Stage name: ${form.stageName}`,
      `Genre: ${form.genre}`,
      `Location: ${form.location || 'Not specified'}`,
      '',
      `Demo links: ${form.links || 'None provided'}`,
      '',
      `About the artiste: ${form.message || 'N/A'}`,
    ].join('\n');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.stageName,
          email: form.email,
          phone: form.phone,
          artistName: form.stageName,
          service: 'Artiste Demo Submission (A&R)',
          budget: form.genre,
          channel: 'email',
          message,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        addDemo({
          stageName: form.stageName,
          email: form.email,
          phone: form.phone,
          genre: form.genre,
          location: form.location,
          links: form.links,
          message: form.message,
        });
        setStatus('success');
        setForm(emptyForm);
        toast.success('Demo submitted to the A&R desk.');
      } else {
        setStatus('error');
        toast.error(data?.error || 'Could not submit your demo.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      toast.error('Could not submit your demo.');
    }
  };

  if (status === 'success') {
    return (
      <div className="border border-hairline bg-surface-2 px-6 py-16 text-center" role="status">
        <CheckCircle size={28} className="mx-auto text-success" aria-hidden="true" />
        <h3 className="mt-6 font-display text-title text-strong">Demo received</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-silver">
          Thank you for sharing your music. The A&amp;R desk reviews every submission and will reach
          out if the record is a fit for the label.
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="btn btn-ghost mt-8">
          Submit another demo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <label htmlFor="demo-stage-name" className={labelClass}>
            Stage name *
          </label>
          <input
            id="demo-stage-name"
            type="text"
            name="stageName"
            required
            value={form.stageName}
            onChange={handleChange}
            placeholder="How you are credited"
            className="field"
          />
        </div>

        <div className="space-y-2.5">
          <label htmlFor="demo-genre" className={labelClass}>
            Genre
          </label>
          <select
            id="demo-genre"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="field"
          >
            {demoGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <label htmlFor="demo-email" className={labelClass}>
            Email address *
          </label>
          <input
            id="demo-email"
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="name@example.com"
            className="field"
          />
        </div>

        <div className="space-y-2.5">
          <label htmlFor="demo-phone" className={labelClass}>
            Phone number *
          </label>
          <input
            id="demo-phone"
            type="tel"
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder="e.g. 07048306524"
            className="field"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <label htmlFor="demo-location" className={labelClass}>
            Based in
          </label>
          <input
            id="demo-location"
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="City, country"
            className="field"
          />
        </div>

        <div className="space-y-2.5">
          <label htmlFor="demo-links" className={labelClass}>
            Demo links
          </label>
          <input
            id="demo-links"
            type="text"
            name="links"
            value={form.links}
            onChange={handleChange}
            placeholder="Streaming, Dropbox or Drive links"
            className="field"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <label htmlFor="demo-message" className={labelClass}>
          Tell us about the record
        </label>
        <textarea
          id="demo-message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder="Your story, the songs you are pitching and where you want to take the project"
          className="field resize-none"
        />
      </div>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-silver">
        <input
          type="checkbox"
          name="rights"
          checked={form.rights}
          onChange={handleChange}
          className="mt-0.5 h-4 w-4 shrink-0 rounded-xs border border-hairline bg-surface-2 accent-brand"
        />
        I confirm I own or control the rights to the material I am submitting and that the links are
        safe to open.
      </label>

      <p aria-live="polite" className="text-xs font-medium text-danger">
        {status === 'error'
          ? 'Failed to submit your demo. Please try again or reach us on WhatsApp directly.'
          : ''}
      </p>

      <button type="submit" disabled={status === 'loading'} className="btn btn-primary w-full">
        {status === 'loading' ? (
          <span>Submitting demo...</span>
        ) : (
          <>
            <Send size={16} aria-hidden="true" /> Submit demo
          </>
        )}
      </button>
    </form>
  );
}

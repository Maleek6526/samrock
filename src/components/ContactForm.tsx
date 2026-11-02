'use client';

import React, { useState } from 'react';
import { CheckCircle, Mail, Phone, Send } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { contactInfo, serviceOptions } from '@/lib/site';

const initialForm = {
  name: '',
  artistName: '',
  email: '',
  phone: '',
  service: serviceOptions[0],
  budget: '',
  message: '',
};

const fieldClass =
  'w-full rounded-xl border border-hairline bg-surface-3 px-4 py-3 text-sm text-strong transition placeholder:text-silver focus:border-brand focus:outline-none';
const labelClass = 'text-xs font-semibold text-silver';

export default function ContactForm() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setStatus('success');
        setFormData(initialForm);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="relative border-t border-hairline bg-surface px-4 py-24">
      <div className="mx-auto max-w-4xl space-y-12">
        <SectionHeading
          eyebrow="Get In Touch"
          title={
            <>
              Book a <span className="text-gradient">Session</span>
            </>
          }
          description="Ready to record your next hit or secure a beat? Send an inquiry and it will reach Sam's Gmail and WhatsApp instantly."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex items-start gap-4 rounded-xl border border-hairline bg-surface-2 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Phone size={20} aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-silver">Call / WhatsApp</p>
              {contactInfo.phones.map((phone) => (
                <p key={phone} className="font-bold text-strong">
                  {phone}
                </p>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-hairline bg-surface-2 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Mail size={20} aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-silver">Email Us</p>
              <p className="break-all text-sm font-bold text-strong sm:text-base">{contactInfo.email}</p>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl border border-hairline bg-surface-2 p-8 shadow-2xl">
          {status === 'success' ? (
            <div className="space-y-4 py-12 text-center" role="status">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-green-500/40 bg-green-500/20 text-green-500">
                <CheckCircle size={32} aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-strong">Inquiry Sent Successfully!</h3>
              <p className="mx-auto max-w-md text-sm text-silver">
                Thank you! Your message has been dispatched to Sam&apos;s Gmail and WhatsApp
                simultaneously. He will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-4 rounded-xl border border-hairline bg-surface-3 px-6 py-2.5 text-xs font-semibold text-brand transition hover:border-brand"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className={labelClass}>
                    Your Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Maleek Adewale"
                    className={fieldClass}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-artist" className={labelClass}>
                    Artist / Stage Name
                  </label>
                  <input
                    id="contact-artist"
                    type="text"
                    name="artistName"
                    value={formData.artistName}
                    onChange={handleChange}
                    placeholder="e.g. Samrock"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="contact-email" className={labelClass}>
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={fieldClass}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-phone" className={labelClass}>
                    WhatsApp Phone Number *
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={contactInfo.phones[1]}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="contact-service" className={labelClass}>
                    Service Required *
                  </label>
                  <select
                    id="contact-service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={fieldClass}
                  >
                    {serviceOptions.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-budget" className={labelClass}>
                    Estimated Budget (Optional)
                  </label>
                  <input
                    id="contact-budget"
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g. ₦50,000"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className={labelClass}>
                  Project Details / Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your track, BPM, reference songs, or session date..."
                  className={`${fieldClass} resize-none`}
                />
              </div>

              <p aria-live="polite" className="text-xs font-semibold text-red-500">
                {status === 'error'
                  ? 'Failed to send message. Please try again or message via WhatsApp directly.'
                  : ''}
              </p>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-solid to-brand-strong py-4 text-base font-bold text-brand-contrast shadow-xl shadow-brand/20 transition hover:opacity-95 disabled:opacity-60"
              >
                {status === 'loading' ? (
                  <span>Sending to Gmail &amp; WhatsApp...</span>
                ) : (
                  <>
                    <Send size={18} aria-hidden="true" /> Send Inquiry Now
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

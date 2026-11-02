'use client';

import React, { useState } from 'react';
import { CheckCircle, Send } from 'lucide-react';
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

const labelClass = 'eyebrow block text-silver';

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
    <section id="contact" className="relative border-t border-hairline bg-surface px-6 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="05"
          eyebrow="Get in touch"
          title={
            <>
              Book a <em className="text-brand">session</em>
            </>
          }
          description="Ready to record your next hit or secure a beat? Send an inquiry and it reaches Sam's Gmail and WhatsApp instantly."
        />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <dl className="border-t border-hairline lg:col-span-4">
            <div className="border-b border-hairline py-6">
              <dt className="eyebrow text-silver">Call / WhatsApp</dt>
              {contactInfo.phones.map((phone) => (
                <dd key={phone} className="mt-3 text-sm font-medium tabular-nums text-strong">
                  {phone}
                </dd>
              ))}
            </div>
            <div className="border-b border-hairline py-6">
              <dt className="eyebrow text-silver">Email</dt>
              <dd className="mt-3 break-all text-sm font-medium text-strong">{contactInfo.email}</dd>
            </div>
            <div className="border-b border-hairline py-6">
              <dt className="eyebrow text-silver">Response time</dt>
              <dd className="mt-3 text-sm font-medium text-strong">Within 24 hours</dd>
            </div>
          </dl>

          <div className="lg:col-span-8">
            {status === 'success' ? (
              <div className="border border-hairline bg-surface-2 px-6 py-16 text-center" role="status">
                <CheckCircle size={28} className="mx-auto text-success" aria-hidden="true" />
                <h3 className="mt-6 font-display text-title text-strong">Inquiry sent</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-silver">
                  Your message has been dispatched to Sam&apos;s Gmail and WhatsApp simultaneously.
                  He will get back to you shortly.
                </p>
                <button type="button" onClick={() => setStatus('idle')} className="btn btn-ghost mt-8">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2.5">
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
                      className="field"
                    />
                  </div>

                  <div className="space-y-2.5">
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
                      className="field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2.5">
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
                      className="field"
                    />
                  </div>

                  <div className="space-y-2.5">
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
                      className="field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2.5">
                    <label htmlFor="contact-service" className={labelClass}>
                      Service Required *
                    </label>
                    <select
                      id="contact-service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="field"
                    >
                      {serviceOptions.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2.5">
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
                      className="field"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
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
                    className="field resize-none"
                  />
                </div>

                <p aria-live="polite" className="text-xs font-medium text-danger">
                  {status === 'error'
                    ? 'Failed to send message. Please try again or message via WhatsApp directly.'
                    : ''}
                </p>

                <button type="submit" disabled={status === 'loading'} className="btn btn-primary w-full">
                  {status === 'loading' ? (
                    <span>Sending to Gmail &amp; WhatsApp...</span>
                  ) : (
                    <>
                      <Send size={16} aria-hidden="true" /> Send inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

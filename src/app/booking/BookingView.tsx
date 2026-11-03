'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, MessageCircle, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import BookingForm from '@/components/BookingForm';
import { bookingCategories, bookingServiceLines, contactInfo } from '@/lib/site';

const categoryBlurbs: Record<string, string> = {
  'Studio Session': 'Treated room time for tracking, overdubs and full production sessions.',
  'Mixing & Mastering': 'Balanced, widened and mastered to a competitive loudness.',
  'Beat Purchase': 'Exclusive or leased instrumentals, delivered ready to record.',
  'Consultation': 'Guidance on sound, references and a realistic release plan.',
  'Media Partnership': 'Brand campaigns, jingles and audio partnerships.',
  'Custom Project': 'A tailor-made scope for anything outside the standard lines.',
};

const steps = [
  {
    title: 'Send the request',
    description: 'Share your project, references and a target date through the form.',
  },
  {
    title: 'Confirm the plan',
    description: 'We reply with availability, a scope and the session details.',
  },
  {
    title: 'Create the record',
    description: 'The session is booked and the studio gets to work.',
  },
];

/** Public booking page: shortcut cards, the full booking form and studio contact. */
export default function BookingView() {
  return (
    <>
      <Navbar />
      <PageShell>
        <PageHeader
          index="09"
          eyebrow="Booking"
          title={
            <>
              Book the <em className="text-brand">studio</em>.
            </>
          }
          description="Studio sessions, mixing, mastering, production and custom projects. Choose a category to start, or send a full request below."
        />

        <section className="mt-20">
          <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Booking categories</span>
            <span className="eyebrow text-brand">Start here</span>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {bookingCategories.map((category) => (
              <div key={category} className="border-t border-hairline pt-5">
                <h2 className="font-display text-title text-strong">{category}</h2>
                <p className="mt-3 text-sm leading-relaxed text-silver">
                  {categoryBlurbs[category] ?? 'A tailored session built around your project.'}
                </p>
                <Link
                  href={`/booking?category=${encodeURIComponent(category)}`}
                  className="link-underline eyebrow mt-5 inline-flex items-center gap-2 text-brand"
                >
                  Open form
                  <ArrowRight size={12} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Service lines</span>
            <span className="eyebrow text-brand">What we take on</span>
          </div>

          <ul className="mt-8 flex flex-wrap gap-3">
            {bookingServiceLines.map((line) => (
              <li key={line}>
                <Link
                  href={`/booking?line=${encodeURIComponent(line)}`}
                  className="eyebrow inline-flex items-center gap-2 rounded-xs border border-hairline px-4 py-2 text-silver transition hover:border-brand hover:text-brand"
                >
                  {line}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20">
          <div className="border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Booking request</span>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="card p-6 sm:p-8">
                <BookingForm />
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="border-t border-hairline pt-5">
                <span className="eyebrow text-silver">Studio contact</span>
              </div>

              <ul className="mt-6 border-t border-hairline">
                <li className="border-b border-hairline py-4">
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="group flex items-center gap-3 text-sm text-silver transition hover:text-brand"
                  >
                    <Mail size={16} aria-hidden="true" />
                    <span className="text-strong transition group-hover:text-brand">
                      {contactInfo.email}
                    </span>
                  </a>
                </li>
                {contactInfo.phones.map((phone) => (
                  <li key={phone} className="border-b border-hairline py-4">
                    <a
                      href={`tel:${phone}`}
                      className="group flex items-center gap-3 text-sm text-silver transition hover:text-brand"
                    >
                      <Phone size={16} aria-hidden="true" />
                      <span className="tabular-nums text-strong transition group-hover:text-brand">
                        {phone}
                      </span>
                    </a>
                  </li>
                ))}
                <li className="border-b border-hairline py-4">
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-sm text-silver transition hover:text-brand"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    <span className="text-strong transition group-hover:text-brand">
                      Message on WhatsApp
                    </span>
                  </a>
                </li>
              </ul>

              <div className="mt-12 border-t border-hairline pt-5">
                <span className="eyebrow text-silver">How it works</span>
              </div>

              <ol className="mt-6 grid gap-px border border-hairline bg-hairline">
                {steps.map((step, index) => (
                  <li key={step.title} className="bg-surface p-6">
                    <span className="eyebrow text-brand">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="mt-3 font-display text-title text-strong">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-silver">{step.description}</p>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>
      </PageShell>
      <Footer />
    </>
  );
}

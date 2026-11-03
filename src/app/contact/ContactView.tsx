'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import NewsletterForm from '@/components/NewsletterForm';
import { useContentSettings } from '@/lib/store';
import { contactInfo, socialLinks } from '@/lib/site';

const chipClass =
  'eyebrow inline-flex items-center rounded-xs border border-hairline px-4 py-2.5 text-silver transition hover:border-brand hover:text-brand';

export default function ContactView() {
  const { contact } = useContentSettings();

  return (
    <>
      <Navbar />
      <PageShell>
        <PageHeader
          index="04"
          eyebrow="Contact"
          title={
            <>
              Let&apos;s build something <em className="text-brand">powerful</em> together.
            </>
          }
          description="Speak to the studio about a production, a session or a partnership. We reply within 24 hours."
        />

        <div className="mt-12 grid grid-cols-1 gap-px border border-hairline bg-hairline md:grid-cols-3">
          <div className="bg-surface p-6 sm:p-8">
            <p className="eyebrow text-silver">Office</p>
            <a
              href={contact.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 block"
            >
              <span className="font-display text-title text-strong transition group-hover:text-brand">
                {contact.officeLabel}
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-silver">
                {contact.officeAddress}
              </span>
            </a>
          </div>

          <div className="bg-surface p-6 sm:p-8">
            <p className="eyebrow text-silver">Email</p>
            <a
              href={`mailto:${contactInfo.email}`}
              className="link-underline mt-4 inline-block break-all text-lede font-medium text-strong"
            >
              {contactInfo.email}
            </a>
          </div>

          <div className="bg-surface p-6 sm:p-8">
            <p className="eyebrow text-silver">Phone</p>
            <ul className="mt-4 space-y-3">
              {contactInfo.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone}`}
                    className="text-lede font-medium tabular-nums text-strong transition hover:text-brand"
                  >
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="mt-16 border-t border-hairline pt-12">
          <h2 className="eyebrow text-silver">Business hours</h2>
          <dl className="mt-6 border-t border-hairline">
            {contact.businessHours.map((row) => (
              <div
                key={row.day}
                className="flex items-center justify-between gap-6 border-b border-hairline py-4"
              >
                <dt className="text-sm font-medium text-strong">{row.day}</dt>
                <dd className="text-sm tabular-nums text-silver">{row.hours}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-16 border-t border-hairline pt-12">
          <h2 className="eyebrow text-silver">Follow us</h2>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={chipClass}
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 border-t border-hairline pt-12">
          <div className="grid gap-8 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <h2 className="font-display text-title text-strong">Join the mailing list</h2>
              <p className="mt-3 text-sm leading-relaxed text-silver">
                New beats, releases and studio announcements, sent straight to your inbox.
              </p>
            </div>
            <div className="md:col-span-7">
              <NewsletterForm />
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-hairline pt-12">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-title text-strong">Prefer to book directly?</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-silver">
                Send a booking request and the studio will confirm your session.
              </p>
            </div>
            <Link href="/booking" className="btn btn-primary shrink-0">
              Book a session
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </PageShell>
      <Footer />
    </>
  );
}

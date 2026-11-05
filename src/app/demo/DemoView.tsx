'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import DemoForm from '@/components/DemoForm';
import { contactInfo, demoGenres } from '@/lib/site';

const checklist = [
  {
    title: 'Finished records',
    description:
      'Send two to three of your strongest songs, mixed enough to hear the idea. Rough takes are fine if the writing is there.',
  },
  {
    title: 'A clear identity',
    description:
      'We listen for a voice and a point of view. Tell us who you are and the audience your music is made for.',
  },
  {
    title: 'Room to grow',
    description:
      'We are building a roster, so we look for artistes we can develop across records rather than a single moment.',
  },
];

const steps = [
  {
    title: 'Submit your demo',
    description: 'Share your links and a short note through the form on this page.',
  },
  {
    title: 'A&R review',
    description: 'The label listens to every submission and shortlists the records that fit the roster.',
  },
  {
    title: 'We reach out',
    description: 'If it is a match, we follow up to talk development, production and release.',
  },
];

/** Public A&R page where artistes submit demos to the label. */
export default function DemoView() {
  return (
    <>
      <Navbar />
      <PageShell>
        <PageHeader
          index="01"
          eyebrow={'A&R'}
          title={
            <>
              Send us your <em className="text-brand">demo</em>.
            </>
          }
          description="Samrock Music Productions is always listening. If you are an artiste or songwriter with records you believe in, the A&R desk wants to hear them."
        />

        <section className="mt-20">
          <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
            <span className="eyebrow text-silver">What we listen for</span>
            <span className="eyebrow text-brand">The brief</span>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {checklist.map((item) => (
              <div key={item.title} className="border-t border-hairline pt-5">
                <h2 className="font-display text-title text-strong">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-silver">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Genres we work in</span>
            <span className="eyebrow text-brand">Sound</span>
          </div>

          <ul className="mt-8 flex flex-wrap gap-3">
            {demoGenres.map((genre) => (
              <li
                key={genre}
                className="eyebrow rounded-xs border border-hairline px-4 py-2 text-silver"
              >
                {genre}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20">
          <div className="border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Demo submission</span>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="card p-6 sm:p-8">
                <DemoForm />
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="border-t border-hairline pt-5">
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

              <div className="mt-12 border-t border-hairline pt-5">
                <span className="eyebrow text-silver">Prefer to talk first?</span>
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
                <li className="border-b border-hairline py-4">
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-sm text-silver transition hover:text-brand"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    <span className="text-strong transition group-hover:text-brand">
                      Message the label on WhatsApp
                    </span>
                  </a>
                </li>
              </ul>

              <Link
                href="/artists"
                className="link-underline eyebrow mt-8 inline-flex items-center gap-2 text-brand"
              >
                Meet the current roster <ArrowRight size={12} aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </section>
      </PageShell>
      <Footer />
    </>
  );
}

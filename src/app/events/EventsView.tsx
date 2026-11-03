'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import { useStudioEvents } from '@/lib/store';
import { formatDate } from '@/lib/site';

export default function EventsView() {
  const events = useStudioEvents();

  const upcoming = events
    .filter((event) => event.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const past = events
    .filter((event) => event.status === 'ended')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <Navbar />
      <PageShell>
        <PageHeader
          index="07"
          eyebrow="Events"
          title={
            <>
              Studio <em className="text-brand">events</em>.
            </>
          }
          description="Masterclasses, live recording sessions and open studio days hosted by Samrock Music Productions. Register for what is next, or browse a recap of what has already happened."
        />

        <section className="mt-20">
          <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Upcoming</span>
            <span className="eyebrow text-brand">
              {upcoming.length} {upcoming.length === 1 ? 'event' : 'events'}
            </span>
          </div>

          {upcoming.length > 0 ? (
            <ul className="mt-10 border-t border-hairline">
              {upcoming.map((event) => (
                <li key={event.id} className="border-b border-hairline">
                  <div className="flex flex-col gap-5 py-8 md:flex-row md:items-baseline md:justify-between md:gap-10">
                    <div className="md:flex-1">
                      <span className="eyebrow text-silver">{formatDate(event.date)}</span>
                      <Link
                        href={`/events/${event.id}`}
                        className="mt-3 block font-display text-title text-strong transition hover:text-brand"
                      >
                        {event.title}
                      </Link>
                      <p className="mt-3 text-sm text-silver">
                        {event.location} &middot; {event.ticketPrice}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {event.registerUrl ? (
                        <a
                          href={event.registerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-ghost"
                        >
                          Register
                        </a>
                      ) : (
                        <Link href="/booking" className="btn btn-primary">
                          Register
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 border border-dashed border-hairline bg-surface-2 p-12 text-center text-sm text-silver">
              No upcoming events are scheduled right now. Check back soon or start a session from the
              booking page.
            </div>
          )}
        </section>

        <section className="mt-20">
          <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Past events</span>
            <span className="eyebrow text-brand">Recaps</span>
          </div>

          {past.length > 0 ? (
            <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <article key={event.id} className="flex flex-col">
                  <div className="media-tone relative aspect-4/3 overflow-hidden rounded-xs border border-hairline bg-surface-2">
                    {event.gallery[0] ? (
                      <Image
                        src={event.gallery[0]}
                        alt={`${event.title} recap`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-silver">
                        <CalendarDays size={28} aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  <h3 className="mt-5 font-display text-title text-strong">{event.title}</h3>
                  <p className="mt-2 text-sm text-silver">{formatDate(event.date)}</p>
                  <Link
                    href={`/events/${event.id}`}
                    className="link-underline eyebrow mt-5 inline-flex items-center gap-2 self-start text-brand"
                  >
                    View recap
                    <ArrowRight size={12} aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-10 border border-dashed border-hairline bg-surface-2 p-12 text-center text-sm text-silver">
              Past events will appear here once a recap gallery has been published.
            </div>
          )}
        </section>
      </PageShell>
      <Footer />
    </>
  );
}

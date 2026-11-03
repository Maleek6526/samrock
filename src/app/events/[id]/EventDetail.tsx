'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import ShareLink from '@/components/ShareLink';
import { useStudioEvents } from '@/lib/store';
import { formatDate } from '@/lib/site';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const events = useStudioEvents();
  const event = events.find((item) => item.id === id);

  if (!event) {
    return (
      <>
        <Navbar />
        <PageShell>
          <PageHeader
            index="—"
            eyebrow="Event"
            title="Event not found"
            description="This event is not on the schedule. Browse upcoming sessions and past recaps instead."
          />
          <div className="mt-10">
            <Link href="/events" className="link-underline eyebrow text-brand">
              Back to events
            </Link>
          </div>
        </PageShell>
        <Footer />
      </>
    );
  }

  const isUpcoming = event.status === 'upcoming';
  const statusLabel = isUpcoming ? 'Upcoming' : 'Recap';

  const moreEvents = events.filter((item) => item.id !== event.id).slice(0, 3);

  return (
    <>
      <Navbar />
      <PageShell>
        <div className="flex items-baseline gap-4 border-t border-hairline pt-5">
          <span className="eyebrow text-brand">Event</span>
          <Link href="/events" className="eyebrow link-underline text-silver">
            Back to events
          </Link>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex items-baseline gap-4">
              <span className="eyebrow text-brand">{statusLabel}</span>
              <span className="eyebrow text-silver">{formatDate(event.date)}</span>
            </div>

            <h1 className="mt-6 font-display text-display text-strong">{event.title}</h1>
            <p className="mt-6 max-w-2xl text-lede text-silver">{event.description}</p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              {isUpcoming ? (
                event.registerUrl ? (
                  <a
                    href={event.registerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Register
                  </a>
                ) : (
                  <Link href="/booking" className="btn btn-primary">
                    Register
                  </Link>
                )
              ) : null}
              <ShareLink url={`/events/${id}`} title={event.title} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <dl className="border-t border-hairline">
              <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-4">
                <dt className="eyebrow text-silver">Location</dt>
                <dd className="text-sm text-strong">{event.location}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-4">
                <dt className="eyebrow text-silver">Ticket</dt>
                <dd className="text-sm text-strong">{event.ticketPrice}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-4">
                <dt className="eyebrow text-silver">Date</dt>
                <dd className="text-sm text-strong">{formatDate(event.date)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {!isUpcoming && event.gallery.length > 0 ? (
          <section className="mt-20">
            <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
              <span className="eyebrow text-silver">Event gallery</span>
              <span className="eyebrow text-brand">Recap</span>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {event.gallery.map((image, index) => (
                <div
                  key={`${event.id}-${index}`}
                  className="media-tone relative aspect-4/3 overflow-hidden rounded-xs border border-hairline bg-surface-2"
                >
                  <Image
                    src={image}
                    alt={`${event.title} gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-20">
          <div className="border-t border-hairline pt-5">
            <span className="eyebrow text-silver">Quick facts</span>
          </div>

          <dl className="mt-10 border-t border-hairline">
            <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-4">
              <dt className="eyebrow text-silver">Date</dt>
              <dd className="text-sm text-strong">{formatDate(event.date)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-4">
              <dt className="eyebrow text-silver">Location</dt>
              <dd className="text-sm text-strong">{event.location}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-4">
              <dt className="eyebrow text-silver">Ticket</dt>
              <dd className="text-sm text-strong">{event.ticketPrice}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-4">
              <dt className="eyebrow text-silver">Status</dt>
              <dd className="text-sm text-strong">{statusLabel}</dd>
            </div>
          </dl>
        </section>

        {moreEvents.length > 0 ? (
          <section className="mt-20">
            <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
              <span className="eyebrow text-silver">More events</span>
              <Link href="/events" className="link-underline eyebrow text-brand">
                View all
              </Link>
            </div>

            <ul className="mt-8 border-t border-hairline">
              {moreEvents.map((item) => (
                <li key={item.id} className="border-b border-hairline">
                  <Link
                    href={`/events/${item.id}`}
                    className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                  >
                    <span className="font-display text-title text-strong transition group-hover:text-brand">
                      {item.title}
                    </span>
                    <span className="eyebrow text-silver">{formatDate(item.date)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-20 border-t border-hairline pt-10">
          <Link
            href="/events"
            className="link-underline eyebrow inline-flex items-center gap-2 text-brand"
          >
            Back to events
            <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </div>
      </PageShell>
      <Footer />
    </>
  );
}

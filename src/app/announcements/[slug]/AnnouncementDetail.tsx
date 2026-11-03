'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import ShareLink from '@/components/ShareLink';
import { useAnnouncements } from '@/lib/store';
import { formatDate } from '@/lib/site';

export default function AnnouncementDetail() {
  const { slug } = useParams<{ slug: string }>();
  const announcements = useAnnouncements();
  const announcement = announcements.find((item) => item.slug === slug);

  if (!announcement) {
    return (
      <>
        <Navbar />
        <PageShell>
          <PageHeader
            index="—"
            eyebrow="Announcement"
            title="Announcement not found"
            description="This story is not in the newsroom. Browse the latest announcements instead."
          />
          <div className="mt-10">
            <Link href="/announcements" className="link-underline eyebrow text-brand">
              Back to announcements
            </Link>
          </div>
        </PageShell>
        <Footer />
      </>
    );
  }

  const sameCategory = announcements.filter(
    (item) => item.slug !== announcement.slug && item.category === announcement.category
  );
  const others = announcements.filter((item) => item.slug !== announcement.slug);
  const moreAnnouncements = (sameCategory.length > 0 ? sameCategory : others).slice(0, 3);

  return (
    <>
      <Navbar />
      <PageShell>
        <div className="flex items-baseline gap-4 border-t border-hairline pt-5">
          <span className="eyebrow text-brand">Announcement</span>
          <Link href="/announcements" className="eyebrow link-underline text-silver">
            Back to announcements
          </Link>
        </div>

        <article className="mt-10">
          <div className="flex items-baseline gap-4">
            <span className="eyebrow text-brand">{announcement.category}</span>
            <span className="eyebrow text-silver">{formatDate(announcement.date)}</span>
          </div>

          <h1 className="mt-6 font-display text-display text-strong">{announcement.title}</h1>

          <p className="mt-8 max-w-2xl whitespace-pre-line text-lede text-silver">
            {announcement.body}
          </p>

          <div className="mt-10">
            <ShareLink url={`/announcements/${slug}`} title={announcement.title} />
          </div>
        </article>

        {moreAnnouncements.length > 0 ? (
          <section className="mt-20">
            <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
              <span className="eyebrow text-silver">More announcements</span>
              <Link href="/announcements" className="link-underline eyebrow text-brand">
                View all
              </Link>
            </div>

            <ul className="mt-8 border-t border-hairline">
              {moreAnnouncements.map((item) => (
                <li key={item.id} className="border-b border-hairline">
                  <Link
                    href={`/announcements/${item.slug}`}
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
            href="/announcements"
            className="link-underline eyebrow inline-flex items-center gap-2 text-brand"
          >
            Back to announcements
            <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </div>
      </PageShell>
      <Footer />
    </>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import { useAnnouncements } from '@/lib/store';
import { formatDate } from '@/lib/site';

/** Trims the body to a short, single-paragraph excerpt. */
function excerpt(body: string, limit = 150) {
  const text = body.trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trimEnd()}…`;
}

export default function AnnouncementsView() {
  const announcements = useAnnouncements();
  const [category, setCategory] = useState('All');

  const sorted = [...announcements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const categories = ['All', ...Array.from(new Set(sorted.map((item) => item.category)))];

  const filtered =
    category === 'All' ? sorted : sorted.filter((item) => item.category === category);

  return (
    <>
      <Navbar />
      <PageShell>
        <PageHeader
          index="08"
          eyebrow="Newsroom"
          title={
            <>
              Studio <em className="text-brand">announcements</em>.
            </>
          }
          description="News, releases and updates from inside Samrock Music Productions, gathered in one place."
        />

        <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-hairline pt-5">
          {categories.map((item) => {
            const isActive = category === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={isActive}
                className={`eyebrow rounded-xs border px-4 py-2 transition ${
                  isActive
                    ? 'border-brand text-brand'
                    : 'border-hairline text-silver hover:text-strong'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <section className="mt-12">
          {filtered.length > 0 ? (
            <ul className="border-t border-hairline">
              {filtered.map((item) => (
                <li key={item.id} className="border-b border-hairline">
                  <div className="flex flex-col gap-3 py-8 md:flex-row md:items-baseline md:gap-10">
                    <div className="flex shrink-0 items-baseline gap-4 md:w-48 md:flex-col md:gap-2">
                      <span className="eyebrow text-brand">{item.category}</span>
                      <span className="eyebrow text-silver">{formatDate(item.date)}</span>
                    </div>

                    <div className="md:flex-1">
                      <Link
                        href={`/announcements/${item.slug}`}
                        className="block font-display text-title text-strong transition hover:text-brand"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-silver">
                        {excerpt(item.body)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="border border-dashed border-hairline bg-surface-2 p-12 text-center text-sm text-silver">
              No announcements in this category yet. Choose another category to keep reading.
            </div>
          )}
        </section>
      </PageShell>
      <Footer />
    </>
  );
}

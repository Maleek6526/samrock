'use client';

import React from 'react';
import { Database, Download } from 'lucide-react';
import { toast } from 'sonner';
import { ghostButton, panelClass, primaryButton } from '@/app/admin/ui';
import {
  buildExportPayload,
  downloadFile,
  readAnnouncements,
  readArtists,
  readBeats,
  readBookings,
  readPlacements,
  readPortfolioSpaces,
  readReleases,
  readStudioEvents,
  readSubscribers,
  readVideos,
  toCsv,
} from '@/lib/store';

const collections: { label: string; read: () => { id: string }[] }[] = [
  { label: 'Beats', read: readBeats },
  { label: 'Placements', read: readPlacements },
  { label: 'Artists', read: readArtists },
  { label: 'Releases', read: readReleases },
  { label: 'Events', read: readStudioEvents },
  { label: 'Announcements', read: readAnnouncements },
  { label: 'Portfolio Spaces', read: readPortfolioSpaces },
  { label: 'Videos', read: readVideos },
  { label: 'Subscribers', read: readSubscribers },
  { label: 'Bookings', read: readBookings },
];

/** Backup and reporting exports for every collection in the portfolio. */
export default function DataPanel() {
  const exportJson = () => {
    downloadFile('samrock-site-export.json', JSON.stringify(buildExportPayload(), null, 2));
    toast.success('Full site export downloaded.');
  };

  const exportCsv = (label: string) => {
    const records = collections.find((item) => item.label === label)?.read() ?? [];
    if (records.length === 0) {
      toast.info(`No ${label.toLowerCase()} to export yet.`);
      return;
    }
    downloadFile(
      `samrock-${label.toLowerCase().replace(/\s+/g, '-')}.csv`,
      toCsv(records as unknown as Record<string, unknown>[]),
      'text/csv'
    );
    toast.success(`${label} exported.`);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-hairline pb-8">
        <h2 className="font-display text-2xl tracking-tight text-strong">Data &amp; Exports</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-silver">
          Download a full JSON snapshot of the site, or export any single collection as a CSV for
          reporting and backups.
        </p>
      </div>

      <section className={`${panelClass} space-y-5`}>
        <div className="flex items-center gap-3">
          <Database size={18} className="text-brand" aria-hidden="true" />
          <h3 className="font-display text-xl text-strong">Full backup</h3>
        </div>
        <p className="text-sm leading-relaxed text-silver">
          Every setting, content block and collection in one JSON file.
        </p>
        <button type="button" onClick={exportJson} className={primaryButton}>
          <Download size={18} aria-hidden="true" /> Export all data (JSON)
        </button>
      </section>

      <section className={`${panelClass} space-y-6`}>
        <h3 className="border-b border-hairline pb-4 font-display text-xl text-strong">
          Collection exports
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => exportCsv(item.label)}
              className={`${ghostButton} justify-between text-xs`}
            >
              {item.label}
              <Download size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

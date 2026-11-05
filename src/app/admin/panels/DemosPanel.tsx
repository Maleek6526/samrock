'use client';

import React, { useState } from 'react';
import { Download, Mail, MessageCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { dangerButton, ghostButton } from '@/app/admin/ui';
import { downloadFile, readDemos, saveDemos, toCsv } from '@/lib/store';
import { formatDate } from '@/lib/site';
import type { DemoRequest } from '@/data/initialData';

const FIELDS: { key: keyof DemoRequest; label: string }[] = [
  { key: 'stageName', label: 'Stage name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'genre', label: 'Genre' },
  { key: 'location', label: 'Location' },
  { key: 'links', label: 'Demo links' },
  { key: 'message', label: 'Message' },
];

/** Demo submissions captured from the public A&R page. */
export default function DemosPanel() {
  const [demos, setDemos] = useState<DemoRequest[]>(readDemos);

  const remove = (id: string) => {
    const next = demos.filter((item) => item.id !== id);
    setDemos(next);
    saveDemos(next);
    toast.success('Demo submission removed.');
  };

  const exportCsv = () => {
    if (demos.length === 0) {
      toast.info('No demo submissions to export yet.');
      return;
    }
    downloadFile(
      'samrock-demos.csv',
      toCsv(demos as unknown as Record<string, unknown>[]),
      'text/csv'
    );
    toast.success('Demo submissions exported.');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h2 className="font-display text-2xl tracking-tight text-strong">Demo Submissions</h2>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <span className="eyebrow text-silver">{demos.length} total</span>
          <button type="button" onClick={exportCsv} className={`${ghostButton} w-full text-xs sm:w-auto`}>
            <Download size={16} aria-hidden="true" /> Export CSV
          </button>
        </div>
      </div>

      {demos.length === 0 ? (
        <p className="border border-dashed border-hairline bg-surface-2 p-12 text-center text-sm text-silver">
          No demo submissions yet. Artistes who send a demo from the A&amp;R page appear here.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {demos.map((demo) => (
            <div key={demo.id} className="border border-hairline bg-surface p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-hairline pb-4">
                <div>
                  <h3 className="font-display text-xl text-strong">{demo.stageName}</h3>
                  <span className="eyebrow mt-1 block text-silver">
                    {formatDate(demo.createdAt)} &middot; {demo.genre}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${demo.email}`}
                    aria-label={`Email ${demo.stageName}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xs border border-hairline text-silver transition hover:border-brand hover:text-brand"
                  >
                    <Mail size={16} aria-hidden="true" />
                  </a>
                  <a
                    href={`https://wa.me/${demo.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${demo.stageName}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xs border border-hairline text-silver transition hover:border-brand hover:text-brand"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <dl className="mt-6 border-t border-hairline">
                {FIELDS.map((field) => (
                  <div
                    key={field.key}
                    className="flex flex-col gap-1 border-b border-hairline py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <dt className="eyebrow shrink-0 text-silver">{field.label}</dt>
                    <dd className="text-sm text-strong sm:text-right">
                      {field.key === 'links' && demo.links ? (
                        <a
                          href={demo.links}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-underline text-brand"
                        >
                          Open link
                        </a>
                      ) : (
                        demo[field.key] || '—'
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={() => remove(demo.id)}
                  className={`${dangerButton} w-full text-xs sm:w-auto`}
                >
                  <Trash2 size={16} aria-hidden="true" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

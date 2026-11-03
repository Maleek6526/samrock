'use client';

import React from 'react';
import { useContentSettings } from '@/lib/store';

/** Editable headline numbers (releases, artistes, years) shown as a hairline band. */
export default function StatsBand({ className = '' }: { className?: string }) {
  const { about } = useContentSettings();

  if (about.stats.length === 0) return null;

  return (
    <dl className={`grid grid-cols-1 gap-px border-y border-hairline bg-hairline sm:grid-cols-3 ${className}`}>
      {about.stats.map((stat) => (
        <div key={stat.label} className="bg-surface px-1 py-8 sm:px-6">
          <dd className="font-display text-display text-strong">{stat.value}</dd>
          <dt className="eyebrow mt-3 text-silver">{stat.label}</dt>
        </div>
      ))}
    </dl>
  );
}

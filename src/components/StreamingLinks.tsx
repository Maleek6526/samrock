'use client';

import React from 'react';
import { useContentSettings } from '@/lib/store';

/** The "available on all major platforms" row, driven by editable content settings. */
export default function StreamingLinks({
  title = 'Available on all major platforms',
}: {
  title?: string;
}) {
  const { streamingPlatforms } = useContentSettings();

  if (streamingPlatforms.length === 0) return null;

  return (
    <div className="border-t border-hairline pt-6">
      <p className="eyebrow text-silver">{title}</p>
      <ul className="mt-5 flex flex-wrap gap-2.5">
        {streamingPlatforms.map((platform) => (
          <li key={platform.label}>
            <a
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow inline-flex items-center rounded-xs border border-hairline px-4 py-2.5 text-silver transition hover:border-brand hover:text-brand"
            >
              {platform.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

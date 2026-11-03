import { Suspense } from 'react';
import type { Metadata } from 'next';
import AnnouncementDetail from './AnnouncementDetail';

export const metadata: Metadata = {
  title: 'Announcement',
  description:
    'A news update from Samrock Music Productions, with related stories from the newsroom.',
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6">
          <p className="eyebrow text-silver" role="status">
            Loading announcement...
          </p>
        </div>
      }
    >
      <AnnouncementDetail />
    </Suspense>
  );
}

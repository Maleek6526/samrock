import { Suspense } from 'react';
import type { Metadata } from 'next';
import EventDetail from './EventDetail';

export const metadata: Metadata = {
  title: 'Event',
  description:
    'Event details, ticket information and a recap from a Samrock Music Productions studio event.',
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6">
          <p className="eyebrow text-silver" role="status">
            Loading event...
          </p>
        </div>
      }
    >
      <EventDetail />
    </Suspense>
  );
}

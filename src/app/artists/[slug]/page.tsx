import { Suspense } from 'react';
import type { Metadata } from 'next';
import ArtistDetail from './ArtistDetail';

export const metadata: Metadata = {
  title: 'Artiste',
  description:
    'An artiste on the Samrock Music Productions roster, with their biography, highlights and catalogue.',
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6">
          <p className="eyebrow text-silver" role="status">
            Loading artiste...
          </p>
        </div>
      }
    >
      <ArtistDetail />
    </Suspense>
  );
}

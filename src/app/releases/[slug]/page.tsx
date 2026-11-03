import { Suspense } from 'react';
import type { Metadata } from 'next';
import ReleaseDetail from './ReleaseDetail';

export const metadata: Metadata = {
  title: 'Release',
  description:
    'A single from the Samrock Music Productions catalogue, with streaming links and related releases.',
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6">
          <p className="eyebrow text-silver" role="status">
            Loading release...
          </p>
        </div>
      }
    >
      <ReleaseDetail />
    </Suspense>
  );
}

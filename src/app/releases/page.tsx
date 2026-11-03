import type { Metadata } from 'next';
import ReleasesView from './ReleasesView';

export const metadata: Metadata = {
  title: 'Releases',
  description:
    'The full catalogue of singles and records produced, recorded, mixed and mastered at Samrock Music Productions.',
};

export default function Page() {
  return <ReleasesView />;
}

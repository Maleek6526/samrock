import type { Metadata } from 'next';
import ArtistsView from './ArtistsView';

export const metadata: Metadata = {
  title: 'Artists',
  description:
    'Meet the artistes and worship leaders on the Samrock Music Productions roster, from the current line-up to the legacy voices behind the catalogue.',
};

export default function Page() {
  return <ArtistsView />;
}

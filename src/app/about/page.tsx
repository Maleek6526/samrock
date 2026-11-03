import type { Metadata } from 'next';
import AboutView from './AboutView';

export const metadata: Metadata = {
  title: 'About | Samrock Music Productions',
  description:
    'Samrock Music Productions is a Lagos studio and production house delivering beat making, recording, mixing and mastering for Afrobeats, Reggae, Woro and Trap records.',
};

export default function Page() {
  return <AboutView />;
}

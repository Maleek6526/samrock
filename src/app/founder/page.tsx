import type { Metadata } from 'next';
import FounderView from './FounderView';

export const metadata: Metadata = {
  title: 'Founder | Samrock Music Productions',
  description:
    'Meet Samuel Adelana (Samrock), founder and lead producer of Samrock Music Productions, and read about his journey across Afrobeats, Reggae, Woro and Trap.',
};

export default function Page() {
  return <FounderView />;
}

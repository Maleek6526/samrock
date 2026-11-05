import type { Metadata } from 'next';
import DemoView from './DemoView';

export const metadata: Metadata = {
  title: 'Submit a Demo',
  description:
    'Submit your demo to the Samrock Music Productions A&R desk. Artistes and songwriters across Afrobeats, Reggae, Woro and beyond are welcome to share their records.',
};

export default function Page() {
  return <DemoView />;
}

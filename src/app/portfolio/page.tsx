import type { Metadata } from 'next';
import PortfolioView from './PortfolioView';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'The Samrock Music Productions roster, legacy artistes and the creative spaces behind every record.',
};

export default function Page() {
  return <PortfolioView />;
}

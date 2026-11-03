import type { Metadata } from 'next';
import AnnouncementsView from './AnnouncementsView';

export const metadata: Metadata = {
  title: 'Announcements',
  description:
    'News, releases and studio updates from Samrock Music Productions, gathered in one newsroom.',
};

export default function Page() {
  return <AnnouncementsView />;
}

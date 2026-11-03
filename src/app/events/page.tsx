import type { Metadata } from 'next';
import EventsView from './EventsView';

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Studio events, masterclasses and live sessions from Samrock Music Productions, with recaps of past events.',
};

export default function Page() {
  return <EventsView />;
}

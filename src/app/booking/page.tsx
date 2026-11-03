import type { Metadata } from 'next';
import BookingView from './BookingView';

export const metadata: Metadata = {
  title: 'Booking',
  description:
    'Book studio time, mixing, mastering and production sessions with Samrock Music Productions.',
};

export default function Page() {
  return <BookingView />;
}

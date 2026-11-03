import type { Metadata } from 'next';
import ContactView from './ContactView';

export const metadata: Metadata = {
  title: 'Contact | Samrock Music Productions',
  description:
    'Reach Samrock Music Productions by phone, email or the booking form. Studio based in Lagos, Nigeria, available for productions, sessions and partnerships.',
};

export default function Page() {
  return <ContactView />;
}

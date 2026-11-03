import type { Metadata } from 'next';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Privacy Policy | Samrock Music Productions',
  description:
    'How Samrock Music Productions collects, uses and protects the information you share when you visit this site.',
};

const email = 'samrockmusicproduction@gmail.com';

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: 'Introduction',
    body: (
      <>
        Samrock Music Productions respects your privacy and is committed to protecting the personal
        information you share with us. This policy explains what we collect, how we use it and the
        choices available to you.
      </>
    ),
  },
  {
    title: 'Log Files',
    body: (
      <>
        Like most websites, we use log files that record visits to the site. The information may
        include IP addresses, browser type, internet service provider, timestamps and referring
        pages. This data is used in aggregate to understand traffic and is not linked to personally
        identifiable information.
      </>
    ),
  },
  {
    title: 'Cookies',
    body: (
      <>
        Samrock Music Productions may use cookies to remember your preferences and understand how the
        site is used. You can disable cookies in your browser settings; some parts of the site may
        not work as intended if you do.
      </>
    ),
  },
  {
    title: 'Third Party Privacy Policies',
    body: (
      <>
        Our site links to third party platforms such as streaming services and social networks. These
        organisations have their own privacy policies, and we encourage you to review them. We are
        not responsible for the practices of external sites.
      </>
    ),
  },
  {
    title: "Children's Information",
    body: (
      <>
        We do not knowingly collect personal information from children. If you believe a child has
        provided information to Samrock Music Productions, please contact us so we can remove it.
      </>
    ),
  },
  {
    title: 'Consent',
    body: (
      <>
        By using our site you consent to this privacy policy. To ask a question or request the
        removal of your details, email us at{' '}
        <a href={`mailto:${email}`} className="link-underline text-brand">
          {email}
        </a>
        .
      </>
    ),
  },
];

export default function Page() {
  return (
    <>
      <Navbar />
      <PageShell>
        <PageHeader
          index="05"
          eyebrow="Privacy"
          title={
            <>
              Privacy <em className="text-brand">policy</em>.
            </>
          }
          description="How Samrock Music Productions handles the information you share with us."
        />

        <div className="mt-16 border-t border-hairline">
          {sections.map((section, index) => (
            <section
              key={section.title}
              className="grid gap-6 border-b border-hairline py-10 md:grid-cols-12 md:gap-10"
            >
              <div className="md:col-span-1">
                <span className="eyebrow text-brand">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h2 className="font-display text-title text-strong md:col-span-4">{section.title}</h2>
              <div className="text-sm leading-relaxed text-silver md:col-span-7">{section.body}</div>
            </section>
          ))}
        </div>
      </PageShell>
      <Footer />
    </>
  );
}

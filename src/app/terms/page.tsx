import type { Metadata } from 'next';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Terms of Service | Samrock Music Productions',
  description:
    'The terms and conditions that govern your use of the Samrock Music Productions website.',
};

const email = 'samrockmusicproduction@gmail.com';

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: 'Acceptance of Terms',
    body: (
      <>
        By accessing and using this website you accept these terms and conditions in full. If you
        disagree with any part of them, please do not use the site.
      </>
    ),
  },
  {
    title: 'Use of the Site',
    body: (
      <>
        You may use this site for lawful purposes only. You agree not to misuse the site, attempt to
        disrupt it, or use its content in a way that infringes the rights of Samrock Music
        Productions or any third party.
      </>
    ),
  },
  {
    title: 'Intellectual Property',
    body: (
      <>
        All content on this site, including text, artwork, audio, logos and the Samrock Music
        Productions name, is owned by or licensed to us and is protected by copyright. You may not
        reproduce or redistribute it without permission.
      </>
    ),
  },
  {
    title: 'External Links',
    body: (
      <>
        This site may contain links to external websites. These links are provided for convenience,
        and Samrock Music Productions does not endorse or take responsibility for the content or
        practices of those sites.
      </>
    ),
  },
  {
    title: 'Changes to These Terms',
    body: (
      <>
        We may update these terms from time to time. Continued use of the site after changes are
        posted constitutes acceptance of the revised terms.
      </>
    ),
  },
  {
    title: 'Contact',
    body: (
      <>
        For any questions about these terms, email Samrock Music Productions at{' '}
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
          index="06"
          eyebrow="Terms"
          title={
            <>
              Terms of <em className="text-brand">service</em>.
            </>
          }
          description="The terms and conditions that govern your use of the Samrock Music Productions website."
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

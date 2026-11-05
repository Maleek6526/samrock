'use client';

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, Music, Shield } from 'lucide-react';
import { brandMark, contactInfo, footerLinks, socialLinks } from '@/lib/site';
import { useSiteSettings } from '@/lib/store';
import NewsletterForm from '@/components/NewsletterForm';

// lucide-react v1.x removed brand logos, so the missing ones are inline SVGs.
type BrandIconProps = { size?: number };

const Youtube = ({ size = 18 }: BrandIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const Facebook = ({ size = 18 }: BrandIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const Instagram = ({ size = 18 }: BrandIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
  </svg>
);

const socialIcons: Record<string, React.ReactNode> = {
  YouTube: <Youtube />,
  Instagram: <Instagram />,
  Facebook: <Facebook />,
  Threads: <MessageSquare size={18} />,
  Audiomack: <Music size={18} />,
  TikTok: <span className="text-[10px] font-bold">TikTok</span>,
};

const emptySubscribe = () => () => {};

// The page is prerendered at build time, so reading the current year during the
// first render would bake the build year into the static HTML. The server
// snapshot is a constant and React swaps in the real year after hydration.
const PRERENDER_YEAR = 2026;

function useCopyrightYear() {
  return useSyncExternalStore(
    emptySubscribe,
    () => new Date().getFullYear(),
    () => PRERENDER_YEAR
  );
}

export default function Footer() {
  const settings = useSiteSettings();
  const copyrightYear = useCopyrightYear();

  return (
    <footer className="border-t border-hairline bg-surface-3 px-6 py-16 text-silver sm:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-4">
        <div className="space-y-6 md:col-span-2">
          <Link href="/" className="group flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xs border border-hairline sm:h-16 sm:w-16">
              <Image
                src="/logo.jpg"
                alt=""
                width={64}
                height={64}
                className="h-full w-full scale-110 object-cover"
              />
            </div>
            <span className="flex flex-col">
              <span className="font-display text-2xl leading-none tracking-tight text-strong transition group-hover:text-brand">
                {brandMark(settings.producerName)}
              </span>
              <span className="eyebrow mt-2 text-brand">Music Productions</span>
            </span>
          </Link>

          <p className="max-w-sm text-sm leading-relaxed text-silver">
            Professional beat making, recording, mixing, mastering and audio engineering. Delivering
            radio-ready records for the global music industry.
          </p>

          <ul className="flex flex-wrap gap-2.5 pt-2">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xs border border-hairline text-silver transition hover:border-brand hover:text-brand"
                >
                  {socialIcons[social.label]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          <h2 className="eyebrow text-strong">Navigation</h2>
          <ul className="space-y-3 text-sm">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="link-underline text-silver transition hover:text-strong"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          <h2 className="eyebrow text-strong">Management</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-brand transition hover:text-strong"
              >
                <Shield size={14} aria-hidden="true" /> Admin Dashboard
              </Link>
            </li>
            <li className="pt-1">
              <span className="eyebrow block text-silver">Hotline / WhatsApp</span>
              {contactInfo.phones.map((phone) => (
                <span key={phone} className="mt-2 block font-medium tabular-nums text-strong">
                  {phone}
                </span>
              ))}
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-7xl gap-6 border-t border-hairline pt-10 md:grid-cols-12 md:items-center md:gap-10">
        <div className="md:col-span-5">
          <h2 className="eyebrow text-strong">Join the mailing list</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-silver">
            New releases, beat drops and studio news, sent straight to your inbox.
          </p>
        </div>
        <div className="md:col-span-7">
          <NewsletterForm />
        </div>
      </div>

        <div className="mx-auto mt-14 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-hairline pt-6 text-xs text-silver sm:flex-row">
        <p>© {copyrightYear} Samrock Music Productions. All rights reserved.</p>

        <p className="flex items-center gap-2">
          Designed &amp; engineered by Engineer Maleek

          <a
            href="https://maleek-adewale.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-hairline px-3 py-1.5 text-white transition-colors duration-300 hover:bg-white hover:text-black"
          >
            Portfolio ↗
          </a>
        </p>
        </div>
    </footer>
  );
}

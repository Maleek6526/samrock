'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { slugify } from '@/lib/site';
import type { Artist } from '@/data/initialData';

/** Roster card. Links to the artiste's detail page unless `href` overrides it. */
export default function ArtistCard({ artist, href }: { artist: Artist; href?: string }) {
  const link = href ?? `/artists/${slugify(artist.name)}`;

  return (
    <article className="group border-t border-hairline pt-5">
      <div className="media-tone relative aspect-4/5 overflow-hidden rounded-xs border border-hairline bg-surface-2">
        {artist.photo ? (
          <Image
            src={artist.photo}
            alt={artist.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-silver">
            <span className="font-display text-display">{artist.name.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="mt-6">
        {artist.genre ? <p className="eyebrow text-brand">{artist.genre}</p> : null}
        <h3 className="mt-3 font-display text-title text-strong">{artist.name}</h3>
        {artist.bio ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-silver">{artist.bio}</p>
        ) : null}
      </div>

      <Link
        href={link}
        className="link-underline eyebrow mt-5 inline-flex items-center gap-2 text-brand"
      >
        View profile <ArrowRight size={12} aria-hidden="true" />
      </Link>
    </article>
  );
}

import type { MetadataRoute } from 'next';
import { initialAnnouncements, initialArtists, initialEvents, initialReleases } from '@/data/initialData';
import { slugify } from '@/lib/site';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://samrock-music-production.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/artists`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/releases`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/services`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/events`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/portfolio`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/announcements`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/demo`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/booking`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/founder`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const releaseRoutes: MetadataRoute.Sitemap = initialReleases.map((release) => ({
    url: `${siteUrl}/releases/${release.slug}`,
    lastModified: release.releaseDate ? new Date(release.releaseDate) : lastModified,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const artistRoutes: MetadataRoute.Sitemap = initialArtists.map((artist) => ({
    url: `${siteUrl}/artists/${slugify(artist.name)}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const eventRoutes: MetadataRoute.Sitemap = initialEvents.map((event) => ({
    url: `${siteUrl}/events/${event.id}`,
    lastModified: new Date(event.date),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  const announcementRoutes: MetadataRoute.Sitemap = initialAnnouncements.map((announcement) => ({
    url: `${siteUrl}/announcements/${announcement.slug}`,
    lastModified: new Date(announcement.date),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [
    ...staticRoutes.map((route) => ({ lastModified, ...route })),
    ...releaseRoutes,
    ...artistRoutes,
    ...eventRoutes,
    ...announcementRoutes,
  ];
}

import type { LucideIcon } from 'lucide-react';

export interface SiteSettings {
  producerName: string;
  whatsappNumber: string;
  email: string;
  statusBadge: string;
}

/** Single source of truth for editable site settings. */
export const defaultSiteSettings: SiteSettings = {
  producerName: 'Samrock Music Productions',
  whatsappNumber: '07048306524',
  email: 'samrockmusicproduction@gmail.com',
  statusBadge: 'Available for Placements, Beats & Studio Sessions',
};

/** First word of the brand name, upper-cased for the navbar/footer wordmark. */
export function brandMark(producerName?: string) {
  const source = (producerName || defaultSiteSettings.producerName).trim();
  const first = source.split(/\s+/)[0];
  return (first || defaultSiteSettings.producerName).toUpperCase();
}

/** Single source of truth for public contact details. */
export const contactInfo = {
  email: 'samrockmusicproduction@gmail.com',
  phones: ['08139972822', '07048306524'],
  whatsapp: '2347048306524',
} as const;

export const socialLinks = [
  { label: 'YouTube', href: 'https://youtube.com/@samrock_beatz?si=cd7CNheHGnn0UASP' },
  { label: 'Instagram', href: 'https://www.instagram.com/invites/contact/?utm_content=mrjbm9f&srtk=10vv58bdz561l' },
  { label: 'Facebook', href: 'https://www.facebook.com/share/1AFR8EaXHb/?mibextid=wwXIfr' },
  { label: 'Threads', href: 'https://www.threads.com/@samrock_music_production?invite=0' },
  { label: 'Audiomack', href: 'https://audiomack.com/adelanasamuel02' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@samrock_beatz?_r=1&_t=ZS9B3Ds0pTKhG' },
] as const;

/** Options offered by the contact form and the admin services copy. */
export const serviceOptions = [
  'Beat Making & Production',
  'Mixing & Mastering',
  'Music Recording',
  'Jingles & Back Tracks',
  'Artiste Management',
] as const;

export interface ServiceDefinition {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
}

import type { LucideIcon } from 'lucide-react';
import { Disc3, Globe, Mic2, Radio, Sliders, Video } from 'lucide-react';

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

/** Full service lines shown on the home section and the /services page. */
export const serviceDefinitions: ServiceDefinition[] = [
  {
    title: 'Beat Making & Production',
    description:
      'Custom instrumentals tailored for Afrobeats, Reggae, Woro and Trap, built with industry-standard VSTs and hardware.',
    icon: Disc3,
    features: ['Exclusive & leased beats', 'Full track arrangement', 'Custom tempo & key'],
  },
  {
    title: 'Mixing & Mastering',
    description:
      'Professional vocal tuning, EQ, compression, stereo widening and loudness optimisation to make your record radio-ready.',
    icon: Sliders,
    features: ['Vocal pitch correction', 'Dynamic balancing', 'Industry-standard loudness'],
  },
  {
    title: 'Music Recording',
    description:
      'Crystal-clear vocal tracking in a professionally treated acoustic environment using premium studio microphones.',
    icon: Mic2,
    features: ['Acoustic studio session', 'Professional monitoring', 'Vocal production coaching'],
  },
  {
    title: 'Jingles & Back Tracks',
    description:
      'Catchy commercial jingles, voiceover backing and custom audio backtracks for brands, radio and social campaigns.',
    icon: Radio,
    features: ['Commercial rights', 'Fast turnaround', 'Tailored brand messaging'],
  },
  {
    title: 'Video Production',
    description:
      'A well-equipped live recording room for video sessions, capturing performances with crisp visuals and direction.',
    icon: Video,
    features: ['Live recording', 'Visual direction', 'Editing & performance capture'],
  },
  {
    title: 'Distribution',
    description:
      'Global distribution across major streaming platforms and digital stores, with reporting that keeps your catalogue visible.',
    icon: Globe,
    features: ['Digital distribution', 'Royalty collection', 'Analytics reporting'],
  },
];

/** Primary navigation, shared by the navbar and the mobile menu. */
export const navLinks = [
  { name: 'Beats', href: '/#beats' },
  { name: 'Artists', href: '/artists' },
  { name: 'Releases', href: '/releases' },
  { name: 'Services', href: '/services' },
  { name: 'Events', href: '/events' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Contact', href: '/contact' },
] as const;

/** Secondary links shown in the footer. */
export const footerLinks = [
  { label: 'Beat Store', href: '/#beats' },
  { label: 'Artists', href: '/artists' },
  { label: 'Releases', href: '/releases' },
  { label: 'Services', href: '/services' },
  { label: 'Events', href: '/events' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Announcements', href: '/announcements' },
  { label: 'About', href: '/about' },
  { label: 'Founder', href: '/founder' },
  { label: 'Booking', href: '/booking' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
] as const;

/** Booking form option sets. */
export const bookingCategories = [
  'Studio Session',
  'Mixing & Mastering',
  'Beat Purchase',
  'Consultation',
  'Media Partnership',
  'Custom Project',
] as const;

export const bookingServiceLines = [
  'Beat Making & Production',
  'Mixing & Mastering',
  'Music Recording',
  'Jingles & Back Tracks',
  'Video Production',
  'Promotional Services',
  'Distribution',
  'Artiste Management',
  'Custom Solution',
] as const;

export const bookingDurations = [
  '15 minutes',
  '30 minutes',
  '45 minutes',
  '60 minutes',
  '90 minutes',
] as const;

/** Editable long-form site content, surfaced through the admin Content tab. */
export interface ContentSettings {
  about: {
    intro: string;
    visionTitle: string;
    visionBody: string;
    pillars: { title: string; description: string }[];
    milestones: { year: string; text: string }[];
    stats: { value: string; label: string }[];
  };
  founder: {
    name: string;
    role: string;
    photo: string;
    bio: string;
    journey: string;
    mission: string;
    achievements: string[];
    instagram: string;
    facebook: string;
    youtube: string;
    phone: string;
    email: string;
    bookTitle: string;
    bookDescription: string;
  };
  contact: {
    officeLabel: string;
    officeAddress: string;
    mapUrl: string;
    businessHours: { day: string; hours: string }[];
  };
  streamingPlatforms: { label: string; href: string }[];
  pressResources: { title: string; description: string; subject: string }[];
  youtube: { channelUrl: string };
}

export const defaultContentSettings: ContentSettings = {
  about: {
    intro:
      'Based in Lagos, Nigeria, Samrock Music Productions is a production house and studio delivering beat making, recording, mixing and mastering for Afrobeats, Reggae, Woro and Trap records.',
    visionTitle: 'Doing the music business, one record at a time',
    visionBody:
      'Our goal is to give talented artistes a serious platform, pairing engineering excellence with instinct so that every release is built to compete on the global stage.',
    pillars: [
      {
        title: 'Beat Making & Production',
        description: 'Custom instrumentals and full arrangements shaped around the artiste.',
      },
      {
        title: 'Mixing & Mastering',
        description: 'Records balanced, widened and mastered to a competitive loudness.',
      },
      {
        title: 'Recording & Engineering',
        description: 'Treated rooms and premium microphones for clean, powerful takes.',
      },
      {
        title: 'Release Support',
        description: 'Branding, distribution and release planning that get records heard.',
      },
    ],
    milestones: [
      { year: '2016', text: 'The studio opens and starts producing local records.' },
      { year: '2019', text: 'Mixing and mastering services expand to a full artiste roster.' },
      { year: '2022', text: 'Releases distributed across all major streaming platforms.' },
      { year: '2025', text: 'Beat store and remote mixing services launched.' },
    ],
    stats: [
      { value: '10+', label: 'Years producing' },
      { value: '50+', label: 'Records delivered' },
      { value: '6', label: 'Artistes on the roster' },
    ],
  },
  founder: {
    name: 'Samuel Adelana (Samrock)',
    role: 'Founder & Lead Producer, Samrock Music Productions',
    photo:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60',
    bio: 'A Nigerian music producer and audio engineer, Samrock has spent over a decade building records for artistes across Afrobeats, Reggae, Woro and Trap.',
    journey:
      'Starting out as a beat maker, Samrock developed a full production and engineering practice, working with artistes from first demo to final master and growing Samrock Music Productions into a studio that handles recording, mixing, mastering and release support end to end.',
    mission:
      'To give artistes a reliable creative home where ideas are turned into finished, competitive records with excellence at every step.',
    achievements: [
      'Produced and mixed records across Afrobeats, Reggae, Woro and Trap',
      'Delivered releases to all major streaming platforms',
      'Built a roster of artistes with an end-to-end production service',
      'Runs the Samrock beat store and remote mixing service',
    ],
    instagram: 'https://www.instagram.com/invites/contact/?utm_content=mrjbm9f&srtk=10vv58bdz561l',
    facebook: 'https://www.facebook.com/share/1AFR8EaXHb/?mibextid=wwXIfr',
    youtube: 'https://youtube.com/@samrock_beatz?si=cd7CNheHGnn0UASP',
    phone: '07048306524',
    email: 'samrockmusicproduction@gmail.com',
    bookTitle: 'Building a Music Career',
    bookDescription:
      'Practical guidance for musicians navigating production, release planning and the business of music, drawn from years of studio work.',
  },
  contact: {
    officeLabel: 'Studio',
    officeAddress: 'Lagos, Nigeria',
    mapUrl: 'https://maps.google.com/?q=Lagos,Nigeria',
    businessHours: [
      { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
      { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
      { day: 'Sunday', hours: 'Closed' },
    ],
  },
  streamingPlatforms: [
    { label: 'Spotify', href: 'https://open.spotify.com/artist/1oexpD5GaB60odDIN76czV' },
    { label: 'Apple Music', href: 'https://music.apple.com/ng/artist/1836767582' },
    { label: 'YouTube', href: 'https://youtube.com/@samrock_beatz' },
    { label: 'Audiomack', href: 'https://audiomack.com/adelanasamuel02' },
    { label: 'Amazon Music', href: 'https://music.amazon.com/' },
    { label: 'Deezer', href: 'https://www.deezer.com/' },
    { label: 'Boomplay', href: 'https://www.boomplay.com/' },
    { label: 'Tidal', href: 'https://tidal.com/' },
    { label: 'SoundCloud', href: 'https://soundcloud.com/' },
  ],
  pressResources: [
    {
      title: 'Artiste Media Kit',
      description: 'Photos, bios and approved brand assets for press use.',
      subject: 'Press kit request - Artiste Media Kit',
    },
    {
      title: 'Studio Fact Sheet',
      description: 'Quick facts, services and gear overview for journalists.',
      subject: 'Press kit request - Studio Fact Sheet',
    },
    {
      title: 'Event Assets',
      description: 'Posters, flyers and promo templates for upcoming events.',
      subject: 'Press kit request - Event Assets',
    },
  ],
  youtube: {
    channelUrl: 'https://youtube.com/@samrock_beatz',
  },
};

/** Turns a title into a URL-safe slug. */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Formats an ISO date into a short, human-readable label (e.g. "16 Jan 2026"). */
export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

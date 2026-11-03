export interface Track {
  id: string;
  title: string;
  audioUrl?: string;
  /** Public share link for a streaming service (Spotify, Apple Music, Audiomack). */
  link?: string;
  coverArt: string;
  artist: string;
}

export interface Beat extends Track {
  genre: string;
  bpm: number;
  key: string;
  price: number;
}

export interface Placement extends Track {
  role: string;
  year: string;
  link: string;
}

export const initialBeats: Beat[] = [
  {
    id: "1",
    title: "Lagos Nights",
    artist: "Samrock",
    genre: "Afrobeats",
    bpm: 105,
    key: "F#m",
    price: 30000,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    coverArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "2",
    title: "Island Vibe",
    artist: "Samrock",
    genre: "Reggae",
    bpm: 85,
    key: "Am",
    price: 25000,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    coverArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "3",
    title: "Woro Bounce",
    artist: "Samrock",
    genre: "Woro",
    bpm: 120,
    key: "Cm",
    price: 35000,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    coverArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60"
  }
];

export const initialPlacements: Placement[] = [
  {
    id: "p1",
    title: "Olagbara",
    artist: "Producer Sam Rock",
    role: "Producer & Mixing",
    year: "2026",
    coverArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60",
    link: "https://music.apple.com/ng/album/olagbara-single/1836767582"
  },
  {
    id: "p2",
    title: "Iro Ayo",
    artist: "Producer Sam Rock",
    role: "Producer",
    year: "2025",
    coverArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60",
    link: "https://music.apple.com/ng/album/iro-ayo/1741372175?i=1741372176"
  },
  {
    id: "p3",
    title: "Speak Oh Spirit",
    artist: "Oluwafelix",
    role: "Mixing & Mastering",
    year: "2025",
    coverArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60",
    link: "https://audiomack.com/oluwafelix-2/song/speak-oh-spirit?share-user-id=44403713"
  },
  {
    id: "p4",
    title: "Irugbin",
    artist: "Adekunle Adelana",
    role: "Producer",
    year: "2025",
    coverArt: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&auto=format&fit=crop&q=60",
    link: "https://audiomack.com/adekunleadelana3/song/adekunle-adelana-irugbin?share-user-id=44403713"
  },
  {
    id: "p5",
    title: "Oluwatosin",
    artist: "Oluwatosin Oderinde",
    role: "Producer",
    year: "2024",
    coverArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60",
    link: "https://audiomack.com/oluwatosin-oderindesotiata"
  },
  {
    id: "p6",
    title: "Segun Super",
    artist: "Segun Super",
    role: "Producer",
    year: "2024",
    coverArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60",
    link: "https://audiomack.com/segun-super"
  },
  {
    id: "p7",
    title: "Oluwasegun",
    artist: "Oluwasegun Adelana",
    role: "Producer",
    year: "2024",
    coverArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60",
    link: "https://audiomack.com/oluwasegun-adelana-1"
  },
  {
    id: "p8",
    title: "Samrock Official",
    artist: "Spotify Profile",
    role: "Discography",
    year: "Active",
    coverArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=60",
    link: "https://open.spotify.com/artist/1oexpD5GaB60odDIN76czV?si=8A15SePaTWiMONMtYAGv5w"
  }
];

/* ==========================================================================
   Extended catalog.

   Everything below is seeded here and then owned by localStorage, so the admin
   dashboard can edit, add or remove records without a redeploy. Seed copy is
   representative portfolio content and is fully replaceable from the dashboard.
   ========================================================================== */

/** An artiste on the roster. `legacy` marks an alumnus shown apart from the current roster. */
export interface Artist {
  id: string;
  name: string;
  genre: string;
  bio: string;
  location: string;
  photo: string;
  highlights: string[];
  legacy: boolean;
}

/** A public release. Reuses the Track shape so the unified audio player can stream it. */
export interface Release extends Track {
  slug: string;
  type: string;
  releaseDate: string;
  description: string;
  listenUrl: string;
  featured: boolean;
}

/** An event shown on /events. Ended events keep their gallery as a recap. */
export interface StudioEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: 'upcoming' | 'ended';
  ticketPrice: string;
  gallery: string[];
  registerUrl: string;
}

/** A news item shown on /announcements. */
export interface Announcement {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  body: string;
}

/** A creative space shown on /portfolio. */
export interface PortfolioSpace {
  id: string;
  title: string;
  description: string;
  image: string;
}

/** A newsletter subscriber captured from the footer form. */
export interface Subscriber {
  id: string;
  email: string;
  date: string;
}

/** A booking request captured from the booking form. */
export interface BookingRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  artist: string;
  category: string;
  service: string;
  duration: string;
  preferredDate: string;
  reason: string;
  details: string;
  createdAt: string;
}

/**
 * A video surfaced on the home page "visuals" section. `url` holds a YouTube
 * link, a direct video link, or a data URL for a clip picked from the device.
 */
export interface VideoItem {
  id: string;
  title: string;
  url: string;
}

export const initialArtists: Artist[] = [
  {
    id: 'ar-1',
    name: 'Samrock',
    genre: 'Afrobeats / Reggae / Woro',
    bio: 'Producer, engineer and founder of Samrock Music Productions. Builds records end to end, from the first kick to the final master.',
    location: 'Lagos, Nigeria',
    photo:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60',
    highlights: ['Producer, mixing & mastering', 'Founder of Samrock Music Productions', 'Afrobeats, Reggae, Woro, Trap'],
    legacy: false,
  },
  {
    id: 'ar-2',
    name: 'Adekunle Adelana',
    genre: 'Afrobeats',
    bio: 'Recording artiste with a melodic Afrobeats delivery, produced and mixed at Samrock Music Productions.',
    location: 'Lagos, Nigeria',
    photo:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=60',
    highlights: ['Single "Irugbin"', 'Produced at Samrock', 'Afrobeats'],
    legacy: false,
  },
  {
    id: 'ar-3',
    name: 'Oluwafelix',
    genre: 'Gospel / Worship',
    bio: 'Worship minister whose single "Speak Oh Spirit" was mixed and mastered at the studio.',
    location: 'Nigeria',
    photo:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&auto=format&fit=crop&q=60',
    highlights: ['Single "Speak Oh Spirit"', 'Mixing & mastering', 'Worship'],
    legacy: false,
  },
  {
    id: 'ar-4',
    name: 'Oluwatosin Oderinde',
    genre: 'Afrobeats',
    bio: 'Artiste and songwriter working with the studio across production and release planning.',
    location: 'Nigeria',
    photo:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=60',
    highlights: ['Single "Oluwatosin"', 'Production', 'Afrobeats'],
    legacy: false,
  },
  {
    id: 'ar-5',
    name: 'Segun Super',
    genre: 'Afrobeats',
    bio: 'Recording artiste whose records were produced by Samrock Music Productions.',
    location: 'Nigeria',
    photo:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=60',
    highlights: ['Production credits with Samrock', 'Afrobeats'],
    legacy: false,
  },
  {
    id: 'ar-6',
    name: 'Oluwasegun Adelana',
    genre: 'Afrobeats',
    bio: 'Artiste on the Samrock roster with a catalogue of produced and mixed records.',
    location: 'Nigeria',
    photo:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=60',
    highlights: ['Production credits with Samrock', 'Afrobeats'],
    legacy: false,
  },
];

export const initialReleases: Release[] = [
  {
    id: 'r-1',
    slug: 'olagbara',
    title: 'Olagbara',
    artist: 'Producer Sam Rock',
    type: 'Single',
    releaseDate: '2026-01-16',
    description:
      'A propulsive Afrobeats single produced and mixed at Samrock Music Productions, built around a rolling log-drum groove and a soaring hook.',
    coverArt:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60',
    listenUrl: 'https://music.apple.com/ng/album/olagbara-single/1836767582',
    link: 'https://music.apple.com/ng/album/olagbara-single/1836767582',
    featured: true,
  },
  {
    id: 'r-2',
    slug: 'iro-ayo',
    title: 'Iro Ayo',
    artist: 'Producer Sam Rock',
    type: 'Single',
    releaseDate: '2025-09-12',
    description:
      'Warm, mid-tempo Afrobeats with live-feel percussion. Produced by Samrock Music Productions.',
    coverArt:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60',
    listenUrl:
      'https://music.apple.com/ng/album/iro-ayo/1741372175?i=1741372176',
    link: 'https://music.apple.com/ng/album/iro-ayo/1741372175?i=1741372176',
    featured: true,
  },
  {
    id: 'r-3',
    slug: 'speak-oh-spirit',
    title: 'Speak Oh Spirit',
    artist: 'Oluwafelix',
    type: 'Single',
    releaseDate: '2025-06-20',
    description:
      'A worship record mixed and mastered at the studio, balancing intimacy in the verses with a wide, cinematic chorus.',
    coverArt:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60',
    listenUrl:
      'https://audiomack.com/oluwafelix-2/song/speak-oh-spirit?share-user-id=44403713',
    link: 'https://audiomack.com/oluwafelix-2/song/speak-oh-spirit?share-user-id=44403713',
    featured: true,
  },
  {
    id: 'r-4',
    slug: 'irugbin',
    title: 'Irugbin',
    artist: 'Adekunle Adelana',
    type: 'Single',
    releaseDate: '2025-03-14',
    description:
      'Produced by Samrock Music Productions. Melodic Afrobeats with a forward-leaning rhythm section.',
    coverArt:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&auto=format&fit=crop&q=60',
    listenUrl:
      'https://audiomack.com/adekunleadelana3/song/adekunle-adelana-irugbin?share-user-id=44403713',
    link: 'https://audiomack.com/adekunleadelana3/song/adekunle-adelana-irugbin?share-user-id=44403713',
    featured: true,
  },
  {
    id: 'r-5',
    slug: 'oluwatosin',
    title: 'Oluwatosin',
    artist: 'Oluwatosin Oderinde',
    type: 'Single',
    releaseDate: '2024-11-08',
    description:
      'Production and arrangement by Samrock Music Productions, with a bright, radio-ready mix.',
    coverArt:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60',
    listenUrl: 'https://audiomack.com/oluwatosin-oderindesotiata',
    link: 'https://audiomack.com/oluwatosin-oderindesotiata',
    featured: false,
  },
  {
    id: 'r-6',
    slug: 'segun-super',
    title: 'Segun Super',
    artist: 'Segun Super',
    type: 'Single',
    releaseDate: '2024-07-19',
    description:
      'Produced at Samrock Music Productions, blending street-leaning percussion with a clean top end.',
    coverArt:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60',
    listenUrl: 'https://audiomack.com/segun-super',
    link: 'https://audiomack.com/segun-super',
    featured: false,
  },
  {
    id: 'r-7',
    slug: 'oluwasegun',
    title: 'Oluwasegun',
    artist: 'Oluwasegun Adelana',
    type: 'Single',
    releaseDate: '2024-04-05',
    description:
      'A produced and mixed record from the Samrock catalogue, pairing Afrobeats rhythm with a warm low end.',
    coverArt:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60',
    listenUrl: 'https://audiomack.com/oluwasegun-adelana-1',
    link: 'https://audiomack.com/oluwasegun-adelana-1',
    featured: false,
  },
];

export const initialEvents: StudioEvent[] = [
  {
    id: 'ev-1',
    title: 'Afrobeats Production Masterclass',
    description:
      'A hands-on session covering beat arrangement, vocal production and mixing workflow, hosted at the Samrock studio.',
    date: '2026-12-15T10:00:00',
    location: 'Lagos, Nigeria',
    status: 'upcoming',
    ticketPrice: '₦25,000',
    gallery: [],
    registerUrl: '',
  },
  {
    id: 'ev-2',
    title: 'Live Recording Session',
    description:
      'A full-band live recording captured in the Samrock room, from tracking through to rough mix.',
    date: '2026-05-01T10:50:00',
    location: 'Ikeja, Lagos',
    status: 'ended',
    ticketPrice: '₦10,000',
    gallery: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=60',
    ],
    registerUrl: '',
  },
  {
    id: 'ev-3',
    title: 'Beat Camp Lagos',
    description:
      'An open studio day where producers and artistes built and recorded together across a single afternoon.',
    date: '2025-11-22T12:00:00',
    location: 'Surulere, Lagos',
    status: 'ended',
    ticketPrice: 'Free',
    gallery: [
      'https://images.unsplash.com/photo-1470229722913-7ea0d1c0db3f?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop&q=60',
    ],
    registerUrl: '',
  },
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'an-1',
    slug: 'studio-sessions-open',
    title: 'Studio sessions now open for the new season',
    category: 'news',
    date: '2026-09-01T09:00:00',
    body: 'Recording, mixing and mastering slots are now open for the new season at Samrock Music Productions. Whether you are cutting a single or finishing a full project, sessions can be booked directly from the booking page. Send your reference tracks and target date and we will shape the right package around your release.',
  },
  {
    id: 'an-2',
    slug: 'irugbin-out-now',
    title: 'Irugbin, produced by Samrock, is out now',
    category: 'release',
    date: '2025-03-14T08:00:00',
    body: 'Irugbin by Adekunle Adelana, produced at Samrock Music Productions, is available on all major streaming platforms. The record pairs a melodic Afrobeats topline with a forward-leaning rhythm section and a clean, radio-ready mix. Stream it now and reach out for the leases or stems.',
  },
];

export const initialPortfolioSpaces: PortfolioSpace[] = [
  {
    id: 'ps-1',
    title: 'Live Studio Sessions',
    description:
      'A treated recording room built for vocal tracking and full-band takes, with premium microphones and monitoring.',
    image:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 'ps-2',
    title: 'Mixing & Mastering Suite',
    description:
      'A focused mix room where records are balanced, widened and mastered to a competitive loudness.',
    image:
      'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 'ps-3',
    title: 'Performance & Worship',
    description:
      'Space and support for capturing live performances, worship nights and one-take visual sessions.',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=60',
  },
];

export const initialVideos: VideoItem[] = [];

export const initialSubscribers: Subscriber[] = [];

export const initialBookings: BookingRequest[] = [];

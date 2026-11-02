export interface Track {
  id: string;
  title: string;
  audioUrl?: string;
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

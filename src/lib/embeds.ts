export type StreamPlatform = 'Spotify' | 'Apple Music' | 'Audiomack';

function parse(url?: string | null): URL | null {
  if (!url) return null;
  const clean = url.trim();
  if (!clean.startsWith('http')) return null;
  try {
    return new URL(clean);
  } catch {
    return null;
  }
}

function hostnameOf(url: URL) {
  return url.hostname.replace(/^www\./, '');
}

/** Which streaming service a link points at, or null when it is a direct file. */
export function getStreamPlatform(url?: string | null): StreamPlatform | null {
  const parsed = parse(url);
  if (!parsed) return null;

  const hostname = hostnameOf(parsed);
  if (hostname === 'spotify.com' || hostname === 'open.spotify.com') return 'Spotify';
  if (hostname === 'music.apple.com' || hostname === 'embed.music.apple.com') return 'Apple Music';
  if (hostname === 'audiomack.com' || hostname === 'embed.audiomack.com') return 'Audiomack';
  return null;
}

/**
 * Converts a public share link into the official embed URL for that platform.
 * Returns null for direct audio files, which the native player handles instead.
 */
export function getEmbedUrl(url?: string | null): string | null {
  const parsed = parse(url);
  const platform = getStreamPlatform(url);
  if (!parsed || !platform) return null;

  const path = parsed.pathname;

  if (platform === 'Spotify') {
    const embedPath = path.startsWith('/embed') ? path : `/embed${path}`;
    return `https://open.spotify.com${embedPath}`;
  }

  if (platform === 'Apple Music') {
    const hostname = hostnameOf(parsed);
    const embedHost = hostname.startsWith('embed.') ? hostname : `embed.${hostname}`;
    return `https://${embedHost}${path}${parsed.search}`;
  }

  // Audiomack only embeds songs through the canonical /embed/song/{artist}/{title} path.
  if (path.includes('/embed/')) return `https://audiomack.com${path}${parsed.search}`;

  if (path.includes('/song/')) {
    const parts = path.split('/').filter((part) => part && part !== 'song');
    if (parts.length >= 2) {
      return `https://audiomack.com/embed/song/${parts[0]}/${parts[1]}`;
    }
  }

  return `https://audiomack.com/embed${path}${parsed.search}`;
}

/**
 * Converts a YouTube watch / share / shorts URL into an embeddable URL.
 * Returns null when the link is not a recognisable YouTube video.
 */
export function getYouTubeEmbedUrl(url?: string | null): string | null {
  const parsed = parse(url);
  if (!parsed) return null;

  const hostname = hostnameOf(parsed);

  if (hostname === 'youtu.be') {
    const id = parsed.pathname.slice(1);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
    if (parsed.pathname.startsWith('/embed/')) {
      return `https://www.youtube.com${parsed.pathname}`;
    }
    if (parsed.pathname.startsWith('/shorts/')) {
      const id = parsed.pathname.split('/')[2];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    const id = parsed.searchParams.get('v');
    if (id) return `https://www.youtube.com/embed/${id}`;
  }

  return null;
}

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.ogv', '.mov', '.m4v'];

/**
 * True when a value is a playable video file rather than a streaming page:
 * a device upload (`data:` / `blob:`) or a direct link ending in a video
 * extension. Those are rendered with a native `<video>` element instead of an
 * embed, which is how locally picked clips play without a server.
 */
export function getVideoFileUrl(url?: string | null): string | null {
  if (!url) return null;
  const clean = url.trim();
  if (!clean) return null;

  if (clean.startsWith('data:video/') || clean.startsWith('blob:')) return clean;

  const parsed = parse(clean);
  if (!parsed) return null;

  const path = parsed.pathname.toLowerCase();
  return VIDEO_EXTENSIONS.some((extension) => path.endsWith(extension)) ? clean : null;
}

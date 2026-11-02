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

export interface SpotifyCreds {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export interface NowPlaying {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumArt?: string;
  url?: string;
}

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const NOW_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENT_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

let cachedToken: { value: string; expiresAt: number } | null = null;

/** test-only: reset the in-memory token cache */
export function __resetTokenCache() {
  cachedToken = null;
}

export function parseNowPlaying(payload: any, fromRecent: boolean): NowPlaying {
  const item = fromRecent ? payload?.items?.[0]?.track : payload?.item;
  if (!item) return { isPlaying: false };
  return {
    isPlaying: !fromRecent && Boolean(payload?.is_playing),
    title: item.name,
    artist: (item.artists ?? []).map((a: any) => a.name).join(', '),
    albumArt: item.album?.images?.[0]?.url,
    url: item.external_urls?.spotify,
  };
}

async function getAccessToken(creds: SpotifyCreds, now: number): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > now) return cachedToken.value;
  const basic = Buffer.from(`${creds.clientId}:${creds.clientSecret}`).toString('base64');
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: creds.refreshToken }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  cachedToken = { value: data.access_token, expiresAt: now + (data.expires_in - 60) * 1000 };
  return cachedToken.value;
}

export async function getNowPlaying(creds: SpotifyCreds, now = Date.now()): Promise<NowPlaying> {
  try {
    const token = await getAccessToken(creds, now);
    if (!token) return { isPlaying: false };

    const cur = await fetch(NOW_URL, { headers: { Authorization: `Bearer ${token}` } });
    if (cur.status === 200) {
      return parseNowPlaying(await cur.json(), false);
    }
    // 204 (nothing playing) or other → fall back to recently played
    const recent = await fetch(RECENT_URL, { headers: { Authorization: `Bearer ${token}` } });
    if (recent.ok) return parseNowPlaying(await recent.json(), true);
    return { isPlaying: false };
  } catch {
    return { isPlaying: false };
  }
}

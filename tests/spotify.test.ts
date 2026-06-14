import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseNowPlaying, getNowPlaying, __resetTokenCache } from '../src/lib/spotify';

describe('parseNowPlaying', () => {
  it('maps a currently-playing payload', () => {
    const payload = {
      is_playing: true,
      item: {
        name: 'IGOR\'S THEME',
        artists: [{ name: 'Tyler, The Creator' }],
        album: { images: [{ url: 'http://img/large' }] },
        external_urls: { spotify: 'http://track/x' },
      },
    };
    expect(parseNowPlaying(payload, false)).toEqual({
      isPlaying: true,
      title: "IGOR'S THEME",
      artist: 'Tyler, The Creator',
      albumArt: 'http://img/large',
      url: 'http://track/x',
    });
  });

  it('returns idle object for empty payload', () => {
    expect(parseNowPlaying(null, false)).toEqual({ isPlaying: false });
  });
});

describe('getNowPlaying', () => {
  const creds = { clientId: 'id', clientSecret: 'sec', refreshToken: 'ref' };

  beforeEach(() => {
    __resetTokenCache();
    vi.restoreAllMocks();
  });

  it('refreshes token then fetches current track', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: 'AT', expires_in: 3600 }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({
        is_playing: true,
        item: { name: 'S', artists: [{ name: 'A' }], album: { images: [{ url: 'I' }] }, external_urls: { spotify: 'U' } },
      }) });
    vi.stubGlobal('fetch', fetchMock);

    const res = await getNowPlaying(creds);
    expect(res.isPlaying).toBe(true);
    expect(res.title).toBe('S');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('fail-soft on token error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({}) }));
    const res = await getNowPlaying(creds);
    expect(res).toEqual({ isPlaying: false });
  });

  it('fail-soft hits token endpoint exactly once when refresh fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);
    const res = await getNowPlaying(creds);
    expect(res).toEqual({ isPlaying: false });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

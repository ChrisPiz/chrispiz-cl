import type { APIRoute } from 'astro';
import { getNowPlaying } from '../../lib/spotify';

export const prerender = false;

export const GET: APIRoute = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return new Response(JSON.stringify({ isPlaying: false }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }

  const data = await getNowPlaying({ clientId, clientSecret, refreshToken });
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=30',
    },
  });
};

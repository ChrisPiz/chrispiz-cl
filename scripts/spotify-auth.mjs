// One-shot Spotify OAuth helper — gets a long-lived refresh_token.
//
// Prereq (once): in https://developer.spotify.com/dashboard open your app →
// Settings → Redirect URIs → add exactly:  http://127.0.0.1:8888/callback
//
// Run:  SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-auth.mjs
// Then open the printed URL, log in, approve. The refresh token is printed and
// written to secrets/spotify_refresh_token (gitignored).

import http from 'node:http';
import { writeFileSync, mkdirSync } from 'node:fs';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT = 'http://127.0.0.1:8888/callback';
const SCOPE = 'user-read-currently-playing user-read-recently-played';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET env vars.');
  process.exit(1);
}

const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPE,
    redirect_uri: REDIRECT,
  });

console.log('\n1) Open this URL in your browser and approve:\n');
console.log(authUrl + '\n');
console.log('Waiting for the redirect on http://127.0.0.1:8888 ...\n');

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/callback')) {
    res.writeHead(404).end();
    return;
  }
  const code = new URL(req.url, 'http://127.0.0.1:8888').searchParams.get('code');
  if (!code) {
    res.writeHead(400).end('No code in callback.');
    return;
  }
  try {
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const r = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT,
      }),
    });
    const data = await r.json();
    if (!data.refresh_token) {
      res.writeHead(500).end('No refresh_token: ' + JSON.stringify(data));
      console.error('Token exchange failed:', data);
      server.close();
      return;
    }
    mkdirSync('secrets', { recursive: true });
    writeFileSync('secrets/spotify_refresh_token', data.refresh_token, { mode: 0o600 });
    console.log('\n✅ refresh_token obtained and written to secrets/spotify_refresh_token\n');
    console.log('REFRESH TOKEN:\n' + data.refresh_token + '\n');
    res.writeHead(200, { 'Content-Type': 'text/html' }).end(
      '<h2>✅ Listo. Refresh token guardado. Puedes cerrar esta pestaña.</h2>'
    );
    server.close();
  } catch (e) {
    res.writeHead(500).end('Error: ' + e.message);
    console.error(e);
    server.close();
  }
});

server.listen(8888, '127.0.0.1');

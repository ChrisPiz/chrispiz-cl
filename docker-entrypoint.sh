#!/bin/sh
set -e
for v in SPOTIFY_CLIENT_ID SPOTIFY_CLIENT_SECRET SPOTIFY_REFRESH_TOKEN; do
  f="/run/secrets/$(echo "$v" | tr '[:upper:]' '[:lower:]')"
  if [ -f "$f" ]; then
    export "$v"="$(cat "$f")"
  fi
done
exec "$@"

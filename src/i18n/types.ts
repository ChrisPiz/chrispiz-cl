export type Lang = 'en' | 'es';

export interface Dict {
  /** hero — white (primary) clause */
  hero: string;
  /** hero — muted (secondary) clause */
  heroMuted: string;
  /** intro subtitle */
  sub: string;
  /** availability pill */
  available: string;
  /** contact card pill-label */
  contactLabel: string;
  /** contact card body */
  contactBody: string;
  /** contact "let's talk" lead-in */
  talk: string;
  /** now-playing pill-label */
  npLabel: string;
  /** now-playing idle text */
  npIdle: string;
  /** now-playing "recently played" prefix */
  npRecently: string;
  /** location pill-label */
  locLabel: string;
  /** city line */
  locCity: string;
  /** remote-availability note */
  locRemote: string;
}

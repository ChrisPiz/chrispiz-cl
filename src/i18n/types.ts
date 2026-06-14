export type Lang = 'en' | 'es';

export interface Dict {
  bio: string;
  available: { badge: string; body: string; cta: string };
  sections: { projects: string; nowPlaying: string; stack: string };
  nowPlaying: { idle: string; recently: string };
}

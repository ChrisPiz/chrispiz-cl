import type { Dict, Lang } from './types';
import { en } from './en';
import { es } from './es';

const dicts: Record<Lang, Dict> = { en, es };

export function getDict(lang: Lang): Dict {
  return dicts[lang] ?? en;
}

export type { Dict, Lang };

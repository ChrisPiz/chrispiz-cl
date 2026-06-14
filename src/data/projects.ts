export type Mark = 'triangle' | 'square' | 'circle';

export interface Project {
  name: string;
  url: string;
  blurb: { en: string; es: string };
  /** color class on .proj — o=orange, b=blue, y=yellow */
  cls: 'o' | 'b' | 'y';
  /** css grid-area */
  area: 'rabbit' | 'tupc' | 'brium';
  mark: Mark;
}

export const projects: Project[] = [
  {
    name: 'Rabbit Hole',
    url: 'https://rabbithole.cl',
    blurb: {
      en: '3D printing, prototyping & custom digital fabrication.',
      es: 'Impresión 3D, prototipado y fabricación digital a medida.',
    },
    cls: 'o',
    area: 'rabbit',
    mark: 'triangle',
  },
  {
    name: 'Tu PC Fácil',
    url: 'https://tupcfacil.com',
    blurb: {
      en: 'AI tool to build compatible PCs in Chile by use & budget.',
      es: 'Herramienta de IA para armar PCs compatibles en Chile según uso y presupuesto.',
    },
    cls: 'b',
    area: 'tupc',
    mark: 'square',
  },
  {
    name: 'Brium',
    url: 'https://brium.cl',
    blurb: {
      en: 'Personal studio: web, AI, automation & digital products.',
      es: 'Estudio personal: web, IA, automatización y productos digitales.',
    },
    cls: 'y',
    area: 'brium',
    mark: 'circle',
  },
];

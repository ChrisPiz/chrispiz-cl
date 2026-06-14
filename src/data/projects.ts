export type Mark = 'triangle' | 'square' | 'circle';

export interface Project {
  name: string;
  url: string;
  /** copy keyed by lang */
  blurb: { en: string; es: string };
  /** css var token name without -- prefix */
  color: 'rabbithole' | 'tupcfacil' | 'brium';
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
    color: 'rabbithole',
    mark: 'triangle',
  },
  {
    name: 'Tu PC Fácil',
    url: 'https://tupcfacil.com',
    blurb: {
      en: 'AI tool to build compatible PCs in Chile by use & budget.',
      es: 'Herramienta con IA para armar PCs compatibles en Chile según uso y presupuesto.',
    },
    color: 'tupcfacil',
    mark: 'square',
  },
  {
    name: 'Brium',
    url: 'https://brium.cl',
    blurb: {
      en: 'Personal studio: web, AI, automation & digital products.',
      es: 'Estudio personal: web, IA, automatización y productos digitales.',
    },
    color: 'brium',
    mark: 'circle',
  },
];

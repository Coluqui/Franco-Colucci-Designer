/**
 * Skills · PRD v4.0 §5: el software con el que Franco produce cada pieza, agrupado.
 * Fuente: portfolio2026-twhh.vercel.app (sección "Herramientas e IA").
 * Nombres propios (iguales en ES y EN); para qué se usa cada uno sale de i18n (`skills.items.<id>`).
 * Logos: Simple Icons (CC0) en src/assets/logos/. Adobe y CapCut no están en Simple Icons
 * (Adobe pidió quitarlos): llevan sus siglas en una caja, como en la web anterior.
 */
import figma from '../assets/logos/figma.svg?raw';
import canva from '../assets/logos/canva.svg?raw';
import wordpress from '../assets/logos/wordpress.svg?raw';
import openai from '../assets/logos/openai.svg?raw';
import gemini from '../assets/logos/googlegemini.svg?raw';
import claude from '../assets/logos/claude.svg?raw';
import elevenlabs from '../assets/logos/elevenlabs.svg?raw';

/** SVG sin <title> ni role: el logo es decorativo (el nombre va como texto al lado). */
const limpio = (svg: string) => svg.replace(/<title>.*?<\/title>/, '').replace(' role="img"', ' aria-hidden="true" focusable="false"');

export type Herramienta = { id: string; nombre: string } & ({ logo: string } | { siglas: string });

export const gruposHerramientas = [
  {
    grupo: 'design',
    items: [
      { id: 'illustrator', nombre: 'Adobe Illustrator', siglas: 'Ai' },
      { id: 'photoshop', nombre: 'Adobe Photoshop', siglas: 'Ps' },
      { id: 'indesign', nombre: 'Adobe InDesign', siglas: 'Id' },
      { id: 'figma', nombre: 'Figma', logo: limpio(figma) },
      { id: 'canva', nombre: 'Canva', logo: limpio(canva) },
    ],
  },
  {
    grupo: 'video',
    items: [
      { id: 'aftereffects', nombre: 'Adobe After Effects', siglas: 'Ae' },
      { id: 'premiere', nombre: 'Adobe Premiere Pro', siglas: 'Pr' },
      { id: 'capcut', nombre: 'CapCut', siglas: 'Cc' },
    ],
  },
  {
    grupo: 'web',
    items: [{ id: 'wordpress', nombre: 'WordPress', logo: limpio(wordpress) }],
  },
  {
    grupo: 'ai',
    items: [
      { id: 'chatgpt', nombre: 'ChatGPT', logo: limpio(openai) },
      { id: 'nanobanana', nombre: 'Nano Banana (Gemini)', logo: limpio(gemini) },
      { id: 'claudecode', nombre: 'Claude Code', logo: limpio(claude) },
      { id: 'elevenlabs', nombre: 'ElevenLabs', logo: limpio(elevenlabs) },
    ],
  },
] as const satisfies ReadonlyArray<{ grupo: string; items: readonly Herramienta[] }>;

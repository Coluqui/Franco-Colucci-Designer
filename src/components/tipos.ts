import type { ImageMetadata } from 'astro';

/** Una pieza tal como la muestran el tile y el visor. Un carrusel es UNA pieza con varios slides (PRD §6). */
export interface PiezaVista {
  slug: string;
  /** Cliente o marca, para la etiqueta del tile ("cliente · formato"). */
  cliente: string;
  /** Nombre visible del formato ("Carrusel", "Post", "Story"…), ya traducido. */
  formato: string;
  /** Proporción de la pieza, "4:5". */
  ratio: string;
  slides: Array<{ src: ImageMetadata; alt: string }>;
}

/** "4:5" → "4 / 5" (para aspect-ratio). */
export const aspecto = (ratio: string) => ratio.replace(':', ' / ');

/**
 * Servicios · PRD §8: seis servicios, cada uno con la proporción de su pieza de vista previa
 * (Ads 1:1, Redes 4:5, Reels 9:16, Mail 3:1, Web 16:10, Branding 4:5).
 * Nombres y descripciones salen de i18n (`serviceItems.<slug>.*`); las piezas de vista previa
 * las elige Franco (PENDIENTE, ver docs/pendientes.md).
 */
import type { servicios } from '../content.config';

export type ServicioSlug = (typeof servicios)[number];

/** Nombre del token --ratio-* del formato de la vista previa. */
export type RatioServicio = 'square' | 'carousel' | 'reel' | 'mail-header' | 'web';

export const ratioServicio: Record<ServicioSlug, RatioServicio> = {
  ads: 'square',
  redes: 'carousel',
  reels: 'reel',
  mail: 'mail-header',
  web: 'web',
  branding: 'carousel',
};

export const ordenServicios: readonly ServicioSlug[] = ['ads', 'redes', 'reels', 'mail', 'web', 'branding'];

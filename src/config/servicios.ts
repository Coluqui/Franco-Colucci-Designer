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

/** Tipo de pieza que filtra Trabajos desde cada servicio (PRD v4.0); sin tipo, Trabajos sin filtro. */
export const tipoDeServicio: Partial<Record<ServicioSlug, 'redes' | 'ads' | 'identidad'>> = {
  ads: 'ads',
  redes: 'redes',
  reels: 'redes',
  branding: 'identidad',
};

export const ordenServicios: readonly ServicioSlug[] = ['ads', 'redes', 'reels', 'mail', 'web', 'branding'];

/**
 * Pieza de vista previa de cada servicio (slug de la colección `piezas`; se muestra su slide 1).
 * Mail 3:1 y Web 16:10 no tienen pieza todavía: PENDIENTE (docs/pendientes.md).
 * La pieza se recorta dentro del marco del servicio; nunca se deforma.
 */
export const piezaServicio: Partial<Record<ServicioSlug, string>> = {
  ads: 'condimento-ad-otra-campana',
  redes: 'moondesk-carrusel-nacimos-de-un-error',
  reels: 'moondesk-story-testimonio',
  branding: 'condimento-branding',
};

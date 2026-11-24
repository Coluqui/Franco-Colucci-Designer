/**
 * Acceso a los proyectos y sus piezas, ya localizados para las páginas (PRD v4.0).
 * El orden sale del campo `orden`; el "Siguiente proyecto" vuelve al primero después del último.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { t, localizePath, type Lang } from '../i18n';
import { formatos, tiposPieza } from '../content.config';

type Pieza = CollectionEntry<'piezas'>['data'];
export type TipoPieza = (typeof tiposPieza)[number];

export type Caso = CollectionEntry<'casos'>['data'] & {
  /** Tipos de pieza del proyecto con su cantidad, en el orden de `tiposPieza` (un carrusel cuenta 1). */
  tipos: Array<{ tipo: TipoPieza; cantidad: number }>;
  /** Portada para la card y el hero: el hero propio o el slide 1 de la primera pieza. */
  portada?: Pieza['slides'][number] | undefined;
};

const ordenar = (a: Pieza, b: Pieza) =>
  (a.orden ?? Infinity) - (b.orden ?? Infinity) ||
  formatos.indexOf(a.formato) - formatos.indexOf(b.formato) ||
  a.slug.localeCompare(b.slug);

export async function getPiezasDeCaso(slug: string): Promise<Pieza[]> {
  const piezas = await getCollection('piezas', (p) => p.data.caso === slug);
  return piezas.map((p) => p.data).sort(ordenar);
}

export async function getCasos(): Promise<Caso[]> {
  const casos = (await getCollection('casos')).map((c) => c.data).sort((a, b) => a.orden - b.orden);
  return Promise.all(
    casos.map(async (c) => {
      const piezas = await getPiezasDeCaso(c.slug);
      const tipos = tiposPieza
        .map((tipo) => ({ tipo, cantidad: piezas.filter((p) => p.tipo === tipo).length }))
        .filter((x) => x.cantidad > 0);
      const portada = c.hero && c.heroAlt ? { src: c.hero, alt: c.heroAlt } : piezas[0]?.slides[0];
      return { ...c, tipos, portada };
    }),
  );
}

export function siguienteCaso(casos: Caso[], slug: string): Caso | undefined {
  if (casos.length < 2) return undefined;
  const i = casos.findIndex((c) => c.slug === slug);
  return casos[(i + 1) % casos.length];
}

export const nombreTipo = (lang: Lang, tipo: TipoPieza) => t(lang, `pieceTypes.${tipo}`);

export const hrefCaso = (lang: Lang, slug: string) => localizePath(lang, `trabajos/${slug}/`);

/** Props de FilaCaso (card de proyecto) para un proyecto. */
export function filaDeCaso(lang: Lang, c: Caso) {
  return {
    slug: c.slug,
    href: hrefCaso(lang, c.slug),
    titulo: c.cliente,
    tipo: c.rol[lang],
    descripcion: c.descripcion[lang],
    servicios: c.tipos.map((x) => `${nombreTipo(lang, x.tipo)} ${x.cantidad}`),
    imagen: c.portada?.src,
    alt: c.portada?.alt[lang],
  };
}

/**
 * Acceso a los casos y sus piezas, ya localizados para las páginas.
 * El orden sale del campo `orden`; el "Siguiente caso" vuelve al primero después del último.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { t, localizePath, type Lang } from '../i18n';
import { formatos } from '../content.config';
import type { ServicioSlug } from '../config/servicios';

export type Caso = CollectionEntry<'casos'>['data'];

export async function getCasos(): Promise<Caso[]> {
  const casos = await getCollection('casos');
  return casos.map((c) => c.data).sort((a, b) => a.orden - b.orden);
}

export async function getPiezasDeCaso(slug: string) {
  const piezas = await getCollection('piezas', (p) => p.data.caso === slug);
  const clave = (p: (typeof piezas)[number]['data']) => [p.orden ?? Infinity, formatos.indexOf(p.formato)] as const;
  return piezas
    .map((p) => p.data)
    .sort((a, b) => {
      const [oa, fa] = clave(a);
      const [ob, fb] = clave(b);
      return oa - ob || fa - fb || a.slug.localeCompare(b.slug);
    });
}

export function siguienteCaso(casos: Caso[], slug: string): Caso | undefined {
  if (casos.length < 2) return undefined;
  const i = casos.findIndex((c) => c.slug === slug);
  return casos[(i + 1) % casos.length];
}

export const nombreServicio = (lang: Lang, s: ServicioSlug) => t(lang, `serviceItems.${s}.name`);

export const hrefCaso = (lang: Lang, slug: string) => localizePath(lang, `trabajos/${slug}/`);

/** Props de FilaCaso para un caso. */
export function filaDeCaso(lang: Lang, c: Caso) {
  return {
    href: hrefCaso(lang, c.slug),
    titulo: c.titulo[lang],
    tipo: c.tipo[lang],
    metricas: c.metricas.slice(0, 2).map((m) => ({ valor: m.valor, etiqueta: m.etiqueta[lang] })),
    descripcion: c.descripcion[lang],
    servicios: c.servicios.map((s) => nombreServicio(lang, s)),
    imagen: c.hero,
    alt: c.heroAlt?.[lang],
  };
}

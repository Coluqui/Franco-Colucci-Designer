/**
 * sitemap.xml · PRD §11 (SEO). Cada página indexable en los dos idiomas, con su par en el otro
 * (xhtml:link hreflang). Sin la 404 ni /dev/.
 */
import type { APIRoute } from 'astro';
import { getCasos } from '../lib/casos';
import { locales, localizePath, defaultLang, type Lang } from '../i18n';

export const GET: APIRoute = async ({ site }) => {
  const rutas = ['', 'trabajos/', ...(await getCasos()).map((c) => `trabajos/${c.slug}/`), 'sobre-mi/', 'hablemos/'];
  const url = (lang: Lang, ruta: string) => new URL(localizePath(lang, ruta), site).href;
  const pares = (ruta: string) =>
    [...locales.map((l) => [l, url(l, ruta)]), ['x-default', url(defaultLang, ruta)]]
      .map(([l, href]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`)
      .join('\n');
  const entradas = rutas.flatMap((ruta) => locales.map((l) => `  <url>\n    <loc>${url(l, ruta)}</loc>\n${pares(ruta)}\n  </url>`));
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entradas.join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};

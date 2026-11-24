/** robots.txt · cerrado salvo en producción con INDEXAR=true (src/config/indexar.ts). */
import type { APIRoute } from 'astro';
import { indexar } from '../config/indexar';

export const GET: APIRoute = ({ site }) =>
  new Response(
    indexar ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site)}\n` : 'User-agent: *\nDisallow: /\n',
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );

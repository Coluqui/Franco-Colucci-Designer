/**
 * ¿Se indexa este deploy? Solo producción de Vercel con INDEXAR=true (Franco la prende cuando no
 * queden textos PENDIENTE). Previews, local y producción sin la variable: noindex y robots.txt cerrado.
 * Solo servidor (astro:env/server): no importarlo desde scripts del cliente.
 */
import { INDEXAR, VERCEL_ENV } from 'astro:env/server';

export const indexar = INDEXAR && VERCEL_ENV === 'production';

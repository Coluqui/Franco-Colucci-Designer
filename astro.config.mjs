// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // `site` se completa al tener dominio (Fase 8): lo necesitan hreflang, Open Graph y sitemap.
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      // Las dos lenguas llevan prefijo: /es/ y /en/.
      prefixDefaultLocale: true,
      // `/` no redirige en el build: src/pages/index.astro elige según el idioma del navegador.
      redirectToDefaultLocale: false,
    },
  },
});

// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // URL pública: Vercel pasa la de producción al compilar (con dominio propio, la toma sola).
  // Hace absolutos el canonical, hreflang, Open Graph y el sitemap.
  site: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321',
  // Todo es estático salvo /[lang]/hablemos/ y la acción del formulario (`prerender = false`).
  adapter: vercel(),
  env: {
    schema: {
      // Opcionales: sin clave el sitio compila y el formulario muestra el error de envío (.env.example).
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACTO_DESTINO: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACTO_REMITENTE: envField.string({ context: 'server', access: 'secret', default: 'Portfolio <onboarding@resend.dev>' }),
      // Indexación: solo con INDEXAR=true en el deploy de producción de Vercel (src/config/indexar.ts).
      INDEXAR: envField.boolean({ context: 'server', access: 'public', default: false }),
      VERCEL_ENV: envField.string({ context: 'server', access: 'public', optional: true }),
    },
  },
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

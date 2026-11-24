// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // `site` se completa al tener dominio (Fase 8): lo necesitan hreflang, Open Graph y sitemap.
  // Todo es estático salvo /[lang]/hablemos/ y la acción del formulario (`prerender = false`).
  adapter: vercel(),
  env: {
    schema: {
      // Opcionales: sin clave el sitio compila y el formulario muestra el error de envío (.env.example).
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACTO_DESTINO: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACTO_REMITENTE: envField.string({ context: 'server', access: 'secret', default: 'Portfolio <onboarding@resend.dev>' }),
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

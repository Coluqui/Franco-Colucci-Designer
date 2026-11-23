import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Piezas de trabajo · modelo del PRD §8.
 * Una carpeta por pieza: src/assets/trabajos/<slug>/ con pieza.json + sus slides.
 * Regla de carruseles (PRD §6): un carrusel es UNA pieza con varios slides;
 * una pieza simple tiene un solo slide.
 */

const localized = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
});

/** Formatos de pieza (filtro "por formato" del caso y etiqueta del tile). */
/** El orden también es el de la grilla del caso y el de los chips: lo digital primero, impresos al final. */
export const formatos = ['carrusel', 'post', 'story', 'reel', 'ad', 'branding', 'mail', 'web', 'ebook', 'impreso'] as const;

const piezas = defineCollection({
  loader: glob({
    base: './src/assets/trabajos',
    pattern: '*/pieza.json',
    // El id es el slug de la carpeta; tiene que coincidir con el campo `slug`.
    generateId: ({ entry, data }) => {
      const folder = entry.split('/')[0] ?? entry;
      if (data['slug'] !== folder) {
        throw new Error(`piezas: la carpeta "${folder}" no coincide con slug "${String(data['slug'])}"`);
      }
      return folder;
    },
  }),
  schema: ({ image }) =>
    z
      .object({
        slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug en kebab-case: minúsculas, números y guiones'),
        /** Slug del caso al que pertenece (agregado al modelo del PRD §8 para contar "piezas por caso"). */
        caso: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        formato: z.enum(formatos),
        /** Orden curado dentro del caso (menor primero). Sin orden: por formato y después por slug. */
        orden: z.number().int().min(1).optional(),
        /** Proporción de la pieza, p. ej. "4:5", "9:16", "16:10". */
        ratio: z.string().regex(/^\d+(?:\.\d+)?:\d+(?:\.\d+)?$/, 'ratio como "4:5"'),
        titulo: localized,
        objetivo: localized,
        /** Métrica del chip (número + etiqueta). Opcional: nunca se inventa. */
        metrica: z
          .object({
            valor: z.string().min(1),
            etiqueta: localized,
          })
          .optional(),
        slides: z
          .array(
            z.object({
              src: image(),
              alt: localized,
              /** Video opcional (reels): la imagen funciona de póster. */
              video: z.string().optional(),
            }),
          )
          .min(1),
      })
      .refine((p) => p.formato !== 'carrusel' || p.slides.length >= 2, {
        message: 'Un carrusel tiene al menos 2 slides (y cuenta como una sola pieza).',
        path: ['slides'],
      }),
});

/** Servicios (PRD §8): filtran Trabajos y arman la lista de servicios. */
export const servicios = ['ads', 'redes', 'reels', 'mail', 'web', 'branding'] as const;

const kebab = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug en kebab-case');

/**
 * Casos · PRD §5 (página de caso) y §8 (plantilla de caso obligatoria).
 * Un JSON por caso en src/content/casos/<slug>.json. Las piezas se vinculan con su campo `caso`.
 * Nada se inventa: textos "PENDIENTE: …" hasta que Franco aporte los datos; métricas y testimonio
 * pueden faltar (la página no muestra esos bloques).
 */
const casos = defineCollection({
  loader: glob({
    base: './src/content/casos',
    pattern: '*.json',
    generateId: ({ entry, data }) => {
      const nombre = entry.replace(/\.json$/, '');
      if (data['slug'] !== nombre) {
        throw new Error(`casos: el archivo "${entry}" no coincide con slug "${String(data['slug'])}"`);
      }
      return nombre;
    },
  }),
  schema: ({ image }) =>
    z.object({
      slug: kebab,
      /** Orden en la home y en Trabajos; también define el "Siguiente caso". */
      orden: z.number().int().min(1),
      cliente: z.string().min(1),
      /** Título del caso (H1 de su página, nombre en la fila). */
      titulo: localized,
      /** Frase del caso: qué se resolvió, en una línea. */
      frase: localized,
      /** Tipo de trabajo, en la fila ("Campaña · Redes y ads"). */
      tipo: localized,
      /** Descripción corta de la fila (1–2 líneas). */
      descripcion: localized,
      rol: localized,
      anio: z.number().int().min(2000).max(2100).optional(),
      servicios: z.array(z.enum(servicios)).min(1),
      herramientas: z.array(z.string().min(1)).default([]),
      problema: localized,
      /** "Lo que hice": pasos en orden. */
      pasos: z.array(localized).min(1),
      resultado: localized,
      /** 2–4 métricas reales; vacío hasta tenerlas (nunca se inventan). */
      metricas: z
        .array(z.object({ valor: z.string().min(1), etiqueta: localized }))
        .max(4)
        .default([]),
      testimonio: z
        .object({ cita: localized, autor: z.string().min(1), rol: localized })
        .optional(),
      /** Hero del caso (mockup o pieza a ancho completo); la fila lo recorta a 16:10, el caso a 16:8. */
      hero: image().optional(),
      heroAlt: localized.optional(),
    }),
});

export const collections = { piezas, casos };

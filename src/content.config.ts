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
export const formatos = ['post', 'carrusel', 'story', 'reel', 'ad', 'mail', 'web', 'ebook', 'branding', 'impreso'] as const;

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

export const collections = { piezas };

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

/** Tipos de pieza (PRD v4.0 §8). El orden es el de los grupos en la página del proyecto. */
export const tiposPieza = ['redes', 'ads', 'documentos', 'lanzamientos', 'identidad'] as const;

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
        /** Tipo de pieza (PRD v4.0): agrupa las piezas en la página del proyecto y filtra Trabajos. */
        tipo: z.enum(tiposPieza),
        titulo: localized,
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

/** Servicios (PRD §8): arman la lista de "Qué hago". */
export const servicios = ['ads', 'redes', 'reels', 'mail', 'web', 'branding'] as const;

const kebab = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug en kebab-case');

/**
 * Proyectos · PRD v4.0 §5 y §8: un proyecto es una empresa con el rol de Franco, qué es la empresa y
 * cómo fue el trabajo, y sus piezas agrupadas por tipo. Un JSON por proyecto en src/content/casos/<slug>.json;
 * las piezas se vinculan con su campo `caso`. Sin objetivo, métricas ni pasos.
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
      /** Orden en la home y en Trabajos; también define el "Siguiente proyecto". */
      orden: z.number().int().min(1),
      /** Empresa: H1 del proyecto y nombre en la card. */
      cliente: z.string().min(1),
      rol: localized,
      /** Qué es la empresa y cómo fue el proyecto (un párrafo). */
      descripcion: localized,
      /** Hero opcional (mockup a ancho completo). Sin hero, se usa la portada de la primera pieza. */
      hero: image().optional(),
      heroAlt: localized.optional(),
    }),
});

export const collections = { piezas, casos };

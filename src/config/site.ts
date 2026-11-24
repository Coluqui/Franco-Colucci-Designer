/**
 * Datos de contacto y archivos del sitio.
 * PENDIENTE: Franco completa los valores en null (docs/pendientes.md).
 * Mientras un valor sea null, el componente lo muestra como pendiente y no genera un link roto.
 */
import type { Lang } from '../i18n';

export const site = {
  nombre: 'Franco Colucci',
  anio: 2026,
  /** Ej.: 'hola@dominio.com' */
  mail: null as string | null,
  /** Número en formato internacional sin signos, ej.: '5492610000000' */
  whatsapp: null as string | null,
  /** URL completa del perfil */
  linkedin: null as string | null,
  /** Imagen para compartir (Open Graph, 1200 × 630) en public/, ej.: '/og.png'. PENDIENTE de Franco. */
  ogImagen: null as string | null,
  /** PDF del CV por idioma, servidos desde public/cv/ */
  cv: { es: null, en: null } as Record<Lang, string | null>,
};

export const mailHref = () => (site.mail ? `mailto:${site.mail}` : null);
export const whatsappHref = () => (site.whatsapp ? `https://wa.me/${site.whatsapp}` : null);
export const linkedinHref = () => site.linkedin;
export const cvHref = (lang: Lang) => site.cv[lang];

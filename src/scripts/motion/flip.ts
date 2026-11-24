/**
 * FLIP (First, Last, Invert, Play) para el visor (M08, M09) y los filtros (M12).
 * Uso: const antes = medir(el); …cambiar el DOM…; flip(el, antes, resorte('snap')).
 * La escala es siempre uniforme: una pieza viaja sin deformarse (docs/motion.md §3.1).
 * Con movimiento reducido no hay FLIP: el cambio es instantáneo (o el fundido del componente).
 */
import { animar, reducido, type OpcionesAnimar } from './base';

export const medir = (el: Element) => el.getBoundingClientRect();

export function flip(el: HTMLElement, antes: DOMRect, opciones: OpcionesAnimar): Animation | null {
  if (reducido()) return null;
  const despues = el.getBoundingClientRect();
  if (!despues.width || !despues.height) return null;
  const dx = antes.left - despues.left;
  const dy = antes.top - despues.top;
  // Uniforme: la proporción que manda es el ancho (el alto sigue al aspect-ratio de la pieza).
  const s = antes.width / despues.width;
  if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(s - 1) < 0.001) return null;
  el.style.transformOrigin = '0 0';
  return animar(el, { transform: 'none' }, { ...opciones, desde: { transform: `translate(${dx}px, ${dy}px) scale(${s})` } });
}

/** La caja que ocupa de verdad una imagen con object-fit: contain dentro de su elemento (visor). */
export function cajaContenida(img: HTMLImageElement): DOMRect {
  const caja = img.getBoundingClientRect();
  const w = img.naturalWidth || Number(img.getAttribute('width')) || caja.width;
  const h = img.naturalHeight || Number(img.getAttribute('height')) || caja.height;
  const s = Math.min(caja.width / w, caja.height / h);
  const ancho = w * s;
  const alto = h * s;
  return new DOMRect(caja.left + (caja.width - ancho) / 2, caja.top + (caja.height - alto) / 2, ancho, alto);
}


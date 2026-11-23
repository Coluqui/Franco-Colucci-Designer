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

/**
 * Encastre (docs/motion.md §2): un marco cambia de proporción con --spring-snap y la pieza se
 * reacomoda adentro. El marco es el recorte (`clip-path: inset()`, excepción ⚠ de M04, M05 y M20)
 * de una capa de tamaño fijo: cambia el formato sin mover el layout y sin deformar la pieza.
 */
import { animar, resorte, token, type OpcionesAnimar } from './base';

export interface Medida {
  w: number;
  h: number;
}

/** Un marco de proporción `ratio` (ancho / alto) lo más grande posible dentro de la caja, centrado. */
export const marcoEn = (caja: Medida, ratio: number): Medida => {
  const w = Math.min(caja.w, caja.h * ratio);
  return { w, h: w / ratio };
};

/** "4 / 5" o "4:5" → 0.8 */
export const proporcion = (valor: string) => {
  const [a, b] = valor.split(/[/:]/).map((n) => parseFloat(n));
  return a && b ? a / b : 1;
};

/** El recorte que deja ver un marco centrado de tamaño `marco` dentro de la caja. */
export const recorte = (caja: Medida, marco: Medida, radio = token('--radius-xs')) => {
  const x = Math.max(0, (caja.w - marco.w) / 2);
  const y = Math.max(0, (caja.h - marco.h) / 2);
  return `inset(${y}px ${x}px round ${radio})`;
};

export const medida = (el: HTMLElement): Medida => ({ w: el.offsetWidth, h: el.offsetHeight });

/** Lleva el recorte de la capa a `hasta` con el resorte del encastre (interrumpible). */
export const encastrar = (capa: HTMLElement, hasta: string, opciones: OpcionesAnimar = {}) =>
  animar(capa, { clipPath: hasta }, { ...resorte('snap'), ...opciones });

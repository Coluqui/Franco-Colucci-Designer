/**
 * Un solo IntersectionObserver compartido para todo el sitio (docs/motion.md §8).
 * - `observar(el, cb)`: avisa cada vez que el elemento entra o sale (loop del hero, frase).
 * - `alEntrar(el, cb)`: una vez, cuando entra un 15 % (entradas M16, M17), y deja de observar.
 * Sin JS no corre nada de esto y todo se ve.
 */

import { alSalir } from '../pagina';
import { alCambiarReducido, animar, numero, resorte } from './base';

type Aviso = (entrada: IntersectionObserverEntry) => void;

/** Umbral de las entradas por scroll: 15 % del elemento en pantalla. */
export const UMBRAL_ENTRADA = 0.15;

const avisos = new Map<Element, Set<Aviso>>();
let io: IntersectionObserver | null = null;

const observador = () =>
  (io ??= new IntersectionObserver(
    (entradas) => entradas.forEach((e) => avisos.get(e.target)?.forEach((f) => f(e))),
    { threshold: [0, UMBRAL_ENTRADA] },
  ));

// Al navegar (ClientRouter) la página se reemplaza: se deja de observar todo lo de la anterior.
document.addEventListener('astro:before-swap', () => {
  io?.disconnect();
  avisos.clear();
});

/** Observa un elemento. Devuelve cómo dejar de observarlo. */
export function observar(el: Element, cb: Aviso): () => void {
  let set = avisos.get(el);
  if (!set) {
    set = new Set();
    avisos.set(el, set);
    observador().observe(el);
  }
  set.add(cb);
  return () => {
    set.delete(cb);
    if (!set.size) {
      avisos.delete(el);
      io?.unobserve(el);
    }
  };
}

/** Una sola vez, cuando el elemento entra un 15 % en pantalla. */
export function alEntrar(el: Element, cb: () => void) {
  const dejar = observar(el, (e) => {
    if (e.isIntersecting && e.intersectionRatio >= UMBRAL_ENTRADA) {
      dejar();
      cb();
    }
  });
  return dejar;
}

/** ¿Está el elemento (aunque sea en parte) dentro del viewport ahora? Para no animar lo que ya se ve. */
export const enPantalla = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
};

export interface Parte {
  el: HTMLElement;
  /** Retraso en ms respecto del disparador (p. ej. --stagger). */
  retraso?: number;
  /** Solo aparece, sin subir (p. ej. la media dentro de una fila que ya sube). */
  soloOpacidad?: boolean;
}

/**
 * Entradas por scroll (M16, M17): cuando `disparador` entra un 15 %, una sola vez, cada parte sube
 * --shift-md y aparece con --spring-soft. Lo que ya se ve al cargar no se anima ("nada arranca
 * escondido"); lo que está fuera de pantalla se esconde recién acá, cuando nadie lo ve.
 * Termina en su CSS (sin estilos en línea): no pisa el hover de las filas (M27).
 * Si algo de adentro recibe el foco antes de entrar (Tab, carga ya scrolleada), entra en ese momento:
 * nunca hay foco en algo invisible. Con colores forzados (alto contraste) no hay entradas.
 */
export function entrar(disparador: Element, partes: Parte[]) {
  if (!partes.length || enPantalla(disparador) || matchMedia('(forced-colors: active)').matches) return;
  const bajar = `translateY(${numero('--shift-md')}px)`;
  const ocultoDe = (p: Parte) => (p.soloOpacidad ? { opacity: '0' } : { opacity: '0', transform: bajar });
  partes.forEach((p) => Object.assign(p.el.style, ocultoDe(p)));

  let hecho = false;
  const revelar = () => {
    if (hecho) return;
    hecho = true;
    dejar();
    partes.forEach((p) => {
      p.el.removeEventListener('focusin', revelar);
      const desde = ocultoDe(p);
      p.el.style.opacity = '';
      p.el.style.transform = '';
      const hasta = p.soloOpacidad ? { opacity: '1' } : { opacity: '1', transform: 'none' };
      animar(p.el, hasta, { ...resorte('soft'), delay: p.retraso ?? 0, desde, soltar: true });
    });
  };
  const dejar = alEntrar(disparador, revelar);
  partes.forEach((p) => p.el.addEventListener('focusin', revelar));
  // Si el usuario pide movimiento reducido con la página abierta, lo pendiente aparece ya.
  alSalir(alCambiarReducido((r) => r && revelar()));
}

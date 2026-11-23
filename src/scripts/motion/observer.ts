/**
 * Un solo IntersectionObserver compartido para todo el sitio (docs/motion.md §8).
 * - `observar(el, cb)`: avisa cada vez que el elemento entra o sale (loop del hero, frase).
 * - `alEntrar(el, cb)`: una vez, cuando entra un 15 % (entradas M16, M17), y deja de observar.
 * Sin JS no corre nada de esto y todo se ve.
 */

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

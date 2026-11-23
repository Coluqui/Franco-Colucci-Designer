/**
 * Base del motion "Formato vivo" (docs/motion.md §8).
 * - Valores: siempre desde design-system/tokens.css, nunca escritos acá.
 * - Movimiento reducido: los tokens ya pasan a 120 ms o 0; `reducido()` solo para M04 y FLIP.
 * - Todo se interrumpe: `animar()` corta la animación en curso del elemento y sigue desde donde estaba.
 */

const raiz = () => getComputedStyle(document.documentElement);

/** Valor crudo de un token: token('--spring-snap'). */
export const token = (nombre: string) => raiz().getPropertyValue(nombre).trim();

/** Un token de tiempo en milisegundos ('560ms', '0.2s', '0'). */
export const ms = (nombre: string) => {
  const v = token(nombre);
  return v.endsWith('ms') ? parseFloat(v) : v.endsWith('s') ? parseFloat(v) * 1000 : parseFloat(v) || 0;
};

/** Un token numérico o de longitud en px ('24px', '0.15', '1.02'). */
export const numero = (nombre: string) => parseFloat(token(nombre)) || 0;

export type Resorte = 'snap' | 'soft' | 'press';
export type Curva = 'out' | 'in' | 'in-out';
export type Duracion = 'instant' | 'fast' | 'base' | 'slow' | 'page' | 'breathe';

/** Resorte cuando hay mano: { easing, duration } de --spring-<r> y --spring-<r>-duration. */
export const resorte = (r: Resorte) => ({ easing: token(`--spring-${r}`), duration: ms(`--spring-${r}-duration`) });

/** Curva cuando no: { easing, duration } de --ease-<c> y --duration-<d>. */
export const curva = (c: Curva, d: Duracion) => ({ easing: token(`--ease-${c}`), duration: ms(`--duration-${d}`) });

const consulta = () => matchMedia('(prefers-reduced-motion: reduce)');

/** ¿Movimiento reducido? Solo para las dos ramas permitidas: loop del hero (M04) y FLIP (M08, M12). */
export const reducido = () => consulta().matches;

/** Avisa cuando cambia la preferencia (p. ej. para pausar o retomar el loop). Devuelve cómo dejar de escuchar. */
export const alCambiarReducido = (cb: (reducido: boolean) => void) => {
  const q = consulta();
  const f = (e: MediaQueryListEvent) => cb(e.matches);
  q.addEventListener('change', f);
  return () => q.removeEventListener('change', f);
};

const enCurso = new WeakMap<Element, Animation>();

const aKebab = (p: string) => p.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

export interface OpcionesAnimar extends KeyframeAnimationOptions {
  /** Estado inicial. Si ya había una animación en curso se ignora: se sigue desde donde estaba. */
  desde?: Keyframe;
}

/**
 * Anima un elemento hacia `hasta` (Web Animations). Antes de empezar fija el estado actual y
 * cancela la animación anterior del mismo elemento: un segundo clic sigue desde donde estaba.
 * Al terminar, el estado final queda como estilo en línea y la animación se libera.
 * `will-change` solo mientras dura.
 */
export function animar(el: HTMLElement, hasta: Keyframe, { desde, ...opciones }: OpcionesAnimar): Animation {
  const previa = enCurso.get(el);
  const interrumpe = previa?.playState === 'running';
  if (previa) {
    if (interrumpe) previa.commitStyles();
    previa.cancel();
  }
  const props = Object.keys(hasta).filter((k) => k !== 'offset' && k !== 'easing' && k !== 'composite');
  el.style.willChange = props.map(aKebab).join(', ');
  const frames = desde && !interrumpe ? [desde, hasta] : [hasta];
  const anim = el.animate(frames, { fill: 'forwards', ...opciones });
  enCurso.set(el, anim);
  anim.finished
    .then(() => {
      anim.commitStyles();
      anim.cancel();
    })
    .catch(() => {
      /* cancelada por otra animación: la siguiente ya tomó el estado */
    })
    .finally(() => {
      if (enCurso.get(el) === anim) {
        enCurso.delete(el);
        el.style.willChange = '';
      }
    });
  return anim;
}

/** Corta la animación en curso de un elemento dejándolo donde está. */
export function detener(el: HTMLElement) {
  const a = enCurso.get(el);
  if (!a) return;
  if (a.playState === 'running') a.commitStyles();
  a.cancel();
}

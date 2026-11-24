/**
 * Lectura · M15 (docs/motion.md §5 y §8): la frase-problema y el cierre se encienden palabra por
 * palabra según el scroll. Se termina de leer cuando su centro llega al 40 % del viewport; el tramo de
 * cada palabra es proporcional a sus letras. Tres resguardos:
 *   1. Monotónica: una palabra encendida nunca se apaga.
 *   2. Autocompletado: si el scroll se detiene --reveal-idle con la frase en pantalla, el resto se
 *      enciende al ritmo de lectura (--stagger-words + --reveal-per-char por letra de la anterior).
 *   3. Una sola vez: completa, se desconecta.
 * Lectores de pantalla: leen la frase entera (copia oculta); las palabras visibles van con aria-hidden.
 * Sin JS se ve completa. Reducido: --reveal-dim vale 1, así que se ve completa desde el inicio.
 * No usa animation-timeline: view() porque no es monotónico.
 */
import { alSalir } from '../pagina';
import { alCambiarReducido, ms, numero } from './base';
import { observar } from './observer';

/** El centro de la frase llega a esta altura del viewport (desde arriba) y la frase está completa. */
const FIN = 0.4;

const activas = new Set<HTMLElement>();

/** Mientras alguien está leyendo, el loop del hero se pausa ("un protagonista por pantalla"). */
const avisar = () => {
  document.documentElement.toggleAttribute('data-leyendo', activas.size > 0);
  document.dispatchEvent(new Event('motion:lectura'));
};

export function lectura(el: HTMLElement) {
  const texto = el.textContent?.trim().replace(/\s+/g, ' ') ?? '';
  if (!texto || el.dataset['lectura'] !== undefined) return;
  // Ya se ve completa (reducido: --reveal-dim 1; alto contraste; o el respaldo corrió porque el script
  // llegó tarde): no se parte ni se vuelve a apagar. Queda el texto tal cual.
  if (getComputedStyle(el).opacity === '1' || matchMedia('(forced-colors: active)').matches) {
    el.dataset['lectura'] = '';
    return;
  }

  const palabras = texto.split(' ');
  const oculto = document.createElement('span');
  oculto.className = 'visually-hidden';
  oculto.textContent = texto;
  const visible = document.createElement('span');
  visible.setAttribute('aria-hidden', 'true');
  const spans = palabras.map((p, i) => {
    const s = document.createElement('span');
    s.className = 'lectura__palabra';
    s.textContent = p;
    visible.append(s);
    if (i < palabras.length - 1) visible.append(' ');
    return s;
  });
  el.replaceChildren(oculto, visible);
  el.dataset['lectura'] = '';

  // Tramo de cada palabra, proporcional a sus letras.
  const total = palabras.reduce((n, p) => n + p.length, 0);
  let acumulado = 0;
  const tramos = palabras.map((p) => {
    const t = { desde: acumulado / total, largo: p.length / total };
    acumulado += p.length;
    return t;
  });

  const dim = numero('--reveal-dim');
  const nivel = spans.map(() => dim);
  spans.forEach((s) => (s.style.opacity = String(dim)));

  let visibleAhora = false;
  let cuadro = 0;
  let espera: number | undefined;
  let completa = dim >= 1;

  const centro = () => {
    const r = el.getBoundingClientRect();
    return r.top + r.height / 2;
  };

  /** Se desconecta. `soltar`: deja de contar como lectura (el loop del hero puede volver). */
  const terminar = (soltar = true) => {
    completa = true;
    window.clearTimeout(espera);
    cancelAnimationFrame(cuadro);
    removeEventListener('scroll', alScroll);
    dejar();
    dejarReducido();
    if (soltar && activas.delete(el)) avisar();
  };

  const pintar = () => {
    cuadro = 0;
    const vh = innerHeight;
    const progreso = Math.min(1, Math.max(0, (vh - centro()) / (vh * (1 - FIN))));
    spans.forEach((s, k) => {
      const { desde, largo } = tramos[k]!;
      const o = dim + (1 - dim) * Math.min(1, Math.max(0, (progreso - desde) / largo));
      if (o > nivel[k]!) {
        nivel[k] = o; // monotónica
        s.style.opacity = String(o);
      }
    });
    const leyendo = progreso > 0 && progreso < 1;
    if (leyendo !== activas.has(el)) {
      if (leyendo) activas.add(el);
      else activas.delete(el);
      avisar();
    }
    if (nivel.every((n) => n >= 1)) terminar();
  };

  /** El usuario frenó con la frase en pantalla (aunque sea su primera línea): lo que falta se enciende
   *  al ritmo de lectura. Mientras se enciende, sigue contando como lectura (el loop espera). */
  const autocompletar = () => {
    if (completa || !visibleAhora || el.getBoundingClientRect().top >= innerHeight) return;
    const porPalabra = ms('--stagger-words');
    const porLetra = ms('--reveal-per-char');
    let retraso = 0;
    let ultima = 0;
    spans.forEach((s, k) => {
      if (nivel[k]! >= 1) return;
      s.style.transitionDelay = `${retraso}ms`;
      s.style.opacity = '1';
      nivel[k] = 1;
      ultima = retraso;
      retraso += porPalabra + porLetra * palabras[k]!.length;
    });
    if (!activas.has(el)) {
      activas.add(el);
      avisar();
    }
    terminar(false);
    // Un solo aviso cuando la última palabra terminó de encenderse.
    window.setTimeout(() => {
      if (activas.delete(el)) avisar();
    }, ultima + ms('--duration-fast'));
  };

  const programarAutocompletado = () => {
    window.clearTimeout(espera);
    espera = window.setTimeout(autocompletar, ms('--reveal-idle'));
  };

  function alScroll() {
    if (!cuadro) cuadro = requestAnimationFrame(pintar);
    programarAutocompletado();
  }

  const dejar = observar(el, (e) => {
    visibleAhora = e.isIntersecting;
    if (visibleAhora) {
      addEventListener('scroll', alScroll, { passive: true });
      pintar();
      programarAutocompletado();
    } else {
      removeEventListener('scroll', alScroll);
      window.clearTimeout(espera);
      if (activas.delete(el)) avisar();
    }
  });

  // Si el usuario pide movimiento reducido con la página abierta, la frase se completa ya.
  const dejarReducido = alCambiarReducido((r) => {
    if (!r || completa) return;
    spans.forEach((s, k) => {
      s.style.transitionDelay = '';
      s.style.opacity = '1';
      nivel[k] = 1;
    });
    terminar();
  });

  if (completa) terminar();
  // Al navegar a otra página: se suelta todo (y el loop del hero deja de esperar).
  else alSalir(() => {
    if (!completa) terminar();
    else if (activas.delete(el)) avisar();
  });
}

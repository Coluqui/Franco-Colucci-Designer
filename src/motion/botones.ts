/**
 * 4.9 · Botones: cambio de texto. En hover, el texto sale hacia arriba y vuelve a entrar desde abajo
 * dentro de su máscara (.boton__mascara), ease.inOut, dur.fast en total. Solo con puntero fino y sin
 * movimiento reducido (lo decide initMotion). Si el texto está cambiando por un estado (Descargando,
 * Copiado: rodarTexto en micro.ts), no se toca.
 */
import { gsap } from './gsap';
import { dur, ease } from './tokens';

export function cambiarTextoBotones() {
  const ac = new AbortController();
  document.querySelectorAll<HTMLElement>('.boton:not(.boton--pendiente)').forEach((boton) => {
    const texto = boton.querySelector<HTMLElement>('.boton__texto');
    if (!texto) return;
    boton.addEventListener(
      'pointerenter',
      (e) => {
        if (e.pointerType !== 'mouse' || boton.matches('[aria-disabled="true"], :disabled')) return;
        if (gsap.isTweening(texto) || texto.getAnimations().length) return;
        gsap
          .timeline()
          .to(texto, { yPercent: -100, duration: dur.fast / 2, ease: ease.inOut })
          .fromTo(texto, { yPercent: 100 }, { yPercent: 0, duration: dur.fast / 2, ease: ease.inOut, clearProps: 'transform' });
      },
      { signal: ac.signal },
    );
  });
  return () => ac.abort();
}

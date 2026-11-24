/**
 * Logo del header (Franco, 24 nov): arriba de todo se ve "FC"; al bajar se despliega en
 * "Franco Colucci" y aparece el puesto debajo; al volver arriba se pliega.
 * Es un cambio de estado (no scrub): las letras abren su ancho (excepción como el acordeón 4.12,
 * es un elemento chico y fuera del scroll) y el nombre sube para dejar lugar al puesto.
 * Solo desde 48rem: en mobile el header no tiene lugar y queda "FC".
 * Reducido: el nombre se despliega sin animar y el puesto aparece con un fundido de dur.reducido.
 */
import { gsap, ScrollTrigger } from './gsap';
import { dur, ease, mov } from './tokens';

export function animarLogo(reducido: boolean) {
  const nombre = document.querySelector<HTMLElement>('[data-logo-nombre]');
  if (!nombre) return;
  const restos = nombre.querySelectorAll('[data-logo-resto]');
  const puesto = nombre.querySelector('[data-logo-puesto]');

  const tl = gsap.timeline({ paused: true });
  if (reducido) {
    tl.set(restos, { width: 'auto' }).set(nombre, { yPercent: mov.subidaLogo }).to(puesto, { opacity: 1, duration: dur.reducido, ease: 'none' });
  } else {
    tl.to(restos, { width: 'auto', duration: dur.base, ease: ease.inOut, stagger: mov.escalonLogo })
      .to(nombre, { yPercent: mov.subidaLogo, duration: dur.fast, ease: ease.out }, `-=${dur.fast}`)
      .fromTo(puesto, { opacity: 0, y: mov.subidaCorta / 2 }, { opacity: 1, y: 0, duration: dur.fast, ease: ease.out }, '<');
  }

  ScrollTrigger.create({
    start: mov.umbralLogo,
    end: 'max',
    onEnter: () => tl.play(),
    onLeaveBack: () => tl.reverse(),
  });
  // Si la página arranca ya scrolleada (atrás del navegador, recarga), aparece desplegado.
  if (scrollY > mov.umbralLogo) tl.progress(1);
}

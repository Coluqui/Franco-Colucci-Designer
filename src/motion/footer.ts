/**
 * 4.13 · Footer que se descubre. Al llegar al final, el interior del footer sube más lento que el
 * contenido (scrub, recortado por el propio footer): parece que el contenido se corre y lo destapa.
 * El monograma "FC" grande entra letra por letra dentro de su máscara (SplitText chars), una vez.
 * Reducido: sin scrub ni desplazamientos; el footer está quieto y visible.
 */
import { gsap, SplitText } from './gsap';
import { dur, ease, mov, stagger } from './tokens';

export function descubrirFooter(reducido: boolean) {
  const footer = document.querySelector<HTMLElement>('[data-footer]');
  if (!footer || reducido) return;
  const interior = footer.querySelector('[data-footer-interior]');
  const nombre = footer.querySelector<HTMLElement>('[data-footer-nombre]');

  if (interior)
    gsap.fromTo(
      interior,
      { yPercent: mov.footerDesde },
      { yPercent: 0, ease: 'none', scrollTrigger: { trigger: footer, start: 'top bottom', end: 'bottom bottom', scrub: true } },
    );

  if (nombre) {
    const split = SplitText.create(nombre, { type: 'chars', mask: 'chars', aria: 'none' });
    gsap.from(split.chars, {
      yPercent: 100,
      duration: dur.slow,
      ease: ease.expo,
      stagger: stagger.items,
      scrollTrigger: { trigger: nombre, start: mov.inicio, once: true },
    });
  }
}

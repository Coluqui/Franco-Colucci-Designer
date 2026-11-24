/**
 * Hero de la home · docs/motion.md v3.0.
 * 4.2 · intro (Franco, 24 nov): "F" y "C" suben dentro de su máscara y después se despliegan en
 *   "FRANCO / COLUCCI" (el ancho de "ranco" y "olucci" se abre, como el logo del header); la bajada
 *   aparece y sube. ≤ 2 s y no bloquea nada.
 * 4.3 · al scrollear el primer viewport, el wordmark se achica (1 → 0,85) y la bajada se va.
 *   Sin pin: dura el 80 % del alto del viewport.
 * Reducido: el nombre completo con un fundido corto.
 */
import { gsap } from './gsap';
import { dur, ease, mov, stagger } from './tokens';

export function animarHero(reducido: boolean) {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  const lineas = [...hero.querySelectorAll<HTMLElement>('[data-hero-linea]')];
  const bajada = hero.querySelector<HTMLElement>('[data-hero-bajada]');
  const wordmark = hero.querySelector<HTMLElement>('[data-hero-wordmark]');
  const restos = hero.querySelectorAll('[data-hero-resto]');

  if (reducido) {
    gsap.set(restos, { width: 'auto' });
    gsap.to([...lineas, bajada], { opacity: 1, duration: dur.reducido, ease: 'none' });
    return;
  }

  gsap.set([...lineas, bajada], { opacity: 1 });
  const intro = gsap.timeline({ defaults: { ease: ease.expo } });
  intro
    .from(lineas, { yPercent: 100, duration: dur.base, stagger: stagger.items })
    .to(restos, { width: 'auto', duration: dur.slow, ease: ease.inOut, stagger: mov.escalonLogo });
  if (bajada) intro.from(bajada, { opacity: 0, y: mov.subidaCorta, duration: dur.base, ease: ease.out }, `-=${dur.fast}`);

  // 4.3 · scrub sobre el primer viewport.
  const scroll = { trigger: hero, start: 'top top', end: '+=80%', scrub: true };
  if (wordmark) gsap.to(wordmark, { scale: mov.escalaHero, yPercent: -12, ease: 'none', scrollTrigger: scroll });
  if (bajada) gsap.to(bajada, { opacity: 0, ease: 'none', scrollTrigger: { ...scroll, end: '+=40%' } });
}

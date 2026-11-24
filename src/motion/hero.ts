/**
 * Hero de la home · docs/motion.md v3.0.
 * 4.2 · intro: cada línea del wordmark se parte en letras que suben dentro de su máscara (expo); el
 *   bajada aparece y sube. ≤ 1,6 s y no bloquea nada.
 * 4.3 · al scrollear el primer viewport, el wordmark se achica (1 → 0,85) y la bajada se va.
 *   Sin pin: dura el 80 % del alto del viewport.
 * Reducido: solo un fundido corto.
 */
import { gsap, SplitText } from './gsap';
import { dur, ease, mov, stagger } from './tokens';

export function animarHero(reducido: boolean) {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  const lineas = [...hero.querySelectorAll<HTMLElement>('[data-hero-linea]')];
  const bajada = hero.querySelector<HTMLElement>('[data-hero-bajada]');
  const wordmark = hero.querySelector<HTMLElement>('[data-hero-wordmark]');

  if (reducido) {
    gsap.to([...lineas, bajada], { opacity: 1, duration: dur.reducido, ease: 'none' });
    return;
  }

  gsap.set([...lineas, bajada], { opacity: 1 });
  const letras = lineas.flatMap((l) => SplitText.create(l, { type: 'chars' }).chars);
  const intro = gsap.timeline({ defaults: { ease: ease.expo } });
  intro.from(letras, { yPercent: 100, duration: dur.slow, stagger: stagger.words / 2 });
  if (bajada) intro.from(bajada, { opacity: 0, y: mov.subidaCorta, duration: dur.base, ease: ease.out }, 0.5);

  // 4.3 · scrub sobre el primer viewport.
  const scroll = { trigger: hero, start: 'top top', end: '+=80%', scrub: true };
  if (wordmark) gsap.to(wordmark, { scale: mov.escalaHero, yPercent: -12, ease: 'none', scrollTrigger: scroll });
  if (bajada) gsap.to(bajada, { opacity: 0, ease: 'none', scrollTrigger: { ...scroll, end: '+=40%' } });
}

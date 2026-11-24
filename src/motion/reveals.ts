/**
 * Revelados por scroll · docs/motion.md v3.0 · la home "se va descubriendo" al bajar.
 * - 4.4 `[data-split]`: títulos por palabras (o `data-split="lines"`, párrafos por líneas) dentro de una máscara.
 * - `[data-reveal]`: el bloque sube y aparece; `data-reveal="clip"`: la media se destapa de abajo hacia
 *   arriba y la imagen se asienta (escala dentro de su máscara, nunca se deforma).
 * - 4.8 `[data-reveal-item]`: cards y tiles entran en tandas, escalonados, una vez.
 * - 4.6 `[data-mask]`: la sección se abre con clip-path ligado al scroll; su contenido
 *   (los hijos de `[data-mask-content]`) entra después, escalonado y desenfocado → nítido.
 * Los estados iniciales están en global.css bajo `html.motion` (sin parpadeo; sin JS, todo visible).
 * Reducido: sin máscaras, scrub ni desplazamientos; solo fundidos de dur.reducido.
 */
import { gsap, ScrollTrigger, SplitText } from './gsap';
import { dur, ease, mov, stagger } from './tokens';

const una = (trigger: Element, start: string = mov.inicio) => ({ trigger, start, once: true });

const todos = <T extends Element = HTMLElement>(sel: string) => [...document.querySelectorAll<T & HTMLElement>(sel)];

export function revelar(reducido: boolean) {
  if (reducido) {
    todos('[data-split], [data-reveal], [data-mask-content] > *').forEach((el) =>
      gsap.to(el, { opacity: 1, duration: dur.reducido, ease: 'none', scrollTrigger: una(el) }),
    );
    ScrollTrigger.batch('[data-reveal-item]', {
      start: mov.inicio,
      once: true,
      onEnter: (lote) => gsap.to(lote, { opacity: 1, duration: dur.reducido, ease: 'none' }),
    });
    return;
  }

  // 4.4 · títulos y párrafos.
  todos('[data-split]').forEach((el) => {
    const lineas = el.dataset['split'] === 'lines';
    gsap.set(el, { opacity: 1 });
    SplitText.create(el, {
      type: lineas ? 'lines' : 'words',
      mask: lineas ? 'lines' : 'words',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(lineas ? self.lines : self.words, {
          yPercent: 110,
          duration: dur.base,
          ease: ease.expo,
          stagger: lineas ? stagger.items : stagger.words,
          scrollTrigger: una(el),
        }),
    });
  });

  // Bloques y media.
  todos('[data-reveal]').forEach((el) => {
    if (el.dataset['reveal'] === 'clip') {
      gsap.set(el, { opacity: 1 });
      const tl = gsap.timeline({ scrollTrigger: una(el) });
      tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: dur.slow, ease: ease.inOut });
      const img = el.querySelector('img, video');
      if (img) tl.from(img, { scale: mov.escalaMedia, duration: dur.slow, ease: ease.out, clearProps: 'transform' }, 0);
      return;
    }
    gsap.fromTo(el, { y: mov.subida, opacity: 0 }, { y: 0, opacity: 1, scrollTrigger: una(el) });
  });

  // 4.8 · cards y tiles en tandas.
  ScrollTrigger.batch('[data-reveal-item]', {
    start: mov.inicio,
    once: true,
    onEnter: (lote) => gsap.fromTo(lote, { y: mov.subida, opacity: 0 }, { y: 0, opacity: 1, stagger: stagger.items, clearProps: 'transform' }),
  });

  // 4.6 · secciones que se abren con máscara.
  todos('[data-mask]').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: `inset(15% 10% round ${mov.radioMascara})` },
      {
        clipPath: 'inset(0% 0% round 0px)',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 25%', scrub: true },
      },
    );
    const items = el.querySelectorAll('[data-mask-content] > *');
    if (items.length)
      gsap.fromTo(
        items,
        { opacity: 0, y: mov.subida, filter: `blur(${mov.blur}px)` },
        { opacity: 1, y: 0, filter: 'blur(0px)', stagger: stagger.items, clearProps: 'filter', scrollTrigger: una(el, 'top 55%') },
      );
  });
}

/** Si el teclado llega a algo que todavía no se reveló, aparece ya: nunca hay foco en algo invisible. */
export function alFocoRevelar() {
  const alFoco = (e: FocusEvent) => {
    const el = (e.target as Element).closest<HTMLElement>('[data-reveal], [data-reveal-item], [data-split], [data-mask-content] > *');
    if (el && Number(getComputedStyle(el).opacity) < 1) gsap.set(el, { opacity: 1, y: 0, clipPath: 'none', filter: 'none' });
  };
  document.addEventListener('focusin', alFoco);
  return () => document.removeEventListener('focusin', alFoco);
}

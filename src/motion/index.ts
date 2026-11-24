/**
 * initMotion() / destroyMotion() · docs/motion.md v3.0 §2.
 * Con <ClientRouter />: `astro:page-load` → init, `astro:before-swap` → destroy. Todo se crea dentro
 * de un gsap.matchMedia(), así que destroy (o un cambio de movimiento reducido) revierte tweens,
 * ScrollTriggers, SplitText y el smoother: nada se duplica al navegar.
 */
import { gsap, ScrollTrigger } from './gsap';
import { iniciarSmooth } from './smooth';
import { revelar, alFocoRevelar } from './reveals';
import { animarHero } from './hero';
import { animarLogo } from './logo';

const html = document.documentElement;
let mm: gsap.MatchMedia | null = null;
let soltarFoco: (() => void) | null = null;

export function initMotion() {
  destroyMotion();
  html.classList.add('motion');
  mm = gsap.matchMedia();
  // `siempre`: GSAP solo corre el callback si alguna condición coincide; sin ella, touch sin reducido no animaba nada.
  mm.add({ siempre: 'all', reducido: '(prefers-reduced-motion: reduce)', fino: '(hover: hover) and (pointer: fine)', ancho: '(min-width: 48rem)' }, (ctx) => {
    const { reducido, fino, ancho } = ctx.conditions as { reducido: boolean; fino: boolean; ancho: boolean };
    // El smoother va primero: los ScrollTriggers se miden contra él.
    const quitarSmooth = fino && !reducido ? iniciarSmooth() : null;
    html.toggleAttribute('data-smooth', Boolean(quitarSmooth));
    animarHero(reducido);
    if (ancho) animarLogo(reducido);
    revelar(reducido);
    return () => {
      quitarSmooth?.();
      html.removeAttribute('data-smooth');
    };
  });
  soltarFoco = alFocoRevelar();
  html.dataset['motionListo'] = '';
  // Las fuentes cambian el largo de las líneas: se vuelve a medir cuando terminan de cargar.
  // Tras un swap de ClientRouter no hay evento `load`: se mide de nuevo cuando el layout ya está armado.
  void document.fonts.ready.then(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
}

export function destroyMotion() {
  mm?.revert();
  mm = null;
  soltarFoco?.();
  soltarFoco = null;
  delete html.dataset['motionListo'];
}

document.addEventListener('astro:page-load', initMotion);
document.addEventListener('astro:before-swap', destroyMotion);
// Astro copia los atributos de <html> de la página nueva: la clase vuelve antes del primer cuadro.
document.addEventListener('astro:after-swap', () => html.classList.add('motion'));

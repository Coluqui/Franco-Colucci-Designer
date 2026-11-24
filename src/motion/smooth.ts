/**
 * 4.1 · Smooth scroll con ScrollSmoother · docs/motion.md v3.0.
 * Solo con puntero fino y sin movimiento reducido (lo decide la condición de matchMedia en index.ts).
 * Wrapper `#smooth-wrapper > #smooth-content` en Base.astro; header, menú, panel, visor y barra
 * mobile quedan afuera. Suaviza, no secuestra: la distancia de scroll es la misma.
 */
import { ScrollSmoother } from './gsap';

export function iniciarSmooth(): () => void {
  const wrapper = document.querySelector<HTMLElement>('#smooth-wrapper');
  const content = document.querySelector<HTMLElement>('#smooth-content');
  if (!wrapper || !content) return () => {};

  const smoother = ScrollSmoother.create({ wrapper, content, smooth: 1, effects: true, normalizeScroll: false });

  // Links internos (#contenido, #trabajos…): el smoother lleva el scroll; el destino recibe el foco.
  const alClic = (e: MouseEvent) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a || a.origin !== location.origin || a.pathname !== location.pathname || !a.hash) return;
    const destino = document.getElementById(decodeURIComponent(a.hash.slice(1)));
    if (!destino || !content.contains(destino)) return;
    e.preventDefault();
    smoother.scrollTo(destino, true, 'top top');
    history.replaceState(null, '', a.hash);
    destino.focus({ preventScroll: true });
  };

  // Foco con teclado en algo fuera de pantalla: el navegador movería el wrapper (fijo) y se
  // desincronizaría; se vuelve a 0 y el smoother lleva el scroll hasta el elemento.
  const alFoco = (e: FocusEvent) => {
    const el = e.target as HTMLElement;
    if (!content.contains(el)) return;
    wrapper.scrollTop = 0;
    const r = el.getBoundingClientRect();
    if (r.top < 0 || r.bottom > innerHeight) smoother.scrollTo(el, false, 'center center');
  };

  document.addEventListener('click', alClic);
  document.addEventListener('focusin', alFoco);
  return () => {
    document.removeEventListener('click', alClic);
    document.removeEventListener('focusin', alFoco);
    smoother.kill();
  };
}

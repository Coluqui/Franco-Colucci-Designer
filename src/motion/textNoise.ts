/**
 * 4.5 · Texto que se define (`data-noise-text`, efecto firma: frase-problema y cierre).
 * Con el scroll, cada palabra pasa de granulada y desenfocada a sólida: un filtro SVG propio
 * (feTurbulence + feDisplacementMap) baja su `scale` a 0 y las palabras pasan de opacity/blur a nítidas,
 * escalonadas, con scrub. Debajo queda una capa fantasma del mismo texto (baja opacidad, aria-hidden):
 * la frase nunca está vacía. El texto real sigue siendo seleccionable y SplitText conserva el aria-label.
 * Al terminar se quita el filtro (no queda pintando). Reducido: sin grano ni scrub, un fundido corto.
 */
import { gsap, SplitText } from './gsap';
import { dur, mov } from './tokens';

const SVG = 'http://www.w3.org/2000/svg';
let n = 0;

/** Un filtro por texto (si fuera compartido, los dos textos se definirían a la vez). */
function crearFiltro() {
  const id = `ruido-${++n}`;
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.innerHTML = `<filter id="${id}" x="-10%" y="-20%" width="120%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="${mov.ruidoFrecuencia}" numOctaves="2" seed="4" result="ruido" />
    <feDisplacementMap in="SourceGraphic" in2="ruido" scale="${mov.ruidoEscala}" xChannelSelector="R" yChannelSelector="G" />
  </filter>`;
  document.body.append(svg);
  return { id, svg, mapa: svg.querySelector('feDisplacementMap')!, turbulencia: svg.querySelector('feTurbulence')! };
}

export function definirTextos(reducido: boolean) {
  const textos = [...document.querySelectorAll<HTMLElement>('[data-noise-text]')];
  if (reducido) {
    textos.forEach((el) => gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: dur.reducido, ease: 'none', scrollTrigger: { trigger: el, start: mov.inicio, once: true } }));
    return;
  }

  const limpiar: (() => void)[] = [];
  textos.forEach((el) => {
    // Capa fantasma: el mismo texto, debajo, a baja opacidad.
    const fantasma = document.createElement('span');
    fantasma.className = 'texto-fantasma';
    fantasma.setAttribute('aria-hidden', 'true');
    fantasma.textContent = el.textContent;
    const real = document.createElement('span');
    real.className = 'texto-real';
    real.append(...el.childNodes);
    el.append(fantasma, real);
    el.dataset['noiseListo'] = '';

    const filtro = crearFiltro();
    const split = SplitText.create(real, { type: 'words', aria: 'none' });
    el.setAttribute('aria-label', fantasma.textContent ?? '');
    gsap.set(real, { filter: `url(#${filtro.id})` });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: mov.inicio, end: mov.finRuido, scrub: true },
      onComplete: () => gsap.set(real, { filter: 'none' }),
      onReverseComplete: () => gsap.set(real, { filter: `url(#${filtro.id})` }),
      onUpdate: () => {
        // De vuelta a mitad de camino: el filtro vuelve a estar.
        if (tl.progress() < 1 && real.style.filter === 'none') gsap.set(real, { filter: `url(#${filtro.id})` });
      },
    });
    tl.fromTo(
      split.words,
      { opacity: 0, filter: `blur(${mov.blur}px)` },
      { opacity: 1, filter: 'blur(0px)', ease: 'none', stagger: mov.escalonRuido, duration: dur.base },
      0,
    ).fromTo(filtro.mapa, { attr: { scale: mov.ruidoEscala } }, { attr: { scale: 0 }, ease: 'none', duration: tl.duration() }, 0);

    limpiar.push(() => {
      tl.scrollTrigger?.kill();
      tl.kill();
      split.revert();
      el.replaceChildren(...real.childNodes);
      el.removeAttribute('aria-label');
      delete el.dataset['noiseListo'];
      filtro.svg.remove();
    });
  });
  return () => limpiar.forEach((f) => f());
}

/**
 * Tipo de cada navegación con <ClientRouter />: si se cambió de idioma (M24), <html> lleva
 * data-vt="idioma" mientras dura la View Transition (sus curvas en src/styles/transiciones.css) y no
 * hay entrada de bloques. Se pone antes de la captura y se repone después del cambio de página
 * (Astro copia los atributos de <html> de la página nueva).
 *
 * M06 · al llegar a un caso con <ClientRouter />, su contenido entra subiendo --shift-md con
 * --spring-soft, máx. 4 bloques con --stagger (los marcados con data-entra, en orden). La media y el
 * título no: viajan desde la fila con la View Transition (src/styles/transiciones.css).
 * Corre en astro:after-swap, antes de que se tome la vista nueva: no hay cuadro con los bloques quietos.
 * En una carga completa no corre (nada arranca escondido). Reducido: los tokens dejan un fundido.
 */
import { animar, ms, numero, resorte } from './base';

const MAX = 4;

let tipo: 'idioma' | null = null;

const html = document.documentElement;

document.addEventListener('astro:before-preparation', (e) => {
  const origen = (e as Event & { sourceElement?: Element }).sourceElement;
  tipo = origen?.closest('[data-toggle-idioma]') ? 'idioma' : null;
  if (tipo) html.dataset['vt'] = tipo;
});

document.addEventListener('astro:before-swap', (e) => {
  const vt = (e as Event & { viewTransition?: ViewTransition }).viewTransition;
  if (tipo) vt?.finished.finally(() => delete html.dataset['vt']);
});

document.addEventListener('astro:after-swap', () => {
  if (tipo) html.dataset['vt'] = tipo;
  if (tipo === 'idioma' || matchMedia('(forced-colors: active)').matches) return;
  const bloques = [...document.querySelectorAll<HTMLElement>('main [data-entra]')].slice(0, MAX);
  const desde = { opacity: '0', transform: `translateY(${numero('--shift-md')}px)` };
  const paso = ms('--stagger');
  bloques.forEach((el, k) =>
    animar(el, { opacity: '1', transform: 'none' }, { ...resorte('soft'), desde, delay: k * paso, soltar: true }),
  );
});

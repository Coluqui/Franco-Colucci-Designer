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
 *
 * M06/M07 · solo viaja el caso que se navega: el de destino si es un caso, si no el de origen. Las otras
 * filas y "Siguiente caso" pierden su nombre en las dos capturas (si no, el título de la fila de otro
 * caso volaría hasta "Siguiente caso", que lleva el mismo nombre). Menos capas que capturar.
 */
import { animar, ms, numero, resorte } from './base';

const MAX = 4;

let tipo: 'idioma' | null = null;
let caso: string | null = null;

const html = document.documentElement;

const slugDe = (url: URL) => /\/trabajos\/([^/]+)\/?$/.exec(url.pathname)?.[1] ?? null;

const soloElCaso = () => {
  if (!caso) return;
  const propios = [`caso-${caso}-media`, `caso-${caso}-titulo`];
  document.querySelectorAll<HTMLElement>('[data-astro-transition-scope]').forEach((el) => {
    const nombre = getComputedStyle(el).viewTransitionName;
    if (nombre.startsWith('caso-') && !propios.includes(nombre)) el.style.viewTransitionName = 'none';
  });
};

document.addEventListener('astro:before-preparation', (e) => {
  const origen = (e as Event & { sourceElement?: Element }).sourceElement;
  tipo = origen?.closest('[data-toggle-idioma]') ? 'idioma' : null;
  if (tipo) html.dataset['vt'] = tipo;
  const { from, to } = e as Event & { from: URL; to: URL };
  caso = slugDe(to) ?? slugDe(from);
  soloElCaso();
});

document.addEventListener('astro:before-swap', (e) => {
  const vt = (e as Event & { viewTransition?: ViewTransition }).viewTransition;
  if (tipo) vt?.finished.finally(() => delete html.dataset['vt']);
});

document.addEventListener('astro:after-swap', () => {
  if (tipo) html.dataset['vt'] = tipo;
  soloElCaso();
  if (tipo === 'idioma' || matchMedia('(forced-colors: active)').matches) return;
  const bloques = [...document.querySelectorAll<HTMLElement>('main [data-entra]')].slice(0, MAX);
  const desde = { opacity: '0', transform: `translateY(${numero('--shift-md')}px)` };
  const paso = ms('--stagger');
  bloques.forEach((el, k) =>
    animar(el, { opacity: '1', transform: 'none' }, { ...resorte('soft'), desde, delay: k * paso, soltar: true }),
  );
});

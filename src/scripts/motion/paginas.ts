/**
 * M06 · al llegar a un caso con <ClientRouter />, su contenido entra subiendo --shift-md con
 * --spring-soft, máx. 4 bloques con --stagger (los marcados con data-entra, en orden). La media y el
 * título no: viajan desde la fila con la View Transition (src/styles/transiciones.css).
 * Corre en astro:after-swap, antes de que se tome la vista nueva: no hay cuadro con los bloques quietos.
 * En una carga completa no corre (nada arranca escondido). Reducido: los tokens dejan un fundido.
 */
import { animar, ms, numero, resorte } from './base';

const MAX = 4;

document.addEventListener('astro:after-swap', () => {
  if (matchMedia('(forced-colors: active)').matches) return;
  const bloques = [...document.querySelectorAll<HTMLElement>('main [data-entra]')].slice(0, MAX);
  const desde = { opacity: '0', transform: `translateY(${numero('--shift-md')}px)` };
  const paso = ms('--stagger');
  bloques.forEach((el, k) =>
    animar(el, { opacity: '1', transform: 'none' }, { ...resorte('soft'), desde, delay: k * paso, soltar: true }),
  );
});

/**
 * Ciclo de vida de cada página con <ClientRouter /> (docs/motion.md §8, M06, M07, M23, M24).
 * Al navegar no se recarga el documento: los módulos corren una sola vez. Por eso cada componente
 * arranca en `enCadaPagina` (carga inicial y cada navegación) y suelta lo global con `alSalir`
 * (escuchas en window/document, observadores, temporizadores) antes de que se cambie la página.
 */

const pendientes: (() => void)[] = [];

/** Se ejecuta justo antes de cambiar de página (o nunca, si no se navega). */
export const alSalir = (fn: () => void) => {
  pendientes.push(fn);
};

document.addEventListener('astro:before-swap', () => {
  pendientes.splice(0).forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  });
});

/** Arranca `iniciar` en cada página. Si devuelve una función, se ejecuta al salir. */
export const enCadaPagina = (iniciar: () => void | (() => void)) => {
  document.addEventListener('astro:page-load', () => {
    const limpiar = iniciar();
    if (limpiar) alSalir(limpiar);
  });
};

/**
 * Respiración (docs/motion.md §2): el ancho de Archivo pasa de --wdth-rest (112) a --wdth-active (125)
 * con --spring-soft. Solo en el servicio activo (M13, CSS en ListaServicios) y en los links del menú (M14).
 * Una línea, alto fijo: `font-stretch` (⚠) cambia el ancho de esa línea y no mueve nada alrededor.
 * Reducido: los tokens dejan --wdth-rest en 125 y el desplazamiento en 0, así que no hay respiración.
 */
import { ms, numero, resorte } from './base';

/**
 * M14 · al abrir el menú, cada link sube --shift-md, aparece y respira (reposo → activo → su ancho),
 * con --stagger-fast entre uno y otro. Termina en lo que diga su CSS: el hover sigue funcionando.
 */
export function respirarEntrada(links: HTMLElement[]) {
  const reposo = `${numero('--wdth-rest')}%`;
  const activo = `${numero('--wdth-active')}%`;
  const desplazamiento = `translateY(${numero('--shift-md')}px)`;
  const paso = ms('--stagger-fast');
  const soft = resorte('soft');

  links.forEach((el, k) => {
    el.getAnimations().forEach((a) => a.cancel());
    const final = getComputedStyle(el).fontStretch;
    el.animate(
      [
        { transform: desplazamiento, opacity: 0, fontStretch: reposo },
        { fontStretch: activo, offset: 0.5 },
        { transform: 'none', opacity: 1, fontStretch: final },
      ],
      { ...soft, delay: k * paso, fill: 'backwards' },
    );
  });
}

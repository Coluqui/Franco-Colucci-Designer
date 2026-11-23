---
paths:
  - "src/**/*.{astro,ts,js,css}"
  - "design-system/**/*"
---

# Motion — "Formato vivo" (v2.0)

Fuente de verdad: `docs/motion.md`. Esta regla es el resumen que se aplica siempre que se toca UI. Si algo de acá choca con `docs/motion.md`, manda `docs/motion.md`. `motion.md` v1.1 ("registro", marcas de corte) está **obsoleto**: si encontrás código que lo use, reemplazalo.

## Tres gestos y nada más

1. **Encastre:** un marco cambia de proporción (1:1, 4:5, 9:16, 3:1, 16:10, 16:8) con `--spring-snap` y la pieza se reacomoda adentro. Se usa en el glifo (M01–M03), el menú que crece desde su botón (M20), el loop del hero (M04), la vista previa de servicios (M05), fila → caso (M06–M07), tile → visor (M08–M11) y el filtro activo (M12).
2. **Respiración:** `font-stretch` de 112 % a 125 % con `--spring-soft` y `--duration-breathe`. Solo en el servicio activo (M13) y en los links del menú (M14). Una línea, alto fijo, un elemento a la vez.
3. **Lectura:** la frase-problema y el cierre se encienden palabra por palabra **ligadas al scroll** (M15), con tres resguardos obligatorios: monotónica (nunca se apaga), autocompletado al ritmo de lectura si el usuario frena 1,2 s, y una sola vez.

Si una animación nueva no es uno de estos tres gestos ni una microinteracción de M25–M32, no va. Preguntá antes de agregarla.

## Reglas duras

- **Solo tokens.** Duraciones y curvas salen de `design-system/tokens.css` (`--duration-*`, `--ease-*`, `--spring-*`). Nunca `300ms` ni `cubic-bezier(...)` sueltos en componentes. En JS, leer con `getComputedStyle(document.documentElement)`.
- **Resorte cuando hay mano, curva cuando no.** Hover, arrastre, toque, abrir y cerrar usan `--spring-*`. Fundidos y salidas usan `--ease-out` / `--ease-in`.
- **Solo `transform` y `opacity`.** Las tres excepciones permitidas son `clip-path` (M04, M05, M20), `font-stretch` (M13, M14) y `grid-template-rows` (M29). Nada anima `width`, `height`, `top` ni `left`.
- **El trabajo no se deforma.** Las piezas se recortan distinto cuando cambia el marco, pero nunca se estiran, inclinan, tiñen ni hacen parallax. La única escala es `--scale-media-hover` en la media de la fila de caso.
- **Nada arranca escondido.** Wordmark, bajada, header y la primera fila se ven en el primer frame. Las entradas por scroll son una por sección (M16) y para filas (M17), con un solo `IntersectionObserver` compartido. Sin JS, todo visible.
- **Todo se interrumpe.** Usá Web Animations (`element.animate`) y llamá a `animation.cancel()` antes de una animación nueva sobre el mismo elemento. Nada de `setTimeout` encadenados para coreografías.
- **Movimiento reducido:** los tokens ya pasan a fundidos de 120 ms o a 0. No escribas ramas `if (reduced)` salvo para el loop del hero (M04 → tira estática) y para no ejecutar FLIP (M08, M12).
- **View Transitions:** Astro `<ClientRouter />`, `transition:name` en la media y el título de cada fila y su caso, `transition:persist` en el header. Las curvas van en `::view-transition-group(...)` con tokens.
- **Sin librerías.** Si algo lo pide (loop o testimonios), proponé `motion` (módulo `animate`, ~3 kB) y esperá el OK.
- **`will-change`** solo durante la animación.

## Prohibido

Marquee, parallax o tilt en piezas, cursor custom, botones magnéticos, scroll suave forzado o scroll-jacking, preloader, letras del wordmark que se arman, grano animado, contadores que suben, texto que se escribe solo, "fade-up" en todos los elementos.

## Dónde vive el código

`src/scripts/motion/`: `encastre.ts` (morph de marcos y glifo), `respiracion.ts` (hover con intención de 80 ms), `lectura.ts` (frase), `flip.ts` (visor y filtros), `observer.ts` (entradas). Estilos de transición en cada componente, con tokens.

## Antes de dar algo por terminado

Probá cada ID que tocaste con y sin `prefers-reduced-motion` (Playwright: `page.emulateMedia({ reducedMotion: 'reduce' })`), a 360 y 1440 px, y en modo claro y oscuro. Nombrá los IDs en el mensaje del commit (`motion(M05): marco de servicios encastra`).

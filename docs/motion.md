# Motion — "Formato vivo" (v2.0)

23 nov 2026 · Etapa 6 · **v2.0 aprobada con las opciones arriesgadas** · Design system "Formato" v2.1 · Reemplaza por completo a `motion.md` v1.1 ("registro", marcas de corte), que queda obsoleto.

Especificación para Claude Code. Los valores viven en `design-system/tokens.css` (sección Motion). Cada interacción tiene un ID (`M01`…`M32`) para el handoff, los commits y los criterios de aceptación. Prototipo de referencia: "Motion v2 — Portfolio Franco Colucci" (https://claude.ai/artifact/8gfyb1JZddUu8wPEu8uEZy).

## 1. Qué tomamos de jeppesen.dev y qué no

| Recurso de Jeppesen | Qué hace bien | Decisión |
| --- | --- | --- |
| Transiciones de página con Astro View Transitions | Pasar de la home a un caso sin corte | **Tomar** con un giro propio: la media cambia de formato (16:10 → 16:8) mientras viaja |
| Wordmark armado por partes (J, E, ✱, PPESEN) | Firma que se arma al entrar | **Adaptar:** solo el glifo encastra sus marcos; las letras no se animan (el wordmark es el H1 y el LCP) |
| Frase-problema que vuelve en el cierre | Ritmo narrativo | **Tomar:** palabra por palabra, pero al ritmo de lectura |
| Servicios con video en loop | Muestra oficio en movimiento | **Adaptar:** en lugar de un video, el marco de la vista previa cambia al formato real de cada servicio |
| Testimonios 01/03 y trabajos con "Drag" | Interacción táctil | **Tomar** el arrastre con inercia en testimonios; los trabajos quedan en filas (más rápidos de escanear para un recruiter) |
| Listas duplicadas para marquee (logos, servicios, métricas) | Movimiento constante | **No tomar:** el marquee es lo que más hace "plantilla" y compite con el trabajo |
| Videos en autoplay en el hero | Impacto | **Adaptar:** el loop de formatos usa piezas reales, con pausa visible |

## 2. Concepto: formato vivo

El glifo dice "una idea que vive en muchos formatos". El motion lo hace literal: **los marcos cambian de formato** (1:1, 4:5, 9:16, 3:1, 16:10) en lugar de aparecer y desaparecer, y **la tipografía respira** en su eje de ancho, que en el design system ya significa jerarquía. Todo lo que el usuario mueve responde con **resortes** calculados con física real, no con curvas fijas: por eso se siente orgánico y no de plantilla.

Tres gestos, nada más:

| Gesto | Qué es | Dónde |
| --- | --- | --- |
| **Encastre** | Un marco cambia de proporción con `--spring-snap` y la pieza se reacomoda adentro | Glifo, loop del hero, vista previa de servicios, fila → caso, tile → visor |
| **Respiración** | El ancho de Archivo pasa de 112 a 125 con `--spring-soft` | Servicio activo, links del menú |
| **Lectura** | El texto aparece al ritmo en que se lee | Frase-problema y cierre |

## 3. Principios

1. **El trabajo no se deforma.** Una pieza puede cambiar de marco (se recorta distinto), nunca se estira, se inclina ni se tiñe. Ni parallax ni tilt.
2. **Un protagonista por pantalla.** Si el loop del hero se mueve, nada más se mueve en ese viewport.
3. **Resorte cuando hay mano, curva cuando no.** Lo que responde a un gesto (hover, arrastre, toque, abrir y cerrar) usa resortes; lo que solo informa (fundidos, salidas) usa curvas cortas.
4. **Nada arranca escondido.** Wordmark, bajada, header y la primera fila de trabajo están pintados desde el primer frame. Las entradas por scroll son una por sección y solo para títulos y filas.
5. **Todo se interrumpe.** Un segundo clic, ESC o un arrastre cortan la animación en curso y siguen desde donde estaba (resortes y Web Animations, nunca `setTimeout` encadenados).
6. **Reducido no es roto.** Con `prefers-reduced-motion`, los tokens pasan a fundidos de 120 ms o cambios instantáneos y el loop queda como tira estática. El contenido y el feedback son los mismos.

## 4. Tokens (v2.1)

| Token | Valor | Reducido | Uso |
| --- | --- | --- | --- |
| `--spring-snap` + `--spring-snap-duration` | resorte 400/30 (rebote 2,8 %), 560 ms | `--ease-out`, 120 ms | Encastre: cambios de formato, glifo, filtro activo |
| `--spring-soft` + `--spring-soft-duration` | resorte 180/22 (rebote 1 %), 700 ms | `--ease-out`, 120 ms | Menú, panel, testimonios, entradas, respiración |
| `--spring-press` + `--spring-press-duration` | resorte 700/40 (rebote 2,7 %), 280 ms | sin animación | Press y suelta de botones, desencastre del glifo |
| `--wdth-rest` / `--wdth-active` | 112 / 125 | 125 / 125 | Respiración |
| `--duration-breathe` | 450 ms | 0 | Respiración |
| `--reveal-per-char` · `--stagger-words` · `--reveal-dim` | 7 ms · 35 ms · 0,15 | 0 · 0 · 1 | Lectura |
| `--hover-intent` | 80 ms | igual | Servicios |
| `--loop-hold` | 2200 ms | — (tira estática) | Loop del hero |
| `--glyph-gap` | 1,5 px | 0 | Desencastre |
| `--scale-media-hover` | 1.02 | 1 | Media de la fila de caso |
| Se mantienen | `--duration-*`, `--ease-out/in/in-out`, `--ease-snap` (fallback), `--stagger` 60, `--stagger-fast` 40, `--shift-sm` 8, `--shift-md` 24, `--hold-feedback` 1800 | | |

Los resortes son `linear()` generados desde la ecuación de un resorte amortiguado (masa 1). Funcionan igual en `transition`, en `@keyframes` y en `element.animate({ easing })`. Sin soporte de `linear()`, los tokens caen a `--ease-snap` / `--ease-out` (bloque `@supports` al final de los tokens).

## 5. Especificación por interacción

Formato: disparador · qué pasa · duración y curva · versión reducida. Se animan solo `transform` y `opacity`, salvo las excepciones marcadas con ⚠, que están justificadas y acotadas.

### Encastre (firma)

| ID | Interacción | Disparador | Qué pasa | Duración · curva | Reducido |
| --- | --- | --- | --- | --- | --- |
| M01 | **Glifo al cargar** | Primera carga de la sesión (`sessionStorage`) | En la O del wordmark (home) o en el logo del header (resto de páginas), los marcos 4:5 y 9:16 entran desde el centro del 1:1 (`scaleX` 0 → 1, el 9:16 con 80 ms de delay). Es la única animación de carga y no tapa nada | 560 · snap | Estático |
| M02 | Glifo: desencastre en hover | Hover o focus del logo y del botón "Hablemos" | Los marcos laterales se separan `--glyph-gap` hacia afuera y vuelven al salir | 280 · press | Sin movimiento |
| M03 | Glifo como confirmación | Envío exitoso del formulario | El glifo del botón vuelve a encastrar una vez (repite M01 a escala chica) | 560 · snap | Sin movimiento |
| M04 | **Loop de formatos del hero** | Automático mientras el hero está en pantalla y la pestaña visible | Una misma campaña pasa por 1:1 → 4:5 → 9:16 → 3:1 → 16:10. El marco cambia de proporción ⚠ (`clip-path: inset()` sobre un contenedor de tamaño fijo, así no mueve el layout) y la pieza del formato nuevo entra con fundido cuando el marco llegó al 70 %. La etiqueta `ISCAMEN · 4:5` cambia con un roll vertical de 8 px. Botón de pausa visible (`aria-pressed`); se pausa solo fuera de pantalla | 560 · snap; pieza 200 · out; hold 2200 | Tira estática con los 5 formatos, sin loop |
| M05 | **Vista previa de servicios** | Hover (con intención de 80 ms) o focus de un servicio | El marco de la vista previa cambia a la proporción de la pieza de ese servicio (Ads 1:1, Redes 4:5, Reels 9:16, Mail 3:1, Web 16:10, Branding 4:5) y la pieza nueva entra con fundido cruzado | 560 · snap; pieza 200 · out | Fundido de 120 ms, el marco salta |
| M06 | **Fila de caso → caso** | Clic en una fila (home o Trabajos) | View Transition: la media 16:10 de la fila se convierte en el hero 16:8 del caso (cambio de formato mientras viaja) y el nombre pasa a ser el H1. La página sale con fundido; el contenido del caso entra subiendo 24 px, máx. 4 bloques con `--stagger` | 700 · snap (media), 200 · in (salida), soft (entrada) | Fundido cruzado de 120 ms |
| M07 | Caso → atrás / siguiente caso | "← Trabajos", atrás del navegador, "Siguiente caso" | La misma transición al revés; "Siguiente caso" (sección invertida) se convierte en el hero del caso siguiente | 700 · snap | Fundido de 120 ms |
| M08 | **Tile → visor** | Clic o Enter en una pieza | FLIP: la pieza viaja de su tile al visor sin deformarse; el fondo `--color-inverse-bg` aparece en 300 ms; contador y controles después (200 ms de delay) | 560 · snap | Fundido de 120 ms |
| M09 | Cerrar el visor | ESC, ×, arrastre vertical en táctil | La pieza vuelve a su tile (si está a la vista) y el foco vuelve al tile | 700 · soft | Fundido de 120 ms |
| M10 | Slides del carrusel | ← → / swipe / botones | Pista con `scroll-snap` nativo: el dedo manda y la inercia es la del sistema. El segmento activo se llena (`scaleX`) | nativo; segmento 300 · out | Sin desplazamiento suave |
| M11 | Pieza siguiente en el visor | → al final, Av Pág, botón | La pieza sale 24 px hacia arriba y la nueva entra desde abajo: vertical = otra pieza, horizontal = otro slide | 200 · in / 560 · snap | Fundido de 120 ms |
| M12 | Filtros | Clic en un filtro (Trabajos y caso) | El fondo del filtro activo y su punto cobalto viajan al nuevo (FLIP). Las piezas que quedan se reacomodan (FLIP), las que salen se desvanecen y las que entran aparecen con `--stagger-fast`. `aria-live` con la cantidad | 560 · snap (activo); 700 · soft (grilla) | Cambio instantáneo |

### Respiración

| ID | Interacción | Disparador | Qué pasa | Duración · curva | Reducido |
| --- | --- | --- | --- | --- | --- |
| M13 | **Servicio activo** | Hover (con intención) o focus | El servicio activo pasa de `wdth` 112 a 125 y de texto secundario a primario; el que deja de estar activo vuelve a 112 ⚠ (`font-stretch` cambia el ancho de una sola línea; el ítem tiene alto fijo, así no mueve nada alrededor) | 450 · soft | Todos en 125; solo cambia el color |
| M14 | Links del menú | Apertura del menú y hover | Al abrir, cada link sube 24 px y respira de 112 a 125 con `--stagger-fast`. En hover, el link pasa a 125 y el resto queda en 112 ⚠ | 700 · soft; 450 · soft | Todos en 125, fundido de 120 ms |

Límites de la respiración: el tamaño de los servicios se acota a su columna (`font-size: min(var(--text-services), 7.6cqi)` con `container-type: inline-size` en la lista), porque a 125 de ancho "Ads de performance" no entra en 7 columnas a 85 px. Nunca en texto de más de una línea, nunca más de un elemento respirando a la vez, nunca en el wordmark ni en títulos de caso.

### Lectura y entradas

| ID | Interacción | Disparador | Qué pasa | Duración · curva | Reducido |
| --- | --- | --- | --- | --- | --- |
| M15 | **Frase-problema y cierre (ligada al scroll)** | Scroll mientras la frase cruza la pantalla | Cada palabra pasa de opacidad 0,15 a 1 según cuánto bajaste: la frase se termina de leer cuando su centro llega al 40 % del viewport. El tramo de cada palabra es proporcional a sus letras (las largas "tardan" más, como al leer). Tres resguardos: **(1) monotónica**, una palabra encendida nunca se apaga al volver a subir; **(2) autocompletado**, si el usuario frena 1,2 s con la frase en pantalla, el resto aparece al ritmo de lectura (`--stagger-words` + `--reveal-per-char`); **(3) una sola vez**, al completarse se desconecta. Implementación en JS con `requestAnimationFrame` sobre el scroll (pasivo); sin JS, la frase se ve completa | por palabra 200 · out; autocompletado ≈ 0,8–1,2 s | Completa desde el inicio |
| M16 | Entrada de sección | El título de la sección entra 15 % en pantalla, una vez | El H2 y el primer bloque suben 24 px y aparecen. **Una entrada por sección**, nunca piezas ni el hero | 700 · soft | Sin entrada |
| M17 | Filas de caso | Cada fila entra 15 % en pantalla, una vez | La fila sube 24 px; la media entra 60 ms después que el texto. La primera fila, si está en el primer viewport, no se anima | 700 · soft | Sin entrada |
| M18 | Métricas | — | **Sin animación.** Los números no cuentan hacia arriba | — | — |

### Capas y navegación

| ID | Interacción | Disparador | Qué pasa | Duración · curva | Reducido |
| --- | --- | --- | --- | --- | --- |
| M19 | Header al scrollear | Scroll > 8 px | Fondo `--color-bg` + hairline abajo. Sobre secciones invertidas, colores invertidos (IntersectionObserver) | 300 · in-out | Instantáneo |
| M20 | **Menú a pantalla completa (crece desde el botón)** | "Menú" | El rectángulo del botón "Menú" cambia de formato hasta cubrir la pantalla ⚠ (`clip-path: inset()` de la caja del botón a `inset(0)`, con radio de 2 px a 0): es un encastre más. Cuando llega al 60 %, los links entran con M14. "Menú" ↔ "Cerrar" con roll vertical. Cerrar: vuelve a meterse en el botón y el foco vuelve a "Menú" | 560 · snap; cierre 300 · in | Fundido de 120 ms |
| M21 | **Panel Hablemos** | "▣ Hablemos" (header, barra, cierre) | Desktop: entra desde la derecha; mobile: sube desde abajo a pantalla completa. Velo en 300 ms. Campos con `--stagger-fast` (máx. 4). Cierre con ESC, × o el velo | 700 · soft; cierre 300 · in | Fundido de 120 ms |
| M22 | Barra inferior mobile | Abrir menú, panel o visor | Baja fuera de pantalla y vuelve al cerrar | 700 · soft | Instantáneo |
| M23 | Cambio de modo | Toggle en menú o footer | View Transition con fundido cruzado; sin salto de layout | 300 · in-out | Instantáneo |
| M24 | Cambio de idioma | Toggle ES/EN | Fundido de los textos con el header persistente (`transition:persist`); misma posición | 200 · out | Instantáneo |

### Microinteracciones

| ID | Interacción | Disparador | Qué pasa | Duración · curva | Reducido |
| --- | --- | --- | --- | --- | --- |
| M25 | Botón primario | Hover / press | Hover: fondo tinta → cobalto (200 · out) y el glifo desencastra (M02). Press: `scale(0.98)` y vuelve con rebote al soltar | 280 · press | Solo color |
| M26 | Botón secundario y link | Hover | Secundario: fondo `--color-surface`. Link: el subrayado pasa de 1 a 2 px (pseudo-elemento con `scaleY`) | 200 · out | Igual |
| M27 | **Fila de caso: hover** | Hover o focus de la fila | La media escala 1.02 dentro de su caja, lenta; "Ver caso →" aparece y la flecha avanza 4 px | 700 · soft | Solo aparece "Ver caso →" |
| M28 | **Testimonios** | Arrastre, flechas, teclado | El arrastre sigue al dedo 1:1; al soltar, el resorte lleva al testimonio más cercano según posición y velocidad. El contador `01/03` rueda en vertical; `aria-live` | 700 · soft | Cambio con fundido de 120 ms |
| M29 | FAQ | Clic en una pregunta | Se abre con `grid-template-rows` 0fr → 1fr ⚠ (la única animación de alto). La barra vertical del `+` se achica (`scaleY` 0) y queda `−` | 700 · soft | Apertura instantánea |
| M30 | Copiar mail | Clic | "Copiar mail" sale hacia arriba y entra "Copiado ✓" en `--color-success`; vuelve a los 1,8 s. `aria-live` | 200 · out | Cambio de texto |
| M31 | Descargar CV | Clic | La flecha baja y "cae" en una línea; "CV" → "Descargando" → "CV ✓" | 280 · press | Cambio de texto |
| M32 | Formulario | Envío | Error por campo: el mensaje baja 4 px con ícono. Enviando: barra indeterminada en la base del botón. Éxito: el formulario se cierra (M29) y aparece la confirmación en `--color-success-bg`, con M03. Error de envío: "Reintentar" + mail, sin perder lo escrito | 200 · out; 700 · soft | Fundidos de 120 ms |

## 6. Decisiones (cerradas el 23 nov)

| Tema | Segura | Arriesgada | Decisión |
| --- | --- | --- | --- |
| Frase-problema | Al ritmo de lectura, una vez | Ligada al scroll | **Elegida: ligada al scroll**, con los resguardos de M15 (monotónica, autocompletado y una sola vez), que resuelven el riesgo de que la frase quede apagada si el usuario se detiene |
| Tipografía que respira | Solo cambia el color del servicio activo | Ancho 112 ↔ 125 en servicios y menú (M13, M14) | **Elegida: ancho que respira.** Es lo que hace que el sitio se sienta vivo y propio: ninguna plantilla anima el ancho de la letra, y sale directo de la regla "expandido = jerarquía". Costo: un recálculo de layout de una línea por frame, acotado |
| Menú | Baja desde arriba | Crece desde el botón "Menú" hasta cubrir la pantalla (`clip-path`) | **Elegida: crece desde el botón** (M20). Suma continuidad: el botón se convierte en el menú. El costo es más trabajo (cálculo de la caja del botón en cada apertura) y cuidar que se sienta inmediato |

**Decididas (23 nov):** Franco eligió las tres opciones más trabajosas: frase ligada al scroll (con los tres resguardos de M15), ancho que respira (M13, M14) y menú que crece desde el botón (M20). Las especificaciones de arriba ya las incluyen.

**Cambios respecto del design system v2.0:** la vista previa de servicios pasaba con un fundido y ahora el marco cambia de formato (M05); los servicios inactivos quedan en `wdth` 112 en lugar de 125; el menú ya no baja desde arriba sino que crece desde el botón. Los tres cambios ya están en `docs/design-system.md` v2.1.

## 7. Fuera del sistema

Marquee de logos o servicios, parallax o tilt en piezas, cursor custom o botones "magnéticos", scroll suave forzado o scroll-jacking, preloader o pantalla de carga, letras del wordmark que se arman, grano animado, contadores que suben, texto que se escribe solo, "fade-up" en todos los elementos.

## 8. Implementación

| Pieza | Cómo |
| --- | --- |
| Microinteracciones, respiración, header (M02, M13, M14, M19, M25–M27, M29) | CSS: `transition` con los tokens. Hover solo dentro de `@media (hover: hover) and (pointer: fine)` |
| Páginas (M06, M07, M23, M24) | Astro `<ClientRouter />` con `transition:name` en media y título de cada fila/caso y `transition:persist` en el header. Las curvas de la View Transition se leen de los tokens en `::view-transition-group(...)` |
| Encastre en JS (M01, M03–M05, M08, M09, M11, M12) | Web Animations API (`element.animate`) con `easing: var(--spring-*)` leído por `getComputedStyle`; FLIP para visor y filtros; siempre `animation.cancel()` antes de una nueva |
| Testimonios (M28) | Pointer events + `scroll-snap` nativo, o un resorte propio de ~40 líneas si el snap nativo no alcanza. Sin librería |
| Slides (M10) | `scroll-snap-type: x mandatory` + `scrollend` |
| Entradas (M16, M17) | Un solo `IntersectionObserver` compartido; clase `.is-in` una vez y `unobserve`. Sin JS, todo visible |
| Frase ligada al scroll (M15) | El `IntersectionObserver` activa un `requestAnimationFrame` solo mientras la frase está en pantalla; progreso = posición del centro de la frase; un temporizador de 1,2 s sin scroll dispara el autocompletado. No usar `animation-timeline: view()` (no es monotónico) |
| Librerías | **Ninguna en el MVP.** Si el loop del hero o los testimonios lo piden, se evalúa `motion` (motion.dev, módulo `animate`, ~3 kB) con OK de Franco |

**Reglas de código:** `will-change` solo durante la animación. Nada anima `width`, `height`, `top` ni `left`; las tres excepciones son `clip-path` en M04/M05/M20, `font-stretch` en M13/M14 y `grid-template-rows` en M29. Duraciones y curvas siempre desde tokens, nunca valores sueltos. Los componentes de motion viven en `src/scripts/motion/` (un módulo por gesto: `encastre.ts`, `respiracion.ts`, `lectura.ts`).

## 9. Criterios de aceptación

- [ ] Cada ID M01–M32 tiene su versión reducida, probada con `prefers-reduced-motion` activo
- [ ] El wordmark, la bajada y la primera fila de trabajo se ven completos en el primer frame; LCP < 2,5 s con y sin motion
- [ ] 60 fps en un Android de gama media (Chrome, CPU 4×) en M04, M05, M06, M13 y M28
- [ ] CLS = 0 en la carga, al cambiar de modo, de idioma y de filtro, y durante la respiración
- [ ] ESC, un segundo clic o un arrastre interrumpen cualquier animación sin estados rotos
- [ ] El loop del hero tiene pausa visible, se detiene fuera de pantalla y con la pestaña oculta (WCAG 2.2.2)
- [ ] Con transparencia reducida no hay grano; con movimiento reducido no hay loop
- [ ] No hay ningún valor de duración o curva escrito a mano fuera de los tokens

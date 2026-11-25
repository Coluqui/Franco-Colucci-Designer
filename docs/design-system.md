# Design system — "Formato" (v2.1, 23 nov 2026)

Fuente de verdad visual del portfolio. Los valores exactos están en `design-system/tokens.css` (v2.1); este documento dice **cómo y dónde** se usan. El motion está especificado en `docs/motion.md` (v2.0, "Formato vivo"). Reemplaza por completo a "Ficha de producción" (v1.x): si algo del repo usa marcas de corte, naranja señal, Instrument Sans o radios de 0 px, es código viejo y se reemplaza.

Referencia de dirección: jeppesen.dev (estructura, tono, grano, tipografía grande y suiza). **No se copian** su glifo ✱, sus fuentes (Clash Grotesk, Author) ni sus textos.

## 1. Concepto

El sitio es un papel con grano, tinta y un solo color, el cobalto. La tipografía Archivo **expandida** es la voz y el glifo **Formato** (tres marcos encastrados: 1:1, 4:5 y 9:16) es la firma. Dice lo que hace Franco: una idea que vive en muchos formatos.

Reglas que nunca se rompen:

1. **El trabajo es el único color fuerte.** La interfaz es papel y tinta. El cobalto aparece solo en: el marco 4:5 del glifo, las cajas de métrica, los links, el focus y el estado activo de un filtro. Si hay más de 5 apariciones por pantalla, sobra.
2. **Las piezas nunca se tiñen.** Ni duotono, ni grano encima, ni filtros: se ven con sus colores reales. El duotono es solo para fotos propias (retrato, proceso, escritorio).
3. **Expandido = jerarquía.** Lo importante (wordmark, títulos de caso, el servicio activo) va en Archivo con `wdth` 125; lo que espera (servicios inactivos, links del menú) en 112 y respira a 125 al activarse. El texto de lectura, en `wdth` 100. No hay una segunda familia sans.
4. **Rectos y chicos.** Radios de 2 px (controles) y 4 px (paneles y media). Botones compactos. Nada de píldoras ni sombras flotantes en la interfaz.
5. **Grano en todo el fondo**, nunca sobre las piezas ni sobre el texto chico.

## 2. Glifo y marca

> **24 nov 2026 · Franco cambia la marca:** el glifo de marcos encastrados queda en pausa. La firma es el **monograma "FC"** (letras reales, Archivo 800 a `wdth` 125, `Glifo.astro`): logo del header, menú y footer. En el header, "FC" se despliega en "Franco Colucci" + puesto al scrollear (desde 48rem; `src/motion/logo.ts`). El wordmark del hero vuelve a tener la O. El botón "Hablemos" va sin glifo. Idioma (ES / EN) y modo (switch sol / luna) viven en el header; el footer ya no los lleva. Botón flotante "Volver arriba". Lo que sigue en esta sección queda como referencia hasta que se defina si vuelve el glifo.

| Uso | Cómo |
| --- | --- |
| Logo en el header | `public/brand/marca-formato.svg` inline, 24–28 px, `color: var(--color-text-primary)`; el marco 4:5 en `var(--color-accent)` |
| Wordmark del hero | "FRANC" + glifo en lugar de la O + salto de línea + "COLUCCI". El glifo mide la altura de las mayúsculas (cap height ≈ 0,72 em) y usa el mismo grosor de trazo que la letra (≈ 0,12 em) |
| Botón "Hablemos" | El glifo a 14 px antes del texto, en `currentColor` |
| Favicon | `public/brand/favicon.svg` (cambia solo con el modo del sistema) |
| Cierre de la home | El glifo enorme (40–60 vw) antes del footer, en `--color-text-primary` |
| Accesibilidad | En el wordmark el H1 real es "Franco Colucci" (texto visible para lectores de pantalla); el glifo va `aria-hidden="true"` y la O se incluye en un `<span class="visually-hidden">O</span>` |

## 3. Color

Usá siempre los tokens semánticos (`--color-*`). La paleta base (`--cloud-*`, `--ink-*`, `--cobalt-*`) no se usa en componentes.

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `--color-bg` | #F1EFEA | #151514 | Fondo de página |
| `--color-surface` | #E5E2DA | #201F1D | Paneles de caso, chips de métrica, tarjetas |
| `--color-stage` | #E8E5DE | #252422 | Detrás de piezas y mockups |
| `--color-raised` | #F8F7F3 | #1E1D1B | Inputs, panel Hablemos, menú |
| `--color-text-primary` | #191918 | #F1EFEA | Texto, botón primario |
| `--color-text-secondary` | #57554F | #A3A099 | Bajadas, etiquetas, servicios inactivos |
| `--color-text-disabled` | #8A877F | #6F6D67 | Solo controles deshabilitados |
| `--color-border-subtle` | #D6D2C8 | #2E2D2A | Separadores (decorativos) |
| `--color-border-strong` | #7D7A72 | #75726B | Bordes de botones secundarios, chips, inputs |
| `--color-accent` | #2E3FE0 | #8E9BFF | Cobalto: métricas, glifo, links, focus |
| `--color-accent-hover` | #2433B8 | #AEB8FF | Hover de links y del acento |
| `--color-on-accent` | #FFFFFF | #151514 | Texto sobre cobalto |
| `--color-success` / `-bg` | #1F6B4F / #DCEBE3 | #7CC8A6 / #1A2B23 | Envío OK, mail copiado |
| `--color-danger` / `-bg` | #B3261E / #F6E0DE | #FF8A80 / #36191A | Errores de formulario (siempre con ícono + texto) |
| `--color-inverse-*` | fondo tinta, texto papel | fondo papel, texto tinta | Sección Clientes + Testimonios, cierre, "Siguiente caso" |

**Contraste:** 80 combinaciones validadas en AA (texto ≥ 4,5:1; bordes de control ≥ 3:1) sobre `bg`, `surface`, `stage` y `raised`, en los dos modos. Peor caso: `border-strong` 3,2:1 en oscuro; `success` 4,95:1 en claro.

**Modo oscuro:** se diseña, no se invierte. Las secciones invertidas pasan a papel claro, así el ritmo claro/oscuro de la página se mantiene en los dos modos.

## 4. Tipografía

**Familias:** Archivo (Google Fonts, variable: `wght` 100–900, `wdth` 62–125) y Geist Mono 500 solo para metadatos de formato. Licencia OFL: se pueden autoalojar.

**Carga:** un solo archivo variable de Archivo con los dos ejes + Geist Mono 500. Con la API de fuentes de Astro, o autoalojadas en `public/fonts/` como `woff2` con `font-display: swap` y `preload` solo de Archivo. Request de Google Fonts equivalente: `family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@500`.

**El ancho se controla con `font-stretch`** (Archivo mapea `wdth` a `font-stretch`): `font-stretch: 125%` = expandida. Si el navegador no lo aplica, usar `font-variation-settings: "wdth" 125`.

| Rol | Tamaño | Ancho | Peso | Interlineado | Interletrado | Dónde |
| --- | --- | --- | --- | --- | --- | --- |
| wordmark | `--text-wordmark` (64 → 246) | 125 | 850 | 0.86 | −0.045em | Hero. Ajustar para que "COLUCCI" ocupe el ancho del contenedor |
| display | `--text-display` (40 → 84) | 112 | 800 | 1 | −0.035em | Frase-problema, cierre |
| services | `min(--text-services, 7.6cqi)` (36 → 85, acotado a su columna) | 112 en reposo · 125 activo | 800 | 1 | −0.035em | Lista "Qué hago" y links del menú. El ancho respira (motion M13–M14) |
| h1 | `--text-h1` (36 → 76) | 125 | 800 | 1.05 | −0.035em | Título de caso, títulos de página |
| h2 | `--text-h2` (28 → 46) | 112 | 750 | 1.05 | −0.025em | Títulos de sección |
| h3 | `--text-h3` (20 → 26) | 100 | 700 | 1.15 | −0.02em | Nombre de caso en filas, preguntas |
| metric | `--text-metric` (36 → 60) | 112 | 800 | 1 | −0.035em | Números grandes de caso, `tabular-nums` |
| lead | `--text-lead` (18 → 22) | 100 | 400 | 1.45 | −0.01em | Bios, bajadas |
| body | `--text-body` (16 → 17) | 100 | 400 | 1.6 | 0 | Texto corrido, máx. `--measure` |
| ui | `--text-ui` (16) | 100 | 600 | 1.2 | 0 | Botones, menú, chips, links de nav |
| label | `--text-label` (12) | Geist Mono | 500 | 1.4 | 0.02em | Solo metadatos: `ISCAMEN · 4:5`, `03 / 12` |

Pesos por token: 400 `--weight-regular`, 600 `--weight-ui`, 700 `--weight-bold`, 750 `--weight-title`, 800 `--weight-black`, 850 `--weight-heavy`.

Mayúsculas solo en el wordmark. Todo lo demás en frase normal. El español es hasta 30 % más largo: los títulos se prueban en español a 360 px.

## 5. Textura: grano y duotono

**Grano** (en todo el sitio):

```css
html { background: var(--color-bg); }
body { background: transparent; }
body::after {
  content: ""; position: fixed; inset: 0; z-index: var(--z-grain); /* -1: detrás del contenido */
  pointer-events: none;
  background-image: url("/brand/grain.svg");
  opacity: var(--grain-opacity);
  mix-blend-mode: var(--grain-blend);
}
```

El grano vive **detrás del contenido**, sobre el fondo de la página (`--z-grain: -1`; ajuste del 23 nov). Así nunca queda encima de piezas, texto, menú, panel ni visor, y no compite con sus `z-index`. Las superficies con fondo propio (paneles, secciones invertidas, inputs) lo tapan; las piezas van sobre `--color-stage`, sin grano. Con `prefers-reduced-transparency: reduce`, el grano se apaga (ya está en los tokens).

**Duotono** (solo fotos propias): SVG filter con `feColorMatrix` (escala de grises) + `feComponentTransfer` que mapea sombras a `--duotone-shadow` y luces a `--duotone-highlight`. Alternativa simple: imagen en gris con `mix-blend-mode: multiply` sobre un fondo `--duotone-highlight` y una capa `--duotone-shadow` en `screen`. Las piezas de clientes no pasan por acá.

## 6. Espaciado, grilla y radios

- Escala base 4 px: `--space-1` (4) a `--space-10` (128). Entre secciones: `--space-section` (80 → 160).
- Grilla: 4 / 8 / 12 columnas; márgenes de 20 / 32 / 48 / 64 px; gutters de 16 / 20 / 24 px. Contenedor de texto y grillas: 1312 px. El wordmark y la lista de servicios pueden usar todo el ancho menos los márgenes.
- Radios: `--radius-xs` 2 px (botones, chips, inputs), `--radius-sm` 4 px (paneles, tarjetas, imágenes), `--radius-full` solo para el pulgar del toggle y puntos de estado.
- Sin sombras en la interfaz. Solo `--shadow-mockup` en marcos de dispositivo.

## 7. Componentes

Todo interactivo tiene: default, hover (solo con `@media (hover: hover) and (pointer: fine)`), focus-visible (`outline: var(--focus-ring); outline-offset: var(--focus-offset)`), active, disabled y, si aplica, loading / error / éxito. Objetivos táctiles de 44 × 44 px como mínimo.

| Componente | Default | Hover · active | Otros estados |
| --- | --- | --- | --- |
| **Header** | Glifo a la izquierda; a la derecha "▣ Hablemos" (primario) + "Menú" (secundario). Fondo transparente sobre el hero; al scrollear, `--color-bg` con `--border-hairline` abajo | — | Sobre secciones invertidas, los colores se invierten |
| **Botón primario** | Fondo `--color-text-primary`, texto `--color-bg`, `--text-ui` 600, alto 36 px (área táctil 44), padding 0 14 px, `--radius-xs`, glifo opcional | Fondo `--color-accent`, texto `--color-on-accent`; el glifo desencastra (M02) · `scale(0.98)` y vuelve con `--spring-press` | Loading: texto "Enviando" + barra indeterminada en la base; disabled: `--color-surface` + `--color-text-disabled` |
| **Botón secundario** | Borde `--border-control`, texto primario, fondo transparente | Fondo `--color-surface` · `scale(0.98)` | Disabled: borde y texto `--color-text-disabled` |
| **Link** | `--color-accent`, subrayado 1 px separado 4 px | `--color-accent-hover`, subrayado 2 px | — |
| **Menú (pantalla completa)** | Crece desde el botón "Menú" hasta cubrir la pantalla (M20), con `--color-raised`; links en `--text-services` con `wdth` 112; a la derecha mail, LinkedIn, WhatsApp, CV y toggles ES/EN y modo | Link en hover: color primario y `wdth` 125 (M14); activo: color primario | Foco atrapado; ESC cierra y devuelve el foco a "Menú" |
| **Panel Hablemos** | Panel lateral derecho, ancho `--drawer-width`, fondo `--color-raised`, velo `--color-scrim`; formulario (nombre, email, mensaje) + links directos | — | Estados de envío: enviando, éxito (mensaje en `--color-success-bg`), error (con "Reintentar" y el mail como alternativa); sin JS, el botón lleva a `/[lang]/hablemos` |
| **Chip de métrica** | Caja `--color-accent` con el número (`--text-ui` 700, `--color-on-accent`) + etiqueta sobre `--color-surface`, `--radius-xs` | — | En secciones invertidas: `--color-inverse-accent` |
| **Card de proyecto (home y Trabajos)** | Panel `--color-surface`, `--radius-sm`: media 16:10 a la izquierda (7 col), a la derecha empresa (h3), rol, descripción corta y cantidad de piezas por tipo (v4.0: sin chips de métrica) | Hover: la media escala `--scale-media-hover` dentro de su caja con `--spring-soft` y aparece "Ver caso →" (M27) | Focus: anillo en todo el panel y "Ver caso →" visible. Clic: la media se convierte en el hero del caso (M06) |
| **Lista de servicios** | Items con alto fijo; activo en `--color-text-primary` y `wdth` 125, inactivos en `--color-text-secondary` y `wdth` 112; vista previa fija a la derecha (caja `--color-stage`) | Hover (con intención de 80 ms) o focus: el activo respira (M13) y el marco de la vista previa cambia al formato de la pieza de ese servicio (M05) | Mobile: acordeón con `+` / `−`; la vista previa va dentro del ítem abierto |
| **Grilla de clientes** | En sección invertida: celdas con borde `--color-inverse-border`, logos SVG monocromos en `--color-inverse-text` | Logo a opacidad 1 (resto 0,7) | — |
| **Testimonios** | Cita en `--text-h2` (wdth 100, 600), autor en `--text-small`, contador `01/03` en label, flechas ← → | — | Arrastrable con inercia y resorte (M28); `aria-live="polite"` en el contador |
| **Skills** (v4.0, reemplaza a la FAQ) | Grupos (Diseño, Video y motion, Web, IA) con logo del software en un solo color (`currentColor`, 32 px), nombre en h3 y para qué lo usa en `--text-body` | Hover: el logo pasa a opacidad 1 (resto 0,7) | Los logos son `aria-hidden`; el nombre es texto real |
| **Filtro (Trabajos y caso)** | Chips de texto: inactivo con `--border-control`; activo con fondo `--color-text-primary` y un punto cobalto | Fondo `--color-surface` | Muestra la cantidad: "Ads · 4" (un carrusel cuenta 1) |
| **Tile de pieza** | Pieza en su `aspect-ratio` sobre `--color-stage`, `--radius-sm`; debajo el formato en label (sin el cliente, que ya encabeza la fila); carrusel: ícono ⧉ + "7 slides" | Aparece "Ver pieza ↗" | Táctil: metadatos siempre visibles |
| **Visor** | Fondo `--color-inverse-bg`; pieza en su ratio; contador doble `Pieza 03 / 12 · Slide 4 / 7` | — | Reglas de navegación del PRD (sección "Carruseles") |
| **Campo de formulario** | Etiqueta arriba (`--text-small` 600), input `--color-raised` con `--border-control`, alto 48, `--radius-xs` | Borde `--color-text-secondary` | Error: borde y texto `--color-danger` + ícono; éxito al enviar |
| **Toggles (ES/EN, modo)** | Segmentado de 2 opciones dentro del menú y el footer | — | Mantiene página y posición |
| **Barra inferior (mobile)** | Fija: "▣ Hablemos" + "CV ↓", `--color-raised`, `--bottom-bar-height` + safe area | — | Se oculta con el menú, el panel o el visor abiertos |
| **Footer** | Glifo grande, mail, LinkedIn, WhatsApp, CV, toggles, "Franco Colucci, 2026" | — | — |

## 8. Responsive (mobile-first)

| Bloque | 360 px | 768 px (`48rem`) | 1280 px o más (`80rem`) |
| --- | --- | --- | --- |
| Header | Glifo + "Menú"; "Hablemos" pasa a la barra inferior | Glifo + "Hablemos" + "Menú" | Igual, alto 80 px |
| Hero | Wordmark en 2 líneas a todo el ancho; loop de formatos debajo | Igual | Igual; el loop a 7 columnas, centrado |
| Frase-problema | `--text-display` a 40 px, 4–6 líneas | — | Hasta 3 líneas, 10 columnas |
| Clientes + testimonios | Apilados: grilla de logos 2 × 3, después testimonios | Grilla 3 × 2 | Logos en 6 col + testimonios en 5 |
| Servicios | Acordeón; vista previa dentro del ítem abierto | Igual | Lista en 7 col + vista previa fija en 5 |
| Filas de caso | Una columna: métrica principal arriba de la imagen | Una columna, media más grande | Media 7 col + texto 5 col |
| Caso | Métricas en 2 × 2; piezas en 2 columnas | Piezas en 3 columnas | Piezas en 4 columnas; datos del caso a la derecha |
| Panel Hablemos | Pantalla completa | 520 px | 520 px |

Reglas: `100dvh` en vez de `100vh`; `env(safe-area-inset-*)` en header, barra y panel; componentes reutilizables con container queries.

## 9. Motion

Especificación completa en `docs/motion.md` **v3.0 ("Desglose", GSAP, 24 nov)**: efectos 4.1–4.13, versión reducida y criterios de aceptación. Reemplaza a v2.0 ("Formato vivo") y a v1.1, que quedan obsoletos. **Los IDs M01–M32 que aparecen en las tablas de componentes de este documento son de v2.0**: el comportamiento de motion de cada componente lo define ahora `docs/motion.md` v3.0 (cards 4.8, botones 4.9, menú 4.10, servicios 4.7, acordeón 4.12).

Resumen: **los marcos cambian de formato** (encastre, con `--spring-snap`), **la letra respira** en su eje de ancho (112 ↔ 125, con `--spring-soft`) y **el texto aparece al ritmo de lectura**. Todo lo que responde a un gesto usa resortes (`--spring-*`); lo que solo informa usa curvas cortas. Nada del primer viewport arranca escondido salvo el encastre del glifo.

Motion: `docs/motion.md` v3.0 "Desglose" (GSAP). Fuera: marquee, cursor custom, preloader, grano animado, contadores que suben, "fade-up" en todos los elementos.

## 10. Prohibido

Degradados, glassmorphism, blobs, marquee, animaciones de motion con valores sueltos (fuera de los tokens), sombras flotantes, radios mayores a 4 px en la interfaz, píldoras, Inter, emojis, una segunda familia sans, grano o duotono sobre piezas de clientes, cobalto como fondo de secciones grandes, el glifo ✱ o cualquier recurso que identifique a Jeppesen.

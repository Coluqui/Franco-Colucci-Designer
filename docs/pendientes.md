# Pendientes

Todo lo que está como `PENDIENTE` en el sitio o espera una decisión de Franco. Se tacha al resolverse.

## Archivos de Franco

| Qué | Dónde se usa | Estado |
| --- | --- | --- |
| `public/brand/marca-formato.svg` | Logo, wordmark, botón Hablemos, cierre | Falta (no se dibuja) |
| `public/brand/favicon.svg` | Favicon | Falta |
| `public/brand/grain.svg` | Grano global | Falta. Hoy: `public/dev/grain-provisorio.svg` (`src/styles/global.css`) |
| CV en PDF, ES y EN | Menú, barra mobile, panel, Sobre mí | Falta. Hay uno en `C:\Users\FRANCO\Portfolio\public\cv-franco-colucci.pdf` (¿vigente?) |
| Originales de mayor calidad | Visor y heros de caso | Ver `docs/inventario.md` |
| Campaña del loop del hero (1:1, 4:5, 9:16, 3:1, 16:10) | Hero (M04) | Falta (PRD §14) |
| Logos de clientes en SVG monocromo | Grilla de clientes | Solo JPG |

## Tokens que faltan en `design-system/tokens.css`

El design system §4 pide estos valores, pero no tienen token. Hoy están escritos a mano en `src/styles/typography.css`, con comentario:

| Rol | Valor | Propuesta |
| --- | --- | --- |
| h3 · interlineado | 1.15 | `--leading-title: 1.15` |
| h3 · interletrado | −0.02em | `--tracking-title: -0.02em` |
| lead · interletrado | −0.01em | `--tracking-lead: -0.01em` |
| label · interlineado | 1.4 | `--leading-label: 1.4` |
| Borde de control en secciones invertidas | `--color-inverse-border` da 1,5:1 (claro) y 1,2:1 (oscuro); un control necesita 3:1 (WCAG 1.4.11) | `--color-inverse-border-strong` de ≥ 3:1, para las flechas de testimonios y los inputs del cierre (Fase 3) |
| Opacidad de logos en reposo (grilla de clientes) | 0,7 (design system §7), a mano en `GrillaClientes.astro` | `--opacity-logo-rest: 0.7` |
| Valores sueltos en controles | `Toggle.astro` (padding interno de 2 px), `Boton.astro` (barra de carga de 2 px y opacidad 0,6) | Tokens de detalle: `--space-px2: 2px`, `--loading-bar-height: 2px`, `--opacity-loading-track: 0.6` (o reglas aceptadas en §7) |
| `--duration-instant` en movimiento reducido | Hoy queda en 100 ms; motion §3.6 pide 120 ms o 0 | Sumar `--duration-instant: 0ms` al bloque `prefers-reduced-motion` |

## Contradicciones entre documentos (las decide Franco)

| Tema | Qué choca | Hoy en el código |
| --- | --- | --- |
| Tamaño del wordmark | El §4 dice "64 → 246". Para que "COLUCCI" entre a 360 px tiene que medir 57 px. Además, `tokens.css:81` da 73,6 px a 360 (el comentario dice 64) | `min(var(--text-wordmark), 17.8cqi)`: llena el contenedor y nunca lo desborda (57 px a 360, 231 px a 1440). Hay que corregir el rango en el §4 y el comentario del token |
| Tamaño de servicios | El §4 dice "36 → 85", pero `min(--text-services, 7.6cqi)` (motion §5) da 24 px en una columna de 320 px (mobile, acordeón) | La fórmula del motion §5. Hay que decidir un mínimo para mobile; ¿36 px con "Ads de performance" partido en dos líneas?, ¿otro valor de cqi en mobile? |
| Servicios en desktop | El §4 y el PRD §3 piden ~85 px, pero `7.6cqi` de una columna de 7/12 da 51 px a 1280 y 56 px a 1440 (revisión ux-ui). El coeficiente salió del peor caso "Ads de performance", que ya no es un nombre de servicio: hoy son Ads, Redes, Reels, Mail, Web, Branding | Igual que arriba. Propuesta: recalcular el coeficiente con el nombre real más largo ("Branding"), así 85 px entra en la columna. Actualizar motion.md (límites de la respiración), design system §4 y PRD §14 |
| Links del menú | El §4 aplica a "services" la fórmula con tope `cqi`, que en el menú daba 24–55 px (revisión ux-ui). El §7 pide `--text-services` | `--text-services` sin tope en `.menu__link` (36 → 85). Aclarar en el §4 que el tope `cqi` es solo de la lista de servicios |
| Alto del botón | El §7 dice "alto 36 px (área táctil 44)" para el primario; `tokens.css` limita `--control-height-sm` (36) al header | 36 en el header, 44 en el resto. Aclarar el §7 |

- **Frase-problema a 360 px**: ocupa 8 líneas (el design system §8 pide 4–6 a 40 px). Misma decisión que la de abajo.
- **Frase-problema a ≥ 1280 px**: el design system §8 pide "hasta 3 líneas, 10 columnas", pero con `--text-display` (84 px) en 10 columnas el borrador del PRD §3 ocupa 5 líneas. Opciones: aceptar 4–5 líneas, acortar la frase o bajar el tope de `--text-display`. Actualizar `docs/design-system.md` §8 según lo que se decida.

- **Tokens nuevos sugeridos en la Fase 4**: `--ratio-portrait` (2 / 3, retrato de Sobre mí) y el grosor/offset del subrayado en hover (hoy 2px / 0.12em, repetidos en `.link` y "Siguiente caso").

## Decisiones abiertas

- Agrupación de carruseles dudosos (ISCAMEN 08–12 y 15–19, serie Carpa, ads de Condimento): `docs/inventario.md`.
- Archivos de la raíz sin versionar: `PRD-Portfolio-Franco-Colucci (5).md`, `design-system (2).md`, `PROMPT-CLAUDE-CODE.md`, `README-MOTION.md`.
- `.claude/rules/contenido-y-assets.md`: el PRD §8 la cita y no existe.
- PRD §8: se sumaron los campos `caso` y `video` al modelo de pieza.
- Caracteres → ↗ ← ⧉ ✓: no están en el subset `latin` de Archivo. Decidir en la Fase 3 si van como íconos SVG.
- `astro check`: instalar `@astrojs/check` + `typescript` (dependencias de desarrollo).
- Cobalto en la home: con 2 filas de caso a la vista (2 chips + "Ver caso →" cada una) y el glifo del header se pasa del máximo de 5 usos (design system §1). Revisarlo al armar la home (Fase 4); si se pasa, "Ver caso →" en `--color-text-primary`.
- Visor: el PRD §6 pide un "marco de teléfono" para carruseles en desktop. Falta su definición visual (¿mockup de Franco?, ¿marco CSS con tokens?). Al definirlo, acercar las flechas de slide a la pieza (hoy quedan contra los bordes a 1280–1440).
- Skills frontend-design y ui-ux-pro-max: no instaladas.
- Playwright: no instalado; las revisiones se hacen con el navegador integrado.

## Contenido

- `meta.siteDescription` (ES y EN) en `src/i18n/*.json`.
- **Casos** (`src/content/casos/*.json`, Fase 4): frase, tipo, descripción corta, rol, año, herramientas, problema, pasos, resultado, 2–4 métricas reales, testimonio y hero 16:8 de MoonDesk, ISCAMEN, Condimento y Carpa. Hoy dicen `PENDIENTE`.
- **Servicios por caso**: los puse a partir del inventario (MoonDesk, ISCAMEN y Carpa → Redes; Condimento → Ads y Branding). Confirmar o corregir.
- **Descripciones de los 6 servicios** (`serviceItems.*.description`) y la pieza de vista previa de cada uno.
- **Textos de páginas en PENDIENTE**: bajada de Trabajos, bio corta y bio de Sobre mí, datos (base, idiomas, modalidad), experiencia con fechas, cómo uso la IA, herramientas e IA de la home.
- **6 preguntas frecuentes**: las preguntas son un borrador de Claude (`faq.q1`–`q6` en `src/i18n/*.json`), a revisar; las respuestas (`faq.a1`–`a6`) las da Franco.
- **Títulos y descripciones SEO** por página: borradores en `pages.*` de `src/i18n/*.json`; revisarlos.
- **Fase 5 · piezas**:
  - Originales de mayor resolución de MoonDesk one-pager, pieza QR y portada de ebook (hoy ~596 × 842 px).
  - Banner de Carpa (835 × 451) fuera del visor: cargarlo si llega un original apaisado de más resolución.
  - "Objetivo" de cada pieza (`objetivo` en cada `pieza.json`, hoy PENDIENTE) y métricas reales si las hay.
  - Vistas previas de **Mail (3:1)** y **Web (16:10)**: no hay piezas en esos formatos.
  - **Loop del hero**: una misma campaña en 1:1, 4:5, 9:16, 3:1 y 16:10 (ningún trabajo la tiene hoy).
  - Elegidas por Claude para las vistas previas (confirmar): Ads → Condimento "otra campaña"; Redes → carrusel MoonDesk "Nacimos de un error"; Reels → story testimonio MoonDesk (estática); Branding → Condimento branding.
- **Fase 5 · dudas sobre piezas (las decide Franco)**:
  - `moondesk-story-testimonio`: muestra la cita, el nombre y la empresa de un cliente. ¿Hay permiso para publicarlo en el portfolio? (El alt no transcribe nombre ni empresa.)
  - `moondesk-post-retrabajos`: es una pregunta sin respuesta y sin logo; ¿es la portada de un carrusel incompleto o de otra marca?
  - `iscamen-story-mujer-en-la-ciencia`: jornada con UNCuyo y Gobierno de Mendoza; confirmar que fue un trabajo para ISCAMEN.
  - `moondesk-pieza-qr` (con GS1 Argentina): ¿se imprimió o fue digital? Hoy está como "impreso".
  - `carpa-metodo` pasó de carrusel a **ebook** (son 9 portadas de módulos y bonos, no un carrusel de redes). `carpa-mockup-producto` repite esas portadas en dispositivos: ¿pieza aparte o hero del caso Carpa?
  - `iscamen-carrusel-citricos` slide 5: el texto dice "VITAMINAS C  A TU ALCANCE" (doble espacio); revisar si falta una palabra.
- **Vista previa de Branding**: la pieza de Condimento es ≈1:1 y el marco de Branding es 4:5 (PRD §8), así que el recorte corta el logotipo. Opciones: (a) una pieza de branding pensada para 4:5; (b) un punto de foco por pieza; (c) Branding en 1:1, actualizando antes el PRD §8.
- **Orden de piezas por caso**: hoy es automático (carruseles, posts, stories… impresos al final). Si querés un orden curado, se agrega `orden` en cada `pieza.json`.

## Fase 6 · motion (paso 2: M04 y M05)

- **Decisión de Franco · M05 con movimiento reducido.** `docs/motion.md` pide "fundido de 120 ms, el marco salta". Hoy el marco encastra en 120 ms con `--ease-out` y la pieza cambia sin fundido (`--duration-fast` vale 0 en reducido). Para cumplirlo al pie de la letra hace falta (a) un token de duración del encastre que valga 0 en reducido, o (b) permitir una rama `reducido()` en M05 (hoy `.claude/rules/motion.md` solo la permite en M04 y FLIP). La otra salida es actualizar la columna "Reducido" de M05 en `docs/motion.md`.
- **Campaña del loop (M04).** Cuando llegue: cada `.hero__pieza` lleva su imagen (la regla `object-fit: cover` ya está) y el texto oculto de cada `<li>` de la tira nombra la campaña ("ISCAMEN · 4:5" + una descripción breve), para que el lector no diga menos que la pantalla. `hero.campaignPending` se reemplaza por el nombre real.
- **Paso 3 (M15).** "Un protagonista por pantalla": a 360 px la frase-problema entra en el primer viewport con el loop andando. Cuando M15 esté activa, el loop se pausa mientras la frase se enciende.
- **Paso 4 (`<ClientRouter />`).** Los scripts de M04 y M05 tienen que correr en `astro:page-load` y liberar en `astro:before-swap`; si no, al volver a la home no hay loop ni hover en servicios.
- **QA de cierre.** El CLS de carga se mide con el build de producción (`astro preview`): en dev, Vite inyecta estilos tarde y con el server cargado el wordmark baja unos px (en producción, 0 en 8 cargas en paralelo).

## Fase 6 · motion (paso 3: M13–M17)

- **Decisión de Franco · M14.** Implementado así: al abrir el menú, los links suben y aparecen con `--stagger-fast`, y solo el de la página actual respira de 112 a 125 (cumple "nunca más de un elemento respirando a la vez"). Si lo aprobás, conviene aclarar la fila M14 de `docs/motion.md`: "respira el link de la página actual; el resto sube y aparece".
- **Decisión de Franco · loop en espera mientras se lee (M04 + M15).** Con la frase-problema a medio leer, el loop termina el formato y espera, pero el botón sigue en "Pausa": puede parecer trabado. Opciones: dejarlo así (y asentarlo en M04), o atenuar la escena mientras espera.
- **Decisión de Franco · entradas con movimiento reducido (M16, M17).** `docs/motion.md` dice "Sin entrada"; con los tokens queda un fundido de 120 ms sin desplazamiento. Es el mismo caso que M05 (ver arriba): un token de duración que valga 0 en reducido lo resolvería en los tres.
- **1.4.12 (espaciado de texto) en servicios a 360.** Los nombres son de una línea (`nowrap`, la respiración lo necesita). Con un espaciado de letras de 0,12 em el nombre activo desborda hacia la derecha sin cortarse ni taparse; verificar con el bookmarklet de espaciado de texto en la QA de cierre.


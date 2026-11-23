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
- **6 preguntas frecuentes** con respuesta (los borradores de los wireframes v4 no están en el repo).
- **Títulos y descripciones SEO** por página: borradores en `pages.*` de `src/i18n/*.json`; revisarlos.

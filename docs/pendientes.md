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

## Decisiones abiertas

- Agrupación de carruseles dudosos (ISCAMEN 08–12 y 15–19, serie Carpa, ads de Condimento): `docs/inventario.md`.
- Archivos de la raíz sin versionar: `PRD-Portfolio-Franco-Colucci (5).md`, `design-system (2).md`, `PROMPT-CLAUDE-CODE.md`, `README-MOTION.md`.
- `.claude/rules/contenido-y-assets.md`: el PRD §8 la cita y no existe.
- PRD §8: se sumaron los campos `caso` y `video` al modelo de pieza.
- Caracteres → ↗ ← ⧉ ✓: no están en el subset `latin` de Archivo. Decidir en la Fase 3 si van como íconos SVG.
- `astro check`: instalar `@astrojs/check` + `typescript` (dependencias de desarrollo).
- Skills frontend-design y ui-ux-pro-max: no instaladas.
- Playwright: no instalado; las revisiones se hacen con el navegador integrado.

## Contenido

- `meta.siteDescription` (ES y EN) en `src/i18n/*.json`.

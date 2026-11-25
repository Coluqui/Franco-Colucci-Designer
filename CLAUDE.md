# Portfolio Franco Colucci

Portfolio de Franco Colucci, diseñador gráfico y digital. Objetivo: conseguir entrevistas en empresas. **El trabajo es el protagonista.**

## Fuentes de verdad

Mandan sobre todo lo demás. Si chocan entre sí, gana la de arriba.

| # | Documento | Versión | Qué define |
| --- | --- | --- | --- |
| 1 | `docs/PRD-Portfolio-Franco-Colucci.md` | v4.0 | Alcance, páginas, flujos, contenido, requisitos, stack |
| 2 | `docs/design-system.md` | v2.1 "Formato" | Cómo y dónde se usa cada token, componentes y estados, responsive, prohibidos |
| 3 | `design-system/tokens.css` | v2.1 | **Única fuente de valores** (`tokens.json` es una copia derivada) |
| 4 | `docs/motion.md` | v3.0 "Desglose" | Efectos 4.1–4.13 con GSAP, versión reducida, criterios de aceptación |
| 5 | `.claude/rules/*.md` | — | Reglas por ruta (se cargan solas al tocar `src/`) |

- **"Ficha de producción" es obsoleta**: marcas de corte, naranja señal, Instrument Sans, radios de 0 px, navegación numerada, mosaico del hero, `motion.md` v1.1 e IDs M33–M39. También **"Formato vivo"** (`motion.md` v2.0, M01–M32, `prompts/07-motion.md`), reemplazado por v3.0 el 24 nov. Si aparece, se lista y se propone borrarlo.
- Si un pedido contradice estas fuentes, **avisar antes** y decir qué documento habría que actualizar.
- **Nunca inventar contenido real** (testimonios, métricas, clientes, textos de caso): placeholder `PENDIENTE` + entrada en `docs/pendientes.md`.

## Reglas importadas

@.claude/rules/motion.md

## Stack

- **Astro 7** + TypeScript estricto (`astro/tsconfigs/strict`). Node ≥ 22.
- **CSS nativo con tokens** (`design-system/tokens.css`). Sin Tailwind ni librerías de UI.
- **i18n nativo**: `/es/` y `/en/` con prefijo; `/` elige según el navegador (español por defecto).
- **Colecciones de contenido** con Zod (`src/content.config.ts`).
- **Motion**: **GSAP** (ScrollTrigger, ScrollSmoother, SplitText, CustomEase) registrado una sola vez en `src/motion/gsap.ts` + View Transitions (`<ClientRouter />`). Sin otras librerías de animación.
- **Fuentes**: Archivo variable (`wdth` 62–125, `wght` 100–900) + Geist Mono 500, autoalojadas en `public/fonts/`.
- **Formulario**: Resend desde una ruta on-demand (Fase 7). **Hosting**: Vercel.

## Estructura

```
docs/                 PRD, design system, motion, inventario, pendientes
design-system/        tokens.css (fuente de valores) + tokens.json
prompts/              prompts de implementación por etapa
.claude/rules/        reglas por ruta · .claude/agents/  subagentes
public/brand/         marca-formato.svg, favicon.svg, grain.svg  (de Franco: no tocar sin preguntar)
public/fonts/         woff2 autoalojadas
src/i18n/             es.json, en.json, index.ts (t(), switchLangPath(), localizePath())
src/content.config.ts colección `piezas`
src/assets/trabajos/<slug>/   una carpeta por pieza: pieza.json + slides
src/pages/[lang]/     páginas por idioma
src/motion/           gsap.ts, tokens.ts, smooth.ts, reveals.ts, hero.ts, logo.ts, micro.ts (WAAPI), paginas.ts, index.ts
src/config/site.ts    mail, WhatsApp, LinkedIn (PENDIENTE hasta que Franco los complete)
```

## Convenciones de código

- **Ningún string visible fijo** en componentes: todo sale de `src/i18n/*.json` con `t(lang, 'clave')`. `en.json` se tipa contra `es.json`.
- **Valores solo vía tokens** semánticos (`--color-*`, `--text-*`, `--space-*`, `--spring-*`…). Nunca la paleta base ni valores sueltos.
- Hover solo en `@media (hover: hover) and (pointer: fine)`; focus-visible con `--focus-ring`; objetivos de 44 × 44 px.
- Mobile-first, container queries, `100dvh`, safe areas.
- **Un carrusel es UNA pieza** con varios slides (PRD §6). Una pieza simple tiene un solo slide.
- **Un proyecto es una empresa**: rol, descripción y sus piezas agrupadas por tipo. Sin objetivo, métricas ni FAQ (PRD v4.0).
- Las piezas nunca se tiñen, deforman ni llevan grano encima.

## Forma de trabajo

- **Por fases, una a la vez.** Al empezar cada fase: plan (archivos y orden) y esperar el OK de Franco. Al terminar, entregar:
  - qué se hizo;
  - la URL local exacta;
  - el resultado de las revisiones;
  - lo pendiente;
  - las decisiones que hacen falta.
  **No pasar a la fase siguiente sin aprobación.**
- **Commits chicos**, uno por paso, en español, con qué y por qué. Motion: `motion(4.8): …`.
- **Antes de cerrar una fase**:
  - `npm run build` sin errores;
  - revisión a 360, 768, 1280 y 1440 px, en claro y oscuro, en ES y EN;
  - una pasada con `reducedMotion: 'reduce'`.
- **Sin dependencias nuevas sin preguntar**: para qué sirve y cuánto pesa.
- **Solo lectura**: `C:\Users\FRANCO\Portfolio\dist\proyectos`, `_inbox/` y `public/brand/`. Se copia; nunca se borra, mueve ni sobrescribe sin preguntar.
- **Secretos**: no leer `.env*` (bloqueado en `.claude/settings.json`). Usar `.env.example`.
- **Dev server**: `npm run dev` → http://localhost:4321/es/ (o `astro dev --background`).

## Subagentes (`.claude/agents/`)

| Agente | Rol |
| --- | --- |
| `arquitecto` | Repo, Astro, i18n, colecciones, CLAUDE.md |
| `frontend` | Layouts, componentes y páginas con tokens |
| `ux-ui` | Revisa jerarquía, estados, responsive y fidelidad (solo lectura) |
| `motion` | Efectos 4.1–4.13 según `docs/motion.md` v3.0 (GSAP) |
| `accesibilidad` | WCAG 2.2 AA (solo lectura) |
| `contenido` | Piezas, textos ES/EN, alt text |
| `backend` | Formulario, anti-spam, env, CV, deploy |
| `qa` | Build, Lighthouse, anchos, idiomas, modos, SEO |

**Quien construye no se aprueba a sí mismo**: lo que hacen `frontend` o `motion` lo revisan `ux-ui` y `accesibilidad` antes de cerrar la fase. En cada fase, decir qué subagente y qué skill se usaron.

## Skills: precedencia

Las fuentes de verdad mandan sobre cualquier skill.

| Skill | Para qué sí | Para qué no |
| --- | --- | --- |
| **frontend-design** | Calidad de implementación: HTML semántico, CSS, layout, detalle tipográfico, estados, terminación | Su estética propia: colores, fuentes, radios, sombras y concepto salen del design system |
| **ui-ux-pro-max** | Revisión de UX y accesibilidad, WCAG 2.2 AA, checklists de entrega | Sus paletas, estilos y pares tipográficos |
| **motion-foundations** | Técnicas: rendimiento, `prefers-reduced-motion`, cuándo animar | Su API `motion/react` y sus presets; el motion se hace con GSAP; no se suman otras librerías (Framer Motion, Lenis) sin OK |

Si falta una skill, avisar y seguir con las que haya, sin instalar nada. Hoy, como reemplazo de ui-ux-pro-max: `design:accessibility-review` (WCAG 2.1, más los criterios 2.2 a mano) y `design:design-critique`.

> **OBSOLETO (24 nov 2026).** Corresponde a motion v2.0 "Formato vivo", reemplazado por `docs/motion.md` v3.0 "Desglose". Se conserva como historial; propuesto para borrar.

# Prompt 07 · Motion "Formato vivo"

Antes de pegarlo: copiá los archivos de este kit a la raíz de "Portfolio 2", reemplazando los que ya existen. Son `docs/motion.md`, `docs/design-system.md`, `docs/PRD-Portfolio-Franco-Colucci.md`, `design-system/tokens.css`, `design-system/tokens.json` y `.claude/rules/motion.md`.

---

Actualicé el motion del portfolio. La nueva fuente de verdad es `docs/motion.md` v2.0 ("Formato vivo"), que reemplaza por completo a la v1.1. Los tokens pasaron a la v2.1, con resortes `--spring-*`, respiración `--wdth-*` y lectura `--reveal-*`.

**Paso 0 · Ordenar (sin código de motion todavía)**

1. Leé `docs/motion.md`, `.claude/rules/motion.md`, `docs/design-system.md` §4, §7 y §9, y la sección 10 del PRD.
2. Actualizá `CLAUDE.md`:
   - En la tabla de fuentes de verdad: PRD v3.2, design system v2.1, tokens v2.1 y `docs/motion.md` v2.0.
   - Importá la regla con `@.claude/rules/motion.md` si no estaba.
   - Borrá cualquier mención a "registro", marcas de corte, M33–M39 o `motion.md` v1.1.
3. Buscá en `src/` código de motion viejo o valores sueltos (`ms`, `cubic-bezier`, `transition:` sin tokens) y listámelos. No los borres todavía.
4. Mostrame el plan de los pasos 1 a 5 y esperá mi OK.

**Paso 1 · Base:** `src/scripts/motion/` con utilidades:
- leer tokens;
- `animate` con resorte;
- FLIP;
- un solo `IntersectionObserver` para entradas;
- detector de movimiento reducido.

Página `/dev/motion` con un botón por ID para probarlos sueltos.

**Paso 2 · Firma:** M01–M05. Glifo (encastre, desencastre y confirmación), loop del hero con pausa y tira estática en movimiento reducido, y vista previa de servicios que cambia de formato.

**Paso 3 · Respiración y lectura:** M13–M17. Ojo: servicios con `font-size: min(var(--text-services), 7.6cqi)` y alto fijo por ítem.

**Paso 4 · Navegación:** M06–M12 y M19–M24. View Transitions fila → caso, visor, filtros, header, menú, panel, barra mobile, modo e idioma.

**Paso 5 · Microinteracciones:** M25–M32.

**En cada paso:**
- Uno por vez, con commit por ID (`motion(M05): …`).
- Probá con Playwright a 360 y 1440 px, en claro y oscuro, y con `reducedMotion: 'reduce'`.
- Corré `npm run build`.
- Pasame la URL local para que lo vea.

**Al final:** la tabla de cumplimiento M01–M32 contra los criterios de aceptación de `docs/motion.md` §9. Incluí un perfil de rendimiento de M04, M05, M06, M13 y M28 con CPU 4× en Chrome.

Si algo de `docs/motion.md` no se puede hacer como está escrito, avisame antes de cambiarlo.

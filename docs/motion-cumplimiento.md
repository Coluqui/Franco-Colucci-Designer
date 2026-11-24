# Cumplimiento de motion · cierre de la Fase 6

Contra `docs/motion.md` v2.0 §9. Medido el 24 nov 2026 sobre el build de producción (`astro preview`), salvo M28, que solo existe en `/es/dev/componentes/` mientras los testimonios sean PENDIENTE.

## Criterios de §9

| Criterio | Estado | Cómo se comprobó |
| --- | --- | --- |
| Cada ID tiene versión reducida, probada | ⚠️ | 27 IDs con prueba en Playwright con `reducedMotion: 'reduce'` y sin él, a 360 y 1440, en claro y oscuro. Faltan M01–M03 (esperan el SVG) y M31 (CV PENDIENTE); M18 no tiene animación. En M05, M16, M17, M19–M22, M29 y M32 el reducido no coincide con la columna de `docs/motion.md`: decisión abierta de Franco. |
| Wordmark, bajada y primera fila en el primer frame; LCP < 2,5 s | ✅ | Nada arranca con opacidad 0 (pruebas del paso 3 y barrido de 160 cargas). LCP 0,71–0,80 s con CPU 4× y 4G lenta, igual con y sin movimiento reducido. |
| 60 fps con CPU 4× en M04, M05, M06, M13 y M28 | ⚠️ M06 | M04, M05, M13 y M28 a 60 fps. M06 da 51–57 fps: se confirma en un Android real (ver abajo). |
| CLS = 0 en carga, modo, idioma, filtro y respiración | ✅ con red rápida · ⚠️ con 4G lenta | **Carga, red rápida:** 0 en las 6 páginas a 360 y 1440. QA encontró 0,12 en `/trabajos/` (los filtros aparecían después del script) y la FAQ se cerraba después del primer cuadro: corregido, ahora se pintan en su estado desde el primer cuadro. **Carga, 4G lenta y sin caché:** 0,007 en la home a 1440 y 0,03 en `/en/` a 360, por el cambio a Archivo; era 0,096 antes del respaldo con métricas. Por debajo del 0,1 de Core Web Vitals, pero no es 0 (decisión en pendientes). **Modo, idioma, respiración:** 0. **Filtro:** 0; el chip activo ensancha y corre a sus vecinos en el mismo clic (`hadRecentInput`). |
| ESC, segundo clic o arrastre interrumpen sin estados rotos | ✅ | Pruebas de clics seguidos (M12), cierre durante el vuelo (M08/M09), ESC y arrastre (M09, M20, M21), arrastre que corta el rodar (M28) y `animar()` con `cancel()` en todo. |
| Loop con pausa visible; se detiene fuera de pantalla y con la pestaña oculta | ✅ | `tests/m04-loop.spec.ts`. |
| Sin grano con transparencia reducida; sin loop con movimiento reducido | ✅ | `--grain-opacity: 0` bajo `prefers-reduced-transparency` en `tokens.css`; M04 pasa a tira estática. |
| Ninguna duración ni curva a mano | ✅ | Búsqueda en `src/`: solo quedan pasos de `visibility` en 0 s y la animación del visor de 1 ms que maneja el dedo con `currentTime`. |

## Perfil de rendimiento (Chromium sin GPU, CPU 4×)

| ID | 360 px | 1440 px |
| --- | --- | --- |
| M04 loop | 60 fps · 0/180 cuadros largos | 60 fps · 0/179 |
| M05 servicios | 60 fps · 0/174 | 60 fps · 0/174 |
| M13 respiración | — (sin hover) | 60 fps · 0/190 |
| M06 fila → caso | 57 fps · 2/120 | 51 fps · 14/108 |
| M28 testimonios | 60 fps · 0/130 | 60 fps · 0/146 |

**M06:** el cuadro largo de 117–133 ms es la carga y el cambio de página (`fetch`, parseo y swap), antes de que empiece la animación. Durante la transición, el hilo principal está ocupado un 38 % y los cuadros alternan 17 y 33 ms **también sin throttling**. Por eso el límite es la rasterización por software del Chromium de prueba (sin GPU), que copia las capturas de página entera. Hay que confirmarlo en un Android real. En el perfil apareció un error real que ya está corregido: el título de otra fila viajaba hasta "Siguiente caso" (commit `a099e26`).

## Estado por ID

| ID | Interacción | Estado | Reducido |
| --- | --- | --- | --- |
| M01 | Glifo al cargar | ⏳ Espera `marca-formato.svg` | — |
| M02 | Glifo: desencastre en hover | ⏳ Espera `marca-formato.svg` | — |
| M03 | Glifo como confirmación | ⏳ SVG y Fase 7 | — |
| M04 | Loop de formatos | ✅ | Tira estática |
| M05 | Vista previa de servicios | ✅ | 120 ms (decisión abierta) |
| M06 | Fila → caso | ✅ | Fundido de 120 ms |
| M07 | Atrás / siguiente caso | ✅ | Fundido de 120 ms |
| M08 | Tile → visor | ✅ | Fundido, sin FLIP |
| M09 | Cerrar el visor | ✅ | Fundido |
| M10 | Slides | ✅ | Sin desplazamiento |
| M11 | Pieza siguiente | ✅ | Fundido |
| M12 | Filtros | ✅ | Sin FLIP |
| M13 | Servicio activo | ✅ | Todos en 125, solo color |
| M14 | Links del menú | ✅ | Todos en 125 |
| M15 | Lectura | ✅ | Frase completa |
| M16 | Entrada de sección | ✅ | 120 ms (decisión abierta) |
| M17 | Filas de caso | ✅ | 120 ms (decisión abierta) |
| M18 | Métricas | Sin animación (por diseño) | — |
| M19 | Header al scrollear | ✅ | 120 ms (decisión abierta) |
| M20 | Menú desde el botón | ✅ | 120 ms (decisión abierta) |
| M21 | Panel Hablemos | ✅ | 120 ms (decisión abierta) |
| M22 | Barra mobile | ✅ | 120 ms (decisión abierta) |
| M23 | Modo | ✅ | Fundido |
| M24 | Idioma | ✅ | Fundido |
| M25 | Botón primario | ✅ sin el glifo (M02) | Sin hundimiento |
| M26 | Link | ✅ | Sin transición |
| M27 | Fila: hover y foco | ✅ | Sin desplazamiento |
| M28 | Testimonios | ✅ (solo en componentes) | Sin rodar |
| M29 | FAQ | ✅ | 120 ms (decisión abierta) |
| M30 | Copiar mail | ✅ (mail PENDIENTE) | Solo el cambio de texto |
| M31 | Descargar CV | Hecho, sin probar (CV PENDIENTE: no hay botón activo) | Solo el cambio de texto |
| M32 | Formulario | ✅ error y enviando; éxito y error de envío en Fase 7 | Error sin fundido (decisión abierta) |

## Accesibilidad de texto (1.4.12)

Con el espaciado máximo de WCAG, en `/es/` y `/en/` a 360, 768, 1280 y 1440:
- **Servicios:** nada se recorta. A 360 el nombre más largo sobresale 9 px, porque M13 lo obliga a una línea.
- **Hero:** el wordmark sobresale. Es texto decorativo con `aria-hidden`; el nombre real está en el `h1`. La bajada ya no se corre: corregido en `Hero.astro`.

# Motion — "Desglose" (v3.0)

24 nov 2026 · **v3.0 aprobada por Franco** · Reemplaza por completo a `motion.md` v2.0 ("Formato vivo", M01–M32), que queda **obsoleto**, igual que v1.1.

Origen: `MOTION_SPEC.md` de Franco (24 nov), adaptado a este repo. Referencia de lenguaje: jeppesen.dev (Astro + GSAP). **Se toman las técnicas, no la identidad**: nada de su logo, su ✱, sus textos ni su layout. Todo se aplica sobre el diseño y los componentes de este sitio.

**Concepto.** El portfolio se va desglosando a medida que se scrollea: primero el nombre y lo mejor del trabajo, después cada proyecto se abre en sus piezas. El movimiento acompaña la lectura y nunca tapa el trabajo.

Cada efecto tiene un ID (`4.1` … `4.13`, la numeración del spec) para los commits (`motion(4.8): …`) y los criterios de aceptación.

## 1. Stack de animación

- **GSAP** (`gsap` en npm) con `ScrollTrigger`, `ScrollSmoother`, `SplitText` y `CustomEase`. Todos los plugins son gratuitos y vienen en el paquete npm desde la 3.13. Verificar versión y licencia en la documentación oficial antes de instalar.
- Los plugins se registran **una sola vez** en `src/motion/gsap.ts`. Ningún componente importa `gsap` por su cuenta.
- **Transiciones entre páginas:** Astro `<ClientRouter />` (View Transitions), que ya está en uso.
- **Grano:** el `grain.svg` actual, detrás del contenido (`--z-grain: -1`, design system §5). No se pone encima de las piezas.
- Sin Three.js, Lottie ni otras librerías salvo pedido de Franco.

## 2. Arquitectura

```
src/motion/
  gsap.ts         registro de plugins + defaults (ease, duration)
  tokens.ts       duraciones, curvas y staggers de GSAP (§3)
  smooth.ts       init/destroy de ScrollSmoother
  reveals.ts      revelados genéricos por data-attribute
  textNoise.ts    texto que pasa de granulado a sólido (4.5)
  hoverPreview.ts vista previa que sigue al cursor (4.7)
  index.ts        initMotion() / destroyMotion()
  micro.ts        micro-interacciones con WAAPI (visor, panel, menú, filtros, botones, formulario)
  paginas.ts      tipo de navegación y entrada de bloques al llegar a un caso
```

- Reemplaza a `src/scripts/motion/` (encastre, respiración, lectura, flip, observer): **borrado el 25 nov**. La lectura de la frase pasó a 4.5 (texto que se define, 25 nov), el encastre de servicios a un fundido cruzado (4.7) y la entrada del menú a 4.10.
- **Micro-interacciones en WAAPI** (`micro.ts`): el visor, el panel, el menú, los filtros, los botones y el formulario siguen con Web Animations y los tokens de `tokens.css`, porque animan pseudo-elementos (`::backdrop`, `::before`) que GSAP no alcanza. El scroll y los revelados son siempre GSAP.
- Se activa por **data-attributes**, no por clases: `data-reveal`, `data-reveal="clip"`, `data-split`, `data-noise-text`, `data-hover-preview`, `data-magnetic`, `data-pin`.
- Cada módulo usa `gsap.context()` / `gsap.matchMedia()` y hace **revert** al desmontar y en cada navegación: `astro:before-swap` → `destroyMotion()`, `astro:page-load` → `initMotion()`. Sin listeners ni ScrollTriggers duplicados al navegar.
- `ScrollTrigger.refresh()` después de cargar fuentes (`document.fonts.ready`) e imágenes, al cambiar de idioma y al cambiar de tema si afecta el layout.

## 3. Tokens de motion

GSAP usa nombres de curva propios (`power3.out`), que CSS no entiende. Por eso **los valores de GSAP viven en `src/motion/tokens.ts`**, que es su única fuente. Las transiciones CSS siguen usando `design-system/tokens.css` (`--duration-*`, `--ease-*`, `--spring-*`). Nadie escribe valores sueltos.

| Token | Valor | Uso |
| --- | --- | --- |
| `dur.fast` | 0.35 s | Botones, salidas |
| `dur.base` | 0.7 s | Revelados |
| `dur.slow` | 1.1 s | Hero, máscaras |
| `ease.out` | `power3.out` | Entradas |
| `ease.inOut` | `power4.inOut` | Wipes, clip-path, transiciones |
| `ease.expo` | `expo.out` | Menú, elementos grandes |
| `ease.back` | `back.out(0.8)` | Solo wordmark y acentos, con moderación |
| `stagger.items` | 0.06 | Cards, links |
| `stagger.words` | 0.04 | Palabras |

## 4. Catálogo

| ID | Efecto | Dónde |
| --- | --- | --- |
| 4.1 | **Smooth scroll** con ScrollSmoother (`smooth: 1`, `effects: true`). Wrapper `#smooth-wrapper > #smooth-content`. Solo con `(pointer: fine)`; en touch, scroll nativo. Header, menú, panel Hablemos, visor y barra mobile van **fuera** de `#smooth-content` | Layout `Base.astro` |
| 4.2 | **Intro del hero.** Wordmark partido con SplitText (chars), `yPercent: 100 → 0` dentro de una máscara, `ease.expo`. El acento entra con wipe `inset(0 100% 0 0)` → `inset(0 0% 0 0)`. Bajada y CTA: fade + `y: 20` con delay corto. Total ≤ 1,6 s. **No bloquea la interacción** | `Hero.astro` |
| 4.3 | **Hero ligado al scroll.** Entrada: las letras del wordmark suben dentro de su máscara y la bajada aparece. Al scrollear, el wordmark escala 1 → 0,85 y sube; la bajada se desvanece (`scrub: true`). El hero no lleva piezas (Franco, 24 nov). **Sin pin largo:** dura como máximo el 60–80 % del alto del viewport | `Hero.astro` |
| 4.4 | **Revelado de texto** (`data-split`): SplitText en palabras (títulos) o líneas (párrafos) con máscara, `yPercent: 110 → 0`, `stagger.words`, al entrar (`start: "top 85%"`, `once: true`) | Títulos de sección, bajadas |
| 4.5 | **Texto que se define** (`data-noise-text`, efecto firma, máximo 2 titulares): pasa de granulado a sólido palabra por palabra con el scroll. Filtro SVG `feTurbulence` + `feDisplacementMap`; `baseFrequency` y `scale` → 0, con `opacity` y `blur()` por palabra, con `scrub`. Capa fantasma del mismo texto debajo (baja opacidad, `aria-hidden`). El texto real sigue siendo seleccionable | Frase-problema y cierre |
| 4.6 | **Sección que se abre con máscara**: `clip-path: inset(15% 10% round var(--radius-sm))` → `inset(0)`, con `scrub` y pin corto (≤ 50vh). El contenido entra después, escalonado (`opacity`, `y`, `blur(8px) → 0`). Colores del tema (sección invertida), nunca fijos | Clientes + Testimonios, Skills |
| 4.7 | **Lista con estado activo + vista previa.** Ítem activo en `--color-text-primary`, el resto en `--color-text-secondary` (hover en desktop; el que está en viewport en mobile). *Ajuste 25 nov: no se baja el resto a opacidad 0,35 porque no llegaría a contraste AA.* `data-hover-preview`: en desktop, la pieza sigue al cursor con `gsap.quickTo` (x/y, 0,5 s, `power3`), entra con `scale 0.9 → 1` + fade y cambia con crossfade. En touch, sin flotante: la imagen va inline | Qué hago |
| 4.8 | **Cards de proyecto.** Hover: la imagen escala 1,04 dentro de su máscara, parallax leve según el cursor (`xPercent`/`yPercent` ±3) y el título se corre un poco. Entrada: `stagger.items`, `y: 40 → 0`, una vez. Clic → caso con **elemento compartido** (`transition:name` en la imagen y en el hero del caso). Todo es clickeable de inmediato | Home, Trabajos, caso |
| 4.9 | **Botones: cambio de texto.** El texto sale hacia arriba y entra una copia desde abajo (`yPercent`), `ease.inOut`, `dur.fast`. Opcional en el CTA principal: magnético (`data-magnetic`), máximo 8 px | `Boton.astro` |
| 4.10 | **Menú.** Abrir: panel con wipe de `clip-path` desde arriba; links `yPercent: 100 → 0` + `blur(6px) → 0`, `stagger.items`, `ease.expo`; el scrim hace fade. Cerrar: lo mismo invertido y más rápido. Foco atrapado, Esc y `aria-expanded` correctos | `Menu.astro` |
| 4.11 | **Toggles.** Tema: View Transitions con un círculo que se expande desde el botón (`clip-path: circle()`); sin soporte, crossfade de 0,3 s. Idioma: los textos hacen fade + `y: 6` y después `ScrollTrigger.refresh()` | Header, menú, footer |
| 4.12 | **Acordeón.** Alto animado con GSAP (`height: auto`); el "+" rota 45° | Servicios en mobile (la FAQ se quitó en v4.0 del PRD) |
| 4.13 | **Footer que se descubre.** El footer queda fijo debajo del contenido y aparece al llegar al final; el nombre grande entra con SplitText (chars) | `Footer.astro` |

## 5. Reglas no negociables

- **`prefers-reduced-motion: reduce`:** sin smooth scroll, sin scrub, sin pins ni texto granulado. Solo fades de ≤ 0,2 s. Se implementa con `gsap.matchMedia()`.
- **Performance:** animar solo `transform`, `opacity`, `clip-path` y `filter` (el blur con moderación). Nada de `top/left/width/height` en scroll, salvo el acordeón (4.12). `will-change` solo durante la animación. 60 fps; si un filtro SVG baja de 50 fps en una laptop media, se simplifica.
- **Sin layout shift ni parpadeo:** los estados iniciales se ponen en CSS bajo `html.motion` (clase que agrega `initMotion()`), o con `gsap.set` antes del primer paint. Si JS falla o no carga, el contenido se ve igual.
- **Mobile:** pins desactivados o más cortos, sin efectos de cursor, sin ScrollSmoother.
- **Accesibilidad:** los textos partidos con SplitText mantienen `aria-label` con el texto completo; lo decorativo lleva `aria-hidden`. Foco visible, Esc y foco atrapado en menú, panel y visor.
- **El trabajo no se tiñe ni se deforma:** las piezas pueden recortarse, escalar dentro de su máscara (4.8) o moverse, nunca estirarse, inclinarse, teñirse ni llevar grano o blur una vez quietas.
- **Moderación:** el foco es ver los proyectos rápido. Ningún efecto esconde contenido más de ~1 viewport de scroll. Ante la duda, menos.
- **Lighthouse Performance ≥ 90 en desktop** con todo aplicado (y se sigue midiendo en mobile).

## 6. Fuera

Marquee, cursor custom, preloader, grano animado, contadores que suben, texto que se escribe solo, "fade-up" en todos los elementos, scroll-jacking que cambie la distancia de scroll (ScrollSmoother suaviza, no secuestra), pins de más de 50vh.

## 7. Plan de implementación (Fase 10)

Un commit por paso y una rama por fase; se muestra el resultado antes de seguir.

1. Base: instalación, `src/motion/`, tokens, init/destroy, reduced-motion, ScrollSmoother; se retira el motion v2.0.
2. Revelados (4.4) + botones (4.9) + menú (4.10).
3. Hero (4.2 + 4.3).
4. Cards + transición al caso (4.8).
5. Efectos firma: 4.5 y 4.6.
6. Lista con vista previa (4.7), toggles (4.11), acordeón (4.12) y footer (4.13).
7. QA: mobile, reduced-motion, cambio de idioma y tema, ida y vuelta entre páginas sin triggers duplicados, Lighthouse.

Al terminar cada fase se reporta: qué efectos y dónde (archivo + data-attribute), cómo probarlo y qué se simplificó por performance o accesibilidad, y por qué.

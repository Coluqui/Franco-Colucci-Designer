---
paths:
  - "src/**/*.{astro,ts,js,css}"
  - "design-system/**/*"
---

# Motion — "Desglose" (v3.0)

Fuente de verdad: `docs/motion.md` v3.0. Esta regla es el resumen que se aplica siempre que se toca UI. Si algo de acá choca con `docs/motion.md`, manda `docs/motion.md`. **Obsoletos:** `motion.md` v2.0 ("Formato vivo", M01–M32, encastre, respiración, lectura) y v1.1 ("registro", marcas de corte). Si encontrás código que los use, reemplazalo.

## Stack

- **GSAP** con `ScrollTrigger`, `ScrollSmoother`, `SplitText` y `CustomEase`, registrados una sola vez en `src/motion/gsap.ts`. Ningún componente importa `gsap` directo.
- View Transitions con Astro `<ClientRouter />`. Sin otras librerías (Three.js, Lottie, Framer Motion, Lenis) sin OK de Franco.

## Reglas duras

- **Solo tokens.** Valores de GSAP desde `src/motion/tokens.ts` (`dur.*`, `ease.*`, `stagger.*`); transiciones CSS desde `design-system/tokens.css`. Nunca `0.5` ni `"power2.out"` sueltos en componentes.
- **Activación por data-attributes:** `data-reveal`, `data-split`, `data-noise-text`, `data-hover-preview`, `data-magnetic`, `data-pin`.
- **Ciclo de vida:** cada módulo con `gsap.context()` / `gsap.matchMedia()`; `astro:before-swap` → `destroyMotion()`, `astro:page-load` → `initMotion()`. Nada duplicado al navegar. `ScrollTrigger.refresh()` tras fuentes, imágenes, idioma y tema.
- **Propiedades:** `transform`, `opacity`, `clip-path` y `filter` (blur con moderación). Nada de `top/left/width/height` en scroll, salvo el acordeón (4.12). `will-change` solo durante la animación.
- **Sin parpadeo:** estados iniciales bajo `html.motion` (la agrega `initMotion()`). Sin JS, todo visible.
- **Movimiento reducido** (`gsap.matchMedia()`): sin smooth scroll, scrub, pins ni texto granulado; solo fades ≤ 0,2 s.
- **Mobile / touch:** sin ScrollSmoother, sin efectos de cursor, pins cortos o ninguno.
- **El trabajo no se tiñe ni se deforma:** se recorta, escala dentro de su máscara o se mueve; nunca se estira, inclina, tiñe ni lleva grano o blur quieto.
- **Accesibilidad:** SplitText conserva `aria-label` con el texto completo; capas fantasma y decorados con `aria-hidden`.
- **Moderación:** ningún efecto esconde contenido más de ~1 viewport de scroll; pins ≤ 50vh.

## Prohibido

Marquee, cursor custom, preloader, grano animado, contadores que suben, texto que se escribe solo, "fade-up" en todos los elementos.

## Antes de dar algo por terminado

Probá cada ID que tocaste con y sin `prefers-reduced-motion` (Playwright: `page.emulateMedia({ reducedMotion: 'reduce' })`), a 360 y 1440 px, en claro y oscuro, y navegando ida y vuelta (sin ScrollTriggers duplicados). Nombrá los IDs en el commit: `motion(4.8): cards con hover y transición al caso`.

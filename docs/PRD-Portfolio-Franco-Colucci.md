# PRD — Portfolio Franco Colucci

24 nov 2026 · Franco Colucci · **v4.0 (motion "Desglose" con GSAP; proyectos por empresa; Skills en lugar de FAQ)**

Este documento es la fuente de verdad del proyecto para el diseño final (Etapa 7) y para Claude Code (Etapa 8). Reemplaza a la v2.1: la dirección "Ficha de producción" y su motion quedaron descartados porque el resultado se veía genérico. La v3.1 suma el motion nuevo, pensado para que el sitio se sienta orgánico y no de plantilla.

## Estado del documento

La nueva dirección toma la estructura y el tono de **jeppesen.dev**, adaptados a un diseñador digital con UX/UI e IA. La estructura es la de los **wireframes v4** y el design system es **"Formato"**. Sigue vigente la regla de contenido **un carrusel es una sola pieza**.

| Etapa | Estado | Entregable |
| --- | --- | --- |
| 0 · Auditoría de la web actual | Hecha en forma parcial | Hallazgos en "Riesgos" |
| 1 · PRD | **v4.0**, se mantiene vivo | Este documento |
| 2 · Referencias y concepto | **Rehecha (23 nov):** referencia jeppesen.dev, concepto "Formato" | Análisis de Jeppesen + tendencias 2026 (sección 4) |
| 3 · Arquitectura y flujos | Rehecha en este PRD | Mapa del sitio + flujos (sección 7) |
| 4 · Wireframes | **v4 en ajuste** | Canvas "Wireframes v4 — Portfolio Franco Colucci" + 7 ajustes pendientes (sección 5) |
| 5 · Design system | **v2.1 "Formato", elegido (23 nov)** | `docs/design-system.md` + `design-system/tokens.css` v2.1 (suma los tokens de motion) |
| 6 · Motion | **v3.0 "Desglose" aprobado** (24 nov), desde el MOTION_SPEC de Franco; reemplaza a v2.0 | `docs/motion.md` v3.0 + `.claude/rules/motion.md` |
| 7 · Diseño final (high-fi) | Sin empezar | Todas las páginas, desktop y mobile, claro y oscuro, ES y EN |
| 8 · Handoff a código | Sin empezar (el repo "Portfolio 2" ya existe) | Paquete de handoff + tareas + CLAUDE.md actualizado |
| 9 · QA y lanzamiento | Sin empezar | Checklist de lanzamiento |

**Descartado:** formato presentación/láminas, muro de piezas, la opción "Escaparate", las direcciones "Galería", "Malbec", "Ficha de producción", "Tinta" y "Plum noir", las marcas de corte, el naranja señal, Instrument Sans, la navegación numerada fija y el mosaico del hero.

### Historial de cambios

| Fecha | Versión | Cambio |
| --- | --- | --- |
| 24 nov 2026 | 4.0 | Motion v3.0 "Desglose" con GSAP (ScrollTrigger, ScrollSmoother, SplitText): el portfolio se desglosa al scrollear; reemplaza a "Formato vivo". El caso deja de ser "problema / objetivo / resultado": es la empresa, el rol de Franco, cómo fue el proyecto y sus piezas agrupadas por tipo. Se quita la FAQ y entra **Skills** con los logos del software. El hero queda solo con el wordmark y la bajada (Franco, 24 nov: sin piezas); el trabajo aparece al scrollear. Bio, experiencia y herramientas desde portfolio2026-twhh.vercel.app. Reel nuevo en Qué hago |
| 23 nov 2026 | 3.2 | Motion aprobado con las tres opciones más trabajosas: frase ligada al scroll (con resguardos), ancho que respira y menú que crece desde el botón. Ruta de los trabajos: `C:\Users\FRANCO\Portfolio\dist\proyectos` |
| 23 nov 2026 | 3.1 | Motion "Formato vivo": encastre (los marcos cambian de formato), respiración (el ancho de Archivo pasa de 112 a 125) y lectura (la frase aparece al ritmo de lectura). Resortes calculados con física real como tokens. 32 interacciones especificadas. Tokens v2.1, design system v2.1, regla de motion para Claude Code |
| 23 nov 2026 | 3.0 | Cambio de dirección: referencia jeppesen.dev, wireframes v4 (home con wordmark, frase-problema, trabajos en filas, servicios, testimonios, FAQ; páginas Trabajos y Sobre mí; panel Hablemos), design system v2 "Formato" (Archivo expandida, cobalto, grano, glifo de marcos encastrados). Motion a rehacer |
| 20 nov 2026 | 2.1 | Motion aprobado (opciones seguras) — **obsoleto** |
| 20 nov 2026 | 2.0 | Versión consolidada con motion "registro" — **obsoleto** |
| 20 nov 2026 | 1.2–1.4 | Regla de carruseles, responsive, Astro y kit de Claude Code |
| 17 nov 2026 | 1.0–1.1 | Primera versión y estructura combinada |

### Documentos relacionados

| Documento | Dónde |
| --- | --- |
| Wireframes v4 | Canvas "Wireframes v4 — Portfolio Franco Colucci" (https://claude.ai/artifact/C8jyvwxnWzuRt5SNjX6o17) |
| Design system v2 | `docs/design-system.md` (repo) · `design-system/design-system.md` (proyecto) |
| Tokens v2.1 | `design-system/tokens.css` + `tokens.json` |
| Motion v3.0 | `docs/motion.md` · regla `.claude/rules/motion.md` · origen: `MOTION_SPEC.md` de Franco |
| Marca | `public/brand/marca-formato.svg`, `favicon.svg`, `grain.svg` |
| Guía para Claude Code | "Guía: del PRD a Claude Code" — https://claude.ai/artifact/3MENedbRJWcsYT28VJ5CYY |
| Obsoletos | Wireframes v3 (PDF), documento "Design system — Portfolio Franco Colucci" (Ficha de producción), `motion.md` v1.1 y v2.0 ("Formato vivo", M01–M32), sus prototipos y `prompts/07-motion.md` |

## 1. Objetivo y métricas de éxito

El portfolio existe para conseguir entrevistas en empresas, remotas o locales, en puestos de diseño gráfico/digital desde USD 2000. En los primeros segundos tiene que transmitir nivel profesional y una identidad propia, y llevar al trabajo con un clic.

| Métrica | Cómo se mide | Meta inicial |
| --- | --- | --- |
| Trabajo visible pronto | La primera card de proyecto aparece con el primer scroll en 1440×900 y 360×780 | Sí, ≤ 1 viewport |
| Contactos recibidos | Envíos del panel Hablemos + clics en mail, LinkedIn y WhatsApp | A definir tras el lanzamiento |
| Descargas del CV | Clics en "CV", por idioma | A definir tras el lanzamiento |
| Casos abiertos por visita | Visitas a páginas de caso / visitas a la home | A definir tras el lanzamiento |
| Profundidad en el visor | Piezas vistas por apertura; en carruseles, % que llega al último slide | A definir tras el lanzamiento |
| Entrevistas conseguidas | Registro propio: entrevistas cuyo origen fue el portfolio | A definir |

## 2. Público y escenarios de uso

| Quién | Dónde y cómo llega | Qué busca | Qué tiene que encontrar |
| --- | --- | --- | --- |
| Recruiter | Celular, desde LinkedIn o una postulación | Saber si encaja | Puesto, ubicación/remoto, idiomas, skills y CV a un toque (barra inferior) |
| Director de arte | Desktop, con tiempo | Criterio y calidad | Wordmark y tipografía con oficio, casos con piezas grandes, visor |
| Equipo de marketing o producto | Desktop o celular | Si produce para sus canales | Servicios con vista previa, filtro por tipo de pieza y proyectos agrupados por tipo |
| Contacto internacional | Desktop, en inglés | Lo mismo, en su idioma | Versión EN completa |

## 3. Posicionamiento y voz

**Frase (borrador):** diseñador gráfico y digital que produce piezas de redes, ads de performance, mails, ebooks y webs que se entienden en un segundo y se pueden medir, con base en UX/UI y un flujo de trabajo con IA.

**Hero (borrador):** "Diseño piezas que tu equipo puede publicar hoy y medir mañana."

**Frase-problema (borrador, vuelve en el cierre):** "Una campaña puede tener la mejor oferta y perder clics porque la pieza no se entiende en un segundo." Cierre: "Si tu equipo necesita piezas que se entiendan en un segundo, hablemos."

Qué lo diferencia, en orden: (1) rango de formatos digitales, (2) pensamiento de sistema en Figma, (3) IA aplicada al proceso, (4) experiencia con organismo público y marcas privadas (ISCAMEN, MoonDesk, Condimento, Carpa, RLB, Interlink).

Título del sitio: **Diseñador gráfico y digital** (EN: *Graphic & Digital Designer*). Voz: concreta, profesional y cercana, sin frases vacías.

## 4. Dirección: qué se toma de Jeppesen y qué no

| Recurso de jeppesen.dev | Decisión | Cómo queda en el portfolio |
| --- | --- | --- |
| Wordmark gigante con un glifo en lugar de una letra (se arma por partes al cargar) | Adaptar | "FRANC▣ COLUCCI": el glifo Formato (marcos 1:1, 4:5 y 9:16 encastrados) reemplaza la O |
| Papel tibio con grano | Tomar | Fondo #F1EFEA (inspirado en Cloud Dancer, Pantone 2026) con grano fino en todo el sitio |
| Frase-problema que se revela al scrollear y vuelve en el cierre | Tomar | Palabra por palabra, una vez |
| Servicios en tipografía enorme con vista previa | Tomar | 6 servicios en Archivo expandida; la vista previa muestra una pieza real de ese servicio y su marco cambia al formato de esa pieza |
| Sección invertida con clientes + testimonios | Tomar | Fondo tinta (en modo oscuro, papel) |
| Chips de métrica | No tomar (v4.0) | Los proyectos no muestran métricas |
| Botón con glifo ("✱ Talk to Lucas") | Adaptar | "▣ Hablemos", abre un panel lateral; el glifo desencastra en hover |
| Astro View Transitions entre home y caso | Tomar | La media de la fila cambia de formato (16:10 → 16:8) mientras se convierte en el hero del caso |
| Listas duplicadas para marquee (logos, servicios, métricas) | No tomar | Sin marquee: es lo que más hace "plantilla" y compite con el trabajo |
| Fotos en duotono | Adaptar | Solo fotos propias (retrato, proceso); las piezas, nunca |
| Clash Grotesk + Author, glifo ✱, textos | No tomar | Archivo + Geist Mono (Google, OFL), glifo propio, textos propios |
| Sin modo oscuro ni idiomas | Sumar | Modo claro y oscuro diseñados; ES y EN |
| Lista de skills | Tomar | Skills con los logos del software, en lugar de una FAQ |
| Smooth scroll, revelados por scroll y transiciones (GSAP) | Tomar las técnicas | Motion "Desglose" (`docs/motion.md` v3.0): el portfolio se desglosa al scrollear |

Tendencias que respaldan la dirección: fondo neutro tipo Cloud Dancer, azul frío eléctrico como acento reservado para foco, texturas de grano en lugar de 3D pesado, abandono del "soft UI" (sombras pesadas, radios extremos) y la tipografía como protagonista.

## 5. Alcance

**Páginas del MVP** (wireframes v4)

| Página | Contenido |
| --- | --- |
| Home `/[lang]/` | Hero (wordmark + bajada) · Frase-problema · Clientes + Testimonios (invertida) · Trabajos (una card por proyecto) · Qué hago (servicios + vista previa + reel) · Skills (logos del software) · Sobre mí (resumen) · Cierre con la frase + Hablemos · Footer con glifo |
| Trabajos `/[lang]/trabajos/` | Una card por proyecto (empresa, rol, cantidad de piezas) + filtro por tipo de pieza |
| Proyecto `/[lang]/trabajos/<slug>/` × 4 | Empresa + rol de Franco · qué es la empresa y cómo fue el proyecto (un párrafo) · hero · **piezas agrupadas por tipo** (Redes, Ads, Documentos, Lanzamientos…) + visor · Siguiente proyecto. Sin objetivo, problema, pasos, resultado ni métricas |
| Sobre mí `/[lang]/sobre-mi/` | Retrato (duotono), bio, datos con etiqueta (base, idiomas, modalidad), experiencia con fechas, cómo uso la IA, CV |
| Hablemos | **Panel lateral** que se abre desde cualquier página; sin JS, página `/[lang]/hablemos/` con el mismo contenido |
| 404 | Mensaje corto + links a Trabajos y Hablemos |

**Funcionalidades del MVP**

- [ ] Header mínimo: glifo + "▣ Hablemos" + "Menú"
- [ ] Menú a pantalla completa (Inicio, Trabajos, Sobre mí + mail, LinkedIn, WhatsApp, CV, ES/EN, modo)
- [ ] Panel Hablemos: formulario corto (nombre, email, mensaje) con estados + copiar mail, WhatsApp, LinkedIn, CV
- [ ] Hero con wordmark y bajada que se achica y se desvanece al scrollear (motion 4.3)
- [ ] Frase-problema que se revela al scrollear
- [ ] Servicios con vista previa que cambia de formato y ancho que respira (desktop) y acordeón (mobile)
- [ ] Testimonios 01/03 con flechas y arrastre con inercia
- [ ] Skills: logos del software agrupados (Diseño, Video y motion, Web, IA)
- [ ] Filtro por tipo de pieza (Trabajos) y piezas agrupadas por tipo (proyecto); un carrusel cuenta 1
- [ ] Visor de piezas a pantalla completa (teclado, swipe, ESC), con carruseles navegables por slide y reels reproducibles
- [ ] Toggle ES/EN que mantiene la página y la posición; toggle claro/oscuro que respeta el sistema y se recuerda
- [ ] CV en PDF en el idioma activo
- [ ] Barra inferior fija en mobile: Hablemos + CV

**Ajustes pendientes a los wireframes v4** (para acercarlos a la referencia; se aplican antes del high-fi)

1. Hero: wordmark a todo el ancho; el loop pasa abajo; el titular largo se muda a la frase-problema.
2. Header: botones compactos de 2 px en lugar de píldoras; "CV" pasa al menú y a la barra mobile.
3. Frase-problema con revelado palabra por palabra.
4. Clientes y testimonios juntos en la sección invertida.
5. Servicios a ~85 px con vista previa fija.
6. Trabajos en cards por proyecto (v4.0).
7. Glifo grande antes del footer.

**Después del MVP:** quinto caso (proyecto personal), dominio propio, antes/después en los casos que lo tengan.

## 6. Carruseles: un carrusel es una sola pieza

Un carrusel se diseña, se publica y se evalúa como una unidad: en el sitio se cuenta, se muestra y se navega como **una pieza con varios slides**.

| Dónde | Cómo se comporta |
| --- | --- |
| Conteos | Un carrusel suma 1 en el contador del visor, los filtros y "piezas por caso" |
| Tile | Portada (slide 1) en 4:5, ícono ⧉ y etiqueta `cliente · Carrusel · 7 slides`. En hover, "Ver pieza ↗". Tile estático: no se cargan slides extra |
| Visor | Slide en 4:5 (en desktop dentro de un marco de teléfono; en mobile a ancho completo, sin marco), indicador segmentado, contador doble `Pieza 03 / 12 · Slide 4 / 7` |
| Teclado | ← → recorren los slides y siguen a la pieza siguiente al terminar; Re Pág / Av Pág saltan de pieza; ESC cierra |
| Táctil | Swipe horizontal = slides; después del último, panel "Siguiente pieza →"; botones de pieza anterior / siguiente de 44 px |
| Inicio y URL | Arranca en el slide 1, sin autoplay; la URL guarda `?pieza=<slug>&slide=4` |
| Página de caso | El carrusel destacado puede mostrarse además como tira horizontal |

Accesibilidad: "Slide 4 de 7" con `aria-live="polite"`, alt por slide, `aria-roledescription="carrusel"`. Performance: en la grilla solo la portada; en el visor, el slide actual + el siguiente.

## 7. Arquitectura de información y flujos

```
Siempre: glifo (inicio) · ▣ Hablemos (panel) · Menú (pantalla completa) · barra Hablemos/CV en mobile

/[lang]/  Home
├── Hero: wordmark + bajada
├── Frase-problema
├── Clientes + Testimonios (invertida)
├── Trabajos destacados ──(fila)──────────────┐
├── Qué hago (servicios + vista previa + reel) │
├── Skills (logos del software)               │
├── Sobre mí (resumen) ──► /[lang]/sobre-mi/   │
│                                             ▼
└── Cierre + Hablemos        /[lang]/trabajos/<slug>/  (MoonDesk · ISCAMEN · Condimento · Carpa)
                                   │ pieza
/[lang]/trabajos/ (filtrar por     ▼
tipo) ──(card)──► proyecto      Visor (pantalla completa)
```

**Flujos clave**

1. **Ver trabajo:** home → card de proyecto (o pieza del hero) → proyecto. 1 clic.
2. **Buscar por tipo:** Menú → Trabajos → "Ads" → proyecto, con sus Ads a la vista. 3 clics.
3. **Ver un carrusel completo:** tile ⧉ → visor en el slide 1 → slides → pieza siguiente.
4. **Contactar:** "▣ Hablemos" (header, barra mobile o cierre) → panel → enviar o link directo. 1 clic para abrir.
5. **Descargar el CV:** barra mobile, menú, panel Hablemos o Sobre mí. 1–2 clics.
6. **Cambiar idioma o modo:** desde el menú o el footer; misma página y posición.

## 8. Contenido

| Pieza de contenido | ES / EN | Quién | Estado |
| --- | --- | --- | --- |
| Hero, frase-problema y cierre | Ambos | Franco + Claude | Borrador (sección 3) |
| 6 servicios con descripción + una pieza de vista previa para cada uno, en el formato de ese servicio (Ads 1:1, Redes 4:5, Reels 9:16, Mail 3:1, Web 16:10, Branding 4:5) | Ambos | Claude propone, Franco elige las piezas | Borrador en wireframes v4 |
| ~~**Hero:** las mejores piezas~~ | — | — | Descartado (24 nov): el hero no lleva piezas |
| **Reel de Qué hago** | — | Franco (video del 16 nov) | Entregado; falta exportarlo liviano (H.264, ~2 MB) |
| **3 testimonios** (nombre, cargo, empresa, 1–2 frases, foto opcional) | Ambos | Franco los pide a clientes | Falta. Si no hay 3, la sección arranca con 1–2 |
| Skills: herramientas agrupadas con su logo y para qué las usa | Ambos | De portfolio2026-twhh.vercel.app | En curso (Fase 9B) |
| Bio corta y bio de Sobre mí; experiencia; cómo uso la IA | Ambos | De portfolio2026-twhh.vercel.app; fechas de experiencia, Franco | En curso (Fase 9B) |
| Por proyecto: rol, qué es la empresa y cómo fue el proyecto | Ambos | De portfolio2026-twhh.vercel.app; lo que falte, borrador de Claude que Franco aprueba | En curso (Fase 9B) |
| Inventario de piezas por caso (una carpeta por carrusel). Origen: `C:\Users\FRANCO\Portfolio\dist\proyectos`, una carpeta por trabajo, solo lectura (son archivos de un build anterior: si hay originales de mayor calidad, usar esos) | — | Franco + Claude Code (Fase 5) | Falta agrupar los carruseles |
| Piezas exportadas, con alt propio (por slide en carruseles) | Alt en ambos | Franco | Falta |
| Hero de cada proyecto (mockup o pieza a ancho completo, 16:8) | — | Franco | Falta |
| Logos de clientes (SVG monocromo) | — | Franco | Falta |
| Retrato + 2–3 fotos de proceso (para duotono) | — | Franco | Existe un retrato, revisar |
| CV en PDF | Ambos | Franco | Existe, actualizar |
| Textos de interfaz, formulario, visor, 404 y SEO | Ambos | Claude | Falta |

**Modelo de contenido por pieza** (v4.0): `slug`, `caso`, `tipo` (Redes, Ads, Documentos, Lanzamientos…), `formato`, `ratio`, `titulo{es,en}`, `slides[{src, alt{es,en}}]`. Sin `objetivo` ni `metrica`. Una pieza simple tiene un solo slide.

**Modelo por proyecto:** `slug`, `empresa`, `rol{es,en}`, `descripcion{es,en}` (qué es la empresa y cómo fue el proyecto), `orden`.

## 9. Design system: "Formato" (v2.1)

Detalle completo en `docs/design-system.md` v2.1; valores en `design-system/tokens.css` v2.1.

| Tema | Decisión |
| --- | --- |
| Concepto | Papel con grano, tinta y un solo color. La tipografía expandida es la voz; el glifo de marcos encastrados es la firma |
| Glifo | Marcos 1:1, 4:5 y 9:16 con la misma altura, encastrados; el 4:5 en cobalto. Logo, O del wordmark, botón Hablemos, favicon y cierre |
| Color | Claro: papel #F1EFEA, tinta #191918, secundario #57554F, superficie #E5E2DA. Oscuro: #151514 / #F1EFEA. Acento único: cobalto #2E3FE0 (oscuro #8E9BFF). Secciones invertidas. 80 combinaciones validadas en AA |
| Tipografía | Archivo variable (`wdth` 125 para wordmark y títulos; servicios y menú respiran entre 112 y 125; 100 para leer) + Geist Mono 500 solo para formatos. Wordmark de 64 a 246 px |
| Textura | Grano global (`grain.svg`, opacidad 0,07 / 0,05); duotono cobalto solo en fotos propias |
| Espaciado y grilla | Base 4 px; 4 / 8 / 12 columnas; márgenes de 20 a 64 px; contenedor de 1312 px; secciones de 80 a 160 px |
| Radios | 2 px controles, 4 px paneles y media; sin sombras de interfaz |
| Componentes | Header, menú a pantalla completa, panel Hablemos, botones, links, card de proyecto, lista de servicios, grilla de clientes, testimonios, skills, filtros, tile, visor, campos, toggles, barra mobile, footer; cada uno con sus estados |

## 10. Motion: "Desglose" (v3.0)

Especificación completa en `docs/motion.md` v3.0, que nace del `MOTION_SPEC.md` de Franco. Reemplaza a "Formato vivo" (v2.0, M01–M32).

**Concepto.** El portfolio se va desglosando a medida que se scrollea: primero el nombre y lo mejor del trabajo, después cada proyecto se abre en sus piezas. Técnicas de jeppesen.dev, no su identidad.

**Stack:** GSAP (ScrollTrigger, ScrollSmoother, SplitText, CustomEase) registrado una sola vez en `src/motion/gsap.ts`, más View Transitions de Astro.

| Momento | Qué pasa | ID |
| --- | --- | --- |
| Todo el sitio | Smooth scroll solo en desktop con puntero fino | 4.1 |
| Carga | El wordmark se arma por letras dentro de una máscara (≤ 1,6 s, sin bloquear) | 4.2 |
| Hero | Al scrollear, el wordmark se achica y la bajada se desvanece (≤ 80 % del viewport) | 4.3 |
| Títulos y párrafos | Revelado por palabras o líneas, una vez | 4.4 |
| Frase-problema y cierre | Pasan de granulado a sólido palabra por palabra con el scroll | 4.5 |
| Clientes y Skills | La sección se abre con una máscara y su contenido entra escalonado | 4.6 |
| Qué hago | Ítem activo + vista previa que sigue al cursor (inline en touch) | 4.7 |
| Proyectos | Cards con hover y transición con elemento compartido al proyecto | 4.8 |
| Botones, menú, toggles, footer | Cambio de texto, menú con wipe, tema en círculo, footer que se descubre | 4.9–4.13 |
| Fuera | Marquee, cursor custom, preloader, grano animado, contadores, texto que se escribe solo, pins de más de 50vh | — |

## 11. Requisitos no funcionales

| Área | Requisito | Criterio de aceptación |
| --- | --- | --- |
| Accesibilidad | WCAG 2.2 AA en ambos modos | Contraste 4,5:1 en texto y 3:1 en controles; focus visible (anillo cobalto); objetivos de 44 × 44 px; un `h1` por página (el wordmark incluye el texto real); foco atrapado en menú, panel y visor |
| Motion | `prefers-reduced-motion` y `prefers-reduced-transparency` | Reducido: sin smooth scroll, scrub, pins ni texto granulado; solo fades ≤ 0,2 s (`gsap.matchMedia()`). Solo `transform`, `opacity`, `clip-path` y `filter`; nada de `top/left/width/height` en scroll salvo el acordeón. 60 fps; CLS = 0; sin JS todo visible; sin ScrollTriggers duplicados al navegar; sin grano con transparencia reducida |
| Performance | Carga rápida con imágenes, grano y GSAP | Lighthouse ≥ 90 en mobile y en desktop con todo el motion; LCP < 2,5 s (el wordmark es texto, no imagen); una sola fuente variable + mono; grano en SVG de ~1 KB; reel corto y liviano |
| SEO | Cada página indexable | Title y description por página e idioma, Open Graph, `hreflang`, sitemap |
| Responsive | Mobile-first | 360, 768, 1280 y 1440 px o más; el wordmark nunca genera scroll horizontal |
| i18n | ES y EN completos | Rutas `/es/` y `/en/`; ningún layout se rompe con el español |
| Modos | Claro y oscuro diseñados | Sin salto de layout ni parpadeo al cargar |
| Formulario | Envío confiable y sin spam | Validación inline, estados de carga, éxito y error sin perder lo escrito, anti-spam |

## 12. Stack técnico

| Pieza | Decisión | Estado |
| --- | --- | --- |
| Repo | "Portfolio 2" (local, después GitHub) | Decidido |
| Framework | Astro (i18n, imágenes, colecciones de contenido, View Transitions) | Decidido |
| Hosting | Vercel, dominio gratuito por ahora | Decidido |
| Desarrollo | Claude Code con `CLAUDE.md` v3 y reglas por ruta | Decidido |
| Tokens | `design-system/tokens.css` v2.1 (fuente de verdad) + `tokens.json` | Elegido |
| Fuentes | Archivo variable (`wght`, `wdth`) + Geist Mono 500, autoalojadas o con la API de fuentes de Astro | Elegido |
| Motion | GSAP (ScrollTrigger, ScrollSmoother, SplitText, CustomEase) + Astro `<ClientRouter />` | Decidido (24 nov) |
| Formulario | Resend desde una ruta on-demand de Astro + anti-spam propio | Propuesto |
| Analítica | Vercel Analytics o equivalente sin cookies | Abierto |

## 13. Próximas etapas

| Etapa | Qué incluye | Entrada que necesita |
| --- | --- | --- |
| 4 · Ajuste de wireframes v4 | Aplicar los 7 ajustes de la sección 5 | Este PRD |
| 6 · Motion | Cerrada: se implementa en la Fase 6 de Claude Code | — |
| 7 · Diseño final | Todas las páginas, desktop y mobile, claro y oscuro, ES y EN | Piezas de servicios, testimonios, textos de proyecto |
| 8 · Handoff | Specs por página, criterios de aceptación, tareas, CLAUDE.md | Etapa 7 aprobada |
| 9 · QA y lanzamiento | Revisión completa en dispositivos reales | Sitio implementado |

## 14. Riesgos y decisiones abiertas

| Riesgo | Por qué importa | Mitigación |
| --- | --- | --- |
| Parecer "otro Jeppesen" | La estructura es muy reconocible | Glifo, tipografía y color propios; nada de ✱, Clash Grotesk ni sus textos; la home suma Skills y foco en recruiters |
| El trabajo tarda en aparecer | El wordmark ocupa el primer viewport | El hero se achica al primer scroll y la primera card entra enseguida; ningún efecto esconde contenido más de ~1 viewport |
| Peso de GSAP | ~60 kB gzip más de JS | Plugins registrados una vez; Lighthouse ≥ 90 como criterio de cierre |
| Testimonios que no llegan | La sección invertida depende de ellos | Pedirlos ya; si hay menos de 3, se muestran los que haya; nunca inventados |
| Grano que pese o ensucie | Afecta legibilidad y performance | SVG de 1 KB, opacidad baja, nunca sobre piezas ni texto chico; se apaga con transparencia reducida |
| Archivo expandida en español | Palabras largas en títulos enormes | Probar en español a 360 px; `hyphens: manual` y textos más cortos donde haga falta |
| Proyectos sin texto | Un recruiter no entiende qué hiciste | Cada proyecto lleva rol y un párrafo sobre la empresa y el trabajo |
| Motion que vuelva a parecer plantilla | Es lo que hizo descartar "Ficha de producción" | Moderación (motion v3.0 §5): ninguna entrada en todos los elementos, nada de marquee |

**Decisiones de motion (24 nov):** se adopta el MOTION_SPEC completo con GSAP (`docs/motion.md` v3.0).

**Decisiones abiertas**

- [ ] Testimonios: a quién pedirlos (MoonDesk, Condimento, ISCAMEN o Carpa)
- [ ] ¿La regla de carruseles aplica a sets de ads en varios tamaños y secuencias de stories?
- [ ] Quinto proyecto (personal)
- [ ] Fechas de experiencia
- [ ] Analítica

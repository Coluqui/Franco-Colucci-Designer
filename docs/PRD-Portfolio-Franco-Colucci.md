# PRD — Portfolio Franco Colucci

23 nov 2026 · Franco Colucci · **v3.2 (motion "Formato vivo" aprobado)**

Este documento es la fuente de verdad del proyecto para el diseño final (Etapa 7) y para Claude Code (Etapa 8). Reemplaza a la v2.1: la dirección "Ficha de producción" y su motion quedaron descartados porque el resultado se veía genérico. La v3.1 suma el motion nuevo, pensado para que el sitio se sienta orgánico y no de plantilla.

## Estado del documento

La nueva dirección toma la estructura y el tono de **jeppesen.dev**, adaptados a un diseñador digital con UX/UI e IA. La estructura es la de los **wireframes v4** y el design system es **"Formato"**. Sigue vigente la regla de contenido **un carrusel es una sola pieza**.

| Etapa | Estado | Entregable |
| --- | --- | --- |
| 0 · Auditoría de la web actual | Hecha en forma parcial | Hallazgos en "Riesgos" |
| 1 · PRD | **v3.2**, se mantiene vivo | Este documento |
| 2 · Referencias y concepto | **Rehecha (23 nov):** referencia jeppesen.dev, concepto "Formato" | Análisis de Jeppesen + tendencias 2026 (sección 4) |
| 3 · Arquitectura y flujos | Rehecha en este PRD | Mapa del sitio + flujos (sección 7) |
| 4 · Wireframes | **v4 en ajuste** | Canvas "Wireframes v4 — Portfolio Franco Colucci" + 7 ajustes pendientes (sección 5) |
| 5 · Design system | **v2.1 "Formato", elegido (23 nov)** | `docs/design-system.md` + `design-system/tokens.css` v2.1 (suma los tokens de motion) |
| 6 · Motion | **v2.0 "Formato vivo" aprobado** (23 nov), con las opciones arriesgadas | `docs/motion.md` v2.0 + prototipo "Motion v2" + `.claude/rules/motion.md` |
| 7 · Diseño final (high-fi) | Sin empezar | Todas las páginas, desktop y mobile, claro y oscuro, ES y EN |
| 8 · Handoff a código | Sin empezar (el repo "Portfolio 2" ya existe) | Paquete de handoff + tareas + CLAUDE.md actualizado |
| 9 · QA y lanzamiento | Sin empezar | Checklist de lanzamiento |

**Descartado:** formato presentación/láminas, muro de piezas, la opción "Escaparate", las direcciones "Galería", "Malbec", "Ficha de producción", "Tinta" y "Plum noir", las marcas de corte, el naranja señal, Instrument Sans, la navegación numerada fija y el mosaico del hero.

### Historial de cambios

| Fecha | Versión | Cambio |
| --- | --- | --- |
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
| Motion v2.0 | `docs/motion.md` (repo y proyecto) · regla `.claude/rules/motion.md` · prompt `prompts/07-motion.md` |
| Prototipo de motion | "Motion v2 — Portfolio Franco Colucci" (https://claude.ai/artifact/8gfyb1JZddUu8wPEu8uEZy) |
| Marca | `public/brand/marca-formato.svg`, `favicon.svg`, `grain.svg` |
| Guía para Claude Code | "Guía: del PRD a Claude Code" — https://claude.ai/artifact/3MENedbRJWcsYT28VJ5CYY |
| Obsoletos | Wireframes v3 (PDF), documento "Design system — Portfolio Franco Colucci" (Ficha de producción), `motion.md` v1.1 y su prototipo "Motion — Portfolio Franco Colucci" |

## 1. Objetivo y métricas de éxito

El portfolio existe para conseguir entrevistas en empresas, remotas o locales, en puestos de diseño gráfico/digital desde USD 2000. En los primeros segundos tiene que transmitir nivel profesional y una identidad propia, y llevar al trabajo con un clic.

| Métrica | Cómo se mide | Meta inicial |
| --- | --- | --- |
| Trabajo visible al entrar | El loop de formatos (piezas reales) asoma en el primer viewport en 1440×900 y 360×780 | Sí, sin scroll |
| Contactos recibidos | Envíos del panel Hablemos + clics en mail, LinkedIn y WhatsApp | A definir tras el lanzamiento |
| Descargas del CV | Clics en "CV", por idioma | A definir tras el lanzamiento |
| Casos abiertos por visita | Visitas a páginas de caso / visitas a la home | A definir tras el lanzamiento |
| Profundidad en el visor | Piezas vistas por apertura; en carruseles, % que llega al último slide | A definir tras el lanzamiento |
| Entrevistas conseguidas | Registro propio: entrevistas cuyo origen fue el portfolio | A definir |

## 2. Público y escenarios de uso

| Quién | Dónde y cómo llega | Qué busca | Qué tiene que encontrar |
| --- | --- | --- | --- |
| Recruiter | Celular, desde LinkedIn o una postulación | Saber si encaja | Puesto, ubicación/remoto, idiomas, FAQ y CV a un toque (barra inferior) |
| Director de arte | Desktop, con tiempo | Criterio y calidad | Wordmark y tipografía con oficio, casos con piezas grandes, visor |
| Equipo de marketing o producto | Desktop o celular | Si produce para sus canales | Servicios con vista previa, filtros por servicio y formato, métricas en cada caso |
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
| Wordmark gigante con un glifo en lugar de una letra | Adaptar | "FRANC▣ COLUCCI": el glifo Formato (marcos 1:1, 4:5 y 9:16 encastrados) reemplaza la O |
| Papel tibio con grano | Tomar | Fondo #F1EFEA (inspirado en Cloud Dancer, Pantone 2026) con grano fino en todo el sitio |
| Frase-problema que se revela al scrollear y vuelve en el cierre | Tomar | Palabra por palabra, una vez |
| Servicios en tipografía enorme con vista previa | Tomar | 6 servicios en Archivo expandida; la vista previa muestra una pieza real de ese servicio y su marco cambia al formato de esa pieza |
| Sección invertida con clientes + testimonios | Tomar | Fondo tinta (en modo oscuro, papel) |
| Chips de métrica | Tomar | Número en caja cobalto + etiqueta |
| Botón con glifo ("✱ Talk to Lucas") | Adaptar | "▣ Hablemos", abre un panel lateral; el glifo desencastra en hover |
| Astro View Transitions entre home y caso | Tomar | La media de la fila cambia de formato (16:10 → 16:8) mientras se convierte en el hero del caso |
| Listas duplicadas para marquee (logos, servicios, métricas) | No tomar | Sin marquee: es lo que más hace "plantilla" y compite con el trabajo |
| Fotos en duotono | Adaptar | Solo fotos propias (retrato, proceso); las piezas, nunca |
| Clash Grotesk + Author, glifo ✱, textos | No tomar | Archivo + Geist Mono (Google, OFL), glifo propio, textos propios |
| Sin modo oscuro ni idiomas | Sumar | Modo claro y oscuro diseñados; ES y EN |
| Sin FAQ | Sumar | Preguntas frecuentes para recruiters |

Tendencias que respaldan la dirección: fondo neutro tipo Cloud Dancer, azul frío eléctrico como acento reservado para foco, texturas de grano en lugar de 3D pesado, abandono del "soft UI" (sombras pesadas, radios extremos) y la tipografía como protagonista.

## 5. Alcance

**Páginas del MVP** (wireframes v4)

| Página | Contenido |
| --- | --- |
| Home `/[lang]/` | Hero (wordmark + bajada + loop de formatos) · Frase-problema · Clientes + Testimonios (invertida) · Trabajos destacados (4 filas) · Qué hago (servicios + herramientas e IA) · Sobre mí (resumen) · Preguntas frecuentes · Cierre con la frase + Hablemos · Footer con glifo |
| Trabajos `/[lang]/trabajos/` | "Filtrar por servicio" + filas de caso con métrica destacada, descripción corta y servicios |
| Caso `/[lang]/trabajos/<slug>/` × 4 | Título + frase + datos (cliente, rol, año, servicios, herramientas) · hero del caso · métricas grandes · El problema · Lo que hice (pasos) · Piezas filtrables por formato + visor · Resultado · Testimonio · Siguiente caso (invertido) |
| Sobre mí `/[lang]/sobre-mi/` | Retrato (duotono), bio, datos con etiqueta (base, idiomas, modalidad), experiencia con fechas, cómo uso la IA, CV |
| Hablemos | **Panel lateral** que se abre desde cualquier página; sin JS, página `/[lang]/hablemos/` con el mismo contenido |
| 404 | Mensaje corto + links a Trabajos y Hablemos |

**Funcionalidades del MVP**

- [ ] Header mínimo: glifo + "▣ Hablemos" + "Menú"
- [ ] Menú a pantalla completa (Inicio, Trabajos, Sobre mí + mail, LinkedIn, WhatsApp, CV, ES/EN, modo)
- [ ] Panel Hablemos: formulario corto (nombre, email, mensaje) con estados + copiar mail, WhatsApp, LinkedIn, CV
- [ ] Loop de formatos en el hero, con botón de pausa y versión estática para movimiento reducido
- [ ] Frase-problema que se revela al scrollear
- [ ] Servicios con vista previa que cambia de formato y ancho que respira (desktop) y acordeón (mobile)
- [ ] Testimonios 01/03 con flechas y arrastre con inercia
- [ ] FAQ en acordeón
- [ ] Filtros por servicio (Trabajos) y por formato (caso); un carrusel cuenta 1
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
6. Trabajos en paneles de superficie con chips de métrica.
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
├── Hero: wordmark + loop de formatos
├── Frase-problema
├── Clientes + Testimonios (invertida)
├── Trabajos destacados ──(fila)──────────────┐
├── Qué hago (servicios + vista previa)        │
├── Sobre mí (resumen) ──► /[lang]/sobre-mi/   │
├── Preguntas frecuentes                       ▼
└── Cierre + Hablemos        /[lang]/trabajos/<slug>/  (MoonDesk · ISCAMEN · Condimento · Carpa)
                                   │ pieza
/[lang]/trabajos/ (filtrar por     ▼
servicio) ──(fila)──► caso      Visor (pantalla completa)
```

**Flujos clave**

1. **Ver trabajo:** home → fila de caso (o loop del hero) → caso. 1 clic.
2. **Buscar por servicio:** Menú → Trabajos → "Ads" → caso con el filtro de formato "Ads" activo. 3 clics.
3. **Ver un carrusel completo:** tile ⧉ → visor en el slide 1 → slides → pieza siguiente.
4. **Contactar:** "▣ Hablemos" (header, barra mobile o cierre) → panel → enviar o link directo. 1 clic para abrir.
5. **Descargar el CV:** barra mobile, menú, panel Hablemos o Sobre mí. 1–2 clics.
6. **Cambiar idioma o modo:** desde el menú o el footer; misma página y posición.

## 8. Contenido

| Pieza de contenido | ES / EN | Quién | Estado |
| --- | --- | --- | --- |
| Hero, frase-problema y cierre | Ambos | Franco + Claude | Borrador (sección 3) |
| 6 servicios con descripción + una pieza de vista previa para cada uno, en el formato de ese servicio (Ads 1:1, Redes 4:5, Reels 9:16, Mail 3:1, Web 16:10, Branding 4:5) | Ambos | Claude propone, Franco elige las piezas | Borrador en wireframes v4 |
| **Loop del hero:** una misma campaña en 5 formatos (1:1, 4:5, 9:16, cabecera de mail 3:1, landing 16:10) | — | Franco elige la campaña y exporta | Falta: es la pieza más importante del sitio. Cada formato tiene que funcionar solo, porque el marco lo recorta en vivo |
| **3 testimonios** (nombre, cargo, empresa, 1–2 frases, foto opcional) | Ambos | Franco los pide a clientes | Falta. Si no hay 3, la sección arranca con 1–2 |
| 6 preguntas frecuentes con respuesta | Ambos | Franco responde, Claude redacta | Borrador de preguntas en wireframes v4 |
| Bio corta y bio de Sobre mí; experiencia con fechas; cómo uso la IA | Ambos | Franco + Claude | Falta |
| Por caso: frase, datos, problema, pasos, resultado, 2–4 métricas, testimonio | Ambos | Franco aporta datos, Claude redacta | Falta |
| Inventario de piezas por caso (una carpeta por carrusel). Origen: `C:\Users\FRANCO\Portfolio\dist\proyectos`, una carpeta por trabajo, solo lectura (son archivos de un build anterior: si hay originales de mayor calidad, usar esos) | — | Franco + Claude Code (Fase 5) | Falta agrupar los carruseles |
| Piezas exportadas, con alt propio (por slide en carruseles) | Alt en ambos | Franco | Falta |
| Hero de cada caso (mockup o loop a ancho completo, 16:8) | — | Franco | Falta |
| Logos de clientes (SVG monocromo) | — | Franco | Falta |
| Retrato + 2–3 fotos de proceso (para duotono) | — | Franco | Existe un retrato, revisar |
| CV en PDF | Ambos | Franco | Existe, actualizar |
| Textos de interfaz, formulario, visor, 404 y SEO | Ambos | Claude | Falta |

**Modelo de contenido por pieza** (sin cambios): `slug`, `formato`, `ratio`, `titulo{es,en}`, `objetivo{es,en}`, `metrica`, `slides[{src, alt{es,en}}]`. Una pieza simple tiene un solo slide. Detalle en `.claude/rules/contenido-y-assets.md`.

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
| Componentes | Header, menú a pantalla completa, panel Hablemos, botones, links, chip de métrica, fila de caso, lista de servicios, grilla de clientes, testimonios, FAQ, filtros, tile, visor, campos, toggles, barra mobile, footer; cada uno con sus estados |

## 10. Motion: "Formato vivo" (v2.0)

Especificación completa en `docs/motion.md`, con 32 interacciones (M01–M32), cada una con disparador, duración, curva y versión reducida. Prototipo: https://claude.ai/artifact/8gfyb1JZddUu8wPEu8uEZy.

**Concepto.** El glifo dice "una idea que vive en muchos formatos" y el motion lo hace literal. Son tres gestos y nada más:

- **Encastre:** los marcos cambian de formato (1:1, 4:5, 9:16, 3:1, 16:10) en lugar de aparecer y desaparecer.
- **Respiración:** el ancho de Archivo pasa de 112 a 125 en lo que se activa.
- **Lectura:** la frase-problema aparece al ritmo en que se lee.

Todo lo que responde a un gesto usa resortes calculados con física real (tokens `--spring-snap`, `--spring-soft` y `--spring-press`). Por eso se siente orgánico y no de plantilla.

| Momento | Qué pasa | ID |
| --- | --- | --- |
| Carga | El glifo encastra sus marcos (560 ms). Es la única animación de carga | M01 |
| Hero | La misma campaña cambia de formato y el marco encastra en cada uno. Botón de pausa; tira estática con movimiento reducido | M04 |
| Frase-problema y cierre | Palabra por palabra ligada al scroll: nunca se apaga, se autocompleta si el usuario frena y pasa una sola vez | M15 |
| Servicios | El activo respira (112 → 125) y el marco de la vista previa cambia al formato de la pieza | M05, M13 |
| Fila → caso | La media 16:10 se convierte en el hero 16:8 del caso (View Transitions) | M06, M07 |
| Visor | La pieza viaja del tile al visor; slides en horizontal, piezas en vertical | M08–M11 |
| Testimonios | Arrastre con inercia y resorte | M28 |
| Menú y panel | El botón "Menú" crece hasta cubrir la pantalla y los links respiran al entrar; el panel entra desde la derecha (desde abajo en mobile) | M14, M20, M21 |
| Microinteracciones | El glifo desencastra en hover, la confirmación aparece en el mismo botón y el envío exitoso re-encastra el glifo | M02, M03, M25–M32 |
| Fuera | Marquee, parallax o tilt en piezas, cursor custom, botones magnéticos, scroll-jacking, preloader, letras del wordmark que se arman, grano animado, contadores que suben, "fade-up" en todo | — |

## 11. Requisitos no funcionales

| Área | Requisito | Criterio de aceptación |
| --- | --- | --- |
| Accesibilidad | WCAG 2.2 AA en ambos modos | Contraste 4,5:1 en texto y 3:1 en controles; focus visible (anillo cobalto); objetivos de 44 × 44 px; un `h1` por página (el wordmark incluye el texto real); foco atrapado en menú, panel y visor; loop con pausa |
| Motion | `prefers-reduced-motion` y `prefers-reduced-transparency` | Cada interacción M01–M32 con versión reducida (los tokens la resuelven). Solo `transform` y `opacity`, salvo tres excepciones documentadas: `clip-path` (M04, M05, M20), `font-stretch` (M13, M14) y `grid-template-rows` (M29). 60 fps en un Android de gama media; CLS = 0; loop con pausa (WCAG 2.2.2); sin grano con transparencia reducida |
| Performance | Carga rápida con imágenes y grano | Lighthouse ≥ 90 en mobile; LCP < 2,5 s (el wordmark es texto, no imagen); una sola fuente variable + mono; grano en SVG de ~1 KB; loop con videos cortos o imágenes livianas |
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
| Motion | CSS con tokens + Astro `<ClientRouter />` (View Transitions) + Web Animations API con resortes `linear()`; sin librería en el MVP | Propuesto (Etapa 6) |
| Formulario | Resend desde una ruta on-demand de Astro + anti-spam propio | Propuesto |
| Analítica | Vercel Analytics o equivalente sin cookies | Abierto |

## 13. Próximas etapas

| Etapa | Qué incluye | Entrada que necesita |
| --- | --- | --- |
| 4 · Ajuste de wireframes v4 | Aplicar los 7 ajustes de la sección 5 | Este PRD |
| 6 · Motion | Cerrada: se implementa en la Fase 6 de Claude Code | — |
| 7 · Diseño final | Todas las páginas, desktop y mobile, claro y oscuro, ES y EN | Campaña del loop, piezas de servicios, testimonios, textos de caso |
| 8 · Handoff | Specs por página, criterios de aceptación, tareas, CLAUDE.md | Etapa 7 aprobada |
| 9 · QA y lanzamiento | Revisión completa en dispositivos reales | Sitio implementado |

## 14. Riesgos y decisiones abiertas

| Riesgo | Por qué importa | Mitigación |
| --- | --- | --- |
| Parecer "otro Jeppesen" | La estructura es muy reconocible | Glifo, tipografía y color propios; nada de ✱, Clash Grotesk ni sus textos; la home suma FAQ y foco en recruiters |
| El trabajo tarda en aparecer | El wordmark ocupa el primer viewport | El loop de formatos (piezas reales) tiene que asomar sin scroll; si no entra, el wordmark se achica |
| Testimonios que no llegan | La sección invertida depende de ellos | Pedirlos ya; si hay menos de 3, se muestran los que haya; nunca inventados |
| Grano que pese o ensucie | Afecta legibilidad y performance | SVG de 1 KB, opacidad baja, nunca sobre piezas ni texto chico; se apaga con transparencia reducida |
| Archivo expandida en español | Palabras largas en títulos enormes | Probar en español a 360 px; `hyphens: manual` y textos más cortos donde haga falta |
| Producción del loop del hero | Es la pieza más visible y todavía no existe | Elegir una campaña que ya tenga los 5 formatos (MoonDesk o ISCAMEN) |
| Casos sin texto ni métricas | Un recruiter no entiende qué hiciste | Plantilla de caso obligatoria |
| Frase ligada al scroll que quede apagada | Si el usuario frena, la frase clave queda al 15 % | Monotónica + autocompletado a 1,2 s + una sola vez (M15) |
| Respiración que pese o mueva el layout | Animar el ancho recalcula el texto en cada frame | Solo una línea por vez, ítems de alto fijo, probado a 60 fps en Android; si falla, la versión segura es solo color |
| Servicios que no entran a 125 de ancho | "Ads de performance" no entra en 7 columnas a 85 px | Tamaño acotado a la columna (`min(--text-services, 7.6cqi)`) |
| Motion que vuelva a parecer plantilla | Es lo que hizo descartar la dirección anterior | Tres gestos y nada más; ninguna entrada en todos los elementos; nada de marquee |

**Decisiones de motion (cerradas el 23 nov: opciones más trabajosas)**

- [x] Frase-problema: **ligada al scroll**, monotónica, con autocompletado y una sola vez (M15)
- [x] Tipografía que respira: **ancho 112 ↔ 125** en servicios y menú (M13, M14)
- [x] Menú: **crece desde el botón** (M20)

**Decisiones abiertas**

- [ ] Campaña para el loop del hero
- [ ] Testimonios: a quién pedirlos (MoonDesk, Condimento, ISCAMEN o Carpa)
- [ ] ¿La regla de carruseles aplica a sets de ads en varios tamaños y secuencias de stories?
- [ ] Quinto proyecto (personal)
- [ ] Fechas de experiencia y métricas por caso
- [ ] Analítica

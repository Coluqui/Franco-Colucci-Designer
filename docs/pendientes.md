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
| ~~Campaña del loop del hero~~ | Hero | Reemplazado en PRD v4.0: el hero muestra las mejores piezas (`src/config/hero.ts`) |
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
- ~~Playwright: no instalado~~ Instalado con OK de Franco (Fase 6): `tests/`, 348 pruebas.

## Contenido

- `meta.siteDescription` (ES y EN) en `src/i18n/*.json`.
- ~~**Casos**~~: resuelto en la Fase 9B con rol y descripción reales (de portfolio2026-twhh.vercel.app). Ya no llevan problema, pasos, resultado ni métricas (PRD v4.0). Falta, opcional: un hero propio 16:8 por proyecto (hoy se usa la portada de la primera pieza).
- **Servicios por caso**: los puse a partir del inventario (MoonDesk, ISCAMEN y Carpa → Redes; Condimento → Ads y Branding). Confirmar o corregir.
- **Descripciones de los 6 servicios** (`serviceItems.*.description`) y la pieza de vista previa de cada uno.
- **Textos de páginas en PENDIENTE**: bajada de Trabajos, bio corta y bio de Sobre mí, datos (base, idiomas, modalidad), experiencia con fechas, cómo uso la IA, herramientas e IA de la home.
- ~~**Preguntas frecuentes**~~: quitadas en PRD v4.0; las reemplaza Skills.
- **Títulos y descripciones SEO** por página: borradores en `pages.*` de `src/i18n/*.json`; revisarlos.
- **Fase 5 · piezas**:
  - Originales de mayor resolución de MoonDesk one-pager, pieza QR y portada de ebook (hoy ~596 × 842 px).
  - Banner de Carpa (835 × 451) fuera del visor: cargarlo si llega un original apaisado de más resolución.
  - Vistas previas de **Mail (3:1)** y **Web (16:10)**: no hay piezas en esos formatos.
  - Elegidas por Claude para las vistas previas (confirmar): Ads → Condimento "otra campaña"; Redes → carrusel MoonDesk "Nacimos de un error"; Reels → reel de Franco del 16 nov (`public/reels/reel.mp4`); Branding → Condimento branding.
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

## Fase 6 · motion (paso 4: navegación, M06–M12 y M19–M24)

- **Decisión de Franco · movimiento reducido en M19–M22.** Es el mismo caso que M05, M16 y M17. `docs/motion.md` pide lo siguiente y, con los tokens, hoy queda otra cosa:

  | ID | Pide `docs/motion.md` | Hoy, con los tokens |
  | --- | --- | --- |
  | M19 | Instantáneo | Fundido de 120 ms |
  | M20 | Fundido de 120 ms | El recorte crece desde el botón en 120 ms |
  | M21 | Fundido de 120 ms | El panel se desliza en 120 ms |
  | M22 | Instantáneo | La barra baja en 120 ms |

  Un token de duración que valga 0 en reducido, o actualizar la columna "Reducido", lo resuelve en los siete.
- **Decisión de Franco · header persistente y cambio de idioma (M24).** El header lleva `transition:persist` por idioma:
  - **Mismo idioma:** al navegar es el mismo nodo (no parpadea y conserva su estado).
  - **Cambio de idioma:** se reemplaza, porque sus textos y links son de cada idioma ("Hablemos" / "Let's talk"). No se mueve: se funde con el resto (200 · out).

  Si lo aprobás, conviene aclarar M24 en `docs/motion.md`: "header en su lugar; sus textos se funden con la página".
- **M19 · detección de secciones invertidas.** `docs/motion.md` dice IntersectionObserver. Se usa una lectura por cuadro del scroll (una sola, con `requestAnimationFrame`), porque lo que importa es la franja exacta debajo del header. El fondo es una capa con opacidad: no se anima ningún color.
- **M08 · agregado.** Mientras su pieza está en el visor, el tile queda vacío, para que no haya dos copias a la vista durante el viaje. Al cerrar, la pieza vuelve a ese lugar.
- **M09 · umbral del arrastre.** Cierra si el dedo recorre más del 20 % del alto de la pantalla; si no, la pieza vuelve con `--spring-soft`. Es una constante del gesto, no un token.
- **M12 · tiempos no especificados.** Lo que sale se desvanece en 200 · in, fuera del flujo. Lo que entra aparece con `--spring-soft` y `--stagger-fast`.
- **Compatibilidad.** En los navegadores sin `view-transition-class` o sin tipos de View Transition, se ve el fundido de página común:
  - la media viaja igual, pero con la curva del navegador;
  - el idioma usa la salida de página (200 · in).
- **Astro y movimiento reducido.** El `<ClientRouter />` apaga todas las animaciones de la transición con `!important`. `src/styles/transiciones.css` recupera el fundido de 120 ms que pide M06/M07.
- **QA de cierre.** El perfil de rendimiento de M06 con CPU 4× va en la QA de cierre: la transición captura la página entera.
- **Revisiones del paso 4: lo que quedó sin corregir (menor).**
  - **M20 · "Menú" y "Cerrar" de distinto ancho.** En el primer cuadro, "Cerrar" se ve recortado dentro de la caja de "Menú" ("Close"/"Menu" en inglés). Si molesta: un ancho mínimo común para los dos.
  - **M09 · proporción del tile.** El vuelo escala por el ancho. Si `ratio` en `pieza.json` no coincide con la proporción real de la portada, al aterrizar hay un salto de alto. Hay que verificarlo cuando se carguen piezas nuevas.
  - **M08 · foco al abrir.** La × tiene el foco unos 400 ms antes de verse (los controles entran 200 ms después). Es aceptable; en reducido no pasa.
  - **M22 · foco al cerrar.** El foco vuelve a "Hablemos" mientras la barra todavía sube (700 ms).
  - **M19 · fundido del header.** Durante los 300 ms del fundido, los textos del header quedan sobre el contenido. Es transitorio.
  - **M12 · posición de la grilla.** `position: relative` se pone en línea sobre la grilla filtrada (`Filtros.astro`). Podría pasar al CSS de cada página.

## Fase 6 · motion (paso 5: microinteracciones M25–M32)

- **M02 dentro de M25.** El primario ya pasa a cobalto y se hunde (0,98). Falta el desencastre del glifo: espera `marca-formato.svg`.
- **M26 · links de varias líneas.** El subrayado es un pseudo-elemento bajo la caja del link: en un link en línea que se parte en dos renglones, la línea queda solo bajo el último. Hoy no hay links así; si aparecen, ese link usa `text-decoration` sin animación.
- **M28 · flechas.** Las flechas usan el scroll suave nativo, no `--spring-soft` (§8 permite scroll-snap nativo). El arrastre con mouse sí sigue 1:1 y elige el testimonio más cercano según la velocidad.
- **M28 · dónde se ve.** Los testimonios reales son PENDIENTE: hoy solo se prueban en `/es/dev/componentes/`.
- **M29 · reducido.** `docs/motion.md` pide instantáneo; con los tokens queda en 120 ms. Es la misma decisión abierta que M05, M16, M17 y M19–M22.
- **M31 · tiempo de "Descargando".** El navegador no avisa cuando termina una descarga: "Descargando" dura `--duration-slow` y después pasa a "CV ✓". El CV es PENDIENTE, así que hoy no se ve.
- **M32 · lo que falta.** Están el error del campo (baja `--shift-xs`) y la barra de "Enviando" (quieta en reducido). El éxito, el error de envío y M03 se conectan con el formulario real en la Fase 7.
- **Token nuevo.** `--shift-xs: 4px` (0 en reducido), para la flecha de M27 y el error de M32. Agregado a `tokens.css` y `tokens.json`.
- **Revisiones del paso 5: lo que quedó sin corregir.**
  - **M31 · en los `Link`.** "Descargar CV" del footer, el menú, el panel y /hablemos son links de texto, no botones: no llevan la animación (sí la barra mobile y Sobre mí). Decisión de Franco: ¿M31 también ahí?
  - **M31 · "cae en una línea".** La flecha baja y se desvanece; falta la línea donde cae. Se suma cuando haya CV para verlo.
  - **M31 · sin anuncio.** "Descargando" y "CV ✓" no tienen región viva (el navegador ya avisa la descarga). En reducido "Descargando" dura 120 ms.
  - ~~**M30 · sin portapapeles.**~~ Resuelto en la Fase 7: el mail se muestra como link al lado del botón. El mail se muestra dentro del botón y no se puede seleccionar. Se resuelve con el mail real (Fase 7): mostrarlo fuera del botón.
  - **M32 · reducido.** El error aparece sin fundido (`--duration-fast` vale 0); `docs/motion.md` pide 120 ms. Entra en la decisión abierta de los tokens de reducido.
  - ~~**M32 · Fase 7.**~~ Hecho en la Fase 7. Al mostrar un error desde JS, sumar `aria-invalid`, `aria-describedby` y mover el foco al primer error.
  - ~~**M32 · valores sueltos.**~~ Pasados a `--progress-height` y `--progress-opacity` en la Fase 7. La barra de "Enviando" usa `block-size: 2px` y `opacity: 0.6` (de la Fase 3). Deuda: pasarlos a tokens.
  - **M28 · Safari iOS.** El contador se sincroniza con `scrollend`; hay que probarlo en un iPhone y, si falta, sumar un respaldo con `scroll`.

## Fase 6 · QA de cierre

- **Decisión de Franco · el punto del filtro activo.** Al activarse, el chip suma el punto y se ensancha 8 px: los filtros vecinos se corren en el mismo clic. CLS sigue en 0 (es respuesta al clic), pero se ve. Para evitarlo, todos los chips reservan el lugar del punto (los inactivos quedan un poco más anchos).
- **M06 en un Android real.** En el Chromium de prueba (sin GPU), con CPU 4×, la transición da 51 fps a 1440 y 57 a 360. Los cuadros alternan 17 y 33 ms igual sin throttling y el hilo principal está ocupado un 38 %: el límite parece la rasterización por software. Confirmar en un teléfono de gama media.
- **1.4.12 · servicios a 360.** Con el espaciado máximo de WCAG, el servicio más largo sobresale 9 px (M13 lo obliga a una línea). No se pierde contenido.
- **Tabla de cumplimiento completa:** `docs/motion-cumplimiento.md`.
- **Decisión de Franco · cambio de fuente en red lenta.** Archivo usa `font-display: swap` con un respaldo de Arial ajustado a sus métricas (`fonts.css`). Con 4G lenta y sin caché queda un CLS de 0,007 en la home a 1440 y 0,03 en `/en/` a 360: Arial no imita el ancho exacto y la bajada o la frase cortan en otro renglón. Para llegar a 0: `font-display: optional` (en una primera visita lenta se queda Arial toda la visita). En Android no hay Arial: ahí el respaldo es el del sistema, sin ajuste.
- **Lighthouse.** No está instalado; se corre en la Fase 8 sobre el deploy de Vercel (o con permiso para sumarlo).
- **Loop a 1440 × 900.** El marco del loop asoma 262 de 477 px sin scroll. Cumple el "asoma" del PRD §1; se revisa con las piezas reales de la campaña.

## Fase 7 · formulario

- **Franco · cuenta de Resend.** Crear la cuenta y una API key, y cargar `RESEND_API_KEY` y `CONTACTO_DESTINO` en `.env` (local) y en Vercel (ver `.env.example`). Sin dominio propio verificado, Resend solo manda desde `onboarding@resend.dev` y solo al mail de la cuenta: `CONTACTO_DESTINO` tiene que ser ese mail. Sin clave, el formulario muestra "error de envío".
- **Probar un envío real** cuando esté la clave (las pruebas automáticas nunca mandan mails).
- **M03 · glifo como confirmación.** El éxito ya existe; el re-encastre del glifo espera `marca-formato.svg`.
- **Sin límite de envíos por IP.** En Vercel cada función arranca de cero; un límite real necesita un almacén compartido (Vercel KV o similar). Hoy el anti-spam es el campo trampa y los 3 s mínimos, y un bot que mande `t=1` a mano se saltea el tiempo (QA). Si llega spam o se agota la cuota de Resend: límite en Vercel o `t` firmado en el servidor.
- **`astro preview` ya no sirve el build** (el adaptador de Vercel genera `.vercel/output`). Las pruebas corren sobre `npm run dev`; el build real se prueba en el deploy de la Fase 8.
- **`form.intro`** sigue PENDIENTE (bajada del panel Hablemos).
- **Decisión de Franco · CLS al enviar con éxito.** El formulario se cierra (M32 → M29) y "O escribime directo" sube: QA midió 0,20–0,25 a 360 si la respuesta tarda más de 500 ms (0,03 a 1440). Opciones: dejarlo (es el gesto que pide motion.md, dentro de un modal), o que la confirmación ocupe el lugar del formulario sin cerrarlo.
- **Decisión de Franco · éxito en el panel.** Hoy, después de enviar, el panel muestra la confirmación hasta que se recarga la página. ¿Se reinicia al cerrarlo?
- **La página `/hablemos/` no tiene "Copiar mail"** (el panel sí). Con el mail real, conviene un componente compartido para los links directos.
- **Barra de "Enviando".** No se pudo capturar en pantalla (el envío dura poco). Revisar su visibilidad con el envío real; si se pierde, se ajusta en `--progress-height` / `--progress-opacity`.
- **Cobalto en el panel (ux-ui).** Con los datos reales puede haber más de 5 links cobalto por pantalla; revisar entonces si "Copiar mail" va en texto primario.
- **404 en `/es/`** muestra una línea en inglés (fuera de esta fase; para `contenido`).

## Fase 8 · SEO y deploy

- **Producción:** https://franco-colucci-portfolio.vercel.app (Vercel publica `main`; cada rama tiene su preview, protegida por Vercel Authentication). Todo cambio va en una rama y se mergea a `main` con OK de Franco.
- **QA en producción (24 nov):** PageSpeed mobile 98–100 en Performance, 96–97 en Accesibilidad, 100 en Buenas prácticas; LCP 0,9 s; CLS 0. SEO 66–69 solo por el `noindex` (esperado). 16 URLs del sitemap y 52 enlaces internos sin 404; 128 cargas (4 anchos × modos × idiomas × movimiento) sin errores.
- **Franco · antes de prender `INDEXAR=true`** (Vercel → Settings → Environment Variables → Production, y redeploy): completar los textos PENDIENTE, en especial la frase de cada caso, que hoy es la `description` y la `og:description` de las 8 páginas de caso.
- **Franco · imagen para compartir** (Open Graph, 1200 × 630): ponerla en `public/` y su ruta en `site.ogImagen` (`src/config/site.ts`). Sin ella, al compartir el link no hay vista previa con imagen.
- **Caché de fuentes.** `/fonts/*` sale con `max-age=0` (cada visita revalida). Se agregó `vercel.json` con `immutable`; verificar en producción después del merge. Si Vercel no lo aplica (el adaptador genera la salida y puede ignorarlo), la alternativa es mover las fuentes a `src/assets/` para que salgan con hash por `/_astro/` (cambia la estructura que describe CLAUDE.md: decisión de Franco).
- **`/xx/hablemos/` en producción da 404 en blanco.** El i18n de Astro corta el idioma inválido dentro de la función, que no puede dibujar la 404 estática. Las demás rutas inválidas muestran la 404. Arreglarlo pide una 404 on-demand (más invocaciones de la función); no vale la pena para una URL que nadie escribe.
- **CLS de carga con red lenta:** 0,0068 en `/es/` a 1440 (el glifo del hero sigue al ancho del wordmark al llegar Archivo) y 0,00008 en Trabajos. Entra en la decisión abierta de `font-display` (Fase 6).
- **Lighthouse marca contraste** en las palabras apagadas de M15 antes del scroll (estado previsto) y en el "CV" pendiente de la barra mobile (no es un control). Se resuelve con el CV real; M15 queda como está salvo decisión.
- **Imágenes de las piezas en el caso:** PageSpeed estima 114 KiB de ahorro a 360 px. Revisar el `sizes` de `TilePieza` con las piezas reales.

## Fase 9 · contenido (PRD v4.0)

- **Franco · confirmar las piezas del hero** (`src/config/hero.ts`): Condimento "No necesitás otra campaña", MoonDesk "Nacimos de un error", ISCAMEN "La mujer en la ciencia", mockup de Carpa y ebook de MoonDesk. Propuesta de Claude: una por proyecto, en formatos distintos.
- **Franco · reel liviano.** `public/reels/reel.mp4` es el video de WhatsApp tal cual (58 s, 1080 × 1920, 9 MB). Se carga recién al abrir Reels (`preload="none"`), pero conviene exportarlo en H.264 a 720 × 1280 y ~2 MB. El póster sale del segundo 1,5.
- **Franco · CV en inglés.** El CV en español es el de la web anterior (`public/cv/franco-colucci-cv.pdf`); `site.cv.en` sigue en null.
- **Franco · fechas de experiencia.** Sobre mí usa la bio de la web anterior; solo ISCAMEN tiene fecha (desde 2021).
- **Pieza "¿Tu marca está preparada?" (MoonDesk)** quedó como Documentos. Confirmar el tipo.
- **Carpa tiene 2 piezas acá y 4 en la web anterior** (bonos, módulos, banner y mockup): la agrupación de la Fase 5 juntó las portadas en una. Si Franco prefiere las 4, se separan.
- **Logos de Skills:** Simple Icons (CC0) para Figma, Canva, WordPress, ChatGPT, Gemini, Claude y ElevenLabs; Adobe y CapCut con siglas (no están en Simple Icons).


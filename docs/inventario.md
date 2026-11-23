# Inventario de trabajos (Fase 0)

23 nov 2026 · Origen: `C:\Users\FRANCO\Portfolio\dist\proyectos` (**solo lectura**: no se movió, renombró ni borró nada).

## Resumen

| Trabajo | Archivos | Peso total | Formatos | Videos |
| --- | --- | --- | --- | --- |
| carpa | 11 | 2,2 MB | JPG | 0 |
| condimento | 4 | 0,5 MB | JPG | 0 |
| iscamen | 19 | 5,8 MB | JPG | 0 |
| moondesk | 18 | 1,9 MB | JPG | 0 |
| **Total** | **52** | **10,4 MB** | solo JPG baseline | **0** |

## ¿Están comprimidos por un build anterior?

- `dist/proyectos` es **idéntico byte a byte** a `C:\Users\FRANCO\Portfolio\public\proyectos` (Astro copia `public/` tal cual): el build **no** los recomprimió.
- Igual parecen **exportes para redes**, no originales: JPG baseline de ~1080 px de ancho, 65–420 KB, nombres genéricos (`01.jpg`…) que no dicen qué pieza es.
- Sirven para tiles y visor (4:5 a ~1080 px alcanza para 1×; queda justo para pantallas 2×).
- **Conviene pedir originales** (PNG o JPG de alta, idealmente 2×) para:
  - `moondesk/12–14` (596 × 842 px): resolución baja para el visor.
  - `carpa/06` (835 × 451 px): baja para ancho completo.
  - Cualquier pieza que vaya a ser **hero de caso (16:8)** o **vista previa de servicios**.

## Detalle por trabajo

Ratio: ancho / alto. "Agrupación" es una **propuesta** a validar por Franco (regla: un carrusel = una pieza).

### moondesk (18)

| Archivo | Medidas | Ratio | Peso | Qué parece |
| --- | --- | --- | --- | --- |
| 01–05 | 1080–1081 × 1350 | 4:5 | 82–136 KB | **Carrusel A** "Nacimos de un error" → "El caos quedó atrás" (relato continuo + CTA final) · 5 slides |
| 06 | 1080 × 1351 | 4:5 | 140 KB | Post suelto "Un cambio normativo. Veinte artes afectados" |
| 07–11 | 1080–1081 × 1350 | 4:5 | 93–112 KB | **Carrusel B** Día de la Tierra ("Hoy es el Día de la Tierra" → "Menos error, más impacto") · 5 slides |
| 12 | 596 × 842 | ≈ A4 | 79 KB | One-pager / ficha de producto (resolución baja) |
| 13 | 596 × 842 | ≈ A4 | 65 KB | Pieza QR "El código se transforma" (resolución baja) |
| 14 | 597 × 842 | ≈ A4 | 69 KB | Portada de ebook "Cómo evitar los 5 errores…" (resolución baja) |
| 15 | 1081 × 1351 | 4:5 | 127 KB | Post feria Envase 2025 |
| 16 | 1080 × 1350 | 4:5 | 93 KB | Post "¿Qué generó más retrabajos este año?" |
| 17 | 900 × 1600 | 9:16 | 138 KB | Story testimonio de cliente |
| 18 | 1080 × 1351 | 4:5 | 135 KB | Post "Validaciones que tardan días…" |

Propuesta: **10 piezas** (2 carruseles + 8 sueltas). *(Corregido en la Fase 5: decía 12.)*

### iscamen (19)

| Archivo | Medidas | Ratio | Peso | Qué parece |
| --- | --- | --- | --- | --- |
| 01–07 | 1081 × 1351 | 4:5 | 160–257 KB | **Carrusel** "Bioinsumos de exportación" (portada + 5 temas + cierre con logos ISCAMEN / Mendoza) · 7 slides |
| 08–12 | 1080 × 1350 | 4:5 | 355–386 KB | Ciclo "Huerto urbano": portada + encuentros #1–#4 con **fechas distintas** → ¿serie de posts o carrusel? **A definir** |
| 13 | 900 × 1600 | 9:16 | 166 KB | Story Día del Trabajador |
| 14 | 900 × 1600 | 9:16 | 363 KB | Story Día de la Mujer en la Ciencia |
| 15–19 | 1080 × 1350 | 4:5 | 332–422 KB | Serie fotográfica cítricos ("Cosechá", "Mendoza agrícola", "El puente", "De la planta al frasco", "Más salud") → ¿carrusel o serie? **A definir** |

Propuesta: entre **5 piezas** (si 08–12 y 15–19 son carruseles) y **14** (si son posts sueltos).

### carpa (11)

| Archivo | Medidas | Ratio | Peso | Qué parece |
| --- | --- | --- | --- | --- |
| 01–05, 07–10 | 1374 × 1600 | ≈ 6:7 (0,859) | 184–233 KB | Serie "Método Carpa" (misma plantilla, un módulo por imagen). Ratio no estándar de redes: ¿portadas de módulos de curso/landing? **A definir** si es una pieza |
| 06 | 835 × 451 | ≈ 1,85:1 | 70 KB | Banner de oferta de lanzamiento (resolución baja) |
| 11 | 1337 × 1600 | 0,836 | 276 KB | Mockup del producto (ebook + pantallas) |

Propuesta: **3 piezas** (serie de módulos como una pieza + banner + mockup). *Fase 5: el banner 06 queda afuera porque no llena un visor de tamaño uniforme; se carga si llega un original apaisado de mayor resolución.*

### condimento (4)

| Archivo | Medidas | Ratio | Peso | Qué parece |
| --- | --- | --- | --- | --- |
| 01 | 1081 × 1081 | 1:1 | 100 KB | Ad "NO necesitás otra campaña…" |
| 02 | 1081 × 1081 | 1:1 | 88 KB | Ad "¿Tu tienda tiene tráfico, pero no ventas?" |
| 03 | 1081 × 1081 | 1:1 | 111 KB | Ad "Si ya hiciste anuncios…" |
| 04 | 1504 × 1545 | ≈ 1:1 | 226 KB | Aplicaciones de marca / branding |

Propuesta: **4 piezas** (3 ads 1:1 —¿set de ads = una pieza? decisión abierta del PRD §14— + branding).

## Huecos contra el PRD

| Necesidad (PRD) | Estado |
| --- | --- |
| Loop del hero: una campaña en 1:1, 4:5, 9:16, 3:1 y 16:10 | **Falta.** Ningún trabajo tiene 3:1 ni 16:10; MoonDesk tiene 4:5 y 9:16, Condimento 1:1 |
| Vista previa de servicios: Ads 1:1, Redes 4:5, Reels 9:16, Mail 3:1, Web 16:10, Branding 4:5 | Hay Ads (condimento), Redes (todas), Reels/stories (estáticas, sin video), Branding (condimento 04). **Faltan Mail 3:1 y Web 16:10** |
| Hero de cada caso 16:8 | **Falta** (no hay mockups apaisados) |
| Videos / reels reproducibles | **No hay ningún video** |
| Logos de clientes en SVG monocromo | Solo `Portfolio/public/logos/*.jpg` (JPG, no SVG) |
| Retrato | Existe `Portfolio/public/franco-photo.png` (a revisar) |
| CV en PDF | No está en la raíz de este proyecto. Hay uno en `Portfolio/public/cv-franco-colucci.pdf` (¿vigente? ¿y la versión EN?) |

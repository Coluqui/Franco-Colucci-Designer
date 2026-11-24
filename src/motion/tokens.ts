/**
 * Tokens de motion para GSAP · docs/motion.md v3.0 §3. Única fuente de valores de GSAP:
 * ningún componente escribe duraciones, curvas ni staggers sueltos.
 * (Las transiciones CSS siguen saliendo de design-system/tokens.css.)
 */
export const dur = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
  /** Movimiento reducido: solo fundidos cortos (§5). */
  reducido: 0.2,
} as const;

export const ease = {
  out: 'power3.out',
  inOut: 'power4.inOut',
  expo: 'expo.out',
  back: 'back.out(0.8)',
} as const;

export const stagger = {
  items: 0.06,
  words: 0.04,
} as const;

/** Distancias y disparadores compartidos (§4). */
export const mov = {
  /** Cards y bloques suben esto al entrar (4.8). */
  subida: 40,
  /** Bajada y CTA del hero (4.2). */
  subidaCorta: 20,
  /** Contenido de la sección con máscara (4.6). */
  blur: 8,
  /** Escala final del wordmark al scrollear (4.3). */
  escalaHero: 0.85,
  /** La imagen de una media se asienta desde esta escala dentro de su máscara (4.8). */
  escalaMedia: 1.15,
  /** Esquinas del marco inicial de la sección con máscara (4.6). */
  radioMascara: '12px',
  /** Logo del header: se despliega pasados estos px de scroll. */
  umbralLogo: 80,
  /** Logo: el nombre sube (yPercent) para dejar lugar al puesto. */
  subidaLogo: -35,
  /** Logo: "ranco" y "olucci" se abren con este desfase. */
  escalonLogo: 0.08,
  /** Los revelados disparan cuando el borde superior llega al 85 % del viewport (4.4). */
  inicio: 'top 85%',
} as const;

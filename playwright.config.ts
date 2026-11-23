import { defineConfig } from '@playwright/test';

/**
 * Pruebas de motion (docs/motion.md §9): 360 y 1440 px, claro y oscuro, con y sin movimiento reducido.
 * Usa el dev server (`npm run dev`); si ya está corriendo, lo reutiliza.
 */
const anchos = [
  { nombre: '360', viewport: { width: 360, height: 780 } },
  { nombre: '1440', viewport: { width: 1440, height: 900 } },
];
const modos = ['light', 'dark'] as const;

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  // Con más workers el dev server se satura: los cuadros de animación no avanzan y los estilos que
  // Vite inyecta tarde mueven el layout (solo en dev: en el build de producción el CLS da 0).
  workers: 2,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4321' },
  webServer: { command: 'npm run dev', url: 'http://localhost:4321/es/', reuseExistingServer: true },
  projects: anchos.flatMap((a) =>
    modos.map((m) => ({ name: `${a.nombre}-${m}`, use: { viewport: a.viewport, colorScheme: m } })),
  ),
});

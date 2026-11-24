import { test, expect, type Page } from '@playwright/test';

/** M23 (cambio de modo) y M24 (cambio de idioma). docs/motion.md §4. */

/** Las animaciones de la View Transition de la raíz, un cuadro después de empezar. */
const raiz = (page: Page) =>
  page.evaluate(() =>
    document
      .getAnimations()
      .map((a) => a.effect as KeyframeEffect)
      .filter((e) => e.pseudoElement?.endsWith('(root)'))
      .map((e) => ({ pseudo: e.pseudoElement, duracion: Number(e.getComputedTiming().duration), easing: String(e.getKeyframes()[0]?.easing) })),
  );

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  const reducido = reducedMotion === 'reduce';

  test.describe(`reducido: ${reducedMotion}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
    });

    test('M23 · el modo cambia con un fundido cruzado de toda la página, sin salto de layout', async ({ page }) => {
      await page.goto('/es/');
      const otro = (await page.evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches)) ? 'light' : 'dark';
      // El switch del header (24 nov): idioma y modo viven arriba.
      const boton = page.locator('[data-header] [data-switch-tema]');
      const antes = await page.evaluate(() => [scrollY, document.documentElement.scrollHeight]);
      await boton.evaluate((b) => (b as HTMLElement).click());
      await expect(page.locator('html')).toHaveAttribute('data-theme', otro);
      if (!reducido) {
        const anims = await raiz(page);
        expect(anims.find((a) => a.pseudo === '::view-transition-old(root)')?.duracion).toBe(300);
        expect(anims.find((a) => a.pseudo === '::view-transition-new(root)')?.duracion).toBe(300);
      }
      await expect(page.locator('html')).not.toHaveAttribute('data-vt', 'tema');
      expect(await page.evaluate(() => [scrollY, document.documentElement.scrollHeight])).toEqual(antes);
      await expect(boton).toHaveAttribute('aria-checked', String(otro === 'dark'));
    });

    test('M24 · el idioma cambia con un fundido (200 · out), sin entrada de bloques y en la misma posición', async ({ page }) => {
      await page.goto('/es/trabajos/iscamen/');
      await page.evaluate(() => {
        const w = window as unknown as { __raiz: unknown[]; __entran: number };
        w.__raiz = [];
        document.addEventListener('astro:after-swap', () =>
          requestAnimationFrame(() => {
            w.__raiz = document
              .getAnimations()
              .map((a) => a.effect as KeyframeEffect)
              .filter((e) => e.pseudoElement?.endsWith('(root)'))
              .map((e) => ({ pseudo: e.pseudoElement, duracion: Number(e.getComputedTiming().duration) }));
            w.__entran = [...document.querySelectorAll('main [data-entra]')].filter((e) => e.getAnimations().length).length;
          }),
        );
      });
      await page.locator('[data-header] [data-toggle-idioma] a:not([aria-current])').evaluate((a) => (a as HTMLElement).click());
      await page.waitForURL('**/en/trabajos/iscamen/');
      await expect.poll(() => page.evaluate(() => (window as unknown as { __raiz: unknown[] }).__raiz.length)).toBeGreaterThan(reducido ? -1 : 0);
      const { r, entran } = await page.evaluate(() => {
        const w = window as unknown as { __raiz: { pseudo: string; duracion: number }[]; __entran: number };
        return { r: w.__raiz, entran: w.__entran };
      });
      if (!reducido) {
        expect(r.find((a) => a.pseudo === '::view-transition-old(root)')?.duracion).toBe(200);
        expect(r.find((a) => a.pseudo === '::view-transition-new(root)')?.duracion).toBe(200);
      }
      expect(entran ?? 0).toBe(0);
      await expect(page.locator('main h1')).toBeVisible();
    });
  });
}

import { test, expect, type Page } from '@playwright/test';

/** Servicio activo (M13) y entrada de los links del menú (4.10). La lectura (M15) se quitó con motion v3.0. */

const stretch = (page: Page, sel: string) =>
  page.locator(sel).first().evaluate((el) => parseFloat(getComputedStyle(el).fontStretch));

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  const reducido = reducedMotion === 'reduce';

  test.describe(`reducido: ${reducedMotion}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
    });

    test('M13 · el servicio activo respira de 112 a 125 y el resto queda en reposo', async ({ page }) => {
      await page.goto('/es/');
      const summaries = page.locator('[data-servicios] summary');
      await summaries.nth(1).scrollIntoViewIfNeeded();
      // Con ScrollSmoother el contenido llega con retraso: se espera a que quede quieto.
      await page.waitForTimeout(1500);
      await summaries.nth(1).click();
      await expect.poll(() => stretch(page, '[data-servicios] details[open] summary')).toBe(125);
      // Los inactivos: 112 con movimiento; 125 en reducido (solo cambia el color).
      // (se espera a que el que se cerró termine de volver: el resorte rebota un poco).
      await expect.poll(() => stretch(page, '[data-servicios] details:not([open]) summary')).toBe(reducido ? 125 : 112);
      // Alto fijo: respirar no mueve nada alrededor.
      const alto = await summaries.nth(1).evaluate((el) => el.getBoundingClientRect().height);
      const altos = await summaries.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
      expect(altos.every((h) => Math.abs(h - alto) < 1)).toBe(true);
      // A 125 el nombre activo entra con su "+" (no empuja nada fuera de su caja).
      for (const i of [0, 1]) {
        await summaries.nth(i).click();
        await expect
          .poll(() => summaries.nth(i).evaluate((e) => e.scrollWidth <= e.clientWidth))
          .toBe(true);
      }
    });

    test('4.10 · los links del menú entran, terminan sin estilos en línea y responden al hover', async ({ page }) => {
      await page.goto('/es/');
      await page.locator('[data-abre-menu]').first().click();
      const links = page.locator('.menu__link');
      // GSAP limpia lo que puso al terminar (clearProps): nada pisa el hover.
      await expect.poll(() => links.evaluateAll((els) => els.map((e) => (e as HTMLElement).style.cssText).join(''))).toBe('');
      expect(await links.evaluateAll((els) => els.every((e) => getComputedStyle(e).opacity === '1'))).toBe(true);
      const vista = page.viewportSize()!;
      if (vista.width >= 1024) {
        const otro = links.filter({ hasNot: page.locator('[aria-current]') }).first();
        await otro.hover();
        await expect.poll(() => otro.evaluate((e) => parseFloat(getComputedStyle(e).fontStretch))).toBe(125);
      }
    });
  });
}

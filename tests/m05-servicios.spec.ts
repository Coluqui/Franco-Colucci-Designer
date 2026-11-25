import { test, expect, type Page } from '@playwright/test';

/** Vista previa de servicios: el marco toma el formato del servicio y las piezas se cruzan con un fundido (4.7). */

const estado = (page: Page, i: number) =>
  page.evaluate((i) => {
    const d = document.querySelectorAll<HTMLDetailsElement>('[data-servicios] details')[i]!;
    const capa = d.querySelector<HTMLElement>('[data-servicio-capa]')!;
    return { clip: getComputedStyle(capa).clipPath, animando: capa.getAnimations().length > 0 };
  }, i);

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test.describe(`reducido: ${reducedMotion}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
      await page.goto('/es/');
      await page.locator('[data-servicios]').scrollIntoViewIfNeeded();
      // Con ScrollSmoother (motion 4.1) el contenido llega con retraso: se espera a que quede quieto.
      await page.waitForTimeout(1500);
    });

    test('el marco toma la forma del servicio activo y no queda tapado', async ({ page }) => {
      const ancho = await page.locator('[data-servicios]').evaluate((l) => getComputedStyle(l).getPropertyValue('--servicios-fijo').trim() === '1');
      const inicial = await estado(page, 0);
      expect(inicial.clip).not.toBe('inset(50%)');

      // Mail (3:1): el recorte es más bajo que ancho.
      await page.locator('[data-servicios] summary').nth(3).click();
      // El evento toggle es asíncrono: se espera a que el recorte esté puesto y quieto.
      await expect.poll(async () => {
        const e = await estado(page, 3);
        return !e.animando && e.clip !== 'inset(50%)';
      }).toBe(true);
      const fin = await estado(page, 3);
      const [y, x] = fin.clip.match(/[\d.]+px/g)!.map(parseFloat);
      expect(y).toBeGreaterThan(x ?? 0);
      // La copia de la pieza que se fue no queda en el DOM.
      await expect(page.locator('[data-servicio-salida]')).toHaveCount(0);
    });

    test('dos cambios seguidos dejan un solo ítem abierto y ninguna copia colgada', async ({ page }) => {
      const ancho = await page.locator('[data-servicios]').evaluate((l) => getComputedStyle(l).getPropertyValue('--servicios-fijo').trim() === '1');
      test.skip(!ancho, 'solo en el modo ancho');
      await page.evaluate(async () => {
        const ds = [...document.querySelectorAll<HTMLDetailsElement>('[data-servicios] details')];
        ds[2]!.open = true;
        await new Promise((r) => ds[2]!.addEventListener('toggle', r, { once: true }));
        ds[3]!.open = true;
        await new Promise((r) => ds[3]!.addEventListener('toggle', r, { once: true }));
      });
      await expect.poll(() => page.locator('[data-servicios] details[open]').count()).toBe(1);
      await expect(page.locator('[data-servicio-salida]')).toHaveCount(0);
      const pieza = page.locator('[data-servicios] details[open] [data-servicio-marco] > *').first();
      await expect.poll(() => pieza.evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
    });
  });
}

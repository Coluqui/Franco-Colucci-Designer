import { test, expect, type Page } from '@playwright/test';

/** M05 · vista previa de servicios: el marco encastra al formato del servicio (docs/motion.md §5). */

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
      if (ancho && reducedMotion === 'no-preference') expect((await estado(page, 3)).animando).toBe(true);
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

    test('un segundo cambio interrumpe sin saltos', async ({ page }) => {
      const ancho = await page.locator('[data-servicios]').evaluate((l) => getComputedStyle(l).getPropertyValue('--servicios-fijo').trim() === '1');
      test.skip(!ancho || reducedMotion === 'reduce', 'solo en el modo ancho con movimiento');
      const r = await page.evaluate(async () => {
        const ds = [...document.querySelectorAll<HTMLDetailsElement>('[data-servicios] details')];
        const capa = (i: number) => ds[i]!.querySelector<HTMLElement>('[data-servicio-capa]')!;
        const espera = (n: number) => new Promise((r) => setTimeout(r, n));
        ds[2]!.open = true; // Reels 9:16
        await new Promise((r) => ds[2]!.addEventListener('toggle', r, { once: true }));
        await espera(120);
        const enCamino = getComputedStyle(capa(2)).clipPath;
        ds[3]!.open = true; // Mail 3:1 antes de terminar
        await new Promise((r) => ds[3]!.addEventListener('toggle', r, { once: true }));
        const arranque = getComputedStyle(capa(3)).clipPath;
        return { enCamino, arranque, abiertos: ds.filter((d) => d.open).length };
      });
      const px = (s: string) => s.match(/[\d.]+px/g)!.slice(0, 2).map(parseFloat);
      const [y1, x1] = px(r.enCamino);
      const [y2, x2] = px(r.arranque);
      // Arranca donde iba el anterior (tolerancia: los pocos ms entre las dos lecturas).
      expect(Math.abs(y2! - y1!) + Math.abs(x2! - x1!)).toBeLessThan(25);
      expect(r.abiertos).toBe(1);
    });
  });
}

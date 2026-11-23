import { test, expect, type Page } from '@playwright/test';

/** Paso 1 de la Fase 6: utilidades base en /es/dev/motion. Cada prueba corre con y sin movimiento reducido. */

const x = (page: Page, sel: string) =>
  page.locator(sel).evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test.describe(`reducido: ${reducedMotion}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
      await page.goto('/es/dev/motion/');
    });

    test('lee el estado de movimiento reducido', async ({ page }) => {
      await expect(page.locator('[data-estado-reducido]')).toHaveText(reducedMotion === 'reduce' ? 'activo' : 'no');
    });

    test('el resorte usa los tokens y se interrumpe sin saltos', async ({ page }) => {
      const marco = '[data-marco="snap"]';
      const timing = await page.evaluate(() => {
        const css = getComputedStyle(document.documentElement);
        return css.getPropertyValue('--spring-snap-duration').trim();
      });
      expect(timing).toBe(reducedMotion === 'reduce' ? '120ms' : '560ms');

      // Se mide en la página, en el mismo cuadro del segundo clic (los clics de Playwright tardan).
      const { enCamino, alInterrumpir } = await page.evaluate(async (sel) => {
        const b = document.querySelector<HTMLButtonElement>('[data-resorte="snap"]')!;
        const m = document.querySelector(sel)!;
        const pos = () => new DOMMatrix(getComputedStyle(m).transform).m41;
        b.click();
        await new Promise((r) => setTimeout(r, 50));
        const enCamino = pos();
        b.click(); // interrumpe: vuelve desde donde estaba
        return { enCamino, alInterrumpir: pos() };
      }, marco);
      expect(enCamino).toBeGreaterThan(0);
      expect(Math.abs(alInterrumpir - enCamino)).toBeLessThan(2);
      await page.waitForTimeout(900);
      expect(await x(page, marco)).toBeCloseTo(0, 0);
      // Terminada, no queda la animación viva ni el will-change.
      const vivas = await page.locator(marco).evaluate((el) => [el.getAnimations().length, (el as HTMLElement).style.willChange]);
      expect(vivas).toEqual([0, '']);
    });

    test('FLIP solo con movimiento completo', async ({ page }) => {
      await page.click('[data-mezclar]');
      const animando = await page.locator('[data-flip] li').evaluateAll((els) => els.some((el) => el.getAnimations().length > 0));
      expect(animando).toBe(reducedMotion !== 'reduce');
    });

    test('el observer marca cada bloque una sola vez', async ({ page }) => {
      const bloques = page.locator('[data-entrada]');
      for (const b of await bloques.all()) {
        await b.scrollIntoViewIfNeeded();
        await expect(b).toHaveAttribute('data-dentro', '');
      }
      await page.evaluate(() => scrollTo(0, 0));
      await expect(bloques.first()).toHaveAttribute('data-dentro', '');
    });

    test('sin errores en consola ni desborde horizontal', async ({ page }) => {
      const errores: string[] = [];
      page.on('pageerror', (e) => errores.push(e.message));
      await page.reload();
      expect(errores).toEqual([]);
      const [sw, cw] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      expect(sw).toBeLessThanOrEqual(cw);
    });
  });
}

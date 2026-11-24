import { test, expect, type Page } from '@playwright/test';

/** M12 · filtros: el activo viaja (FLIP) y la grilla se reacomoda. docs/motion.md §3. */

const CASO = '/es/trabajos/moondesk/';

const quieto = (page: Page) =>
  expect
    .poll(() => page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && !(a.effect as KeyframeEffect).pseudoElement).length))
    .toBe(0);

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  const reducido = reducedMotion === 'reduce';

  test.describe(`reducido: ${reducedMotion}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
      await page.goto(CASO);
      await page.locator('[data-filtros]').scrollIntoViewIfNeeded();
    });

    test('el fondo y el punto del activo viajan al filtro nuevo', async ({ page }) => {
      const filtros = page.locator('.filtro');
      const destino = filtros.nth(1);
      await destino.click();
      await expect(destino).toHaveAttribute('aria-pressed', 'true');
      const fondo = await destino.locator('.filtro__fondo').evaluate((e) => e.getAnimations().length);
      const punto = await destino.locator('.filtro__punto').evaluate((e) => e.getAnimations().length);
      expect(fondo).toBe(reducido ? 0 : 1);
      expect(punto).toBe(reducido ? 0 : 1);
      await quieto(page);
      // Termina en su CSS: el fondo cubre el filtro activo, sin estilos en línea.
      expect(await destino.locator('.filtro__fondo').evaluate((e) => [getComputedStyle(e).opacity, e.style.transform])).toEqual(['1', '']);
      expect(await filtros.nth(0).locator('.filtro__fondo').evaluate((e) => getComputedStyle(e).opacity)).toBe('0');
    });

    test('la grilla: salen, se reacomodan y entran; aria-live con la cantidad', async ({ page }) => {
      const items = page.locator('#piezas-caso [data-filtro]');
      const total = await items.count();
      const filtro = page.locator('.filtro').nth(1);
      const n = Number(/(\d+)/.exec((await filtro.locator('.filtro__cantidad').textContent()) ?? '')?.[1]);
      await filtro.click();
      if (!reducido) {
        // Mientras salen, quedan fuera del flujo (en su lugar) y se desvanecen.
        const saliendo = await items.evaluateAll((els) => els.filter((e) => (e as HTMLElement).style.position === 'absolute').length);
        expect(saliendo).toBe(total - n);
      }
      await quieto(page);
      await expect(items.locator('visible=true')).toHaveCount(n);
      expect(await items.evaluateAll((els) => els.every((e) => (e as HTMLElement).style.cssText === '' || (e as HTMLElement).hidden))).toBe(true);
      await expect(page.locator('[data-filtros-estado]')).toContainText(String(n));

      // Volver a "Todos": entran todas, escalonadas, y terminan visibles.
      await page.locator('.filtro').nth(0).click();
      await quieto(page);
      await expect(items.locator('visible=true')).toHaveCount(total);
      expect(await items.evaluateAll((els) => els.every((e) => getComputedStyle(e).opacity === '1'))).toBe(true);
    });

    test('clics seguidos: manda el último y nada queda a medias', async ({ page }) => {
      const items = page.locator('#piezas-caso [data-filtro]');
      await page.locator('.filtro').nth(1).click();
      await page.locator('.filtro').nth(2).click();
      await page.locator('.filtro').nth(0).click();
      await quieto(page);
      await expect(items.locator('visible=true')).toHaveCount(await items.count());
      expect(await items.evaluateAll((els) => els.every((e) => (e as HTMLElement).style.cssText === ''))).toBe(true);
    });

    test('lo que sale no se puede tocar; un anuncio igual al anterior se vuelve a escribir', async ({ page }) => {
      const items = page.locator('#piezas-caso [data-filtro]');
      await page.locator('.filtro').nth(1).click();
      if (!reducido) expect(await items.evaluateAll((els) => els.filter((e) => (e as HTMLElement).inert).length)).toBeGreaterThan(0);
      await quieto(page);
      expect(await items.evaluateAll((els) => els.some((e) => (e as HTMLElement).inert))).toBe(false);
      // El anuncio se vacía y se escribe en el cuadro siguiente (los lectores leen aunque se repita).
      await page.locator('.filtro').nth(0).click();
      await page.locator('[data-filtros-estado]').evaluate((el) => {
        const w = window as unknown as { __vacio: boolean };
        w.__vacio = false;
        new MutationObserver(() => el.textContent === '' && (w.__vacio = true)).observe(el, { childList: true, characterData: true, subtree: true });
      });
      const texto = await page.locator('[data-filtros-estado]').textContent();
      await page.locator('.filtro').nth(1).click();
      await page.locator('.filtro').nth(0).click();
      await expect(page.locator('[data-filtros-estado]')).toHaveText(texto!);
      expect(await page.evaluate(() => (window as unknown as { __vacio: boolean }).__vacio)).toBe(true);
    });

    test('alto contraste: el filtro activo se distingue', async ({ page }) => {
      await page.emulateMedia({ forcedColors: 'active', reducedMotion });
      const fondos = () => page.locator('.filtro').evaluateAll((els) => els.slice(0, 2).map((e) => getComputedStyle(e).backgroundColor));
      await expect.poll(async () => new Set(await fondos()).size).toBe(2);
    });
  });
}

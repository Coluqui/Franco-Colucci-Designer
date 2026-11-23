import { test, expect, type Page } from '@playwright/test';

/** Fase 6, paso 3: M13, M14 (respiración), M15 (lectura) y M16, M17 (entradas). docs/motion.md §5. */

const stretch = (page: Page, sel: string) =>
  page.locator(sel).first().evaluate((el) => parseFloat(getComputedStyle(el).fontStretch));

const opacidades = (page: Page) =>
  page.locator('[data-frase]').first().locator('.lectura__palabra').evaluateAll((els) => els.map((e) => parseFloat(getComputedStyle(e).opacity)));

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
      await summaries.nth(1).click();
      await expect.poll(() => stretch(page, '[data-servicios] details[open] summary')).toBe(125);
      // Los inactivos: 112 con movimiento; 125 en reducido (solo cambia el color).
      // (se espera a que el que se cerró termine de volver: el resorte rebota un poco).
      await expect.poll(() => stretch(page, '[data-servicios] details:not([open]) summary')).toBe(reducido ? 125 : 112);
      // Alto fijo: respirar no mueve nada alrededor.
      const alto = await summaries.nth(1).evaluate((el) => el.getBoundingClientRect().height);
      const altos = await summaries.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
      expect(altos.every((h) => Math.abs(h - alto) < 1)).toBe(true);
    });

    test('M14 · los links del menú entran y respiran, y después responden al hover', async ({ page }) => {
      await page.goto('/es/');
      await page.locator('[data-abre-menu]').first().click();
      const links = page.locator('.menu__link');
      if (!reducido) {
        const animando = await links.evaluateAll((els) => els.filter((e) => e.getAnimations().length > 0).length);
        expect(animando).toBe(await links.count());
      }
      await expect.poll(() => links.evaluateAll((els) => els.every((e) => e.getAnimations().length === 0))).toBe(true);
      // Terminan en su CSS: sin estilos en línea que pisen el hover.
      expect(await links.evaluateAll((els) => els.map((e) => (e as HTMLElement).style.cssText).join(''))).toBe('');
      const vista = page.viewportSize()!;
      if (vista.width >= 1024) {
        const otro = links.filter({ hasNot: page.locator('[aria-current]') }).first();
        await otro.hover();
        await expect.poll(() => otro.evaluate((e) => parseFloat(getComputedStyle(e).fontStretch))).toBe(125);
      }
    });

    test('M15 · la frase se lee al bajar, nunca se apaga y la leen completa los lectores', async ({ page }) => {
      await page.goto('/es/');
      const frase = page.locator('[data-frase]').first();
      // Lectores de pantalla: el texto completo, una sola vez.
      const oculto = await frase.locator('.visually-hidden').textContent();
      expect(oculto!.split(' ').length).toBeGreaterThan(5);
      await expect(frase.locator('[aria-hidden="true"]')).toHaveCount(1);
      if (reducido) {
        expect((await opacidades(page)).every((o) => o === 1)).toBe(true);
        return;
      }
      const inicio = await opacidades(page);
      expect(Math.min(...inicio)).toBeLessThan(0.5);
      // Bajar hasta que el centro de la frase pase el 40 %: completa.
      await frase.evaluate((el) => {
        const r = el.getBoundingClientRect();
        scrollBy(0, r.top + r.height / 2 - innerHeight * 0.35);
      });
      await expect.poll(async () => Math.min(...(await opacidades(page)))).toBe(1);
      // Monotónica: al volver arriba no se apaga.
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(400);
      expect(Math.min(...(await opacidades(page)))).toBe(1);
    });

    test('M15 · si el scroll se detiene con la frase a medias, se completa sola', async ({ page }) => {
      test.skip(reducido, 'en reducido la frase ya está completa');
      await page.goto('/es/');
      const frase = page.locator('[data-frase]').first();
      // El centro a mitad de camino entre el borde de abajo y el 40 %.
      await frase.evaluate((el) => {
        const r = el.getBoundingClientRect();
        scrollBy(0, r.top + r.height / 2 - innerHeight * 0.7);
      });
      await page.waitForTimeout(300);
      const aMedias = await opacidades(page);
      expect(Math.min(...aMedias)).toBeLessThan(1);
      // Mientras se lee, el loop del hero espera.
      await expect(page.locator('html')).toHaveAttribute('data-leyendo', '');
      await expect.poll(async () => Math.min(...(await opacidades(page))), { timeout: 5000 }).toBe(1);
      await expect(page.locator('html')).not.toHaveAttribute('data-leyendo', '');
    });

    test('M16 y M17 · lo de abajo entra una vez; lo que ya se ve no se anima', async ({ page }) => {
      await page.goto('/es/');
      const titulo = page.locator('#preguntas .seccion__cabecera');
      // Fuera de pantalla: espera escondido (solo cuando nadie lo ve).
      expect(await titulo.evaluate((el) => getComputedStyle(el).opacity)).toBe('0');
      await titulo.scrollIntoViewIfNeeded();
      await expect.poll(() => titulo.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
      await expect.poll(() => titulo.evaluate((el) => (el as HTMLElement).style.cssText)).toBe('');
      // Las filas: cada una entra; al terminar no quedan estilos en línea.
      const filas = page.locator('[data-fila]');
      for (const f of await filas.all()) await f.scrollIntoViewIfNeeded();
      await expect
        .poll(() => filas.evaluateAll((els) => els.every((f) => [...f.querySelectorAll<HTMLElement>('.fila__texto, .fila__media')].every((e) => getComputedStyle(e).opacity === '1'))))
        .toBe(true);
    });

    test('M16 · el hero y la primera pantalla se ven en el primer cuadro', async ({ page }) => {
      await page.goto('/es/');
      const ocultos = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('body *')]
          // Las piezas del loop que no están en turno esperan ocultas a propósito.
          .filter((el) => !el.closest('[data-loop-escena]'))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.bottom > 0 && r.top < innerHeight && r.width > 0 && el.style.opacity === '0';
          })
          .map((el) => el.className),
      );
      expect(ocultos).toEqual([]);
    });
  });
}

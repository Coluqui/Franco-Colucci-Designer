import { test, expect, type Page } from '@playwright/test';

/**
 * Motion v3.0 "Desglose" (docs/motion.md): la home se va revelando al bajar (4.4, 4.6, 4.8).
 * Reemplaza a las pruebas de M16 y M17 (motion v2.0).
 */

const REVELABLES = '[data-reveal], [data-reveal-item], [data-split], [data-mask-content] > *';

const ocultos = (page: Page) =>
  page.evaluate(
    (sel) => [...document.querySelectorAll<HTMLElement>(sel)].filter((e) => +getComputedStyle(e).opacity < 0.99).length,
    REVELABLES,
  );

/** Baja de a medio viewport hasta el final, como alguien que lee. */
const bajarHastaElFinal = async (page: Page) => {
  // Tras un swap, el smoother fija el alto del body un cuadro después.
  await page.waitForFunction(() => document.documentElement.scrollHeight > innerHeight * 2);
  for (let i = 0; i < 60; i++) {
    const fin = await page.evaluate(() => {
      scrollBy(0, innerHeight / 2);
      return scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
    });
    await page.waitForTimeout(80);
    if (fin) break;
  }
};

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test.describe(`reducido: ${reducedMotion}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
    });

    for (const ruta of ['/es/', '/en/', '/es/trabajos/', '/es/trabajos/moondesk/']) {
      test(`${ruta} · lo de abajo espera oculto y al bajar todo queda visible`, async ({ page }) => {
        const errs: string[] = [];
        page.on('pageerror', (e) => errs.push(e.message));
        await page.goto(ruta);
        await expect(page.locator('html')).toHaveAttribute('data-motion-listo', '');
        if (ruta === '/es/') expect(await ocultos(page)).toBeGreaterThan(0);
        await bajarHastaElFinal(page);
        await expect.poll(() => ocultos(page), { timeout: 5000 }).toBe(0);
        expect(errs).toEqual([]);
      });
    }
  });
}

test('4.2 · el hero se ve sin scrollear', async ({ page }) => {
  await page.goto('/es/');
  await expect(page.locator('[data-hero-wordmark]')).toBeVisible();
  await expect.poll(() => page.locator('[data-hero-bajada]').evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
});

test('smooth scroll solo con puntero fino y sin movimiento reducido', async ({ page }) => {
  await page.goto('/es/');
  await expect(page.locator('html')).toHaveAttribute('data-motion-listo', '');
  const fino = await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches);
  expect(await page.evaluate(() => document.documentElement.hasAttribute('data-smooth'))).toBe(fino);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveAttribute('data-smooth', '');
});

test('nunca hay foco en algo invisible: lo que espera aparece al recibir el foco', async ({ page }) => {
  await page.goto('/es/');
  await expect(page.locator('html')).toHaveAttribute('data-motion-listo', '');
  const fila = page.locator('.fila-caja[data-reveal-item]').last();
  await fila.locator('a').first().focus();
  await expect.poll(() => fila.evaluate((e) => +getComputedStyle(e).opacity)).toBeGreaterThan(0.99);
});

test('ir y volver con ClientRouter: un solo smoother y los revelados vuelven a andar', async ({ page }) => {
  const errs: string[] = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('/es/');
  // La URL cambia antes del swap: se espera a astro:page-load de la página nueva.
  const cargada = () =>
    page.evaluate(() => new Promise<void>((r) => document.addEventListener('astro:page-load', () => r(), { once: true })));
  for (let i = 0; i < 2; i++) {
    let espera = cargada();
    // Clic por JS: con el smoother, el clic de Playwright no llega a bajar hasta el footer.
    await page.locator('footer a[href="/es/trabajos/"]').first().evaluate((a) => (a as HTMLElement).click());
    await espera;
    espera = cargada();
    await page.goBack();
    await espera;
  }
  await expect(page.locator('html')).toHaveAttribute('data-motion-listo', '');
  expect(await page.locator('#smooth-wrapper').count()).toBe(1);
  await bajarHastaElFinal(page);
  await expect.poll(() => ocultos(page), { timeout: 5000 }).toBe(0);
  expect(errs).toEqual([]);
});

import { test, expect, type Page } from '@playwright/test';

/**
 * Fase 6, paso 4: con <ClientRouter /> el documento no se recarga al navegar. Cada componente tiene
 * que volver a arrancar en la página nueva y soltar lo de la anterior.
 */

const errores = (page: Page) => {
  const lista: string[] = [];
  page.on('pageerror', (e) => lista.push(e.message));
  page.on('console', (m) => m.type() === 'error' && lista.push(m.text()));
  return lista;
};

/** Navega con un clic y comprueba que fue sin recargar (la marca en window sobrevive). */
const navegar = async (page: Page, href: string) => {
  await page.evaluate(() => ((window as unknown as { __sinRecarga: boolean }).__sinRecarga = true));
  // Clic por JS: con ScrollSmoother, el clic de Playwright no siempre llega a bajar hasta el footer.
  await page.locator(`footer a[href="${href}"]`).first().evaluate((a) => (a as HTMLElement).click());
  await page.waitForURL(`**${href}`);
  await page.waitForFunction(() => document.readyState === 'complete');
  expect(await page.evaluate(() => (window as unknown as { __sinRecarga?: boolean }).__sinRecarga)).toBe(true);
};

test('navegar sin recargar: el header persiste y todo vuelve a arrancar', async ({ page }) => {
  const errs = errores(page);
  await page.goto('/es/');
  await page.evaluate(() => ((document.querySelector('[data-header]') as unknown as { __mismo: boolean }).__mismo = true));

  await navegar(page, '/es/trabajos/');
  // El header es el mismo nodo (transition:persist) y se puso al día (arriba: sin data-scrolled).
  expect(await page.evaluate(() => (document.querySelector('[data-header]') as unknown as { __mismo?: boolean }).__mismo)).toBe(true);
  await expect(page.locator('[data-header]')).not.toHaveAttribute('data-scrolled', '');
  // Los filtros de Trabajos arrancaron en la página nueva.
  await expect(page.locator('[data-filtros]').first()).toHaveAttribute('data-listo', '');

  await navegar(page, '/es/');
  // La home vuelve a arrancar: servicios con su recorte y la frase con su capa fantasma (4.5), una sola vez.
  await expect(page.locator('[data-servicios]')).toHaveAttribute('data-encastre', '');
  await expect(page.locator('.frase').first().locator('.texto-fantasma')).toHaveCount(1);
  // Nadie quedó "leyendo" de la página anterior (el loop no espera de más).
  await expect(page.locator('html')).not.toHaveAttribute('data-leyendo', '');
  // El header reacciona al scroll en la página nueva.
  // Tras el swap, el smoother fija el alto de la página un cuadro después.
  await page.waitForFunction(() => document.documentElement.scrollHeight > innerHeight * 2);
  await page.evaluate(() => scrollTo(0, 400));
  await expect(page.locator('[data-header]')).toHaveAttribute('data-scrolled', '');
  expect(errs).toEqual([]);
});

test('el modo elegido sobrevive a la navegación', async ({ page }) => {
  await page.goto('/es/');
  await page.evaluate(() => localStorage.setItem('tema', 'dark'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await navegar(page, '/es/trabajos/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-js', '');
});

test('cambiar de idioma: el header pasa al otro idioma y la posición se conserva', async ({ page }) => {
  await page.goto('/es/');
  await page.evaluate(() => scrollTo(0, (document.documentElement.scrollHeight - innerHeight) / 2));
  const antes = await page.evaluate(() => scrollY / (document.documentElement.scrollHeight - innerHeight));
  // Clic por JS: el clic de Playwright podría mover la posición que se guarda.
  await page.locator('[data-header] [data-toggle-idioma] a:not([aria-current])').evaluate((a) => (a as HTMLElement).click());
  await page.waitForURL('**/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('[data-header] [data-abre-menu]')).toHaveAttribute('aria-label', /menu/i);
  await expect(page.locator('[data-header] [data-abre-panel]')).not.toContainText('Hablemos');
  // Con ScrollSmoother el alto de la página llega un cuadro después del swap.
  await expect
    .poll(() => page.evaluate((a) => Math.abs(scrollY / (document.documentElement.scrollHeight - innerHeight) - a), antes))
    .toBeLessThan(0.05);
});

test('después de cambiar de idioma, el foco queda en el toggle (no vuelve al principio)', async ({ page }) => {
  await page.goto('/es/');
  await page.locator('[data-header] [data-toggle-idioma] a:not([aria-current])').evaluate((a) => (a as HTMLElement).click());
  await page.waitForURL('**/en/');
  await expect(page.locator('[data-header] [data-toggle-idioma] [aria-current]')).toBeFocused();
});

import { test, expect, type Page } from '@playwright/test';

/** M19 (header), M20 (menú desde el botón), M21 (panel Hablemos), M22 (barra inferior). docs/motion.md §4. */

const quieto = (page: Page, sel: string) =>
  expect.poll(() => page.locator(sel).evaluate((el) => el.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length)).toBe(0);

const errores = (page: Page) => {
  const lista: string[] = [];
  page.on('pageerror', (e) => lista.push(e.message));
  page.on('console', (m) => m.type() === 'error' && lista.push(m.text()));
  return lista;
};

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  const reducido = reducedMotion === 'reduce';

  test.describe(`reducido: ${reducedMotion}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
    });

    test('M19 · el fondo del header aparece con opacidad al scrollear', async ({ page }) => {
      await page.goto('/es/');
      const capa = () => page.locator('[data-header]').evaluate((h) => getComputedStyle(h, '::before').opacity);
      expect(await capa()).toBe('0');
      expect(await page.locator('[data-header]').evaluate((h) => getComputedStyle(h, '::before').transitionDuration)).toBe(reducido ? '0.12s' : '0.3s');
      await page.evaluate(() => scrollTo(0, 400));
      await expect.poll(capa).toBe('1');
      // El header mismo no cambia de fondo: solo su capa (nada anima colores).
      expect(await page.locator('[data-header]').evaluate((h) => getComputedStyle(h).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
    });

    test('M20 · el menú se abre con un wipe desde arriba; el foco vuelve a "Menú"', async ({ page }) => {
      await page.goto('/es/');
      const boton = page.locator('[data-header] [data-abre-menu]');
      await boton.click();
      const menu = page.locator('[data-menu]');
      await expect(menu).toHaveAttribute('open', '');
      const frames = await menu.evaluate((m) => (m.getAnimations()[0]?.effect as KeyframeEffect | undefined)?.getKeyframes().map((k) => String(k['clipPath'])));
      expect(frames?.[0]).toMatch(/^inset\(0px 0px 100%( 0px)?\)$/);
      // Los links entran con GSAP (4.10) y terminan visibles y sin estilos en línea.
      await expect.poll(() => page.locator('.menu__link').evaluateAll((els) => els.every((e) => getComputedStyle(e).opacity === '1' && !(e as HTMLElement).style.cssText))).toBe(true);
      await quieto(page, '[data-menu]');
      expect(await menu.evaluate((m) => getComputedStyle(m).clipPath)).toBe('none');
      expect(await boton.getAttribute('aria-expanded')).toBe('true');

      await page.keyboard.press('Escape');
      await expect(menu).not.toHaveAttribute('open', '');
      await expect(boton).toBeFocused();
      expect(await boton.getAttribute('aria-expanded')).toBe('false');
      expect(await menu.evaluate((m) => (m as HTMLElement).style.cssText)).toBe('');
    });

    test('M21 · el panel entra (derecha en desktop, abajo en mobile) y sale con ESC, × o el velo', async ({ page }) => {
      await page.goto('/es/');
      const abridor = page.locator('[data-abre-panel]:visible').first();
      await abridor.click();
      const panel = page.locator('[data-panel]');
      await expect(panel).toHaveAttribute('open', '');
      const desde = await page.locator('.panel__interior').evaluate((el) => String((el.getAnimations()[0]?.effect as KeyframeEffect).getKeyframes()[0]?.['transform']));
      const ancho = page.viewportSize()!.width >= 768;
      expect(desde).toBe(ancho ? 'translateX(100%)' : 'translateY(100%)');
      const velo = await panel.evaluate((p) => p.getAnimations({ subtree: true }).find((a) => (a.effect as KeyframeEffect).pseudoElement === '::backdrop')?.effect?.getComputedTiming().duration);
      expect(velo).toBe(reducido ? 120 : 300);
      const campos = await page.locator('[data-panel] [data-form-hablemos] form > :is(.campo, .boton)').evaluateAll((els) => els.filter((e) => e.getAnimations().length > 0).length);
      expect(campos).toBeLessThanOrEqual(4);
      await quieto(page, '[data-panel]');
      await page.locator('[data-cierra-panel]').click();
      await expect(panel).not.toHaveAttribute('open', '');
      // Velo: clic fuera del interior (solo hay velo a la vista en desktop).
      if (ancho) {
        await abridor.click();
        await quieto(page, '[data-panel]');
        await page.mouse.click(10, 300);
        await expect(panel).not.toHaveAttribute('open', '');
      }
      expect(await page.locator('.panel__interior').evaluate((e) => (e as HTMLElement).style.cssText)).toBe('');
    });

    test('M22 · la barra inferior baja con un diálogo abierto y vuelve al cerrarlo', async ({ page }) => {
      test.skip(page.viewportSize()!.width >= 768, 'la barra existe solo en angosto');
      await page.goto('/es/');
      const barra = page.locator('[data-barra-mobile]');
      const y = () => barra.evaluate((b) => new DOMMatrix(getComputedStyle(b).transform).m42);
      expect(await y()).toBe(0);
      await page.locator('[data-header] [data-abre-menu]').click();
      await expect.poll(async () => (await y()) > 0).toBe(true);
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-menu]')).not.toHaveAttribute('open', '');
      await expect.poll(y).toBe(0);
      await expect(barra).toBeVisible();
    });
  });
}

test('después de navegar, "Menú" y "Hablemos" (header persistente) abren una sola vez y sin errores', async ({ page }) => {
  const errs = errores(page);
  await page.goto('/es/');
  for (const destino of ['/es/trabajos/', '/es/']) {
    await page.locator(`footer a[href="${destino}"]`).first().evaluate((a) => (a as HTMLElement).click());
    await page.waitForURL(`**${destino}`);
    await page.waitForFunction(() => document.readyState === 'complete');
  }
  await page.locator('[data-header] [data-abre-menu]').click();
  await expect(page.locator('[data-menu]')).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-menu]')).not.toHaveAttribute('open', '');
  await page.locator('[data-abre-panel]:visible').first().click();
  await expect(page.locator('[data-panel]')).toHaveAttribute('open', '');
  expect(errs).toEqual([]);
});

import { test, expect } from '@playwright/test';

/** M04 · loop de formatos del hero (docs/motion.md §5 y §9). */

const etiqueta = '[data-loop-etiqueta]';

test.describe('con movimiento', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    // CLS: se registran los cambios de layout desde el primer momento.
    await page.addInitScript(() => {
      (window as any).__cls = 0;
      new PerformanceObserver((l) =>
        l.getEntries().forEach((e: any) => {
          if (!e.hadRecentInput) (window as any).__cls += e.value;
        }),
      ).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto('/es/');
  });

  test('pasa de formato, rueda la etiqueta y no mueve el layout', async ({ page }) => {
    const loop = page.locator('[data-loop]');
    await expect(loop).toHaveAttribute('data-activo', '');
    await expect(page.locator(etiqueta)).toHaveText(/· 1:1$/);
    // La escena ocupa exactamente la caja de la tira.
    const [tira, escena] = await Promise.all(
      ['[data-loop-tira]', '[data-loop-escena]'].map((s) => page.locator(s).boundingBox()),
    );
    expect(escena!.height).toBeCloseTo(tira!.height, 0);
    expect(escena!.width).toBeCloseTo(tira!.width, 0);
    // 560 ms de encastre + 2200 de hold: llega a 4:5.
    await expect(page.locator(etiqueta)).toHaveText(/· 4:5$/, { timeout: 5000 });
    expect(await page.evaluate(() => (window as any).__cls)).toBe(0);
  });

  test('la pausa es visible, tiene estado y detiene el loop', async ({ page }) => {
    const pausa = page.locator('[data-loop-pausa]');
    await expect(pausa).toBeVisible();
    const caja = await pausa.boundingBox();
    expect(caja!.width).toBeGreaterThanOrEqual(44);
    expect(caja!.height).toBeGreaterThanOrEqual(44);
    await pausa.click();
    await expect(pausa).toHaveAttribute('aria-pressed', 'true');
    const antes = await page.locator(etiqueta).textContent();
    await page.waitForTimeout(3500);
    await expect(page.locator(etiqueta)).toHaveText(antes!);
    await pausa.click();
    await expect(pausa).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator(etiqueta)).not.toHaveText(antes!, { timeout: 5000 });
  });

  test('fuera de pantalla se detiene', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const estados = await page.locator('[data-loop]').evaluate((l) => l.getAnimations({ subtree: true }).map((a) => a.playState));
    expect(estados.every((s) => s !== 'running')).toBe(true);
    const antes = await page.locator(etiqueta).textContent();
    await page.waitForTimeout(3500);
    await expect(page.locator(etiqueta)).toHaveText(antes!);
  });
});

test.describe('movimiento reducido', () => {
  test('sin loop: queda la tira estática', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/es/');
    await expect(page.locator('[data-loop]')).not.toHaveAttribute('data-activo', '');
    await expect(page.locator('[data-loop-pausa]')).toBeHidden();
    await expect(page.locator('[data-loop-tira]')).toHaveCSS('opacity', '1');
    await expect(page.locator('[data-loop-tira] .hero__formato')).toHaveCount(5);
  });
});

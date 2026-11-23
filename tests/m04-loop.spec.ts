import { test, expect } from '@playwright/test';

/** M04 · loop de formatos del hero (docs/motion.md §5 y §9). */

const etiqueta = '[data-loop-etiqueta]';

test.describe('con movimiento', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    // CLS del loop: cambios de layout desde que cargan las fuentes. En dev, Vite inyecta estilos tarde
    // y con el server saturado el wordmark puede bajar unos px: eso no es motion y en producción da 0.
    await page.addInitScript(() => {
      const w = window as any;
      w.__shifts = [];
      w.__fuentes = Infinity;
      document.fonts.ready.then(() => (w.__fuentes = performance.now()));
      new PerformanceObserver((l) =>
        l.getEntries().forEach((e: any) => !e.hadRecentInput && w.__shifts.push([e.startTime, e.value])),
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
    const cls = await page.evaluate(() => {
      const w = window as any;
      return w.__shifts.filter(([t]: number[]) => t > w.__fuentes).reduce((n: number, [, v]: number[]) => n + v, 0);
    });
    expect(cls).toBe(0);
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

  test('pausar a mitad de una transición deja un formato entero y legible', async ({ page }) => {
    // Se espera a que empiece el primer cambio y se pausa en pleno encastre.
    await page.waitForFunction(() =>
      document.querySelector('[data-loop-capa]')!.getAnimations().some((a) => a.playState === 'running'),
    );
    await page.waitForTimeout(250);
    await page.locator('[data-loop-pausa]').click();
    await page.waitForTimeout(100);
    const r = await page.evaluate(() => {
      const op = (el: Element) => parseFloat(getComputedStyle(el).opacity);
      const piezas = [...document.querySelectorAll('[data-loop-pieza]')].map(op);
      return {
        etiqueta: op(document.querySelector('[data-loop-etiqueta]')!),
        piezas,
        vivas: document.querySelector('[data-loop]')!.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length,
      };
    });
    expect(r.etiqueta).toBe(1);
    expect(r.piezas.filter((o) => o === 1)).toHaveLength(1);
    expect(r.piezas.every((o) => o === 0 || o === 1)).toBe(true);
    expect(r.vivas).toBe(0);
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

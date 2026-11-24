import { test, expect, type Page } from '@playwright/test';

/** M06 (fila → caso) y M07 (caso → atrás / siguiente) con View Transitions. docs/motion.md §3. */

type Captura = { pseudo: string; duracion: number; easing: string }[];

/** Junto a cada cambio de página, guarda las animaciones de la View Transition (un cuadro después del swap). */
const espiar = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { __vt: Captura[] };
    w.__vt = [];
    document.addEventListener('astro:after-swap', () =>
      requestAnimationFrame(() =>
        w.__vt.push(
          document.getAnimations().map((a) => {
            const efecto = a.effect as KeyframeEffect;
            const t = efecto.getComputedTiming();
            return { pseudo: efecto.pseudoElement ?? '', duracion: Number(t.duration), easing: String(efecto.getKeyframes()[0]?.easing ?? '') };
          }),
        ),
      ),
    );
  });

const ultima = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { __vt: Captura[] };
    return w.__vt.at(-1) ?? [];
  });

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

    test('M06 · la media y el nombre de la fila viajan al hero y al H1 del caso', async ({ page }) => {
      const errs = errores(page);
      await page.goto('/es/trabajos/');
      await espiar(page);
      const link = page.locator('.fila__link').first();
      const href = (await link.getAttribute('href'))!;
      const slug = href.split('/').filter(Boolean).at(-1)!;
      await link.click();
      await page.waitForURL(`**${href}`);
      await expect.poll(async () => (await ultima(page)).length).toBeGreaterThan(0);
      const anims = await ultima(page);
      const grupo = anims.find((a) => a.pseudo === `::view-transition-group(caso-${slug}-media)`);
      const titulo = anims.find((a) => a.pseudo === `::view-transition-group(caso-${slug}-titulo)`);
      const salida = anims.find((a) => a.pseudo === '::view-transition-old(root)');
      if (reducido) {
        // Fundido cruzado de 120 ms; nada viaja.
        expect(grupo).toBeUndefined();
        expect(titulo).toBeUndefined();
        expect(salida?.duracion).toBe(120);
      } else {
        expect(grupo?.duracion).toBe(700);
        expect(grupo?.easing).toContain('linear(');
        expect(titulo?.duracion).toBe(700);
        expect(salida?.duracion).toBe(200);
        // El contenido del caso entra: hasta 4 bloques, escalonados.
        const entran = await page.locator('main [data-entra]').evaluateAll((els) =>
          els.slice(0, 4).map((e) => e.getAnimations().length),
        );
        expect(entran.some((n) => n > 0)).toBe(true);
      }
      // Al terminar, los bloques quedan en su CSS y visibles.
      await expect
        .poll(() => page.locator('main [data-entra]').evaluateAll((els) => els.every((e) => getComputedStyle(e).opacity === '1' && !(e as HTMLElement).style.cssText)))
        .toBe(true);
      await expect(page.locator('main h1')).toBeVisible();
      expect(errs).toEqual([]);
    });

    test('M07 · atrás del navegador hace el camino inverso; "Siguiente caso" se vuelve el H1', async ({ page }) => {
      const errs = errores(page);
      await page.goto('/es/trabajos/');
      await espiar(page);
      const link = page.locator('.fila__link').first();
      const href = (await link.getAttribute('href'))!;
      const slug = href.split('/').filter(Boolean).at(-1)!;
      await link.click();
      await page.waitForURL(`**${href}`);
      await page.goBack();
      await page.waitForURL('**/es/trabajos/');
      await expect.poll(async () => (await ultima(page)).some((a) => a.pseudo.includes('root'))).toBe(true);
      const atras = await ultima(page);
      if (!reducido) expect(atras.some((a) => a.pseudo === `::view-transition-group(caso-${slug}-media)`)).toBe(true);

      // Siguiente caso.
      await page.goto(href);
      await espiar(page);
      const siguiente = page.locator('.siguiente__link');
      const destino = (await siguiente.getAttribute('href'))!;
      const otro = destino.split('/').filter(Boolean).at(-1)!;
      await siguiente.evaluate((a) => (a as HTMLElement).click());
      await page.waitForURL(`**${destino}`);
      await expect.poll(async () => (await ultima(page)).length).toBeGreaterThan(0);
      const sig = await ultima(page);
      if (!reducido) expect(sig.some((a) => a.pseudo === `::view-transition-group(caso-${otro}-titulo)`)).toBe(true);
      await expect(page.locator('main h1')).toContainText(await page.locator('.caso__nombre').innerText());
      expect(errs).toEqual([]);
    });
  });
}

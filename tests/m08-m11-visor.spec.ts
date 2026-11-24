import { test, expect, type Page } from '@playwright/test';

/** M08 (tile → visor), M09 (cerrar), M10 (segmento) y M11 (otra pieza). docs/motion.md §3. */

const CASO = '/es/trabajos/iscamen/';

const animacionesDe = (page: Page, sel: string) =>
  page.locator(sel).first().evaluate((el) =>
    el.getAnimations({ subtree: true }).filter((a) => (a.effect as KeyframeEffect).target === el).map((a) => {
      const e = a.effect as KeyframeEffect;
      return { pseudo: e.pseudoElement ?? '', duracion: Number(e.getComputedTiming().duration), retraso: Number(e.getTiming().delay) };
    }),
  );

const imgVisor = (page: Page) => page.locator('[data-visor] .visor__slide img').first();

/** Abre el visor desde un tile que está a la vista. */
const abrir = async (page: Page, n = 0) => {
  const tile = page.locator('[data-abre-visor]').nth(n);
  await tile.scrollIntoViewIfNeeded();
  await tile.click();
  await expect(page.locator('[data-visor]')).toHaveAttribute('open', '');
  return tile;
};

const quieto = (page: Page) =>
  expect.poll(() => page.locator('[data-visor]').evaluate((v) => v.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length)).toBe(0);

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  const reducido = reducedMotion === 'reduce';

  test.describe(`reducido: ${reducedMotion}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
      await page.goto(CASO);
    });

    test('M08 · la pieza viaja del tile al visor; fondo en 300 ms, controles 200 ms después', async ({ page }) => {
      await abrir(page);
      const fondo = (await animacionesDe(page, '[data-visor]')).find((a) => a.pseudo === '::before');
      expect(fondo?.duracion).toBe(reducido ? 120 : 300);
      const barra = await animacionesDe(page, '.visor__barra');
      // Reducido: --duration-fast vale 0, así que aparecen con el fondo (que se funde en 120 ms).
      if (reducido) expect(barra.every((a) => a.retraso === 0)).toBe(true);
      else expect(barra[0]?.retraso).toBe(200);
      if (reducido) {
        const pieza = await imgVisor(page).evaluate((el) => (el.getAnimations()[0]?.effect as KeyframeEffect | undefined)?.getKeyframes()[0]);
        expect(pieza?.['opacity']).toBe('0');
      } else {
        // Viaja una copia fija por encima de la pista (que recorta), desde la caja del tile.
        const copia = page.locator('[data-visor] .visor__vuelo');
        await expect(copia).toHaveCount(1);
        const desde = await copia.evaluate((el) => String((el.getAnimations()[0]?.effect as KeyframeEffect).getKeyframes()[0]?.['transform']));
        expect(desde).toContain('scale(');
      }
      // Una sola copia a la vista: el tile queda vacío mientras su pieza está en el visor.
      await expect.poll(() => page.locator('[data-abre-visor] img').first().evaluate((e) => e.style.opacity)).toBe('0');
      await quieto(page);
      await expect(page.locator('[data-visor] .visor__vuelo')).toHaveCount(0);
      expect(await imgVisor(page).evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
      // Termina en su CSS: la pieza sin transformación, sin deformarse (contain).
      expect(await imgVisor(page).evaluate((e) => getComputedStyle(e).transform)).toBe('none');
      expect(await imgVisor(page).evaluate((e) => getComputedStyle(e).objectFit)).toBe('contain');
    });

    test('M09 · ESC y × cierran con la pieza volviendo al tile; el foco vuelve al tile', async ({ page }) => {
      const tile = await abrir(page);
      await quieto(page);
      await page.keyboard.press('Escape');
      if (!reducido) {
        // Durante el regreso el visor sigue abierto (la pieza viaja).
        await expect(page.locator('[data-visor]')).toHaveAttribute('open', '');
        await expect(page.locator('[data-visor] .visor__vuelo')).toHaveCount(1);
      }
      await expect(page.locator('[data-visor]')).not.toHaveAttribute('open', '');
      await expect(tile).toBeFocused();
      expect(await page.locator('[data-abre-visor] img').first().evaluate((e) => e.style.opacity)).toBe('');
      expect(new URL(page.url()).searchParams.get('pieza')).toBeNull();

      await abrir(page);
      await page.locator('[data-visor-cerrar]').click();
      await expect(page.locator('[data-visor]')).not.toHaveAttribute('open', '');
      // Se puede volver a abrir y todo arranca de cero.
      await abrir(page);
      await quieto(page);
      expect(await page.locator('.visor__barra').evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
    });

    test('M09 · arrastre vertical en táctil: corto vuelve, largo cierra', async ({ page }) => {
      await abrir(page);
      await quieto(page);
      const arrastrar = (dy: number) =>
        page.locator('[data-visor-escena]').evaluate((el, dy) => {
          const r = el.getBoundingClientRect();
          const x = r.left + r.width / 2;
          const y = r.top + r.height / 2;
          const ev = (tipo: string, yy: number) =>
            el.dispatchEvent(new PointerEvent(tipo, { pointerId: 7, pointerType: 'touch', clientX: x, clientY: yy, bubbles: true }));
          ev('pointerdown', y);
          for (let k = 1; k <= 5; k++) ev('pointermove', y + (dy * k) / 5);
          ev('pointerup', y + dy);
        }, dy);
      await arrastrar(40);
      await expect(page.locator('[data-visor]')).toHaveAttribute('open', '');
      await expect.poll(() => imgVisor(page).evaluate((e) => getComputedStyle(e).transform)).toBe('none');
      await arrastrar(400);
      await expect(page.locator('[data-visor]')).not.toHaveAttribute('open', '');
    });

    test('M10 · el segmento activo se llena con scaleX', async ({ page }) => {
      // Un carrusel: el tile con ícono de carrusel.
      const carrusel = page.locator('.tile:has(.tile__icono) [data-abre-visor]').first();
      await carrusel.scrollIntoViewIfNeeded();
      await carrusel.click();
      await quieto(page);
      const relleno = (i: number) =>
        page.locator('.visor__segmentos button').nth(i).evaluate((b) => getComputedStyle(b, '::after').transform);
      expect(await relleno(0)).toBe('matrix(1, 0, 0, 1, 0, 0)');
      expect(await relleno(1)).toBe('matrix(0, 0, 0, 1, 0, 0)');
      await page.keyboard.press('ArrowRight');
      await expect.poll(() => relleno(1)).toBe('matrix(1, 0, 0, 1, 0, 0)');
      await expect.poll(() => relleno(0)).toBe('matrix(0, 0, 0, 1, 0, 0)');
      await expect(page.locator('[data-visor-contador]')).toContainText('Slide 2');
    });

    test('M11 · otra pieza: la actual sale hacia arriba y la nueva entra desde abajo', async ({ page }) => {
      await abrir(page);
      await quieto(page);
      const antes = await page.locator('[data-visor-contador]').textContent();
      await page.keyboard.press('PageDown');
      if (!reducido) {
        const sale = await page.locator('[data-visor-pista]').evaluate((el) => (el.getAnimations()[0]?.effect as KeyframeEffect | undefined)?.getKeyframes().at(-1));
        expect(String(sale?.['transform'])).toContain('translateY(-24px)');
      }
      await expect(page.locator('[data-visor-contador]')).not.toHaveText(antes!);
      await quieto(page);
      expect(await page.locator('[data-visor-pista]').evaluate((e) => (e as HTMLElement).style.cssText)).toBe('');
      // Dos pedidos seguidos: manda el último (dos piezas más allá).
      const n = (t: string | null) => Number(/(\d+) \//.exec(t ?? '')?.[1]);
      const actual = n(await page.locator('[data-visor-contador]').textContent());
      await page.keyboard.press('PageDown');
      await page.keyboard.press('PageDown');
      await expect.poll(async () => n(await page.locator('[data-visor-contador]').textContent())).toBe(actual + 2);
      await quieto(page);
      expect(await page.locator('[data-visor-pista]').evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
    });

    test('mientras se cierra, el teclado no cambia de pieza y el foco vuelve al tile que la abrió', async ({ page }) => {
      const tile = await abrir(page);
      await quieto(page);
      const antes = await page.locator('[data-visor-contador]').textContent();
      await page.keyboard.press('Escape');
      await page.keyboard.press('PageDown');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('Tab');
      expect(await page.locator('[data-visor-contador]').textContent()).toBe(antes);
      await expect(page.locator('[data-visor]')).not.toHaveAttribute('open', '');
      await expect(tile).toBeFocused();
    });
  });
}

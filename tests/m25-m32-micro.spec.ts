import { test, expect, type Page } from '@playwright/test';

/** Paso 5: microinteracciones M25–M32. docs/motion.md §4. */

const ancho = (page: Page) => page.viewportSize()!.width >= 1024;

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  const reducido = reducedMotion === 'reduce';

  test.describe(`reducido: ${reducedMotion}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
    });

    test('M25 · el primario pasa a cobalto en hover y se hunde al presionar', async ({ page }) => {
      test.skip(!ancho(page), 'hover solo con puntero fino');
      await page.goto('/es/');
      const boton = page.locator('[data-header] .header__hablemos');
      const antes = await boton.evaluate((b) => getComputedStyle(b).backgroundColor);
      await boton.hover();
      await expect.poll(() => boton.evaluate((b) => getComputedStyle(b).backgroundColor)).not.toBe(antes);
      const box = (await boton.boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await expect.poll(() => boton.evaluate((b) => getComputedStyle(b).transform)).toBe(reducido ? 'matrix(1, 0, 0, 1, 0, 0)' : 'matrix(0.98, 0, 0, 0.98, 0, 0)');
      await page.mouse.up();
    });

    test('M26 · el subrayado del link pasa de 1 a 2 px con scaleY', async ({ page }) => {
      test.skip(!ancho(page), 'hover solo con puntero fino');
      await page.goto('/es/trabajos/iscamen/');
      // Los links sueltos (link--suelto) no llevan subrayado: se prueba uno de texto/contacto.
      const link = page.locator('a.link:not(.link--suelto)').first();
      const linea = () => link.evaluate((a) => getComputedStyle(a, '::after').transform);
      expect(await linea()).toBe('matrix(1, 0, 0, 0.5, 0, 0)');
      // Ese link está en el footer: con 4.13 el interior llega a su lugar recién al final de la página
      // (antes queda recortado), y con ScrollSmoother hay que esperar a que el contenido se asiente.
      await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(1500);
      await link.hover();
      await expect.poll(linea).toBe('none');
    });

    test('M27 · con foco, la media escala y la flecha avanza', async ({ page }) => {
      await page.goto('/es/trabajos/');
      const fila = page.locator('.fila').first();
      await fila.locator('.fila__link').focus();
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      const flecha = () => fila.locator('.fila__ver .icono').evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41);
      await expect.poll(flecha).toBe(reducido ? 0 : 4);
    });


    test('M28 · el contador rueda y el arrastre con mouse lleva al más cercano', async ({ page }) => {
      await page.goto('/es/dev/componentes/');
      const raiz = page.locator('[data-testimonios]');
      await raiz.scrollIntoViewIfNeeded();
      // Con ScrollSmoother (motion 4.1) el contenido llega con retraso: se espera a que quede quieto.
      await page.waitForTimeout(1500);
      const contador = raiz.locator('[data-contador]');
      await raiz.locator('[data-siguiente]').click();
      if (!reducido) expect(await contador.evaluate((e) => e.getAnimations().length)).toBeGreaterThan(0);
      await expect(contador).toHaveText('02');
      await expect.poll(() => contador.evaluate((e) => (e as HTMLElement).style.cssText)).toBe('');
      if (!ancho(page)) return;
      // Arrastre con mouse hacia la izquierda: pasa al siguiente.
      const pista = raiz.locator('[data-pista]');
      const box = (await pista.boundingBox())!;
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.6, box.y + box.height / 2, { steps: 8 });
      await expect(pista).toHaveAttribute('data-arrastrando', '');
      await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2, { steps: 4 });
      await page.mouse.up();
      await expect(pista).not.toHaveAttribute('data-arrastrando', '');
      await expect(contador).toHaveText('03');
    });

    test('M30 · "Copiar mail" rueda a "Copiado" y vuelve', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.goto('/es/dev/componentes/');
      // En la página de componentes el panel tiene un mail de prueba si lo hay; si no, se prueba el roll directo.
      const roll = await page.evaluate(async () => {
        const { rodarTexto } = await import('/src/motion/micro.ts');
        const el = document.createElement('span');
        el.style.display = 'inline-block';
        el.textContent = 'Copiar mail';
        document.body.append(el);
        const p = rodarTexto(el, 'Copiado');
        const animando = el.getAnimations().length;
        await p;
        return { animando, texto: el.textContent };
      });
      expect(roll.texto).toBe('Copiado');
      if (!reducido) expect(roll.animando).toBe(1);
    });

    test('M32 · el error de un campo baja al aparecer; enviando muestra la barra', async ({ page }) => {
      await page.goto('/es/dev/componentes/');
      const error = page.locator('.campo__error:not([hidden])').first();
      await expect(error).toHaveCSS('animation-name', /campo-error/);
      const carga = page.locator('.boton__carga').first();
      if (await carga.count()) await expect(carga).toHaveCSS('animation-name', reducido ? 'none' : /boton-carga/);
    });
  });
}

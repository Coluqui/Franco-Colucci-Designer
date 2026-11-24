import { test, expect, type Page } from '@playwright/test';

/**
 * Formulario Hablemos (Fase 7, M32). Ninguna prueba manda un mail de verdad:
 * - "éxito" completa el campo trampa: la acción lo trata como spam y responde "enviado" sin enviar;
 * - "error de envío" responde 503 desde la ruta de la acción.
 */
const ACCION = '**/_actions/contacto**';

const llenar = async (page: Page, prefijo: string, { trampa }: { trampa: boolean }) => {
  await page.fill(`#${prefijo}-nombre`, 'Ana Prueba');
  await page.fill(`#${prefijo}-email`, 'ana@ejemplo.com');
  await page.fill(`#${prefijo}-mensaje`, 'Hola, esto es una prueba.');
  await page.locator(`#${prefijo}-nombre`).evaluate((el) => ((el as HTMLInputElement).form!.elements.namedItem('t') as HTMLInputElement).value = String(Date.now() - 60_000));
  if (trampa) await page.locator(`#${prefijo}-web`).fill('spam', { force: true });
};

const abrirPanel = async (page: Page) => {
  await page.goto('/es/');
  await page.locator('[data-abre-panel]:visible').first().click();
  await expect(page.locator('[data-panel]')).toHaveAttribute('open', '');
};

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test.describe(`panel con JS (${reducedMotion})`, () => {
    test.beforeEach(({ page }) => page.emulateMedia({ reducedMotion }));

    test('errores por campo: aria-invalid, mensaje y foco en el primero', async ({ page }) => {
      await abrirPanel(page);
      await page.fill('#panel-email', 'no-es-mail');
      await page.locator('[data-panel] button[type="submit"]').click();
      await expect(page.locator('#panel-nombre')).toBeFocused();
      await expect(page.locator('#panel-nombre')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator('#panel-email')).toHaveAttribute('aria-describedby', 'panel-email-error');
      await expect(page.locator('#panel-email-error')).toHaveText(/email/i);
      await expect(page.locator('#panel-mensaje-error')).toBeVisible();
      // Al corregir, el error se va.
      await page.fill('#panel-nombre', 'Ana');
      await expect(page.locator('#panel-nombre')).not.toHaveAttribute('aria-invalid');
      await expect(page.locator('#panel-nombre-error')).toBeHidden();
    });

    test('error de envío: Reintentar + mail, sin perder lo escrito', async ({ page }) => {
      await page.route(ACCION, (r) => r.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ type: 'AstroActionError', code: 'SERVICE_UNAVAILABLE', status: 503, message: '' }) }));
      await abrirPanel(page);
      await llenar(page, 'panel', { trampa: false });
      const boton = page.locator('[data-panel] button[type="submit"]');
      await boton.click();
      await expect(page.locator('[data-panel] [data-error-envio]')).toBeVisible();
      await expect(boton).toHaveText('Reintentar');
      await expect(boton).not.toHaveAttribute('aria-busy');
      await expect(page.locator('#panel-mensaje')).toHaveValue('Hola, esto es una prueba.');
    });

    test('enviando y éxito: barra, se cierra el formulario y la confirmación recibe el foco', async ({ page }) => {
      let soltar!: () => void;
      const espera = new Promise<void>((r) => (soltar = r));
      await page.route(ACCION, async (r) => {
        await espera;
        await r.continue();
      });
      await abrirPanel(page);
      await llenar(page, 'panel', { trampa: true });
      const boton = page.locator('[data-panel] button[type="submit"]');
      await boton.click();
      await expect(boton).toHaveAttribute('aria-busy', 'true');
      await expect(boton).toHaveText('Enviando');
      // La barra recorre el botón y sale de su recorte: se comprueba que se muestre, no dónde está.
      await expect(boton.locator('.boton__carga')).toHaveCSS('display', 'block');
      // Un segundo clic mientras envía no vuelve a enviar (aria-disabled: Playwright necesita force).
      let envios = 0;
      page.on('request', (r) => r.url().includes('/_actions/contacto') && envios++);
      await boton.click({ force: true });
      soltar();
      const exito = page.locator('[data-panel] [data-exito]');
      await expect(exito).toBeVisible();
      await expect(exito).toBeFocused();
      await expect(page.locator('[data-panel] .form-hablemos__cuerpo')).toHaveJSProperty('inert', true);
      await expect(page.locator('[data-panel] .form-hablemos__cuerpo')).toHaveCSS('visibility', 'hidden');
      expect(envios).toBe(0);
    });
  });
}

test.describe('página sin JS', () => {
  test.use({ javaScriptEnabled: false });

  test('errores: vuelve con lo escrito, los mensajes y el foco en el primero', async ({ page }) => {
    await page.goto('/es/hablemos/');
    const form = page.locator('main [data-form-hablemos]');
    await form.locator('#pagina-email').fill('no-es-mail');
    await form.locator('#pagina-mensaje').fill('Mi mensaje');
    await form.locator('button[type="submit"]').click();
    await expect(page.locator('#pagina-nombre')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#pagina-nombre')).toBeFocused();
    await expect(page.locator('#pagina-email')).toHaveValue('no-es-mail');
    await expect(page.locator('#pagina-email-error')).toBeVisible();
    await expect(page.locator('#pagina-mensaje')).toHaveValue('Mi mensaje');
    await expect(page.locator('#pagina-mensaje')).not.toHaveAttribute('aria-invalid');
    await expect(page).toHaveTitle(/^Error: /);
  });

  test('demasiado rápido: error que se puede reintentar, y al reintentar cuenta desde el primer envío', async ({ page }) => {
    await page.goto('/es/hablemos/');
    await page.fill('#pagina-nombre', 'Ana');
    await page.fill('#pagina-email', 'ana@ejemplo.com');
    await page.fill('#pagina-mensaje', 'Hola');
    await page.locator('main button[type="submit"]').click();
    await expect(page.locator('main [data-error-envio]')).toBeVisible();
    await expect(page.locator('main [data-error-envio]')).toBeFocused();
    await expect(page.locator('#pagina-mensaje')).toHaveValue('Hola');
    // El momento del primer envío vuelve en la página (no el de este redibujo).
    const t = Number(await page.locator('main input[name="t"]').inputValue());
    expect(Date.now() - t).toBeGreaterThan(0);
    expect(await page.locator('main input[name="t"]').inputValue()).not.toBe('');
  });

  test('éxito (camino del anti-spam: no manda nada)', async ({ page }) => {
    await page.goto('/en/hablemos/');
    await page.fill('#pagina-nombre', 'Ana');
    await page.fill('#pagina-email', 'ana@ejemplo.com');
    await page.fill('#pagina-mensaje', 'Hola');
    await page.locator('#pagina-web').fill('spam', { force: true });
    await page.locator('main button[type="submit"]').click();
    await expect(page).toHaveTitle(/^Sent: /);
    await expect(page.locator('main [data-exito]')).toBeFocused();
    await expect(page.locator('main [data-exito]')).toBeVisible();
    await expect(page.locator('main [data-exito]')).toContainText('Thanks');
    // POST → redirect → GET: recargar no vuelve a enviar.
    expect(new URL(page.url()).search).toBe('?enviado');
    let envios = 0;
    page.on('request', (r) => r.method() === 'POST' && envios++);
    await page.reload();
    await expect(page.locator('main [data-exito]')).toBeVisible();
    expect(envios).toBe(0);
  });

  test('largo máximo: avisa que es largo (no que falta) y no devuelve más de lo permitido', async ({ page }) => {
    await page.goto('/es/hablemos/');
    await page.fill('#pagina-nombre', 'Ana');
    await page.fill('#pagina-email', 'ana@ejemplo.com');
    await page.fill('#pagina-mensaje', 'x'.repeat(5001));
    await page.locator('main button[type="submit"]').click();
    await expect(page.locator('#pagina-mensaje-error')).toContainText('demasiado largo');
    expect((await page.locator('#pagina-mensaje').inputValue()).length).toBe(5001);
  });

  test('idioma inválido: 404', async ({ page }) => {
    const r = await page.goto('/xx/hablemos/');
    expect(r?.status()).toBe(404);
  });
});

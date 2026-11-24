import { test, expect } from '@playwright/test';

/** SEO (Fase 8, PRD §11). No depende del ancho ni del modo: corre en un solo proyecto. */
test.beforeEach(({}, info) => test.skip(info.project.name !== '1440-light'));

const PAGINAS = ['', 'trabajos/', 'sobre-mi/', 'hablemos/'];

for (const lang of ['es', 'en'])
  for (const ruta of PAGINAS)
    test(`/${lang}/${ruta}: title, description, canonical, hreflang y Open Graph`, async ({ page }) => {
      await page.goto(`/${lang}/${ruta}`);
      const head = page.locator('head');
      await expect(page).toHaveTitle(/Franco Colucci/);
      expect(await head.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
      const canonica = await head.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonica).toMatch(new RegExp(`^https?://[^/]+/${lang}/${ruta}$`));
      expect(await head.locator('meta[property="og:url"]').getAttribute('content')).toBe(canonica);
      for (const l of ['es', 'en', 'x-default'])
        expect(await head.locator(`link[rel="alternate"][hreflang="${l}"]`).getAttribute('href')).toMatch(/^https?:\/\//);
      // Fuera de producción con INDEXAR, nada se indexa.
      await expect(head.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    });

test('sitemap: cada página en los dos idiomas, con sus pares', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
  for (const lang of ['es', 'en']) for (const ruta of PAGINAS) expect(locs).toContain(`/${lang}/${ruta}`);
  expect(locs.some((l) => l.includes('/dev/') || l.includes('404'))).toBe(false);
  expect(locs.filter((l) => /\/trabajos\/[^/]+\/$/.test(l)).length).toBeGreaterThan(0);
  // Todas las URLs del sitemap responden.
  for (const l of locs) expect((await request.get(l)).status(), l).toBe(200);
});

test('robots.txt: cerrado fuera de producción', async ({ request }) => {
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /');
});

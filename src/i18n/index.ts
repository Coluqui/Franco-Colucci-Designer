import es from './es.json';
import en from './en.json';

export const locales = ['es', 'en'] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = 'es';

/** Los dos diccionarios tienen que tener las mismas claves: en.json se tipa contra es.json. */
type Dict = typeof es;
const dictionaries: Record<Lang, Dict> = { es, en: en satisfies Dict };

type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];

/** Clave de texto de interfaz, p. ej. "meta.siteTitle". */
export type UiKey = Leaves<Dict>;

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Devuelve el texto de interfaz para un idioma. Ningún string visible va fijo en un componente. */
export function t(lang: Lang, key: UiKey): string {
  let node: unknown = dictionaries[lang];
  for (const part of key.split('.')) {
    node = (node as Record<string, unknown>)[part];
  }
  if (typeof node !== 'string') throw new Error(`i18n: falta la clave "${key}" en ${lang}`);
  return node;
}

/** Igual que t(), con variables: tf('es', 'tile.slides', { n: 7 }) → "7 slides". */
export function tf(lang: Lang, key: UiKey, vars: Record<string, string | number>): string {
  return t(lang, key).replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`));
}

/** Número con dos dígitos, para contadores tipo "03 / 12". */
export const dosDigitos = (n: number) => String(n).padStart(2, '0');

/** Idioma a partir de la URL (/es/…, /en/…). */
export function langFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return isLang(first) ? first : defaultLang;
}

/** Misma ruta en otro idioma: /es/trabajos/ → /en/trabajos/. Mantiene query y hash. */
export function switchLangPath(url: URL, target: Lang): string {
  const parts = url.pathname.split('/');
  if (isLang(parts[1])) parts[1] = target;
  else parts.splice(1, 0, target);
  return parts.join('/') + url.search + url.hash;
}

/** Ruta localizada: localizePath('en', 'trabajos/') → /en/trabajos/ */
export function localizePath(lang: Lang, path = ''): string {
  return `/${lang}/${path.replace(/^\/+/, '')}`;
}

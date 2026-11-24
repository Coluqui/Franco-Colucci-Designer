/**
 * Formulario Hablemos · PRD §11 ("envío confiable y sin spam") y §12 (Resend + anti-spam propio).
 * Una sola acción para el panel (con JS) y para /[lang]/hablemos/ (sin JS).
 * Los mensajes de validación son claves de i18n (`form.required`, `form.invalidEmail`): los traduce
 * quien muestra el error.
 */
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { RESEND_API_KEY, CONTACTO_DESTINO, CONTACTO_REMITENTE } from 'astro:env/server';

/** Una persona tarda más que esto en completar nombre, mail y mensaje; un bot, no. */
export const MIN_LLENADO_MS = 3000;

/** Largos máximos por campo (también recortan lo que vuelve a la página sin JS). */
export const LARGO_MAX = { nombre: 200, email: 320, mensaje: 5000 } as const;

// Un campo vacío llega como null (no como ''): también es "required".
const requerido = (max: number) => z.string('required').trim().min(1, 'required').max(max, 'tooLong');

export const server = {
  contacto: defineAction({
    accept: 'form',
    input: z.object({
      nombre: requerido(LARGO_MAX.nombre),
      email: requerido(LARGO_MAX.email).pipe(z.email('invalidEmail')),
      mensaje: requerido(LARGO_MAX.mensaje),
      /** Campo trampa: invisible para personas; un bot lo completa. */
      web: z.string().optional(),
      /** Momento en que se mostró el formulario (ms). Texto: si no es un número, cuenta como "demasiado rápido" (error visible). */
      t: z.string().optional(),
    }),
    handler: async ({ nombre, email, mensaje, web, t }) => {
      // Campo trampa: se responde "enviado" para no darle pistas al bot, pero no se manda nada.
      if (web) return { enviado: true };
      // Demasiado rápido (o sin momento): error que se puede reintentar. Una persona muy rápida no
      // pierde el mensaje creyendo que salió; al reintentar ya pasaron los 3 s.
      // Un `t` en el futuro es el reloj del visitante adelantado: no se traba el reintento.
      const transcurrido = Date.now() - Number(t);
      if (!t || Number.isNaN(transcurrido) || (transcurrido >= 0 && transcurrido < MIN_LLENADO_MS)) {
        throw new ActionError({ code: 'TOO_MANY_REQUESTS' });
      }

      if (!RESEND_API_KEY || !CONTACTO_DESTINO) {
        console.error('[contacto] Faltan RESEND_API_KEY o CONTACTO_DESTINO (ver .env.example).');
        throw new ActionError({ code: 'SERVICE_UNAVAILABLE' });
      }

      const respuesta = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: CONTACTO_REMITENTE,
          to: [CONTACTO_DESTINO],
          reply_to: email,
          subject: `Portfolio · ${nombre.replace(/\s+/g, ' ')}`,
          text: `${nombre} <${email}>\n\n${mensaje}`,
        }),
        signal: AbortSignal.timeout(10_000),
      }).catch(() => null);

      if (!respuesta?.ok) {
        console.error('[contacto] Resend respondió', respuesta?.status, await respuesta?.text().catch(() => ''));
        throw new ActionError({ code: 'BAD_GATEWAY' });
      }
      return { enviado: true };
    },
  }),
};

// Reparto de anuncios por MENSAJE PRIVADO a los miembros de un rol.
//
// Va aparte del endpoint de interacciones porque Discord exige respuesta en 3
// segundos y esto tarda minutos: el comando contesta "Enviando..." y llama
// aquí, que trabaja por tandas y al final deja el informe en ese mismo aviso.
//
// Solo se llama a sí mismo y desde el endpoint de interacciones: lleva un
// secreto en la cabecera (el token del bot, que solo conoce el servidor).
import { after } from "next/server";
import {
  DISCORD_BOT_TOKEN,
  buildMessage,
  sendDirectMessage,
  editInteractionResponse,
  esperar,
  PAUSA_ENTRE_PRIVADOS_MS,
  type AnnouncementFields,
} from "@/lib/discord-bot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Vercel corta las funciones al minuto: por eso el trabajo va por tandas.
export const maxDuration = 60;

// Margen para cerrar la tanda y encadenar la siguiente antes del corte.
const LIMITE_TANDA_MS = 40_000;

export type TrabajoPrivados = {
  fields: AnnouncementFields;
  pendientes: string[];
  enviados: number;
  fallidos: number;
  total: number; // cuántos tiene el rol en realidad
  rolNombre: string;
  interactionToken: string;
};

function informe(t: {
  enviados: number;
  fallidos: number;
  total: number;
  rolNombre: string;
  pendientes: number;
}): string {
  const lineas = [
    `**Reparto terminado** · rol ${t.rolNombre}`,
    `Recibido por **${t.enviados}** ${t.enviados === 1 ? "persona" : "personas"}.`,
  ];
  if (t.fallidos > 0) {
    lineas.push(
      `No le llegó a **${t.fallidos}**: tienen los mensajes privados cerrados. Eso no se puede forzar desde el bot.`
    );
  }
  if (t.pendientes > 0) {
    lineas.push(`Quedaron **${t.pendientes}** sin enviar porque se agotó el tiempo.`);
  }
  const alcanzados = t.enviados + t.fallidos;
  if (t.total > alcanzados) {
    lineas.push(
      `Aviso: el rol tiene **${t.total}** personas y el tope de seguridad es de ${alcanzados}. El resto no recibió nada.`
    );
  }
  return lineas.join("\n");
}

export async function POST(req: Request) {
  // Solo el propio servidor puede pedir esto.
  if (req.headers.get("x-imp-secreto") !== DISCORD_BOT_TOKEN) {
    return new Response(JSON.stringify({ error: "No autorizado." }), { status: 401 });
  }

  let trabajo: TrabajoPrivados;
  try {
    trabajo = (await req.json()) as TrabajoPrivados;
  } catch {
    return new Response(JSON.stringify({ error: "Petición inválida." }), { status: 400 });
  }

  const origin = new URL(req.url).origin;

  // Se responde ya y el reparto sigue por detrás: quien llama no espera.
  after(async () => {
    const arranque = Date.now();
    const mensaje = buildMessage(trabajo.fields); // en privado no se menciona a nadie
    const pendientes = [...trabajo.pendientes];
    let enviados = trabajo.enviados;
    let fallidos = trabajo.fallidos;

    while (pendientes.length > 0 && Date.now() - arranque < LIMITE_TANDA_MS) {
      const userId = pendientes.shift();
      if (!userId) break;
      const ok = await sendDirectMessage(userId, mensaje);
      if (ok) enviados++;
      else fallidos++;
      await esperar(PAUSA_ENTRE_PRIVADOS_MS);
    }

    // ¿Queda gente? Se encadena otra tanda con lo que falta.
    if (pendientes.length > 0) {
      await editInteractionResponse(
        trabajo.interactionToken,
        `Enviando privados… **${enviados}** entregados, quedan **${pendientes.length}**.`
      );
      await fetch(`${origin}/api/discord/enviar-privados`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-imp-secreto": DISCORD_BOT_TOKEN },
        body: JSON.stringify({ ...trabajo, pendientes, enviados, fallidos }),
      });
      return;
    }

    await editInteractionResponse(
      trabajo.interactionToken,
      informe({
        enviados,
        fallidos,
        total: trabajo.total,
        rolNombre: trabajo.rolNombre,
        pendientes: 0,
      })
    );
  });

  return new Response(JSON.stringify({ aceptado: true }), {
    status: 202,
    headers: { "Content-Type": "application/json" },
  });
}

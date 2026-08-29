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
  botonApuntarse,
  sendDirectMessage,
  editInteractionResponse,
  sendPlainDirectMessage,
  esperar,
  PAUSA_ENTRE_PRIVADOS_MS,
  type AnnouncementFields,
} from "@/lib/discord-bot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Vercel corta las funciones al minuto: por eso el trabajo va por tandas.
export const maxDuration = 60;

// Vercel mata la funcion al minuto. La tanda se corta MUY antes para que
// siempre queden segundos de sobra con los que encadenar la siguiente: con
// tandas de 50s el reparto moria justo al ir a pasar el relevo.
const LIMITE_TANDA_MS = 25_000;

// Cuanto puede tardar un envio en el peor caso (con reintento por frenazo).
// Si no cabe otro dentro de la tanda, se cierra y se pasa el relevo ya.
const MARGEN_POR_ENVIO_MS = 3_000;

// Pasa el relevo a la siguiente tanda. Se reintenta: si esta llamada se pierde,
// el reparto se queda a medias y no hay quien lo retome.
async function pasarRelevo(origin: string, cuerpo: unknown): Promise<boolean> {
  for (let intento = 1; intento <= 3; intento++) {
    try {
      const res = await fetch(`${origin}/api/discord/enviar-privados`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-imp-secreto": DISCORD_BOT_TOKEN },
        body: JSON.stringify(cuerpo),
      });
      if (res.ok) return true;
      console.error(`[privados] relevo rechazado (${res.status}), intento ${intento}`);
    } catch (err) {
      console.error(`[privados] relevo fallido, intento ${intento}:`, err);
    }
    await esperar(500 * intento);
  }
  return false;
}

export type TrabajoPrivados = {
  fields: AnnouncementFields;
  // Rol que reparte el botón "Me apunto" dentro del privado (opcional).
  botonRol?: string;
  guildId?: string;
  // Quién lanzó el reparto: recibe el informe por privado al terminar.
  autorId?: string;
  pendientes: string[];
  enviados: number;
  fallidos: number;
  errores: number;
  total: number; // cuántos tiene el rol en realidad
  rolNombre: string;
  interactionToken: string;
};

function informe(t: {
  enviados: number;
  fallidos: number;
  errores: number;
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
  if (t.errores > 0) {
    lineas.push(`Fallaron **${t.errores}** por otros motivos (quedan en los registros del servidor).`);
  }
  if (t.pendientes > 0) {
    lineas.push(`Quedaron **${t.pendientes}** sin enviar porque se agotó el tiempo.`);
  }
  const alcanzados = t.enviados + t.fallidos + t.errores;
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
    // El botón sí viaja: sirve para que quien lo lea se apunte desde ahí mismo.
    if (trabajo.botonRol && trabajo.guildId) {
      mensaje.components = [botonApuntarse(trabajo.botonRol, trabajo.guildId)];
    }
    const pendientes = [...trabajo.pendientes];
    let enviados = trabajo.enviados;
    let fallidos = trabajo.fallidos;
    let errores = trabajo.errores ?? 0;

    // Se para cuando ya no cabe otro envio entero dentro de la tanda.
    while (
      pendientes.length > 0 &&
      Date.now() - arranque < LIMITE_TANDA_MS - MARGEN_POR_ENVIO_MS
    ) {
      const userId = pendientes.shift();
      if (!userId) break;
      const resultado = await sendDirectMessage(userId, mensaje);
      if (resultado === "entregado") enviados++;
      else if (resultado === "cerrado") fallidos++;
      else errores++;
      await esperar(PAUSA_ENTRE_PRIVADOS_MS);
    }

    console.log(
      `[privados] tanda cerrada: ${enviados} entregados, ${fallidos} cerrados, ` +
        `${errores} errores, ${pendientes.length} pendientes`
    );

    // ¿Queda gente? Se encadena otra tanda con lo que falta.
    if (pendientes.length > 0) {
      await editInteractionResponse(
        trabajo.interactionToken,
        `Enviando privados… **${enviados}** entregados, quedan **${pendientes.length}**.`
      );

      const relevo = await pasarRelevo(origin, {
        ...trabajo,
        pendientes,
        enviados,
        fallidos,
        errores,
      });
      if (relevo) return;

      // Nadie recogio el relevo: mejor decirlo que dejar el aviso congelado.
      const aviso =
        `**Reparto interrumpido** · rol ${trabajo.rolNombre}\n` +
        `Llegó a **${enviados}** ${enviados === 1 ? "persona" : "personas"} y se cortó ` +
        `con **${pendientes.length}** por enviar. Vuelve a lanzarlo para los que faltan.`;
      await editInteractionResponse(trabajo.interactionToken, aviso);
      if (trabajo.autorId) await sendPlainDirectMessage(trabajo.autorId, aviso);
      return;
    }

    const texto = informe({
      enviados,
      fallidos,
      errores,
      total: trabajo.total,
      rolNombre: trabajo.rolNombre,
      pendientes: 0,
    });

    await editInteractionResponse(trabajo.interactionToken, texto);

    // Un reparto grande puede durar más de los 15 minutos que vive el aviso
    // original. Por eso el informe se manda también por privado a quien lo
    // lanzó: así no se pierde aunque el aviso ya no se pueda tocar.
    if (trabajo.autorId) await sendPlainDirectMessage(trabajo.autorId, texto);
  });

  return new Response(JSON.stringify({ aceptado: true }), {
    status: 202,
    headers: { "Content-Type": "application/json" },
  });
}

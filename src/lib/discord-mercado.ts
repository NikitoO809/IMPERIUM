// El mercado de Aion 2.
//
// Nadie escribe a mano en el canal: la gente rellena un formulario con /vendo
// o /compro y el bot publica un tema en el foro del mercado. Así todas las
// ofertas tienen la misma pinta, se filtran por etiqueta, y se cierran solas.
//
// Igual que el resto del bot, NO hay base de datos. El estado de una oferta
// vive en su propio tema: abierta, cerrada o caducada son etiquetas del foro.
//
// Lo que se comercia es SOLO cosa del juego (kinah, objetos, servicios). El
// dinero real está prohibido: es baneo de NCSoft para quien lo hace y un
// problema para el servidor. Eso lo dice la guía del canal y el pie de cada
// oferta.
import { after } from "next/server";
import {
  discordFetch,
  editInteractionResponse,
  esStaff,
  postMessage,
  sendDirectMessage,
  EPHEMERAL,
  InteractionResponseType,
  type DiscordActionRow,
  type DiscordEmbed,
} from "@/lib/discord-bot";

// ── Ajustes ──────────────────────────────────────────────────────

// Id del foro donde se publica todo. Sale de scripts/crear-foro-mercado.mjs.
const FORO = (process.env.DISCORD_FORO_MERCADO ?? "").trim();
// Canal privado donde caen los avisos del botón "Reportar" (opcional).
const CANAL_REPORTES = (process.env.DISCORD_CANAL_REPORTES ?? "").trim();
// Hace falta para que la tarea de caducidad pueda listar los temas abiertos.
export const GUILD_ID = (process.env.DISCORD_GUILD_ID ?? "").trim();

export const MERCADO_CONFIGURADO = Boolean(FORO);

// Horas que aguanta una oferta antes de cerrarse sola. Un mercado se mueve
// rápido: lo que sigue publicado mañana casi nunca sigue en pie de verdad.
export const HORAS_VIGENCIA = 24;
// Días que hay que llevar en el servidor para poder publicar. Es la barrera
// contra la cuenta recién creada que entra solo a estafar.
const DIAS_ANTIGUEDAD = 7;

const COLOR_VENDO = 0x3ba55d; // verde
const COLOR_COMPRO = 0x5865f2; // azul
const COLOR_CERRADA = 0x4f545c; // gris

// Nombres de las etiquetas del foro. Tienen que coincidir, letra por letra,
// con las que crea scripts/crear-foro-mercado.mjs.
const TAG_VENDO = "Vendo";
const TAG_COMPRO = "Compro";
export const TAG_CERRADA = "Cerrada";
export const TAG_CADUCADA = "Caducada";

// Los ids de las etiquetas, fijados a mano. Buscarlas por su nombre funciona,
// pero se rompe en silencio: basta con que alguien le quite un acento a una
// etiqueta desde Discord para que el mercado empiece a publicar sin etiquetar,
// sin dar ningún error. Con los ids puestos aquí eso ya no puede pasar.
// Formato: "Vendo=123,Compro=456,Cerrada=789". Los saca `npm run discord:tags`.
const TAGS_FIJADAS = (process.env.DISCORD_MERCADO_TAGS ?? "").trim();

export type TipoOferta = "vendo" | "compro";

// Categorías que se eligen en el propio comando (Discord las enseña como
// desplegable). El valor viaja hasta el formulario dentro del custom_id.
export const CATEGORIAS = [
  { value: "equipo", name: "Equipo" },
  { value: "materiales", name: "Materiales" },
  { value: "consumibles", name: "Consumibles" },
  { value: "servicios", name: "Servicios (carry, crafteo...)" },
  { value: "otros", name: "Otros" },
] as const;

const NOMBRE_CATEGORIA: Record<string, string> = {
  equipo: "Equipo",
  materiales: "Materiales",
  consumibles: "Consumibles",
  servicios: "Servicios",
  otros: "Otros",
};

// ── El formulario ────────────────────────────────────────────────

export type OfertaFields = {
  item: string;
  cantidad: string;
  precio: string;
  nick: string;
  notas: string;
};

const VACIA: OfertaFields = { item: "", cantidad: "", precio: "", nick: "", notas: "" };

type Campo = {
  id: keyof OfertaFields;
  label: string;
  placeholder: string;
  required?: boolean;
  long?: boolean;
  maxLength: number;
};

function campos(tipo: TipoOferta): Campo[] {
  const vende = tipo === "vendo";
  return [
    {
      id: "item",
      label: vende ? "Qué vendes" : "Qué buscas",
      placeholder: "Espada de fuego +5",
      required: true,
      maxLength: 90,
    },
    { id: "cantidad", label: "Cantidad (opcional)", placeholder: "1", maxLength: 30 },
    {
      id: "precio",
      label: vende ? "Precio en kinah" : "Cuánto pagas",
      placeholder: "3.000.000 kinah, o «cambio por manastones»",
      required: true,
      maxLength: 90,
    },
    { id: "nick", label: "Tu nick en el juego", placeholder: "Nikito", required: true, maxLength: 40 },
    {
      id: "notas",
      label: "Detalles (opcional)",
      placeholder: "Cuándo te conectas, si admites cambio, lo que sea.",
      long: true,
      maxLength: 700,
    },
  ];
}

// ── Respuestas cortas ────────────────────────────────────────────

function json(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// Mensaje que solo ve quien pulsó o escribió el comando.
function aviso(content: string) {
  return json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content, flags: EPHEMERAL },
  });
}

// ── Cómo queda una oferta publicada ──────────────────────────────

function limpio(texto: string, max: number): string {
  // Nada de menciones escritas a mano dentro de la ficha: el bot no las
  // convierte en aviso, pero engañan a quien las lee. Se parten con un espacio
  // de ancho cero, que no se ve pero rompe la mención.
  return texto.trim().replace(/@(everyone|here)/g, "@​$1").slice(0, max);
}

export function embedOferta(
  tipo: TipoOferta,
  categoria: string,
  fields: OfertaFields,
  autorId: string
): DiscordEmbed {
  const vende = tipo === "vendo";
  const embed: DiscordEmbed = {
    title: `${vende ? "💰" : "🔎"} ${limpio(fields.item, 200)}`,
    color: vende ? COLOR_VENDO : COLOR_COMPRO,
    fields: [
      { name: vende ? "Precio" : "Paga", value: limpio(fields.precio, 200) || "—", inline: true },
      { name: "Cantidad", value: limpio(fields.cantidad, 60) || "1", inline: true },
      { name: "Categoría", value: NOMBRE_CATEGORIA[categoria] ?? "Otros", inline: true },
      { name: "Nick en el juego", value: limpio(fields.nick, 60) || "—", inline: true },
      { name: vende ? "Vende" : "Busca", value: `<@${autorId}>`, inline: true },
    ],
    footer: {
      text: `Se cierra sola en ${HORAS_VIGENCIA} horas · Solo trato dentro del juego: nada de dinero real`,
    },
  };
  const notas = limpio(fields.notas, 900);
  if (notas) embed.description = notas;
  return embed;
}

// Los tres botones de una oferta abierta. El autor viaja en el custom_id: es
// lo único que Discord nos devuelve al pulsar, y sirve para saber quién puede
// cerrarla y a quién avisar.
export function botonesOferta(autorId: string): DiscordActionRow {
  return {
    type: 1,
    components: [
      {
        type: 2,
        style: 1,
        label: "Contactar",
        custom_id: `mercado:contactar:${autorId}`,
        emoji: { name: "💬" },
      },
      {
        type: 2,
        style: 2,
        label: "Ya está cerrada",
        custom_id: `mercado:cerrar:${autorId}`,
        emoji: { name: "✅" },
      },
      {
        type: 2,
        style: 4,
        label: "Reportar",
        custom_id: `mercado:reportar:${autorId}`,
        emoji: { name: "⚠️" },
      },
    ],
  };
}

// El único botón que le queda a una oferta cerrada. Sirve para no tener que
// rellenar el formulario entero otra vez cuando lo que vendes sigue en pie:
// los datos se sacan de la propia ficha y el formulario se abre relleno.
export function botonRepublicar(autorId: string): DiscordActionRow {
  return {
    type: 1,
    components: [
      {
        type: 2,
        style: 1,
        label: "Publicar de nuevo",
        custom_id: `mercado:republicar:${autorId}`,
        emoji: { name: "🔄" },
      },
    ],
  };
}

// Quién publicó una oferta, leyendo su propia ficha. El id viaja dentro del
// campo "Vende"/"Busca" como mención, que es lo que se pinta al publicarla.
function autorDelEmbed(embed: DiscordEmbed | undefined): string {
  const campo = embed?.fields?.find((f) => f.name === "Vende" || f.name === "Busca");
  return campo?.value?.match(/<@!?(\d+)>/)?.[1] ?? "";
}

// Reconstruye lo que se escribió en el formulario a partir de la ficha
// publicada. Sin base de datos, la ficha ES el registro de la oferta.
export function ofertaDelEmbed(
  embed: DiscordEmbed | undefined
): { tipo: TipoOferta; categoria: string; fields: OfertaFields } | null {
  if (!embed) return null;
  const campo = (nombre: string) => embed.fields?.find((f) => f.name === nombre)?.value ?? "";

  // El tipo se deduce del nombre del campo del dinero: al publicar, una oferta
  // de venta pone "Precio" y una de compra pone "Paga".
  const precio = campo("Precio");
  const paga = campo("Paga");
  if (!precio && !paga) return null;
  const tipo: TipoOferta = precio ? "vendo" : "compro";

  // De vuelta al valor interno: en la ficha está el nombre bonito.
  const nombreCat = campo("Categoría");
  const categoria =
    Object.keys(NOMBRE_CATEGORIA).find((k) => NOMBRE_CATEGORIA[k] === nombreCat) ?? "otros";

  // Al cerrarla, el título se quedó como "✅ Espada de fuego — CERRADA". Se
  // quita solo el emoji de estado, no todo lo que no sea letra: en Aion los
  // objetos se llaman "+5 Espada" y ese "+" es parte del nombre.
  const item = (embed.title ?? "")
    .replace(/^(?:💰|🔎|✅|🕓)\s*/u, "")
    .replace(/\s+—\s+(CERRADA|CADUCADA)\s*$/, "")
    .trim();

  return {
    tipo,
    categoria,
    fields: {
      item,
      cantidad: campo("Cantidad") === "1" ? "" : campo("Cantidad"),
      precio: precio || paga,
      nick: campo("Nick en el juego").replace(/^—$/, ""),
      notas: embed.description ?? "",
    },
  };
}

// Deja el embed en gris y con el motivo escrito, para el que llegue tarde.
export function embedCerrado(embed: DiscordEmbed, motivo: string): DiscordEmbed {
  const caducada = motivo === TAG_CADUCADA;
  const titulo = (embed.title ?? "Oferta").replace(/^(💰|🔎)\s*/, "");
  return {
    ...embed,
    title: `${caducada ? "🕓" : "✅"} ${titulo} — ${caducada ? "CADUCADA" : "CERRADA"}`,
    color: COLOR_CERRADA,
    footer: {
      text: caducada
        ? `Caducada: pasaron ${HORAS_VIGENCIA} horas y nadie la cerró.`
        : "Cerrada por quien la publicó.",
    },
  };
}

// ── Etiquetas del foro ───────────────────────────────────────────

let cacheTags: { at: number; tags: Record<string, string> } | null = null;

// Lo que diga DISCORD_MERCADO_TAGS. Se lee cada vez: son cuatro pares y así
// no hay que reiniciar nada al cambiarlo.
function tagsFijadas(): Record<string, string> {
  const tags: Record<string, string> = {};
  for (const par of TAGS_FIJADAS.split(",")) {
    const [nombre, id] = par.split("=").map((t) => t.trim());
    if (nombre && id && /^\d+$/.test(id)) tags[nombre.toLowerCase()] = id;
  }
  return tags;
}

// Los ids de las etiquetas hay que preguntárselos al foro. Se guardan diez
// minutos para no preguntar en cada oferta. Las fijadas a mano pisan a las que
// vengan del foro: son las que no se rompen si alguien renombra una.
async function tagsDelForo(): Promise<Record<string, string>> {
  if (cacheTags && Date.now() - cacheTags.at < 10 * 60_000) return cacheTags.tags;
  const fijadas = tagsFijadas();
  const res = await discordFetch(`/channels/${FORO}`, "GET", undefined);
  // Si Discord no contesta, al menos quedan las fijadas.
  if (!res.ok) return fijadas;
  const canal = (await res.json()) as { available_tags?: { id: string; name: string }[] };
  const tags: Record<string, string> = {};
  for (const t of canal.available_tags ?? []) tags[t.name.toLowerCase()] = t.id;
  const todas = { ...tags, ...fijadas };
  cacheTags = { at: Date.now(), tags: todas };
  return todas;
}

async function idsDeTags(nombres: string[]): Promise<string[]> {
  const tags = await tagsDelForo();
  const faltan = nombres.filter((n) => !tags[n.toLowerCase()]);
  if (faltan.length) {
    // Antes esto pasaba desapercibido y la oferta salía sin etiquetar.
    console.error(
      `[mercado] etiquetas que no existen en el foro: ${faltan.join(", ")}. ` +
        "Alguien las ha renombrado o borrado; ponlas en DISCORD_MERCADO_TAGS."
    );
  }
  return nombres.map((n) => tags[n.toLowerCase()]).filter(Boolean);
}

// ── Publicar y cerrar ────────────────────────────────────────────

type Resultado = { ok: true; id: string } | { ok: false; error: string };

export async function publicarOferta(
  tipo: TipoOferta,
  categoria: string,
  fields: OfertaFields,
  autorId: string
): Promise<Resultado> {
  const etiquetas = await idsDeTags([
    tipo === "vendo" ? TAG_VENDO : TAG_COMPRO,
    NOMBRE_CATEGORIA[categoria] ?? "Otros",
  ]);

  const titulo = `[${tipo === "vendo" ? "Vendo" : "Compro"}] ${limpio(fields.item, 80)}`;
  const res = await discordFetch(`/channels/${FORO}/threads`, "POST", {
    name: titulo,
    auto_archive_duration: 1440, // un dia sin actividad y Discord lo archiva
    applied_tags: etiquetas,
    message: {
      embeds: [embedOferta(tipo, categoria, fields, autorId)],
      components: [botonesOferta(autorId)],
      allowed_mentions: { parse: [] },
    },
  });
  if (!res.ok) return { ok: false, error: `${res.status} ${await res.text()}` };
  const hilo = (await res.json()) as { id?: string };
  return hilo.id ? { ok: true, id: hilo.id } : { ok: false, error: "Discord no devolvió el tema." };
}

// Cierra una oferta: tacha la ficha, le quita los botones, le pone la etiqueta
// y archiva el tema. El orden importa: primero el mensaje, porque un tema
// bloqueado ya no se puede editar.
export async function cerrarOferta(
  threadId: string,
  embed: DiscordEmbed | undefined,
  motivo: string
): Promise<{ ok: boolean; error?: string }> {
  // Si Discord ya lo archivó por su cuenta (una semana sin respuestas), hay
  // que sacarlo del archivo: dentro de un tema archivado no se puede editar.
  await discordFetch(`/channels/${threadId}`, "PATCH", { archived: false });

  // En un tema de foro, el mensaje de cabecera tiene el mismo id que el tema.
  let cabecera = embed;
  if (!cabecera) {
    const res = await discordFetch(`/channels/${threadId}/messages/${threadId}`, "GET", undefined);
    if (res.ok) {
      const msg = (await res.json()) as { embeds?: DiscordEmbed[] };
      cabecera = msg.embeds?.[0];
    }
  }

  if (cabecera) {
    // Se van los botones de la oferta viva y queda solo el de republicar, para
    // quien siga vendiendo lo mismo al día siguiente. Si no se sabe quién la
    // publicó, mejor ninguno que uno que no va a funcionar.
    const autor = autorDelEmbed(cabecera);
    await discordFetch(`/channels/${threadId}/messages/${threadId}`, "PATCH", {
      embeds: [embedCerrado(cabecera, motivo)],
      components: autor ? [botonRepublicar(autor)] : [],
    });
  }

  // `applied_tags` sustituye a las que hubiera, así que hay que conservarlas.
  // Discord admite cinco por tema como mucho.
  const actual = await discordFetch(`/channels/${threadId}`, "GET", undefined);
  let etiquetas: string[] = [];
  if (actual.ok) {
    const hilo = (await actual.json()) as { applied_tags?: string[] };
    etiquetas = hilo.applied_tags ?? [];
  }
  const [idMotivo] = await idsDeTags([motivo]);
  if (idMotivo && !etiquetas.includes(idMotivo)) etiquetas = [...etiquetas.slice(0, 4), idMotivo];

  const res = await discordFetch(`/channels/${threadId}`, "PATCH", {
    applied_tags: etiquetas,
    archived: true,
    locked: true,
  });
  return res.ok ? { ok: true } : { ok: false, error: `${res.status} ${await res.text()}` };
}

// ── Quién puede publicar ─────────────────────────────────────────

// El rol lo controla Discord (Ajustes → Integraciones); aquí solo se mira la
// antigüedad, que Discord no sabe filtrar.
function llevaPocoTiempo(joinedAt: string | undefined): boolean {
  if (!joinedAt) return false; // si no lo sabemos, no se bloquea a nadie
  const dias = (Date.now() - new Date(joinedAt).getTime()) / 86_400_000;
  return Number.isFinite(dias) && dias < DIAS_ANTIGUEDAD;
}

// ── La puerta: qué hacer con cada interacción del mercado ────────

type Fila = { components?: { custom_id?: string; value?: string }[] };

export type MercadoInteraction = {
  guild_id?: string;
  channel_id?: string;
  // Vale 15 minutos para cambiar la respuesta cuando el trabajo tarda.
  token?: string;
  member?: { user?: { id?: string }; joined_at?: string; permissions?: string };
  user?: { id?: string };
  message?: { id?: string; embeds?: DiscordEmbed[] };
  data?: {
    name?: string;
    custom_id?: string;
    options?: { name?: string; value?: string }[];
    components?: Fila[];
  };
};

function quien(i: MercadoInteraction): string {
  return i.member?.user?.id ?? i.user?.id ?? "";
}

function leerFormulario(filas: Fila[] | undefined): OfertaFields {
  const values = { ...VACIA };
  for (const fila of filas ?? []) {
    for (const input of fila.components ?? []) {
      const id = input.custom_id as keyof OfertaFields | undefined;
      if (id && id in values) values[id] = input.value ?? "";
    }
  }
  return values;
}

// El formulario que se abre dentro de Discord. Con `previos` sale relleno:
// es lo que hace que republicar una oferta sea un clic y no volver a
// escribirlo todo.
function formulario(tipo: TipoOferta, categoria: string, previos?: OfertaFields) {
  return json({
    type: InteractionResponseType.MODAL,
    data: {
      custom_id: `mercado:nueva:${tipo}:${categoria}`,
      title: previos
        ? "Publicar de nuevo"
        : tipo === "vendo"
          ? "Publicar lo que vendes"
          : "Publicar lo que buscas",
      components: campos(tipo).map((campo) => {
        const valor = previos?.[campo.id]?.slice(0, campo.maxLength) ?? "";
        return {
          type: 1,
          components: [
            {
              type: 4,
              custom_id: campo.id,
              label: campo.label,
              style: campo.long ? 2 : 1,
              required: Boolean(campo.required),
              max_length: campo.maxLength,
              placeholder: campo.placeholder,
              ...(valor ? { value: valor } : {}),
            },
          ],
        };
      }),
    },
  });
}

const SIN_FORO =
  "El mercado todavía no está montado: falta crear el foro y poner su id en " +
  "`DISCORD_FORO_MERCADO`. Avisa a Miguel.";

const AVISO_ANTIGUEDAD =
  `Para publicar en el mercado hay que llevar al menos **${DIAS_ANTIGUEDAD} días** en el servidor. ` +
  "No es nada personal: es lo que frena a las cuentas nuevas que entran solo a estafar. " +
  "Mientras tanto puedes escribir en los temas que ya hay.";

// Discord corta a los 3 segundos. Publicar o cerrar una oferta son varias
// llamadas seguidas, así que se contesta "un momento..." y el trabajo sigue
// por detrás, escribiendo el resultado en ese mismo aviso.
function unMomento(token: string | undefined, trabajo: (avisar: (texto: string) => Promise<void>) => Promise<void>) {
  const avisar = async (texto: string) => {
    if (token) await editInteractionResponse(token, texto);
  };
  after(async () => {
    try {
      await trabajo(avisar);
    } catch (error) {
      console.error("[mercado]", error);
      await avisar("Algo ha fallado por mi parte. Vuelve a intentarlo en un minuto.");
    }
  });
  return json({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    data: { flags: EPHEMERAL },
  });
}

// Los comandos /vendo, /compro y /mercado.
export async function comandoMercado(
  nombre: string,
  i: MercadoInteraction
): Promise<Response | null> {
  if (nombre !== "vendo" && nombre !== "compro" && nombre !== "mercado") return null;
  if (!MERCADO_CONFIGURADO) return aviso(SIN_FORO);

  // ── /mercado: buscar entre las ofertas abiertas.
  if (nombre === "mercado") {
    const texto = (i.data?.options?.find((o) => o.name === "busco")?.value ?? "").trim();
    const tipo = i.data?.options?.find((o) => o.name === "tipo")?.value as
      | TipoOferta
      | undefined;
    if (!texto) return aviso("Dime qué buscas: `/mercado busco: manastones`");

    return unMomento(i.token, async (avisar) => {
      const res = await buscarOfertas(texto, tipo);
      if (!res.ok) {
        console.error("[mercado] buscar:", res.error);
        await avisar("No he podido mirar el mercado. Prueba en un minuto.");
        return;
      }
      if (res.hallazgos.length === 0) {
        await avisar(
          `No hay nada abierto que encaje con **${limpio(texto, 80)}**` +
            (res.abiertas > 0
              ? `. Hay ${res.abiertas} ofertas abiertas: prueba con una palabra más corta, o publica tú un \`/compro\`.`
              : ". El mercado está vacío ahora mismo: publica tú el primero.")
        );
        return;
      }
      const lista = res.hallazgos
        .slice(0, 10)
        .map((h) => `${h.tipo === "vendo" ? "💰" : "🔎"} <#${h.id}>`)
        .join("\n");
      const sobran = res.hallazgos.length - 10;
      await avisar(
        `**${res.hallazgos.length}** ofertas abiertas con **${limpio(texto, 80)}**:\n\n` +
          lista +
          (sobran > 0 ? `\n\n…y ${sobran} más. Afina la búsqueda para verlas.` : "")
      );
    });
  }

  if (llevaPocoTiempo(i.member?.joined_at)) return aviso(AVISO_ANTIGUEDAD);

  const categoria = i.data?.options?.find((o) => o.name === "categoria")?.value ?? "otros";
  return formulario(nombre as TipoOferta, categoria);
}

// El formulario enviado y los tres botones.
export async function componenteMercado(
  customId: string,
  i: MercadoInteraction
): Promise<Response | null> {
  if (!customId.startsWith("mercado:")) return null;
  if (!MERCADO_CONFIGURADO) return aviso(SIN_FORO);

  const [, accion, dato, extra] = customId.split(":");
  const yo = quien(i);
  if (!yo) return aviso("No he podido identificarte.");

  // ── Se envió el formulario: publicar la oferta.
  if (accion === "nueva") {
    const fields = leerFormulario(i.data?.components);
    if (!fields.item.trim() || !fields.precio.trim()) {
      return aviso("Faltaba el objeto o el precio, no he publicado nada.");
    }
    return unMomento(i.token, async (avisar) => {
      const res = await publicarOferta(dato as TipoOferta, extra || "otros", fields, yo);
      if (!res.ok) {
        console.error("[mercado] publicar:", res.error);
        await avisar(`No he podido publicarla: ${res.error.slice(0, 300)}`);
        return;
      }
      await avisar(
        `Publicada: <#${res.id}>\n` +
          "Cuando cierres el trato, pulsa **✅ Ya está cerrada** en tu propia ficha. " +
          `Si no, se cierra sola en ${HORAS_VIGENCIA} horas.`
      );

      // Y de paso, barrer las que ya se han pasado de hora. La pasada diaria
      // sola no da para 24 horas de vigencia: si el foro tiene movimiento, es
      // esto lo que mantiene el mercado al día. Con tope, para no eternizarse.
      const limpieza = await caducarOfertas(TOPE_POR_PUBLICACION);
      if (limpieza.cerradas > 0) {
        console.log(`[mercado] barrido al publicar: ${limpieza.cerradas} cerradas`);
      }
    });
  }

  const autorId = dato;

  // ── "Publicar de nuevo": reabrir el formulario con lo que ya había.
  if (accion === "republicar") {
    if (yo !== autorId) return aviso("Solo puede republicarla quien la publicó.");
    if (llevaPocoTiempo(i.member?.joined_at)) return aviso(AVISO_ANTIGUEDAD);
    // La ficha viene dentro de la propia interacción, así que no hay que
    // preguntarle nada a Discord: da tiempo a contestar con el formulario.
    const oferta = ofertaDelEmbed(i.message?.embeds?.[0]);
    if (!oferta) {
      return aviso("No he podido leer la oferta. Publícala con `/vendo` o `/compro`.");
    }
    return formulario(oferta.tipo, oferta.categoria, oferta.fields);
  }

  // ── "Contactar": avisar por privado a quien publicó.
  if (accion === "contactar") {
    if (yo === autorId) return aviso("Esta oferta es tuya.");
    const enlace =
      i.guild_id && i.channel_id
        ? `https://discord.com/channels/${i.guild_id}/${i.channel_id}`
        : "el mercado";
    return unMomento(i.token, async (avisar) => {
      // Aquí importa saber si llegó: en este servidor más de la mitad de la
      // gente tiene los privados cerrados, y quedarse esperando respuesta a un
      // mensaje que nunca salió es la mejor forma de matar el mercado.
      const resultado = await sendDirectMessage(autorId, {
        content:
          `👋 <@${yo}> está interesado en tu oferta del mercado: ${enlace}\n` +
          "Contéstale por privado o en el propio tema.",
        embeds: [],
        allowed_mentions: { parse: [] },
      });
      if (resultado === "cerrado") {
        await avisar(
          "Tiene los privados cerrados, así que no le ha llegado nada. " +
            `Escríbele en el propio tema de la oferta y mencionándole: <@${autorId}>.`
        );
        return;
      }
      if (resultado === "error") {
        await avisar("No he podido avisarle. Escríbele en el tema de la oferta.");
        return;
      }
      await avisar(
        "Le he avisado por privado. Recuerda: **el trato se cierra dentro del juego**. " +
          "Si te piden dinero real, no sigas y usa el botón ⚠️."
      );
    });
  }

  // ── "Ya está cerrada": solo el autor o el staff.
  if (accion === "cerrar") {
    if (yo !== autorId && !esStaff(i.member?.permissions)) {
      return aviso("Solo puede cerrarla quien la publicó (o un oficial).");
    }
    const threadId = i.channel_id;
    if (!threadId) return aviso("No sé de qué oferta hablamos.");
    const cabecera = i.message?.embeds?.[0];
    return unMomento(i.token, async (avisar) => {
      const res = await cerrarOferta(threadId, cabecera, TAG_CERRADA);
      if (!res.ok) {
        console.error("[mercado] cerrar:", res.error);
        await avisar(`No he podido cerrarla: ${(res.error ?? "").slice(0, 300)}`);
        return;
      }
      await avisar("Cerrada. El tema queda archivado, pero se puede seguir leyendo.");
    });
  }

  // ── "Reportar": abre un formulario para contar qué pasó.
  if (accion === "reportar") {
    if (yo === autorId) return aviso("No puedes reportar tu propia oferta.");
    return json({
      type: InteractionResponseType.MODAL,
      data: {
        custom_id: `mercado:reporte:${autorId}:${i.channel_id ?? ""}`,
        title: "Reportar esta oferta",
        components: [
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: "motivo",
                label: "¿Qué ha pasado?",
                style: 2,
                required: true,
                max_length: 700,
                placeholder: "Me pidió dinero real / no entregó lo pactado / precio falso...",
              },
            ],
          },
        ],
      },
    });
  }

  // ── El reporte enviado: va al canal del staff.
  if (accion === "reporte") {
    const motivo = leerReporte(i.data?.components);
    if (!CANAL_REPORTES) {
      console.warn("[mercado] reporte sin canal configurado:", motivo);
      return aviso(
        "No tengo canal de avisos configurado, así que no he podido pasarlo. " +
          "Cuéntaselo directamente a un oficial."
      );
    }
    const enlace = i.guild_id && extra ? `https://discord.com/channels/${i.guild_id}/${extra}` : "—";
    const res = await postMessage(CANAL_REPORTES, {
      content: "",
      embeds: [
        {
          title: "⚠️ Aviso del mercado",
          color: 0xed4245,
          fields: [
            { name: "Reporta", value: `<@${yo}>`, inline: true },
            { name: "Reportado", value: `<@${autorId}>`, inline: true },
            { name: "Oferta", value: enlace },
            { name: "Motivo", value: limpio(motivo, 900) || "—" },
          ],
        },
      ],
      allowed_mentions: { parse: [] },
    });
    if (!res.ok) console.error("[mercado] reporte:", res.error);
    return aviso(
      res.ok
        ? "Avisado. Un oficial lo mirará. Gracias por decirlo."
        : "No he podido pasar el aviso. Díselo a un oficial directamente."
    );
  }

  return aviso("Ese botón ya no hace nada.");
}

function leerReporte(filas: Fila[] | undefined): string {
  for (const fila of filas ?? []) {
    for (const input of fila.components ?? []) {
      if (input.custom_id === "motivo") return input.value ?? "";
    }
  }
  return "";
}

// ── La limpieza ──────────────────────────────────────────────────

// Cuántas cierra como mucho el barrido que va detrás de cada oferta nueva.
// La pasada diaria no tiene tope: ahí no hay nadie esperando.
const TOPE_POR_PUBLICACION = 10;

type Hilo = { id: string; name?: string; parent_id?: string; applied_tags?: string[] };

// Todos los temas del foro del mercado: los abiertos y los que Discord archivó
// él solo por llevar una semana sin respuestas. Los segundos no salen en la
// lista de abiertos, y sin ellos ni se caducan ni se encuentran al buscar.
async function temasDelMercado(): Promise<
  { ok: true; temas: Hilo[] } | { ok: false; error: string }
> {
  const activos = await discordFetch(`/guilds/${GUILD_ID}/threads/active`, "GET", undefined);
  if (!activos.ok) return { ok: false, error: `${activos.status} ${await activos.text()}` };

  const { threads = [] } = (await activos.json()) as { threads?: Hilo[] };
  const temas: Hilo[] = threads.filter((t) => t.parent_id === FORO);

  const guardados = await discordFetch(
    `/channels/${FORO}/threads/archived/public?limit=100`,
    "GET",
    undefined
  );
  if (guardados.ok) {
    const archivados = (await guardados.json()) as { threads?: Hilo[] };
    const vistos = new Set(temas.map((t) => t.id));
    for (const hilo of archivados.threads ?? []) {
      if (!vistos.has(hilo.id)) temas.push(hilo);
    }
  }
  return { ok: true, temas };
}

// ── Buscar ───────────────────────────────────────────────────────

// Sin acentos y en minúsculas: quien busca "manastone" tiene que encontrar
// "Manastones", y quien busca "espada" tiene que encontrar "Espada".
function normaliza(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export type Hallazgo = { id: string; titulo: string; tipo: TipoOferta };

// Busca por el título del tema, que es donde va el objeto: al publicar se
// nombra "[Vendo] Espada de fuego". No mira dentro de la ficha porque eso
// serían tantas llamadas a Discord como ofertas haya.
export async function buscarOfertas(
  texto: string,
  soloTipo?: TipoOferta
): Promise<{ ok: true; hallazgos: Hallazgo[]; abiertas: number } | { ok: false; error: string }> {
  const lista = await temasDelMercado();
  if (!lista.ok) return { ok: false, error: lista.error };

  const tags = await tagsDelForo();
  const cerradasYa = new Set(
    [tags[TAG_CERRADA.toLowerCase()], tags[TAG_CADUCADA.toLowerCase()]].filter(Boolean)
  );

  // Todas las palabras tienen que aparecer, en cualquier orden.
  const palabras = normaliza(texto).split(/\s+/).filter(Boolean);
  const hallazgos: Hallazgo[] = [];
  let abiertas = 0;

  for (const hilo of lista.temas) {
    if ((hilo.applied_tags ?? []).some((t) => cerradasYa.has(t))) continue;
    // Una oferta pasada de hora está muerta aunque nadie la haya marcado aún.
    if (edadEnHoras(hilo.id) >= HORAS_VIGENCIA) continue;

    const titulo = hilo.name ?? "";
    const tipo: TipoOferta = /^\[compro\]/i.test(titulo) ? "compro" : "vendo";
    abiertas++;
    if (soloTipo && tipo !== soloTipo) continue;

    const plano = normaliza(titulo);
    if (palabras.every((p) => plano.includes(p))) {
      hallazgos.push({ id: hilo.id, titulo, tipo });
    }
  }

  // Las más nuevas primero: el id de Discord ya va en orden de creación.
  hallazgos.sort((a, b) => (a.id < b.id ? 1 : -1));
  return { ok: true, hallazgos, abiertas };
}

// Cierra las ofertas que ya han pasado de tiempo. La llaman la tarea diaria y
// cada publicación nueva.
export async function caducarOfertas(tope = Infinity): Promise<{
  revisadas: number;
  cerradas: number;
  error?: string;
}> {
  if (!MERCADO_CONFIGURADO) {
    return { revisadas: 0, cerradas: 0, error: "Falta DISCORD_FORO_MERCADO." };
  }
  if (!GUILD_ID) return { revisadas: 0, cerradas: 0, error: "Falta DISCORD_GUILD_ID." };

  const lista = await temasDelMercado();
  if (!lista.ok) return { revisadas: 0, cerradas: 0, error: lista.error };
  const candidatos = lista.temas;

  // Las que ya están cerradas o caducadas no se vuelven a tocar.
  const tags = await tagsDelForo();
  const cerradasYa = new Set(
    [tags[TAG_CERRADA.toLowerCase()], tags[TAG_CADUCADA.toLowerCase()]].filter(Boolean)
  );

  let cerradas = 0;
  let revisadas = 0;
  for (const hilo of candidatos) {
    if ((hilo.applied_tags ?? []).some((t) => cerradasYa.has(t))) continue;
    revisadas++;
    if (edadEnHoras(hilo.id) < HORAS_VIGENCIA) continue;
    if (cerradas >= tope) break;
    const r = await cerrarOferta(hilo.id, undefined, TAG_CADUCADA);
    if (r.ok) cerradas++;
    else console.error("[mercado] caducar", hilo.id, r.error);
    await new Promise((seguir) => setTimeout(seguir, 400)); // sin prisa, que Discord no se queje
  }
  return { revisadas, cerradas };
}

// La fecha de creación va dentro del propio id de Discord (un "snowflake"):
// los bits de arriba son los milisegundos desde 2015.
function edadEnHoras(id: string): number {
  try {
    const ms = Number((BigInt(id) >> BigInt(22)) + BigInt(1420070400000));
    return (Date.now() - ms) / 3_600_000;
  } catch {
    return 0;
  }
}

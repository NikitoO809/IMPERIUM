// Puerta de entrada del BOT de Discord.
//
// Cuando alguien escribe /anuncio en el servidor, Discord manda una petición
// HTTP a esta dirección y espera respuesta en menos de 3 segundos. Aquí se
// decide qué contestar: abrir el formulario, o publicar lo que se escribió.
//
// Esta ruta NO comparte nada con el resto de la web: ni sesión, ni base de
// datos. La seguridad es la firma de Discord (cada petición viene firmada) y
// los permisos del propio servidor de Discord (quién puede usar el comando).
import { after } from "next/server";
import {
  BOT_CONFIGURED,
  DISCORD_APP_ID,
  DISCORD_BOT_TOKEN,
  EPHEMERAL,
  getRoleMembers,
  editInteractionResponse,
  EVERYONE,
  botonApuntarse,
  addRoleToMember,
  removeRoleFromMember,
  memberHasRole,
  InteractionResponseType,
  InteractionType,
  isValidSignature,
  buildMessage,
  messageToFields,
  postMessage,
  editMessage,
  type AnnouncementFields,
  type DiscordEmbed,
} from "@/lib/discord-bot";
import { comandoMercado, componenteMercado } from "@/lib/discord-mercado";
import { componenteNoticia } from "@/lib/discord-noticias";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Nombres de los comandos, tal como se registran en Discord.
// (no se exportan: Next solo admite exports concretos en un route handler)
const COMMAND_NEW = "anuncio";
const COMMAND_EDIT = "Editar anuncio";
const COMMAND_DM = "privado";

// ── Utilidades de respuesta ──────────────────────────────────────

function reply(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Mensaje que solo ve quien usó el comando (confirmaciones y errores).
function ephemeral(content: string) {
  return reply({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content, flags: EPHEMERAL },
  });
}

// ── El formulario ────────────────────────────────────────────────

type TextInput = {
  id: keyof AnnouncementFields;
  label: string;
  placeholder: string;
  long?: boolean;
  required?: boolean;
  maxLength: number;
};

const FORM: TextInput[] = [
  { id: "title", label: "Título (déjalo vacío para un mensaje normal)", placeholder: "Guerra de alianzas este sábado", maxLength: 256 },
  { id: "body", label: "Mensaje", placeholder: "Lo que quieres contar. Admite **negrita** y saltos de línea.", long: true, required: true, maxLength: 4000 },
  { id: "imageUrl", label: "Imagen (enlace, opcional)", placeholder: "https://...", maxLength: 500 },
  { id: "linkUrl", label: "Enlace del título (opcional)", placeholder: "https://...", maxLength: 500 },
  { id: "color", label: "Color de la barra (opcional)", placeholder: "#7c5cff", maxLength: 7 },
];

// Construye el formulario que se abre dentro de Discord, relleno con los
// valores que se le pasen (vacíos si es un anuncio nuevo).
function modal(customId: string, title: string, values: AnnouncementFields) {
  return reply({
    type: InteractionResponseType.MODAL,
    data: {
      custom_id: customId,
      title,
      components: FORM.map((field) => ({
        type: 1, // fila
        components: [
          {
            type: 4, // campo de texto
            custom_id: field.id,
            label: field.label,
            style: field.long ? 2 : 1, // 2 = párrafo, 1 = una línea
            required: Boolean(field.required),
            max_length: field.maxLength,
            placeholder: field.placeholder,
            value: values[field.id] || undefined,
          },
        ],
      })),
    },
  });
}

const EMPTY: AnnouncementFields = { title: "", body: "", imageUrl: "", linkUrl: "", color: "" };

// ── Lectura de lo que llega ──────────────────────────────────────

type ModalRow = { components?: { custom_id?: string; value?: string }[] };

// Saca los valores del formulario enviado.
function readFields(components: ModalRow[] | undefined): AnnouncementFields {
  const values = { ...EMPTY };
  for (const row of components ?? []) {
    for (const input of row.components ?? []) {
      const id = input.custom_id as keyof AnnouncementFields | undefined;
      if (id && id in values) values[id] = input.value ?? "";
    }
  }
  return values;
}

type CommandOption = { name?: string; value?: string };

type Interaction = {
  type: number;
  channel_id?: string;
  guild_id?: string;
  // Token de la interacción: sirve 15 minutos para cambiar la respuesta.
  token?: string;
  // Quién lanzó la interacción y qué roles tiene ya (para el botón).
  // `joined_at` y `permissions` los usa el mercado: antigüedad para publicar
  // y si es un oficial para cerrar la oferta de otro.
  member?: { user?: { id?: string }; roles?: string[]; joined_at?: string; permissions?: string };
  // En un mensaje privado no hay `member` (no hay servidor): viene `user`.
  user?: { id?: string };
  // El mensaje en el que se pulsó el botón (una ficha del mercado).
  message?: { id?: string; embeds?: DiscordEmbed[] };
  data?: {
    name?: string;
    custom_id?: string;
    target_id?: string;
    options?: CommandOption[];
    components?: ModalRow[];
    resolved?: {
      messages?: Record<
        string,
        { content?: string; embeds?: DiscordEmbed[]; author?: { id?: string } }
      >;
    };
  };
};

// ── Endpoint ─────────────────────────────────────────────────────

export async function POST(req: Request) {
  // El cuerpo se lee en crudo: la firma se calcula sobre el texto exacto.
  const rawBody = await req.text();

  // 1) ¿Viene de Discord de verdad? Si la firma no cuadra, 401 y fuera.
  //    Discord exige este 401: lo comprueba al guardar la dirección.
  const valid = isValidSignature(
    rawBody,
    req.headers.get("x-signature-ed25519"),
    req.headers.get("x-signature-timestamp")
  );
  if (!valid) return reply({ error: "Firma inválida." }, 401);

  if (!BOT_CONFIGURED) {
    return ephemeral("El bot no está configurado del todo en el servidor. Avisa a Miguel.");
  }

  let interaction: Interaction;
  try {
    interaction = JSON.parse(rawBody) as Interaction;
  } catch {
    return reply({ error: "Cuerpo inválido." }, 400);
  }

  // 2) Discord comprueba de vez en cuando que seguimos vivos.
  if (interaction.type === InteractionType.PING) {
    return reply({ type: InteractionResponseType.PONG });
  }

  // 3) Alguien usó un comando.
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const name = interaction.data?.name;

    // /anuncio → formulario vacío.
    //
    // El rol elegido en el comando viaja dentro del custom_id del formulario:
    // es la forma de que llegue hasta el momento de publicar, ya que cada
    // interacción es una petición independiente (no hay nada guardado).
    if (name === COMMAND_NEW) {
      const elegido = interaction.data?.options?.find((o) => o.name === "rol")?.value ?? "";
      // Discord manda @everyone como un rol con el id del propio servidor.
      const roleId = elegido && elegido === interaction.guild_id ? EVERYONE : elegido;
      // Rol que se reparte con el botón "Me apunto" (opcional).
      const botonRol = interaction.data?.options?.find((o) => o.name === "boton")?.value ?? "";
      if (botonRol && botonRol === interaction.guild_id) {
        return ephemeral("El botón no puede repartir @everyone: elige un rol normal.");
      }
      return modal(`announce:new:${roleId}:${botonRol}`, "Nuevo anuncio", EMPTY);
    }

    // /privado → mismo formulario, pero el envío será por mensaje privado.
    if (name === COMMAND_DM) {
      const roleId = interaction.data?.options?.find((o) => o.name === "rol")?.value ?? "";
      if (!roleId) return ephemeral("Tienes que elegir un rol.");
      if (roleId === interaction.guild_id) {
        return ephemeral(
          "Mandar un privado a **todo el servidor** es justo lo que Discord considera spam, y por eso deshabilitan bots. " +
            "Para avisar a todos usa `/anuncio` eligiendo **@everyone**: la notificación les llega igual y es la vía oficial."
        );
      }
      const botonRol = interaction.data?.options?.find((o) => o.name === "boton")?.value ?? "";
      if (botonRol && botonRol === interaction.guild_id) {
        return ephemeral("El botón no puede repartir @everyone: elige un rol normal.");
      }
      return modal(`privado:${roleId}:${botonRol}`, "Anuncio por privado", EMPTY);
    }

    // Clic derecho en un mensaje → Apps → Editar anuncio.
    if (name === COMMAND_EDIT) {
      const targetId = interaction.data?.target_id ?? "";
      const target = interaction.data?.resolved?.messages?.[targetId];
      if (!target) return ephemeral("No he podido leer ese mensaje.");

      // Solo puede editar mensajes suyos: los de otras personas no son del bot.
      if (target.author?.id !== DISCORD_APP_ID) {
        return ephemeral("Solo puedo editar los anuncios que he publicado yo.");
      }

      // Al editar se conserva la mención original: Discord no vuelve a avisar
      // en una edición, así que nadie recibe un segundo aviso.
      const { fields, roleId } = messageToFields(target);
      return modal(
        `announce:edit:${interaction.channel_id}:${targetId}:${roleId ?? ""}`,
        "Editar anuncio",
        fields
      );
    }

    // /vendo y /compro → el mercado se ocupa (abre su propio formulario).
    const mercado = await comandoMercado(name ?? "", interaction);
    if (mercado) return mercado;

    return ephemeral("Ese comando todavía no hace nada.");
  }

  // 4) Alguien pulsó un botón.
  if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
    const customId = interaction.data?.custom_id ?? "";

    // Los botones de una ficha del mercado (contactar, cerrar, reportar).
    const mercado = await componenteMercado(customId, interaction);
    if (mercado) return mercado;

    // Los de un borrador de noticia (publicar, descartar).
    const noticia = await componenteNoticia(customId, interaction);
    if (noticia) return noticia;

    if (!customId.startsWith("apuntarse:")) return ephemeral("Ese botón ya no hace nada.");

    const [, roleId, guildDelBoton] = customId.split(":");
    // En un canal, el servidor viene en la interacción; en un privado, no:
    // ahí se saca del propio botón.
    const guildId = interaction.guild_id ?? guildDelBoton;
    const userId = interaction.member?.user?.id ?? interaction.user?.id;
    if (!roleId || !guildId || !userId) return ephemeral("No he podido identificarte.");

    // Si ya lo tenía, el botón sirve para darse de baja. En un canal los roles
    // llegan en la interacción; en un privado hay que preguntar a Discord.
    const yaLoTiene = interaction.member?.roles
      ? interaction.member.roles.includes(roleId)
      : await memberHasRole(guildId, userId, roleId);
    const resultado = yaLoTiene
      ? await removeRoleFromMember(guildId, userId, roleId)
      : await addRoleToMember(guildId, userId, roleId);

    if (!resultado.ok) {
      console.error("[discord] repartir rol:", resultado.error);
      // Los dos fallos posibles piden arreglos distintos, así que se distinguen.
      const yaNoExiste = resultado.error.startsWith("404");
      return ephemeral(
        yaNoExiste
          ? "Ese rol ya no existe en el servidor. Avisa a un administrador."
          : "No he podido darte el rol: mi rol tiene que estar por encima del suyo en la lista del servidor y necesito el permiso de gestionar roles. Avisa a un administrador."
      );
    }

    return ephemeral(
      yaLoTiene
        ? `Te he quitado <@&${roleId}>. Ya no te avisaremos de eso.`
        : `Listo, ya tienes <@&${roleId}>. Te avisaremos por ahí.`
    );
  }

  // 5) Se envió el formulario: hay que publicar o editar.
  if (interaction.type === InteractionType.MODAL_SUBMIT) {
    const customId = interaction.data?.custom_id ?? "";

    // Los formularios del mercado (nueva oferta, reporte) van por su cuenta:
    // no son anuncios y no comparten campos con ellos.
    const mercado = await componenteMercado(customId, interaction);
    if (mercado) return mercado;

    const fields = readFields(interaction.data?.components);

    // Formas del custom_id:
    //   privado:<rol>
    //   announce:new:<rol a avisar>:<rol del botón>
    //   announce:edit:<canal>:<mensaje>:<rol a avisar>
    const partes = customId.split(":");
    let roleId: string | null = null; // a quién avisar
    let botonRol = ""; // rol que reparte el botón "Me apunto"

    if (customId.startsWith("privado:")) {
      roleId = partes[1] || null;
      botonRol = partes[2] || "";
    } else if (customId.startsWith("announce:edit:")) {
      roleId = partes[4] || null;
    } else {
      roleId = partes[2] || null;
      botonRol = partes[3] || "";
    }

    const message = buildMessage(fields, roleId);
    if (botonRol && interaction.guild_id) {
      message.components = [botonApuntarse(botonRol, interaction.guild_id)];
    }

    if (!message.content && message.embeds.length === 0) {
      return ephemeral("El mensaje estaba vacío, no he publicado nada.");
    }

    // Reparto por privado a los miembros de un rol.
    if (customId.startsWith("privado:")) {
      const guildId = interaction.guild_id;
      const token = interaction.token;
      if (!guildId || !token) return ephemeral("No he podido identificar el servidor.");
      if (!roleId) return ephemeral("No he podido identificar el rol.");

      // Buscar a la gente y repartir lleva minutos: se contesta "pensando..."
      // y el trabajo sigue por detrás, avisando en ese mismo mensaje.
      after(async () => {
        const miembros = await getRoleMembers(guildId, roleId);
        if (!miembros.ok) {
          await editInteractionResponse(
            token,
            miembros.error.includes("Missing Access") || miembros.error.startsWith("403")
              ? "No puedo ver quién tiene ese rol. Activa **Server Members Intent** en el portal de Discord (tu aplicación → Bot → Privileged Gateway Intents) y vuelve a intentarlo."
              : `No he podido leer los miembros del rol: ${miembros.error.slice(0, 200)}`
          );
          return;
        }
        if (miembros.ids.length === 0) {
          await editInteractionResponse(token, "Ese rol no lo tiene nadie (o solo bots). No he enviado nada.");
          return;
        }

        await editInteractionResponse(
          token,
          `Enviando privados a **${miembros.ids.length}** ${miembros.ids.length === 1 ? "persona" : "personas"}…`
        );

        await fetch(`${new URL(req.url).origin}/api/discord/enviar-privados`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-imp-secreto": DISCORD_BOT_TOKEN },
          body: JSON.stringify({
            fields,
            botonRol,
            guildId,
            autorId: interaction.member?.user?.id ?? interaction.user?.id,
            pendientes: miembros.ids,
            enviados: 0,
            fallidos: 0,
            errores: 0,
            total: miembros.total,
            rolNombre: `<@&${roleId}>`,
            interactionToken: token,
          }),
        });
      });

      return reply({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        data: { flags: EPHEMERAL },
      });
    }

    // Editar uno ya publicado.
    if (customId.startsWith("announce:edit:")) {
      const [, , channelId, messageId] = customId.split(":");
      // announce:edit:<canal>:<mensaje>:<rol>
      const result = await editMessage(channelId, messageId, message);
      return ephemeral(
        result.ok
          ? "Anuncio actualizado."
          : `No he podido editarlo: ${result.error.slice(0, 300)}`
      );
    }

    // Publicar uno nuevo, en el canal donde se escribió el comando.
    const channelId = interaction.channel_id;
    if (!channelId) return ephemeral("No sé en qué canal publicarlo.");

    const result = await postMessage(channelId, message);
    return ephemeral(
      result.ok
        ? "Anuncio publicado. Para cambiarlo: clic derecho en el mensaje → Apps → Editar anuncio."
        : `No he podido publicarlo: ${result.error.slice(0, 300)}`
    );
  }

  return reply({ error: "Tipo de interacción no soportado." }, 400);
}

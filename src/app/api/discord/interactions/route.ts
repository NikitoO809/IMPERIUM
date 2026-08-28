// Puerta de entrada del BOT de Discord.
//
// Cuando alguien escribe /anuncio en el servidor, Discord manda una petición
// HTTP a esta dirección y espera respuesta en menos de 3 segundos. Aquí se
// decide qué contestar: abrir el formulario, o publicar lo que se escribió.
//
// Esta ruta NO comparte nada con el resto de la web: ni sesión, ni base de
// datos. La seguridad es la firma de Discord (cada petición viene firmada) y
// los permisos del propio servidor de Discord (quién puede usar el comando).
import {
  BOT_CONFIGURED,
  DISCORD_APP_ID,
  EPHEMERAL,
  InteractionResponseType,
  InteractionType,
  isValidSignature,
  DISCORD_PUBLIC_KEY,
  buildMessage,
  messageToFields,
  postMessage,
  editMessage,
  type AnnouncementFields,
  type DiscordEmbed,
} from "@/lib/discord-bot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Nombres de los comandos, tal como se registran en Discord.
export const COMMAND_NEW = "anuncio";
export const COMMAND_EDIT = "Editar anuncio";

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

type Interaction = {
  type: number;
  channel_id?: string;
  data?: {
    name?: string;
    custom_id?: string;
    target_id?: string;
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

// Comprobación temporal: dice si el servidor tiene bien puestas las claves,
// sin enseñar ninguna. Se quita en cuanto el bot funcione.
export async function GET() {
  return Response.json({
    publicKeyLength: DISCORD_PUBLIC_KEY.length,
    appIdLength: DISCORD_APP_ID.length,
    hasToken: BOT_CONFIGURED,
  });
}

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
    if (name === COMMAND_NEW) {
      return modal("announce:new", "Nuevo anuncio", EMPTY);
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

      return modal(
        `announce:edit:${interaction.channel_id}:${targetId}`,
        "Editar anuncio",
        messageToFields(target)
      );
    }

    return ephemeral("Ese comando todavía no hace nada.");
  }

  // 4) Se envió el formulario: hay que publicar o editar.
  if (interaction.type === InteractionType.MODAL_SUBMIT) {
    const customId = interaction.data?.custom_id ?? "";
    const fields = readFields(interaction.data?.components);
    const message = buildMessage(fields);

    if (!message.content && message.embeds.length === 0) {
      return ephemeral("El mensaje estaba vacío, no he publicado nada.");
    }

    // Editar uno ya publicado.
    if (customId.startsWith("announce:edit:")) {
      const [, , channelId, messageId] = customId.split(":");
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

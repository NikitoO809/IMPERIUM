// Elegir clase de AION 2 desde un desplegable.
//
// Sirve en los dos sitios y con el mismo código: pegado en el canal de clases,
// y dentro de un mensaje privado. La diferencia es que en un privado no hay
// servidor del que tirar, así que el id del servidor viaja dentro del
// custom_id, igual que hace el botón "Me apunto".
//
// Al elegir se pone la clase nueva ANTES de quitar la vieja: si Discord
// fallara a mitad, la persona se queda con dos roles (raro pero inofensivo) en
// vez de quedarse sin ninguno.
import {
  DISCORD_BOT_TOKEN,
  EPHEMERAL,
  InteractionResponseType,
  addRoleToMember,
  removeRoleFromMember,
  type DiscordActionRow,
  type DiscordMessageBody,
} from "./discord-bot";

const API = "https://discord.com/api/v10";

export const GUILD_ID = (process.env.DISCORD_GUILD_ID ?? "").trim();

// Las ocho clases, en el orden de las familias del juego: guerreros,
// exploradores, magos y sacerdotes.
//
// OJO con la sexta: el rol y el emoji del servidor se llaman "Summoner" desde
// antes de que se supiera el nombre definitivo, pero la clase se llama
// Spiritmaster. Aquí se enseña el nombre bueno y por dentro se usa el id de
// siempre, para no tener que renombrar el rol y romper a quien ya lo tiene.
export const CLASES = [
  { rol: "1541651913714569246", nombre: "Templar",      papel: "Tanque",               emoji: { name: "Templar",   id: "1541674638776606811" } },
  { rol: "1541668219121836183", nombre: "Gladiator",    papel: "Daño cuerpo a cuerpo", emoji: { name: "Gladiator", id: "1541674524884475925" } },
  { rol: "1541652150722232421", nombre: "Ranger",       papel: "Daño a distancia",     emoji: { name: "Ranger",    id: "1541674552571076658" } },
  { rol: "1541652212122390568", nombre: "Assassin",     papel: "Daño explosivo",       emoji: { name: "Assassin",  id: "1541674437764587570" } },
  { rol: "1541668617177931876", nombre: "Sorcerer",     papel: "Daño mágico",          emoji: { name: "Sorcerer",  id: "1541674581016838145" } },
  { rol: "1541668714594836540", nombre: "Spiritmaster", papel: "Invocador",            emoji: { name: "Summoner",  id: "1541674609429192825" } },
  { rol: "1541668075450142771", nombre: "Cleric",       papel: "Sanador",              emoji: { name: "Cleric",    id: "1541674499445882920" } },
  { rol: "1541667952464633936", nombre: "Chanter",      papel: "Soporte",              emoji: { name: "Chanter",   id: "1541674470320775248" } },
] as const;

const ROLES_CLASE = CLASES.map((c) => c.rol) as readonly string[];
const nombreDe = (rol: string) => CLASES.find((c) => c.rol === rol)?.nombre ?? "esa clase";

// El desplegable. `actual` marca la clase que ya tiene, para que aparezca
// señalada al abrirlo.
export function filaClases(guildId: string, actual?: string): DiscordActionRow {
  return {
    type: 1,
    components: [
      {
        type: 3,
        custom_id: `clase:${guildId}`,
        placeholder: "Selecciona tu clase",
        min_values: 1,
        max_values: 1,
        options: CLASES.map((c) => ({
          label: c.nombre,
          value: c.rol,
          description: c.papel,
          emoji: { name: c.emoji.name, id: c.emoji.id },
          default: c.rol === actual,
        })),
      },
    ],
  };
}

// El privado que se reparte. Se escribe entero aquí para que el script de
// envío no tenga que saber nada de clases ni de roles.
export function mensajeElegirClase(guildId: string): DiscordMessageBody {
  return {
    content: "",
    embeds: [
      {
        title: "⚔️  Elige tu clase para AION 2",
        color: 0xc9a227,
        description:
          "El juego abre el **30 de septiembre** en acceso anticipado y el **5 de octubre** para todos.\n\n" +
          "Dinos con qué vas a jugar y te doy el rol al momento. Sirve para organizar los grupos " +
          "antes de que empiece: saber cuántos tanques y cuántos sanadores somos.\n\n" +
          "Elígela aquí abajo, sin salir de este privado. Si luego cambias de idea, vuelves a abrir " +
          "el desplegable y ya está: solo se guarda la última.",
        footer: { text: "IMPERIUM · si no piensas jugar a AION 2, ignora este mensaje" },
      },
    ],
    allowed_mentions: { parse: [] },
    components: [filaClases(guildId)],
  };
}

// Los roles que tiene ahora mismo. En un canal vienen dentro de la propia
// interacción; en un privado hay que preguntárselo a Discord.
async function rolesDe(guildId: string, userId: string): Promise<string[] | null> {
  try {
    const res = await fetch(`${API}/guilds/${guildId}/members/${userId}`, {
      headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
    });
    if (!res.ok) return null;
    const m = (await res.json()) as { roles?: string[] };
    return m.roles ?? [];
  } catch {
    return null;
  }
}

type ClaseInteraction = {
  guild_id?: string;
  member?: { user?: { id?: string }; roles?: string[] };
  user?: { id?: string };
  data?: { values?: string[] };
};

function aviso(content: string) {
  return Response.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content, flags: EPHEMERAL },
  });
}

// Alguien eligió en el desplegable. Devuelve null si el custom_id no es suyo,
// para que la puerta de entrada siga probando con los demás.
export async function componenteClase(
  customId: string,
  i: ClaseInteraction
): Promise<Response | null> {
  if (!customId.startsWith("clase:")) return null;

  const [, guildDelMenu] = customId.split(":");
  const guildId = i.guild_id || guildDelMenu || GUILD_ID;
  const userId = i.member?.user?.id ?? i.user?.id;
  const elegido = i.data?.values?.[0];

  if (!guildId || !userId) return aviso("No he podido identificarte.");
  if (!elegido || !ROLES_CLASE.includes(elegido)) {
    return aviso("Esa clase ya no está en la lista. Avisa a un administrador.");
  }

  const actuales = i.member?.roles ?? (await rolesDe(guildId, userId));
  if (actuales === null) {
    return aviso("No he podido mirar tus roles. Prueba otra vez en un minuto.");
  }
  if (actuales.includes(elegido)) {
    return aviso(`Ya eras **${nombreDe(elegido)}**, así que lo dejo como está.`);
  }

  const puesta = await addRoleToMember(guildId, userId, elegido);
  if (!puesta.ok) {
    console.error("[clases] poner rol:", puesta.error);
    return aviso(
      puesta.error.startsWith("404")
        ? "Ese rol ya no existe en el servidor. Avisa a un administrador."
        : "No he podido darte el rol. Avisa a un administrador: mi rol tiene que estar por encima de los de clase."
    );
  }

  // Fuera las demás: una persona, una clase.
  const anteriores = actuales.filter((r) => ROLES_CLASE.includes(r) && r !== elegido);
  for (const vieja of anteriores) {
    const quitada = await removeRoleFromMember(guildId, userId, vieja);
    if (!quitada.ok) console.error("[clases] quitar rol:", quitada.error);
  }

  const cambio = anteriores.length
    ? `Cambiada de **${nombreDe(anteriores[0])}** a **${nombreDe(elegido)}**.`
    : `Listo, ya eres **${nombreDe(elegido)}**.`;
  return aviso(`${cambio}\nSi te equivocaste, vuelve a abrir el desplegable y elige otra.`);
}

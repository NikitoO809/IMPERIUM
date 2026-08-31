// Registra los comandos del bot en Discord.
//
// Se ejecuta a mano, UNA vez (y cada vez que cambien los comandos):
//   npm run discord:comandos
//
// Lee las claves de .env.local. No instala nada: Node ya trae todo.
import { readFileSync } from "node:fs";

// ── Lee .env.local sin librerías ─────────────────────────────────
function loadEnv() {
  const env = {};
  let raw = "";
  try {
    raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  } catch {
    return env;
  }
  for (const line of raw.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const APP_ID = env.DISCORD_APP_ID;
const TOKEN = env.DISCORD_BOT_TOKEN;
const GUILD_ID = env.DISCORD_GUILD_ID; // opcional

if (!APP_ID || !TOKEN) {
  console.error(
    "\n  Faltan datos en .env.local.\n" +
      "  Necesito DISCORD_APP_ID y DISCORD_BOT_TOKEN.\n" +
      "  Los copias del Portal de Desarrolladores de Discord.\n"
  );
  process.exit(1);
}

// ── Los comandos ─────────────────────────────────────────────────
// default_member_permissions: "0" → de entrada solo lo ven los administradores
// del servidor. Para dárselo a un rol concreto:
//   Ajustes del servidor → Integraciones → IMPERIUM → Comandos.
const COMMANDS = [
  {
    name: "anuncio",
    type: 1, // comando de barra: se escribe /anuncio
    description: "Escribe un anuncio y publicalo en este canal",
    default_member_permissions: "0",
    contexts: [0], // solo dentro de un servidor (no en mensajes directos)
    options: [
      {
        // type 8 = ROLE: Discord enseña el selector de roles del servidor.
        type: 8,
        name: "rol",
        description: "Rol al que avisar (opcional). Si no eliges ninguno, no se menciona a nadie.",
        required: false,
      },
      {
        type: 8,
        name: "boton",
        description: "Rol que recibe quien pulse el boton 'Me apunto' (opcional)",
        required: false,
      },
    ],
  },
  {
    name: "privado",
    type: 1,
    description: "Manda el anuncio por mensaje privado a quienes tengan un rol",
    default_member_permissions: "0",
    contexts: [0],
    options: [
      {
        type: 8,
        name: "rol",
        description: "Rol cuyos miembros recibiran el privado",
        required: true,
      },
      {
        type: 8,
        name: "boton",
        description: "Rol que recibe quien pulse 'Me apunto' dentro del privado (opcional)",
        required: false,
      },
    ],
  },
  {
    name: "Editar anuncio",
    type: 3, // aparece con clic derecho sobre un mensaje → Apps
    default_member_permissions: "0",
    contexts: [0],
  },
  // ── El mercado de Aion 2 ───────────────────────────────────────
  // Estos dos son para los jugadores, no para los admins. Siguen saliendo con
  // permisos "0" para que no aparezcan de golpe a los 1.200 miembros: se le
  // dan al rol AION 2 en Ajustes → Integraciones → IMPERIUM → Comandos.
  {
    name: "vendo",
    type: 1,
    description: "Publica en el mercado algo que vendes (solo dentro del juego)",
    default_member_permissions: "0",
    contexts: [0],
    options: [
      {
        type: 3, // texto con opciones cerradas
        name: "categoria",
        description: "De que es la oferta",
        required: true,
        choices: [
          { name: "Equipo", value: "equipo" },
          { name: "Materiales", value: "materiales" },
          { name: "Consumibles", value: "consumibles" },
          { name: "Servicios (carry, crafteo...)", value: "servicios" },
          { name: "Otros", value: "otros" },
        ],
      },
    ],
  },
  {
    name: "compro",
    type: 1,
    description: "Publica en el mercado algo que buscas (solo dentro del juego)",
    default_member_permissions: "0",
    contexts: [0],
    options: [
      {
        type: 3,
        name: "categoria",
        description: "De que es la busqueda",
        required: true,
        choices: [
          { name: "Equipo", value: "equipo" },
          { name: "Materiales", value: "materiales" },
          { name: "Consumibles", value: "consumibles" },
          { name: "Servicios (carry, crafteo...)", value: "servicios" },
          { name: "Otros", value: "otros" },
        ],
      },
    ],
  },
  // Buscar entre lo que hay publicado. Sin esto, con el foro lleno hay que ir
  // mirando tema por tema, que es la forma mas rapida de que nadie lo use.
  {
    name: "mercado",
    type: 1,
    description: "Busca algo entre las ofertas abiertas del mercado",
    default_member_permissions: "0",
    contexts: [0],
    options: [
      {
        type: 3,
        name: "busco",
        description: "Que estas buscando (por ejemplo: manastones)",
        required: true,
        max_length: 80,
      },
      {
        type: 3,
        name: "tipo",
        description: "Solo quien vende, o solo quien compra",
        required: false,
        choices: [
          { name: "Solo lo que se vende", value: "vendo" },
          { name: "Solo lo que se busca", value: "compro" },
        ],
      },
    ],
  },
];

// Registrar en UN servidor es inmediato. Registrarlos globalmente puede tardar
// hasta una hora en aparecer, por eso preferimos el servidor si está puesto.
const url = GUILD_ID
  ? `https://discord.com/api/v10/applications/${APP_ID}/guilds/${GUILD_ID}/commands`
  : `https://discord.com/api/v10/applications/${APP_ID}/commands`;

const res = await fetch(url, {
  method: "PUT",
  headers: { "Content-Type": "application/json", Authorization: `Bot ${TOKEN}` },
  body: JSON.stringify(COMMANDS),
});

if (!res.ok) {
  console.error(`\n  Discord ha dicho que no (${res.status}):\n  ${await res.text()}\n`);
  process.exit(1);
}

const registrados = await res.json();
console.log(
  `\n  Listo. Comandos registrados ${GUILD_ID ? "en tu servidor" : "globalmente"}:\n` +
    registrados.map((c) => `    · ${c.type === 3 ? "(clic derecho) " : "/"}${c.name}`).join("\n") +
    (GUILD_ID
      ? "\n\n  Ya deberían aparecer en Discord. Si no, cierra y abre Discord.\n"
      : "\n\n  Los comandos globales pueden tardar hasta 1 hora en aparecer.\n")
);

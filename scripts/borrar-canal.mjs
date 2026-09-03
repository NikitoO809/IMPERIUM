// Borra canales, guardando antes una copia para poder recrearlos.
//
//   node scripts/borrar-canal.mjs <id,id,id>              (simula)
//   node scripts/borrar-canal.mjs <id,id,id> --aplicar
//   node scripts/borrar-canal.mjs --revertir              (los recrea todos)
//
// La copia (nombre, tipo, categoría, posición y permisos) se guarda en
// scripts/data/canales-borrados.json ANTES de borrar. Con --revertir se vuelven
// a crear tal como estaban.
//
// DOS AVISOS sobre esa marcha atrás:
//
//   1. El canal recreado tiene un ID NUEVO. Lo que apuntase al id viejo (un
//      bot, una variable de .env.local, un enlace pegado en un mensaje) hay que
//      volver a apuntarlo a mano.
//   2. Los MENSAJES no vuelven. Aquí da igual porque se usa con canales de voz
//      vacíos, pero no lo uses con un canal de texto con conversación dentro.
import fs from "node:fs";

const REVERTIR = process.argv.includes("--revertir");
const APLICAR = process.argv.includes("--aplicar");
const LISTA = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : null;

if (!LISTA && !REVERTIR) {
  console.error("\n  uso: node scripts/borrar-canal.mjs <id,id,id> [--aplicar]");
  console.error("       node scripts/borrar-canal.mjs --revertir\n");
  process.exit(1);
}

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    })
);
const G = env.DISCORD_GUILD_ID;
const H = {
  Authorization: "Bot " + env.DISCORD_BOT_TOKEN,
  "Content-Type": "application/json",
  "X-Audit-Log-Reason": "Limpieza de canales, pedida por Miguel",
};
const api = (ruta, opts) => fetch(`https://discord.com/api/v10${ruta}`, { headers: H, ...opts });

const COPIAS = "scripts/data/canales-borrados.json";
const copias = fs.existsSync(COPIAS) ? JSON.parse(fs.readFileSync(COPIAS, "utf8")) : {};
const guardar = () => {
  fs.mkdirSync("scripts/data", { recursive: true });
  fs.writeFileSync(COPIAS, JSON.stringify(copias, null, 1), "utf8");
};

const TIPOS = { 0: "texto", 2: "voz", 4: "categoría", 5: "anuncios", 15: "foro" };

// ── Recrear lo borrado ───────────────────────────────────────────

if (REVERTIR) {
  const pendientes = Object.entries(copias);
  if (!pendientes.length) {
    console.log("\n  no tengo ningún canal guardado para recrear.\n");
    process.exit(0);
  }
  console.log("");
  for (const [id, c] of pendientes) {
    const res = await api(`/guilds/${G}/channels`, {
      method: "POST",
      body: JSON.stringify({
        name: c.name,
        type: c.type,
        parent_id: c.parent_id,
        position: c.position,
        permission_overwrites: c.permission_overwrites,
        ...(c.type === 2 ? { bitrate: c.bitrate, user_limit: c.user_limit } : {}),
      }),
    });
    if (!res.ok) {
      console.error(`  FALLO ${res.status} al recrear ${c.name}: ${(await res.text()).slice(0, 150)}`);
      continue;
    }
    const nuevo = await res.json();
    console.log(`  recreado   ${c.name}   (id nuevo: ${nuevo.id}, el viejo era ${id})`);
    delete copias[id];
    guardar();
  }
  console.log("\n  ojo: los ids son nuevos. Si algún bot o variable apuntaba a los viejos, hay que reapuntarlos.\n");
  process.exit(0);
}

// ── Borrar ───────────────────────────────────────────────────────

const ids = LISTA.split(",").map((s) => s.trim()).filter(Boolean);
const trabajo = [];

console.log("");
for (const id of ids) {
  const res = await api(`/channels/${id}`);
  if (!res.ok) {
    console.log(`  no existe        ${id}`);
    continue;
  }
  const c = await res.json();
  console.log(`  se borraría      ${(TIPOS[c.type] ?? c.type).padEnd(10)} ${c.name}`);
  trabajo.push(c);
}

if (!APLICAR) {
  console.log(`\n  ${trabajo.length} canales. (simulación: añade --aplicar)\n`);
  process.exit(0);
}
if (!trabajo.length) {
  console.log("\n  nada que borrar.\n");
  process.exit(0);
}

console.log("");
for (const c of trabajo) {
  // La copia se guarda ANTES de borrar: si el borrado falla no pasa nada, pero
  // si se borra sin copia ya no hay vuelta atrás.
  copias[c.id] = {
    name: c.name,
    type: c.type,
    parent_id: c.parent_id,
    position: c.position,
    permission_overwrites: c.permission_overwrites,
    bitrate: c.bitrate,
    user_limit: c.user_limit,
    borrado: new Date().toISOString(),
  };
  guardar();

  const res = await api(`/channels/${c.id}`, { method: "DELETE" });
  if (res.ok) {
    console.log(`  borrado    ${c.name}`);
  } else {
    console.error(`  FALLO ${res.status} en ${c.name}: ${(await res.text()).slice(0, 150)}`);
    delete copias[c.id];
    guardar();
  }
}

console.log("\n  para recrearlos:  node scripts/borrar-canal.mjs --revertir\n");

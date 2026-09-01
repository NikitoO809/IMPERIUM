// Manda por PRIVADO el desplegable para elegir clase de AION 2.
//
//   node scripts/privado-clases.mjs --a 241630173299081216,1041000695953903676
//   node scripts/privado-clases.mjs --rol "AION 2" --sin-clase
//   node scripts/privado-clases.mjs --rol "AION 2" --sin-clase --de-verdad
//
// Sin --de-verdad hace un ENSAYO: dice a quién escribiría y no manda nada.
//
// Se ejecuta en TU ORDENADOR, no en la web: Vercel se corta al minuto y
// Discord frena los envíos, así que aquí no hay prisa.
//
// APUNTA a quién ya escribió en scripts/data/privados-clases.json. Si se corta
// a medias, lo relanzas y sigue por donde iba: nadie lo recibe dos veces. Para
// volver a escribirle a alguien, bórralo de ese fichero.
//
// OJO: el desplegable no hace nada hasta que el código esté DESPLEGADO en
// Vercel, porque el clic lo atiende la web (/api/discord/interactions).
import fs from "node:fs";

const arg = (n) => {
  const i = process.argv.indexOf(n);
  return i > -1 ? process.argv[i + 1] : null;
};
const DE_VERDAD = process.argv.includes("--de-verdad");
const SIN_CLASE = process.argv.includes("--sin-clase");
const A = arg("--a");
const ROL = arg("--rol");

if (!A && !ROL) {
  console.error('\n  uso: node scripts/privado-clases.mjs --a <id,id>  |  --rol "AION 2" [--sin-clase] [--de-verdad]\n');
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
const H = { Authorization: "Bot " + env.DISCORD_BOT_TOKEN, "Content-Type": "application/json" };
const api = (ruta, opts) => fetch(`https://discord.com/api/v10${ruta}`, { headers: H, ...opts });

// Las ocho clases. La fuente de verdad es src/lib/discord-clases.ts: si se
// tocan los roles allí, hay que tocarlos aquí también (y al revés).
const CLASES = [
  ["1541651913714569246", "Templar", "Tanque", "Templar", "1541674638776606811"],
  ["1541668219121836183", "Gladiator", "Daño cuerpo a cuerpo", "Gladiator", "1541674524884475925"],
  ["1541652150722232421", "Ranger", "Daño a distancia", "Ranger", "1541674552571076658"],
  ["1541652212122390568", "Assassin", "Daño explosivo", "Assassin", "1541674437764587570"],
  ["1541668617177931876", "Sorcerer", "Daño mágico", "Sorcerer", "1541674581016838145"],
  ["1541668714594836540", "Spiritmaster", "Invocador", "Summoner", "1541674609429192825"],
  ["1541668075450142771", "Cleric", "Sanador", "Cleric", "1541674499445882920"],
  ["1541667952464633936", "Chanter", "Soporte", "Chanter", "1541674470320775248"],
];
const ROLES_CLASE = CLASES.map((c) => c[0]);

const MENSAJE = {
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
  components: [
    {
      type: 1,
      components: [
        {
          type: 3,
          custom_id: `clase:${G}`,
          placeholder: "Selecciona tu clase",
          min_values: 1,
          max_values: 1,
          options: CLASES.map(([rol, nombre, papel, em, emId]) => ({
            label: nombre,
            value: rol,
            description: papel,
            emoji: { name: em, id: emId },
          })),
        },
      ],
    },
  ],
};

// ── A quién ──────────────────────────────────────────────────────

async function todosLosMiembros() {
  let after = "0";
  let todos = [];
  for (;;) {
    const l = await (await api(`/guilds/${G}/members?limit=1000&after=${after}`)).json();
    if (!Array.isArray(l) || !l.length) break;
    todos = todos.concat(l);
    after = l[l.length - 1].user.id;
    if (l.length < 1000) break;
  }
  return todos;
}

const miembros = await todosLosMiembros();
const nombre = (m) => m.nick || m.user.global_name || m.user.username;
let gente = [];

if (A) {
  for (const id of A.split(",").map((s) => s.trim()).filter(Boolean)) {
    const m = miembros.find((x) => x.user.id === id);
    if (!m) console.log(`  no está en el servidor   ${id}`);
    else gente.push(m);
  }
} else {
  const roles = await (await api(`/guilds/${G}/roles`)).json();
  const rol = roles.find((r) => r.id === ROL || r.name.toLowerCase() === ROL.toLowerCase());
  if (!rol) {
    console.error(`\n  no encuentro el rol "${ROL}".\n`);
    process.exit(1);
  }
  gente = miembros.filter((m) => m.roles.includes(rol.id));
  console.log(`\n  rol "${rol.name}": ${gente.length} personas`);
}

gente = gente.filter((m) => !m.user.bot);
if (SIN_CLASE) {
  const antes = gente.length;
  gente = gente.filter((m) => !m.roles.some((r) => ROLES_CLASE.includes(r)));
  console.log(`  con clase ya elegida: ${antes - gente.length} (fuera)`);
}

// Los que ya lo recibieron en un intento anterior.
const APUNTE = "scripts/data/privados-clases.json";
const yaEscritos = fs.existsSync(APUNTE) ? JSON.parse(fs.readFileSync(APUNTE, "utf8")) : {};
const repetidos = gente.filter((m) => yaEscritos[m.user.id]);
gente = gente.filter((m) => !yaEscritos[m.user.id]);
if (repetidos.length) console.log(`  ya lo recibieron antes: ${repetidos.length} (fuera)`);

console.log(`\n  A ESCRIBIR: ${gente.length}\n`);
gente.forEach((m, i) => console.log(`  ${String(i + 1).padStart(3)}. ${nombre(m)}`));

if (!DE_VERDAD) {
  console.log("\n  ensayo: no he mandado nada. Añade --de-verdad para enviarlo.\n");
  process.exit(0);
}
if (!gente.length) {
  console.log("\n  nadie a quien escribir.\n");
  process.exit(0);
}

// ── Enviar ───────────────────────────────────────────────────────

// Discord frena los privados en cuanto se manda de seguido; cuando lo hace,
// dice cuánto hay que esperar y aquí se le hace caso sin rechistar.
const PAUSA = 900;
const cuenta = { entregado: 0, cerrado: 0, error: 0 };
const cerrados = [];

console.log("");
for (const m of gente) {
  const quien = nombre(m);
  let estado = "error";
  for (let intento = 1; intento <= 5; intento++) {
    const canal = await api("/users/@me/channels", {
      method: "POST",
      body: JSON.stringify({ recipient_id: m.user.id }),
    });
    // 403 = esa persona no acepta privados de este servidor. Es lo más común.
    if (canal.status === 403) {
      estado = "cerrado";
      break;
    }
    if (canal.status === 429) {
      const espera = ((await canal.json()).retry_after ?? 5) + 1;
      console.log(`  esperando ${Math.ceil(espera)}s…`);
      await new Promise((s) => setTimeout(s, espera * 1000));
      continue;
    }
    if (!canal.ok) break;
    const { id } = await canal.json();
    const res = await api(`/channels/${id}/messages`, { method: "POST", body: JSON.stringify(MENSAJE) });
    if (res.ok) {
      estado = "entregado";
      break;
    }
    if (res.status === 403) {
      estado = "cerrado";
      break;
    }
    if (res.status === 429) {
      const espera = ((await res.json()).retry_after ?? 5) + 1;
      console.log(`  esperando ${Math.ceil(espera)}s…`);
      await new Promise((s) => setTimeout(s, espera * 1000));
      continue;
    }
    console.error(`  FALLO ${res.status}: ${(await res.text()).slice(0, 150)}`);
    break;
  }
  cuenta[estado]++;
  if (estado === "cerrado") cerrados.push(quien);
  console.log(`  ${estado.padEnd(10)} ${quien}`);
  if (estado === "entregado") {
    yaEscritos[m.user.id] = new Date().toISOString();
    fs.mkdirSync("scripts/data", { recursive: true });
    fs.writeFileSync(APUNTE, JSON.stringify(yaEscritos, null, 1), "utf8");
  }
  await new Promise((s) => setTimeout(s, PAUSA));
}

console.log(`\n  entregados: ${cuenta.entregado}   privados cerrados: ${cuenta.cerrado}   fallos: ${cuenta.error}`);
if (cerrados.length) console.log(`\n  no les llega (tienen los privados cerrados):\n   ${cerrados.join(", ")}`);
console.log("");

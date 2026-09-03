// Deja canales visibles SOLO para un rol.
//
//   node scripts/cerrar-canales.mjs <idRol> <idCanal,idCanal,...>            (simula)
//   node scripts/cerrar-canales.mjs <idRol> <idCanal,idCanal,...> --aplicar
//   node scripts/cerrar-canales.mjs --revertir                               (deshace todo)
//
// En cada canal hace tres cosas:
//   1. A @everyone le NIEGA "ver el canal".
//   2. Al rol indicado se lo PERMITE.
//   3. A cualquier otro rol que hoy pueda verlo, se lo quita — si no, la
//      puerta seguiría abierta por otro lado. Los roles de administrador se
//      dejan en paz: se saltan los permisos igualmente, así que quitárselo
//      no cambiaría nada y solo ensucia.
//
// Antes de tocar nada guarda los permisos enteros de cada canal en
// scripts/data/permisos-antes.json. Con --revertir se dejan como estaban.
//
// AVISO: tú no vas a poder comprobar si funciona. Los administradores y los
// roles EL JEFE / Oficial IMP / Developer IMP ven todos los canales pase lo
// que pase. Para probarlo de verdad hace falta una cuenta normal.
import fs from "node:fs";

const REVERTIR = process.argv.includes("--revertir");
const APLICAR = process.argv.includes("--aplicar");
const [ROL, CANALES] = process.argv.slice(2);

if (!REVERTIR && (!ROL || !CANALES || CANALES.startsWith("--"))) {
  console.error("\n  uso: node scripts/cerrar-canales.mjs <idRol> <idCanal,idCanal> [--aplicar]");
  console.error("       node scripts/cerrar-canales.mjs --revertir\n");
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
  "X-Audit-Log-Reason": "Canales reservados a un rol, pedido por Miguel",
};
const api = (r, o) => fetch(`https://discord.com/api/v10${r}`, { headers: H, ...o });

const VER = 1n << 10n; // VIEW_CHANNEL
const ADMIN = 1n << 3n;

const COPIAS = "scripts/data/permisos-antes.json";
const copias = fs.existsSync(COPIAS) ? JSON.parse(fs.readFileSync(COPIAS, "utf8")) : {};
const guardar = () => {
  fs.mkdirSync("scripts/data", { recursive: true });
  fs.writeFileSync(COPIAS, JSON.stringify(copias, null, 1), "utf8");
};

const roles = await (await api(`/guilds/${G}/roles`)).json();
const nombreRol = (id) => (id === G ? "@everyone" : roles.find((r) => r.id === id)?.name ?? `(id ${id})`);
const esAdmin = (id) => {
  const r = roles.find((x) => x.id === id);
  return r ? Boolean(BigInt(r.permissions) & ADMIN) : false;
};

// ── Deshacer ─────────────────────────────────────────────────────

if (REVERTIR) {
  const pendientes = Object.entries(copias);
  if (!pendientes.length) {
    console.log("\n  no tengo permisos guardados de ningún canal.\n");
    process.exit(0);
  }
  console.log("");
  for (const [id, c] of pendientes) {
    const res = await api(`/channels/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ permission_overwrites: c.permission_overwrites }),
    });
    if (res.ok) {
      console.log(`  devuelto a como estaba   ${c.name}`);
      delete copias[id];
      guardar();
    } else {
      console.error(`  FALLO ${res.status} en ${c.name}: ${(await res.text()).slice(0, 150)}`);
    }
  }
  console.log("");
  process.exit(0);
}

// ── Cerrar ───────────────────────────────────────────────────────

const rol = roles.find((r) => r.id === ROL);
if (!rol) {
  console.error(`\n  no existe el rol ${ROL}.\n`);
  process.exit(1);
}

console.log(`\n  se abrirá solo para: ${rol.name}\n`);

const ids = CANALES.split(",").map((s) => s.trim()).filter(Boolean);
const trabajo = [];

for (const id of ids) {
  const c = await (await api(`/channels/${id}`)).json();
  if (!c.id) {
    console.log(`  no existe   ${id}`);
    continue;
  }
  const ovs = c.permission_overwrites ?? [];
  const acciones = [];

  const ev = ovs.find((o) => o.id === G);
  if (!ev || !(BigInt(ev.deny) & VER)) acciones.push("ocultarlo a todo el mundo");

  const mio = ovs.find((o) => o.id === ROL);
  if (!mio || !(BigInt(mio.allow) & VER)) acciones.push(`dejar ver a "${rol.name}"`);

  const sobran = ovs.filter(
    (o) => o.type === 0 && o.id !== G && o.id !== ROL && BigInt(o.allow) & VER && !esAdmin(o.id)
  );
  for (const s of sobran) acciones.push(`quitar el acceso a "${nombreRol(s.id)}"`);

  console.log(`  ${c.name}`);
  if (!acciones.length) console.log("      ya estaba como quieres");
  else acciones.forEach((a) => console.log(`      · ${a}`));

  trabajo.push({ canal: c, sobran, ev, mio });
}

if (!APLICAR) {
  console.log(`\n  ${trabajo.length} canales. (simulación: añade --aplicar)\n`);
  process.exit(0);
}

console.log("");
for (const t of trabajo) {
  const c = t.canal;
  // La copia, antes de tocar nada.
  if (!(c.id in copias)) {
    copias[c.id] = { name: c.name, permission_overwrites: c.permission_overwrites ?? [] };
    guardar();
  }

  const pon = async (id, tipo, allow, deny) => {
    const res = await api(`/channels/${c.id}/permissions/${id}`, {
      method: "PUT",
      body: JSON.stringify({ type: tipo, allow: allow.toString(), deny: deny.toString() }),
    });
    if (!res.ok) console.error(`  FALLO ${res.status} en ${c.name}: ${(await res.text()).slice(0, 150)}`);
    return res.ok;
  };

  // 1) @everyone: se le niega ver, conservando lo que ya tuviera.
  const evAllow = t.ev ? BigInt(t.ev.allow) & ~VER : 0n;
  const evDeny = (t.ev ? BigInt(t.ev.deny) : 0n) | VER;
  await pon(G, 0, evAllow, evDeny);

  // 2) El rol: se le deja ver, conservando lo que ya tuviera.
  const miAllow = (t.mio ? BigInt(t.mio.allow) : 0n) | VER;
  const miDeny = t.mio ? BigInt(t.mio.deny) & ~VER : 0n;
  await pon(ROL, 0, miAllow, miDeny);

  // 3) Los demás roles que podían verlo dejan de poder.
  for (const s of t.sobran) {
    const a = BigInt(s.allow) & ~VER;
    const d = BigInt(s.deny);
    if (a === 0n && d === 0n) {
      await api(`/channels/${c.id}/permissions/${s.id}`, { method: "DELETE" });
    } else {
      await pon(s.id, 0, a, d);
    }
  }

  console.log(`  cerrado   ${c.name}`);
}

console.log("\n  para deshacerlo:  node scripts/cerrar-canales.mjs --revertir\n");

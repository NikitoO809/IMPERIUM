// Memoria de la intro: si ya se vio (versión corta en siguientes visitas) y
// si ya sonó en esta sesión (no se repite al volver a la portada). La URL
// manda por encima de todo: ?intro=full | short | 0 | high | medium | low.
import type { Tier } from "./quality";

const SEEN = "imperium:intro-seen";
const SESSION = "imperium:intro-session";

export interface IntroDecision {
  mode: "full" | "short" | "none";
  force: Tier | null;
}

function read(store: Storage, key: string): string | null {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}
function write(store: Storage, key: string, value: string) {
  try {
    store.setItem(key, value);
  } catch {
    // Sin almacenamiento (modo privado, etc.): la intro simplemente vuelve a sonar.
  }
}

export function decideIntro(search: string): IntroDecision {
  const param = new URLSearchParams(search).get("intro");
  if (param === "0" || param === "off" || param === "none") return { mode: "none", force: null };
  if (param === "full") return { mode: "full", force: "high" };
  if (param === "short") return { mode: "short", force: "high" };
  if (param === "high" || param === "medium" || param === "low") return { mode: "full", force: param };
  if (read(sessionStorage, SESSION)) return { mode: "none", force: null };
  return { mode: read(localStorage, SEEN) ? "short" : "full", force: null };
}

export function markIntroSeen() {
  write(localStorage, SEEN, String(Date.now()));
  write(sessionStorage, SESSION, "1");
}

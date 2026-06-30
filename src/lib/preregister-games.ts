// Lista curada de MMORPG próximos más esperados.
// Fuente de los datos: ranking "Highest Hyped" + fichas de
// https://www.mmorpg.com/games (extraído el 2026-06-14). Cada juego enlaza a
// su FICHA en mmorpg.com (infoUrl). NO es la página oficial de preregistro:
// cuando exista un enlace oficial, rellena `preRegisterUrl` y el botón pasará
// a "Preregistrarse". `hype` es la puntuación de expectación de la comunidad.
//
// Las imágenes son los logos oficiales que sirve mmorpg.com (PNG con
// transparencia, ~125px): se muestran centrados sin recorte (object-contain).
// La fecha de lanzamiento de la web es poco fiable (contradice el estado), por
// eso no se incluye: añade `releaseWindow` solo con un dato real y verificado.

import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";
import { logDbError } from "@/lib/log";

export type PreRegisterGame = {
  key: string; // clave estable y única
  name: string;
  genre: string; // p.ej. "MMORPG", "MMO de acción", "ARPG"
  status: string; // estado del desarrollo: "En desarrollo", "Beta", ...
  hype?: number; // puntuación de expectación (mmorpg.com)
  platforms?: string[]; // p.ej. ["PC", "PS5"]
  developer?: string; // estudio
  publisher?: string; // editora
  releaseWindow?: string; // p.ej. "2026" (solo si es fiable)
  blurb: string; // una frase
  image: string | null; // logo (null → degradado con el nombre)
  infoUrl: string; // ficha del juego (mmorpg.com) — siempre presente
  website?: string; // web OFICIAL del juego (verificada). El botón "Ver juego"
  //                   la usa si existe; si no, cae a infoUrl (ficha).
  preRegisterUrl?: string; // enlace OFICIAL de preregistro, si existe
};

const MMORPG = "https://www.mmorpg.com";
const LOGO = "https://images.mmorpg.com/images/games/logos/32";

// Fallback si no hay base de datos / tabla vacía (mantiene la home funcionando).
export const FALLBACK_PREREGISTER: PreRegisterGame[] = [
  {
    key: "chrono-odyssey",
    name: "Chrono Odyssey",
    genre: "MMO de acción",
    status: "En desarrollo",
    hype: 9.5,
    platforms: ["PC", "Consolas", "Móvil"],
    developer: "Kakao Games",
    blurb: "MMO de acción de mundo abierto. El más esperado según MMORPG.com.",
    image: `${LOGO}/1729_32.png?cb=DFC1F202AF68D2BDE5FD8780F3349200`,
    infoUrl: `${MMORPG}/chrono-odyssey`,
    website: "https://chronoodyssey.kakaogames.com/",
  },
  {
    key: "path-of-exile-2",
    name: "Path of Exile 2",
    genre: "ARPG",
    status: "En desarrollo",
    hype: 9.0,
    developer: "Grinding Gear Games",
    blurb: "ARPG de acción muy esperado por la comunidad.",
    image: `${LOGO}/1737_32.png?cb=8A49B519D5661DCDFE48688DD653859A`,
    infoUrl: `${MMORPG}/path-of-exile-2`,
    website: "https://pathofexile2.com/",
  },
  {
    key: "blue-protocol",
    name: "Blue Protocol",
    genre: "MMORPG",
    status: "En desarrollo",
    hype: 8.8,
    developer: "Bandai Namco",
    publisher: "Bandai Namco",
    blurb: "MMORPG de estética anime entre los más esperados del momento.",
    image: `${LOGO}/1630_32.png?cb=085EEBA2173A4143E3AE66F819395499`,
    infoUrl: `${MMORPG}/blue-protocol`,
  },
  {
    key: "fractured-veil",
    name: "Fractured Veil",
    genre: "MMO de acción",
    status: "En desarrollo",
    hype: 8.6,
    developer: "Paddle Creek Games",
    blurb: "MMO de acción y supervivencia en desarrollo.",
    image: `${LOGO}/1829_32.png?cb=044605B4C5C382FB447D4BAC9FED7F37`,
    infoUrl: `${MMORPG}/fractured-veil`,
  },
  {
    key: "palia",
    name: "Palia",
    genre: "MMO",
    status: "Beta",
    hype: 8.3,
    platforms: ["PC", "Switch"],
    developer: "Singularity 6",
    blurb: "MMO acogedor de vida y comunidad, en fase beta.",
    image: `${LOGO}/1769_32.png?cb=86598693DBD7EB68624A340C819042B9`,
    infoUrl: `${MMORPG}/palia`,
    website: "https://palia.com/",
  },
  {
    key: "throne-and-liberty",
    name: "Throne and Liberty",
    genre: "MMORPG",
    status: "Por confirmar",
    hype: 8.1,
    platforms: ["PC", "PS5"],
    developer: "NCSoft",
    publisher: "Amazon Games",
    blurb: "MMORPG de gran escala con combate dinámico.",
    image: `${LOGO}/1807_32.png?cb=EDF0ACD84E3FF7C3422EDA8C820144A4`,
    infoUrl: `${MMORPG}/throne-and-liberty`,
    website: "https://www.playthroneandliberty.com/",
  },
  {
    key: "archeage-chronicles",
    name: "ArcheAge Chronicles",
    genre: "MMO de acción",
    status: "En desarrollo",
    platforms: ["PC", "Xbox Series", "PS5"],
    developer: "XLGAMES",
    publisher: "Kakao Games",
    blurb: "Nueva entrega de la saga ArcheAge, en desarrollo.",
    image: `${LOGO}/1832_32.png?cb=CB21BBE62F47AA20D773667B53F9719B`,
    infoUrl: `${MMORPG}/archeage-chronicles`,
    website: "https://archeagechronicles.kakaogames.com/",
  },
  {
    key: "iron-and-magic",
    name: "Iron and Magic",
    genre: "MMORPG",
    status: "En desarrollo",
    developer: "DeHorizon",
    blurb: "MMORPG en desarrollo. Sigue sus novedades en la ficha.",
    image: `${LOGO}/1822_32.png?cb=1808639C1F97DA464B5D0D66B4BA0AF2`,
    infoUrl: `${MMORPG}/iron-and-magic`,
  },
  {
    key: "legacy-steel-and-sorcery",
    name: "Legacy: Steel & Sorcery",
    genre: "ARPG",
    status: "En desarrollo",
    developer: "Notorious Studios",
    blurb: "Acción PvPvE de extracción y fantasía, en desarrollo.",
    image: `${LOGO}/1814_32.png?cb=AEEB711BBE0CA79558CC676F788F134D`,
    infoUrl: `${MMORPG}/legacy-steel-and-sorcery`,
    website: "https://www.playlegacy.gg/",
  },
  {
    key: "the-hidden-ones",
    name: "The Hidden Ones",
    genre: "ARPG",
    status: "En desarrollo",
    developer: "Morefun Studios",
    publisher: "Tencent",
    blurb: "ARPG en desarrollo entre los más vigilados de la comunidad.",
    image: `${LOGO}/1907_32.png?cb=C465E230447ADF05797E3877778C9895`,
    infoUrl: `${MMORPG}/the-hidden-ones`,
    website: "https://morefunstudios.com/",
  },
];

// ── Lectura desde la base de datos (con fallback al array) ───────
type PreRegRow = {
  id: string;
  key: string;
  name: string;
  genre: string | null;
  status: string | null;
  hype: number | null;
  platforms: string[] | null;
  developer: string | null;
  publisher: string | null;
  release_window: string | null;
  blurb: string | null;
  image: string | null;
  info_url: string | null;
  website: string | null;
  prereg_url: string | null;
  order_index: number;
};

function rowToGame(r: PreRegRow): PreRegisterGame {
  return {
    key: r.key,
    name: r.name,
    genre: r.genre ?? "",
    status: r.status ?? "",
    hype: r.hype ?? undefined,
    platforms: r.platforms ?? undefined,
    developer: r.developer ?? undefined,
    publisher: r.publisher ?? undefined,
    releaseWindow: r.release_window ?? undefined,
    blurb: r.blurb ?? "",
    image: r.image,
    infoUrl: r.info_url ?? "",
    website: r.website ?? undefined,
    preRegisterUrl: r.prereg_url ?? undefined,
  };
}

const PREREG_SELECT =
  "id, key, name, genre, status, hype, platforms, developer, publisher, release_window, blurb, image, info_url, website, prereg_url, order_index";

// Lista pública para la home (desde la tabla, con fallback al array).
export async function getPreRegisterGames(): Promise<PreRegisterGame[]> {
  if (!SUPABASE_CONFIGURED) return FALLBACK_PREREGISTER;
  const supabase = await createClient();
  const { data, error } = await supabase.from("preregister_games").select(PREREG_SELECT).order("order_index");
  if (error) logDbError("getPreRegisterGames.preregister_games", error);
  const rows = (data ?? []) as PreRegRow[];
  if (rows.length === 0) return FALLBACK_PREREGISTER;
  return rows.map(rowToGame);
}

// Una ficha individual por su `key` (para el "mundo" del juego próximo).
// Usa el fallback si Supabase no está configurado o no está en la tabla.
export async function getPreRegisterGame(key: string): Promise<PreRegisterGame | null> {
  if (!SUPABASE_CONFIGURED) return FALLBACK_PREREGISTER.find((g) => g.key === key) ?? null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("preregister_games")
    .select(PREREG_SELECT)
    .eq("key", key)
    .maybeSingle();
  if (error) logDbError("getPreRegisterGame.preregister_games", error);
  if (data) return rowToGame(data as PreRegRow);
  return FALLBACK_PREREGISTER.find((g) => g.key === key) ?? null;
}

// Para el panel: incluye id y orderIndex (para editar / reordenar).
export type AdminPreRegisterGame = PreRegisterGame & { id: string; orderIndex: number };

export async function getAdminPreRegisterGames(): Promise<AdminPreRegisterGame[]> {
  if (!SUPABASE_CONFIGURED) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("preregister_games").select(PREREG_SELECT).order("order_index");
  if (error) logDbError("getAdminPreRegisterGames.preregister_games", error);
  return ((data ?? []) as PreRegRow[]).map((r) => ({
    ...rowToGame(r),
    id: r.id,
    orderIndex: r.order_index,
  }));
}

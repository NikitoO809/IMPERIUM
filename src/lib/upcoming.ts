// Juegos "que estamos esperando" como comunidad. NO viven en la tabla games
// (aún no tienen guías); son cartas de "próximamente" con un contador de cuánta
// gente los espera (tabla game_subscriptions) y un botón "Avísame".
//
// Los datos de cada juego se editan desde el panel (/admin/proximos) y se
// guardan en la tabla `upcoming_games`. El array FALLBACK_UPCOMING se usa solo
// si Supabase no está configurado o la tabla está vacía (para no quedar en blanco).
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";

export type UpcomingGame = {
  key: string; // clave estable (= game_subscriptions.game_key)
  name: string;
  tag: string; // género/etiqueta corta
  blurb: string; // una frase de por qué lo esperamos
  // Imagen opcional de portada. Si es null, la card usa una portada degradada.
  image: string | null;
  // Identidad del juego en los avisos de Discord:
  emoji: string; // círculo de color que lo representa en el tablero
  color: number; // color del embed del feed (entero decimal, p.ej. 0x7c5cff)
};

// Fallback si no hay base de datos (mantiene la home funcionando).
export const FALLBACK_UPCOMING: UpcomingGame[] = [
  {
    key: "guild-wars-3",
    name: "Guild Wars 3",
    tag: "MMORPG",
    blurb:
      "El esperado regreso de la saga. En cuanto haya más información, montamos comunidad y guías para arrancar todos juntos.",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1284210/library_hero.jpg",
    emoji: "🟣",
    color: 0x7c5cff,
  },
];

type UpcomingRow = {
  key: string;
  name: string;
  tag: string | null;
  blurb: string | null;
  image: string | null;
  emoji: string | null;
  color: number | null;
};

// Lista de juegos esperados (desde la tabla, con fallback al array).
export async function getUpcomingGameList(): Promise<UpcomingGame[]> {
  if (!SUPABASE_CONFIGURED) return FALLBACK_UPCOMING;
  const supabase = await createClient();
  const { data } = await supabase
    .from("upcoming_games")
    .select("key, name, tag, blurb, image, emoji, color")
    .order("order_index");
  const rows = (data ?? []) as UpcomingRow[];
  if (rows.length === 0) return FALLBACK_UPCOMING;
  return rows.map((r) => ({
    key: r.key,
    name: r.name,
    tag: r.tag ?? "",
    blurb: r.blurb ?? "",
    image: r.image,
    emoji: r.emoji ?? "🟣",
    color: r.color ?? 0x7c5cff,
  }));
}

// ── Para el panel de admin ───────────────────────────────────
export type AdminUpcomingGame = {
  id: string;
  key: string;
  name: string;
  tag: string;
  blurb: string;
  image: string | null;
  emoji: string;
  color: number;
  orderIndex: number;
  subscribers: number; // cuánta gente lo espera (suscripciones activas)
};

// Lista completa (con id y conteo de suscriptores) para gestionar en el panel.
export async function getAdminUpcomingGames(): Promise<AdminUpcomingGame[]> {
  if (!SUPABASE_CONFIGURED) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("upcoming_games")
    .select("id, key, name, tag, blurb, image, emoji, color, order_index")
    .order("order_index");
  const { data: counts } = await supabase.rpc("upcoming_game_counts");
  const countMap = new Map<string, number>(
    (counts ?? []).map((r: { game_key: string; subscribers: number }) => [
      r.game_key,
      Number(r.subscribers),
    ])
  );
  type Row = {
    id: string; key: string; name: string; tag: string | null; blurb: string | null;
    image: string | null; emoji: string | null; color: number | null; order_index: number;
  };
  return ((data ?? []) as Row[]).map((r) => ({
    id: r.id,
    key: r.key,
    name: r.name,
    tag: r.tag ?? "",
    blurb: r.blurb ?? "",
    image: r.image,
    emoji: r.emoji ?? "🟣",
    color: r.color ?? 0x7c5cff,
    orderIndex: r.order_index,
    subscribers: countMap.get(r.key) ?? 0,
  }));
}

export type UpcomingGameCard = UpcomingGame & {
  subscribers: number; // cuánta gente lo espera
  subscribed: boolean; // si el usuario actual ya está suscrito
};

// Devuelve los juegos esperados con su contador y si el usuario actual ya está
// suscrito a cada uno. Funciona sin sesión (subscribed = false para todos).
export async function getUpcomingGames(): Promise<UpcomingGameCard[]> {
  const list = await getUpcomingGameList();
  const base = list.map((g) => ({ ...g, subscribers: 0, subscribed: false }));
  if (!SUPABASE_CONFIGURED) return base;

  const supabase = await createClient();

  // Conteos públicos (RPC con security definer: solo totales, no quién).
  const { data: counts } = await supabase.rpc("upcoming_game_counts");
  const countMap = new Map<string, number>(
    (counts ?? []).map((r: { game_key: string; subscribers: number }) => [
      r.game_key,
      Number(r.subscribers),
    ])
  );

  // ¿A cuáles está suscrito el usuario actual? (RLS: solo ve las suyas.)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let mine = new Set<string>();
  if (user) {
    const { data } = await supabase
      .from("game_subscriptions")
      .select("game_key")
      .eq("user_id", user.id)
      .eq("active", true);
    mine = new Set((data ?? []).map((r: { game_key: string }) => r.game_key));
  }

  return base.map((g) => ({
    ...g,
    subscribers: countMap.get(g.key) ?? 0,
    subscribed: mine.has(g.key),
  }));
}

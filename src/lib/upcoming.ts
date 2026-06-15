// Juegos "que estamos esperando" como comunidad. NO viven en la tabla games
// (aún no tienen guías); son cartas de "próximamente" con un contador de cuánta
// gente los espera (tabla game_subscriptions) y un botón "Avísame".
//
// Para añadir un juego nuevo: agrega una entrada a UPCOMING_GAMES con una `key`
// estable y única (esa key es la que se guarda en game_subscriptions.game_key).
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";

export type UpcomingGame = {
  key: string; // clave estable (= game_subscriptions.game_key)
  name: string;
  tag: string; // género/etiqueta corta
  blurb: string; // una frase de por qué lo esperamos
  // Imagen opcional de portada (URL externa, se sirve con <img> normal).
  // Si es null, la card usa una portada degradada con el nombre.
  image: string | null;
  // Identidad del juego en los avisos de Discord:
  emoji: string; // círculo de color que lo representa en el tablero
  color: number; // color del embed del feed (entero decimal, p.ej. 0x7c5cff)
};

export const UPCOMING_GAMES: UpcomingGame[] = [
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

export type UpcomingGameCard = UpcomingGame & {
  subscribers: number; // cuánta gente lo espera
  subscribed: boolean; // si el usuario actual ya está suscrito
};

// Devuelve los juegos esperados con su contador y si el usuario actual ya está
// suscrito a cada uno. Funciona sin sesión (subscribed = false para todos).
export async function getUpcomingGames(): Promise<UpcomingGameCard[]> {
  const base = UPCOMING_GAMES.map((g) => ({
    ...g,
    subscribers: 0,
    subscribed: false,
  }));
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

// Contador de "gente esperando" un juego (el botón del banner de reclutamiento).
//
// No hace falta iniciar sesión: cada navegador guarda un token anónimo y solo
// puede sumar una vez por juego. Los datos viven en la tabla `game_hype`, que
// nadie toca en directo: se entra por las funciones hype_count / hype_join.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";
import { logDbError } from "@/lib/log";

// Cuánta gente espera el juego. Devuelve 0 si no hay base de datos configurada.
export async function getHypeCount(gameKey: string): Promise<number> {
  if (!SUPABASE_CONFIGURED) return 0;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("hype_count", { p_game_key: gameKey });
  if (error) {
    logDbError("getHypeCount.hype_count", error);
    return 0;
  }
  return Number(data ?? 0);
}

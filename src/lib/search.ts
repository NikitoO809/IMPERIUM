// Capa de datos del BUSCADOR GLOBAL (lado servidor).
// Llama a la función de Supabase `search_content`, que busca EN VIVO en guías
// (+ sus pasos), secciones (+ sus bloques) y héroes. Al consultar las tablas
// directamente, todo el contenido nuevo aparece solo (sin reindexar).
// La función es SECURITY INVOKER: la RLS decide qué ve cada quién (el público
// solo lo publicado; el admin también los borradores).
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";
import { logDbError } from "@/lib/log";

// Tipo de resultado que devuelve el buscador.
export type SearchKind = "guia" | "seccion" | "heroe";

export type SearchResult = {
  kind: SearchKind;
  gameSlug: string;
  gameName: string;
  url: string;
  title: string;
  subtitle: string;
  snippet: string | null;
  coverImage: string | null;
  rank: number;
};

// Forma cruda que devuelve la RPC (snake_case).
type SearchRow = {
  kind: string;
  game_slug: string;
  game_name: string;
  url: string;
  title: string;
  subtitle: string | null;
  snippet: string | null;
  cover_image: string | null;
  rank: number;
};

function mapRow(r: SearchRow): SearchResult {
  return {
    kind: (["guia", "seccion", "heroe"].includes(r.kind) ? r.kind : "guia") as SearchKind,
    gameSlug: r.game_slug,
    gameName: r.game_name,
    url: r.url,
    title: r.title,
    subtitle: r.subtitle ?? "",
    snippet: r.snippet,
    coverImage: r.cover_image,
    rank: r.rank,
  };
}

// Busca contenido. Devuelve [] si la consulta está vacía o Supabase no está configurado.
export async function searchContent(query: string, limit = 24): Promise<SearchResult[]> {
  const q = query.trim();
  if (!q || !SUPABASE_CONFIGURED) return [];

  const max = Math.min(Math.max(1, limit), 50);
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_content", { q, max_results: max });
  if (error) {
    logDbError("searchContent", error);
    return [];
  }
  return ((data ?? []) as SearchRow[]).map(mapRow);
}

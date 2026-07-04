// SALÓN DE LOS TITANES — el club VIP/whales de la alianza (Call of Dragons).
// Los que sostienen la guerra: poder, VIP, míticos y nivel de castillo.
// Se guardan en la tabla `titanes`; lectura pública de los publicados,
// escritura solo admin. El array FALLBACK_TITANES mantiene el salón con vida si
// Supabase no está configurado o la tabla está vacía.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";
import { logDbError } from "@/lib/log";

export type TitanTier = "diamante" | "rubi" | "oro";

export type Titan = {
  id: string;
  ign: string; // nombre en el juego
  epiteto: string; // "El Rompemuros", etc.
  avatarUrl: string | null;
  vipLevel: number;
  power: number; // poder total
  mythics: number; // héroes míticos
  castleLevel: number;
  tier: TitanTier;
  isFounder: boolean;
  quote: string; // su frase / flex
};

type TitanRow = {
  id: string;
  ign: string;
  epiteto: string | null;
  avatar_url: string | null;
  vip_level: number | null;
  power: number | string | null;
  mythics: number | null;
  castle_level: number | null;
  tier: string | null;
  is_founder: boolean | null;
  quote: string | null;
};

const SELECT =
  "id, ign, epiteto, avatar_url, vip_level, power, mythics, castle_level, tier, is_founder, quote";

function mapTitan(r: TitanRow): Titan {
  const tier: TitanTier = r.tier === "diamante" || r.tier === "rubi" ? r.tier : "oro";
  return {
    id: r.id,
    ign: r.ign,
    epiteto: r.epiteto ?? "",
    avatarUrl: r.avatar_url,
    vipLevel: r.vip_level ?? 0,
    power: Number(r.power ?? 0),
    mythics: r.mythics ?? 0,
    castleLevel: r.castle_level ?? 0,
    tier,
    isFounder: !!r.is_founder,
    quote: r.quote ?? "",
  };
}

// Reserva: mantiene el salón poblado si no hay base de datos / tabla vacía.
export const FALLBACK_TITANES: Titan[] = [
  { id: "emperor", ign: "Emperor", epiteto: "El que nunca falla un cofre", avatarUrl: null, vipLevel: 18, power: 92_000_000, mythics: 7, castleLevel: 30, tier: "diamante", isFounder: true, quote: "Ustedes ponen las tropas. Yo pongo el banco." },
  { id: "titan", ign: "Titan", epiteto: "El Coleccionista", avatarUrl: null, vipLevel: 16, power: 78_000_000, mythics: 5, castleLevel: 30, tier: "rubi", isFounder: false, quote: "" },
  { id: "kraken", ign: "Kraken", epiteto: "El Inquebrantable", avatarUrl: null, vipLevel: 15, power: 71_000_000, mythics: 4, castleLevel: 30, tier: "rubi", isFounder: false, quote: "" },
  { id: "ghost", ign: "Ghost", epiteto: "La Sombra Dorada", avatarUrl: null, vipLevel: 13, power: 54_000_000, mythics: 3, castleLevel: 29, tier: "oro", isFounder: false, quote: "" },
  { id: "valor", ign: "Valor", epiteto: "El Constante", avatarUrl: null, vipLevel: 12, power: 49_000_000, mythics: 2, castleLevel: 28, tier: "oro", isFounder: false, quote: "" },
];

// ── Web pública: solo Titanes publicados, ordenados (override manual → VIP → poder) ──
export async function getTitanes(): Promise<Titan[]> {
  if (!SUPABASE_CONFIGURED) return FALLBACK_TITANES;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("titanes")
    .select(SELECT)
    .eq("is_published", true)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("vip_level", { ascending: false })
    .order("power", { ascending: false });
  if (error) logDbError("getTitanes.titanes", error);
  const rows = (data ?? []) as unknown as TitanRow[];
  if (rows.length === 0) return FALLBACK_TITANES;
  return rows.map(mapTitan);
}

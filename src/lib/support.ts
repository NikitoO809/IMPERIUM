// Datos de la página "Apoyar IMPERIUM" (rangos de donante).
// Los PRECIOS son de ejemplo — Miguel los ajusta. El enlace de pago se toma de
// la variable de entorno NEXT_PUBLIC_KOFI_URL (Ko-fi). Si no está puesta, los
// botones caen a la invitación de Discord para no quedar rotos.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";
import type { Rank } from "@/lib/ranks";

export type SupportTier = {
  rank: Extract<Rank, "veterano" | "fundador" | "leyenda">;
  name: string;
  price: string; // texto editable (ejemplo)
  popular?: boolean;
  perks: string[];
};

// Meta de "primeros Fundadores" (gancho de escasez).
export const FOUNDERS_GOAL = 50;

// Enlace de pago (Ko-fi). Configúralo en .env.local: NEXT_PUBLIC_KOFI_URL=...
export const KOFI_URL = process.env.NEXT_PUBLIC_KOFI_URL ?? "";
export const DISCORD_INVITE = process.env.NEXT_PUBLIC_DISCORD_INVITE ?? "";

// Tiers de apoyo. Precios de EJEMPLO (3 / 8 / 20 €).
export const SUPPORT_TIERS: SupportTier[] = [
  {
    rank: "veterano",
    name: "Veterano",
    price: "3 €",
    perks: [
      "Escribir en la discusión de cada juego",
      "Crear alianzas",
      "Asistente IA · 10 consultas/día",
      "Nombre en color + insignia bronce",
    ],
  },
  {
    rank: "fundador",
    name: "Fundador",
    price: "8 €",
    popular: true,
    perks: [
      "Todo lo de Veterano",
      "Asistente IA · 30 consultas/día",
      "Insignia cian con brillo",
      "Más destacado en discusión y alianzas",
    ],
  },
  {
    rank: "leyenda",
    name: "Leyenda",
    price: "20 €",
    perks: [
      "Todo lo de Fundador",
      "Asistente IA · 100 consultas/día",
      "Insignia oro máximo brillo",
      "Tu nombre en el Muro de Fundadores",
    ],
  },
];

// Cuántos donantes hay ya (para la barra de meta). Cuenta desde la vista pública
// (funciona sin login). Si algo falla, devuelve 0.
export async function getDonorCount(): Promise<number> {
  if (!SUPABASE_CONFIGURED) return 0;
  const supabase = await createClient();
  const { count } = await supabase
    .from("public_profiles")
    .select("id", { count: "exact", head: true })
    .in("role", ["veterano", "fundador", "leyenda"]);
  return count ?? 0;
}

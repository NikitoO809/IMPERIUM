// Cliente de Supabase para el NAVEGADOR (componentes "use client").
// Usa solo la clave pública (anon) — segura para el frontend.
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

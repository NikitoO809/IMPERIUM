// ¿Están puestas las claves de Supabase? Si no, la web funciona igual pero
// el login queda desactivado (en vez de romperse).
export const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

"use client";

// Hook que da el usuario actual (o null) en componentes de cliente.
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";

export type AppUser = { id: string; name: string; avatar: string | null } | null;

type SupabaseUserLike = {
  id: string;
  user_metadata?: { full_name?: string; name?: string; avatar_url?: string };
};

function mapUser(u: SupabaseUserLike | null | undefined): AppUser {
  if (!u) return null;
  return {
    id: u.id,
    name: u.user_metadata?.full_name || u.user_metadata?.name || "Jugador",
    avatar: u.user_metadata?.avatar_url ?? null,
  };
}

export function useUser() {
  const [user, setUser] = useState<AppUser>(null);
  const [loading, setLoading] = useState(SUPABASE_CONFIGURED);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(mapUser(data.user as SupabaseUserLike | null));
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapUser(session?.user as SupabaseUserLike | undefined));
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, loading };
}

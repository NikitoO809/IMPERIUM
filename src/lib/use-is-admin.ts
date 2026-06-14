"use client";

// Hook que indica si el usuario actual es admin (para mostrar el enlace
// al panel solo a quien corresponde). El acceso real lo protege el servidor.
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    let active = true;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();
      if (active) setIsAdmin(profile?.role === "admin");
    });
    return () => {
      active = false;
    };
  }, []);

  return isAdmin;
}

"use client";

// Contador de "conectados ahora en la web" en tiempo real, vía Supabase Realtime
// (presence). Cada visita se une a un canal y cuenta cuántos hay. Si Realtime no
// está disponible, se queda en "—" sin romper nada.
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";

export function LivePresence() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    const supabase = createClient();
    // id anónimo por pestaña (no identifica a la persona, solo cuenta presencia).
    const key = Math.random().toString(36).slice(2);
    const channel = supabase.channel("online-users", { config: { presence: { key } } });

    channel
      .on("presence", { event: "sync" }, () => {
        setCount(Object.keys(channel.presenceState()).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ at: Date.now() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2">
        <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" />
        <span className="font-num text-4xl font-extrabold text-white tabular-nums">
          {count ?? "—"}
        </span>
      </div>
      <p className="mt-1 text-xs text-white/50">conectados ahora en la web</p>
    </div>
  );
}

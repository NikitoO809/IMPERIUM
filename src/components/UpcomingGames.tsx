"use client";

// Cards de juegos "que estamos esperando" como comunidad (sistema Glass Etéreo).
// Cada card muestra cuánta gente lo espera y un botón "Avísame":
//   - Sin sesión  → "Entra con Discord para avisarte" (inicia login).
//   - Suscrito    → "Te avisaremos ✓" (al pulsar, se desapunta).
//   - Sin suscribir → "Avísame cuando salga" (al pulsar, se apunta + avisa a Discord).
import { useState, useTransition } from "react";
import type { UpcomingGameCard } from "@/lib/upcoming";
import { toggleSubscription } from "@/app/(app)/actions";
import { useUser } from "@/lib/use-user";
import { LoginButton } from "@/components/auth/LoginButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { BellIcon, DiscordIcon } from "@/components/icons";

export function UpcomingGames({ games }: { games: UpcomingGameCard[] }) {
  const { user, loading } = useUser();

  if (games.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((g) => (
        <UpcomingCard key={g.key} game={g} loggedIn={Boolean(user)} authLoading={loading} />
      ))}
    </div>
  );
}

function UpcomingCard({
  game,
  loggedIn,
  authLoading,
}: {
  game: UpcomingGameCard;
  loggedIn: boolean;
  authLoading: boolean;
}) {
  // Estado local optimista: refleja el cambio al instante mientras la BD responde.
  const [subscribed, setSubscribed] = useState(game.subscribed);
  const [count, setCount] = useState(game.subscribers);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  function onToggle() {
    setError(false);
    const next = !subscribed;
    // Optimista.
    setSubscribed(next);
    setCount((c) => Math.max(0, c + (next ? 1 : -1)));
    startTransition(async () => {
      const res = await toggleSubscription(game.key);
      if (!res.ok) {
        // Revertir.
        setSubscribed(!next);
        setCount((c) => Math.max(0, c + (next ? -1 : 1)));
        setError(true);
      } else {
        setSubscribed(res.subscribed);
      }
    });
  }

  const waitingLabel = count === 1 ? "persona lo espera" : "personas lo esperan";

  return (
    <GlassCard hover className="h-full" innerClassName="h-full">
      <div className="flex h-full flex-col">
        {/* Portada */}
        <div className="relative h-36 overflow-hidden rounded-t-[calc(1.75rem-6px)]">
          {game.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={game.image}
              alt={game.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-brand/40 via-brand/10 to-accent/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <span className="eyebrow absolute left-4 top-4 !text-gold">Próximamente</span>
          <h3 className="font-display absolute bottom-3 left-4 right-4 text-2xl text-white">
            {game.name}
          </h3>
        </div>

        {/* Cuerpo */}
        <div className="flex flex-1 flex-col p-5">
          <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{game.tag}</span>
          <p className="mt-2.5 flex-1 text-sm leading-relaxed text-zinc-400">{game.blurb}</p>

          {/* Contador de gente esperando */}
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="font-num text-gold">{count}</span>
            <span className="text-zinc-500">{waitingLabel}</span>
          </div>

          {/* Botón */}
          <div className="mt-4">
            {authLoading ? (
              <div className="pill pill-ghost w-full justify-center opacity-50">…</div>
            ) : loggedIn ? (
              <button
                type="button"
                onClick={onToggle}
                disabled={pending}
                className={`pill w-full justify-center disabled:opacity-60 ${
                  subscribed ? "pill-ghost !text-gold" : "pill-primary"
                }`}
              >
                <BellIcon className="h-4 w-4" />
                {subscribed ? "Te avisaremos ✓" : "Avísame cuando salga"}
              </button>
            ) : (
              <LoginButton className="pill pill-primary w-full justify-center">
                <DiscordIcon className="h-4 w-4" />
                Entra con Discord para avisarte
              </LoginButton>
            )}
            {error && (
              <p className="mt-2 text-center text-xs text-red-300/80">
                No se pudo guardar. Inténtalo otra vez.
              </p>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

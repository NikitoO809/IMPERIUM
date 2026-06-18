// Salón de la FAMA — la élite de la comunidad sobre un fondo espacial
// interactivo. Pulsa un nombre para ver su hazaña. Se gestiona desde
// /admin/comunidad (sección "Mejores jugadores").
import type { Metadata } from "next";
import { getTopPlayers } from "@/lib/community";
import { TopPlayers } from "@/components/TopPlayers";
import { HudLabel } from "@/components/hud";

export const metadata: Metadata = {
  title: "Salón de la Fama",
  description:
    "La élite de la comunidad IMPERIUM. Los jugadores más destacados y sus hazañas.",
  alternates: { canonical: "/fama" },
};

export default async function FamaPage() {
  const players = await getTopPlayers();

  if (players.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 pt-12 pb-12 text-center">
        <HudLabel>Salón de la Fama</HudLabel>
        <h1 className="mt-3 font-title text-3xl font-extrabold tracking-wide text-glow-brand sm:text-4xl">
          Fama
        </h1>
        <p className="mt-4 text-sm text-white/45">
          Todavía no hay jugadores destacados. Vuelve pronto.
        </p>
      </main>
    );
  }

  return (
    <main>
      <TopPlayers players={players} />
    </main>
  );
}

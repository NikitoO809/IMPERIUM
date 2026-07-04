// Sección PRÓXIMOS: portal de juegos que vienen (hero + destacados + lista).
// Cada tarjeta lleva al "mundo" del juego (/proximos/[key]). Pública (escaparate
// + SEO). Dentro de (app): no añade header/footer.
import type { Metadata } from "next";
import { getPreRegisterGames } from "@/lib/preregister-games";
import { ProximosPortal } from "@/components/ProximosPortal";

export const metadata: Metadata = {
  title: "Próximos juegos",
  description:
    "Los juegos que vienen: MMORPG y más en el horizonte. Entra a cada uno, sigue sus novedades y organiza tu alianza para el día 1 con la comunidad IMPERIUM.",
  alternates: { canonical: "/proximos" },
};

export default async function ProximosPage() {
  const games = await getPreRegisterGames();

  return (
    <main className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6">
      <h1 className="sr-only">Próximos juegos — el horizonte de IMPERIUM</h1>
      <ProximosPortal games={games} />
    </main>
  );
}

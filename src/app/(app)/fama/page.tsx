// Salón de la Fama → SALÓN DE LOS TITANES: el club VIP/whales de la alianza,
// con trono para el #1 y tiers (Diamante · Rubí · Oro) sobre fondo espacial.
// Los datos viven en la tabla `titanes`; se administran (próximamente) desde el
// panel. Dentro de (app): no añade fondo/cabecera/footer propios.
import type { Metadata } from "next";
import { getTitanes } from "@/lib/titanes";
import TitanesHall from "@/components/TitanesHall";

// Refresca el ranking cada 5 min (ISR).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Salón de los Titanes",
  description:
    "Los Titanes de IMPERIUM: la élite que sostiene la alianza. Poder, VIP y héroes míticos de los mejores de la comunidad.",
  alternates: { canonical: "/fama" },
};

export default async function FamaPage() {
  const titanes = await getTitanes();
  return (
    <main>
      <TitanesHall titanes={titanes} />
    </main>
  );
}

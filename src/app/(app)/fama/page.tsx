// Salón de la Fama — las Leyendas de IMPERIUM: una fila de personajes 3D
// (renders propios, generados y recortados con scripts/fama) sobre un lago
// que los refleja, con un paisaje al fondo. Solo nombre y guild bajo cada uno;
// al pasar el ratón, cada leyenda hace su gesto. La lista vive en
// src/lib/fama/leyendas.ts. Sin cabecera de texto: el escenario ocupa todo el
// espacio entre la barra de navegación y el pie (el título queda solo para
// lectores de pantalla y buscadores).
// Dentro de (app): no añade fondo/cabecera/footer propios.
import type { Metadata } from "next";
import { LEYENDAS_VISIBLES } from "@/lib/fama/leyendas";
import { LegendsStage } from "@/components/fama/LegendsStage";

export const metadata: Metadata = {
  title: "Salón de la Fama",
  description:
    "Las Leyendas de IMPERIUM: los nombres que sostuvieron el estandarte de la comunidad. La foto de familia del gremio.",
  alternates: { canonical: "/fama" },
};

export default function FamaPage() {
  return (
    <main className="ly-page">
      <h1 className="sr-only">Salón de la Fama · Leyendas de IMPERIUM</h1>
      <LegendsStage leyendas={LEYENDAS_VISIBLES} />
    </main>
  );
}

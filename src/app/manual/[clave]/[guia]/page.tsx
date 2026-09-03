// Manual de Atreia — una guía.
//
// Misma puerta que el índice: si la clave del enlace no es la buena, 404. El
// visor es de cliente porque el interruptor de idioma y el de PvE/PvP cambian
// sin recargar.
import { notFound } from "next/navigation";
import { claveValida, indiceHref } from "@/lib/manual/acceso";
import { getGuia } from "@/lib/manual";
import { ManualViewer } from "@/components/ManualViewer";

type Props = { params: Promise<{ clave: string; guia: string }> };

export async function generateMetadata({ params }: Props) {
  const { clave, guia } = await params;
  // Sin la clave buena no se dice ni qué guía es.
  if (!claveValida(clave)) return { title: "Manual de Atreia" };
  const g = getGuia(guia);
  return { title: g ? `${g.nombre} · Manual de Atreia` : "Manual de Atreia" };
}

export default async function ManualGuiaPage({ params }: Props) {
  const { clave, guia } = await params;
  if (!claveValida(clave)) notFound();

  const g = getGuia(guia);
  if (!g) notFound();

  return <ManualViewer guia={g} volverA={indiceHref(clave)} />;
}

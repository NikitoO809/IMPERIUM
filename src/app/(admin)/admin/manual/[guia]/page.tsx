// Manual de Atreia — una guía.
//
// Solo el Supremo, igual que el índice. El visor es de cliente porque el
// interruptor de idioma y el de PvE/PvP cambian sin recargar.
import { notFound } from "next/navigation";
import { requireSupremo } from "@/lib/admin";
import { getGuia } from "@/lib/manual";
import { ManualViewer } from "@/components/admin/ManualViewer";

export async function generateMetadata({ params }: { params: Promise<{ guia: string }> }) {
  const { guia } = await params;
  const g = getGuia(guia);
  return { title: g ? `${g.nombre} · Manual de Atreia` : "Manual de Atreia" };
}

export default async function ManualGuiaPage({ params }: { params: Promise<{ guia: string }> }) {
  await requireSupremo();

  const { guia } = await params;
  const g = getGuia(guia);
  if (!g) notFound();

  return <ManualViewer guia={g} />;
}

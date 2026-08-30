// La pasada diaria de noticias de Aion 2.
//
// Vercel llama aquí una vez al día (ver vercel.json): mira el canal oficial de
// Steam y deja de borrador, en el canal de oficiales, lo que no se hubiera
// visto ya. Publicar es cosa de un humano y su botón.
//
// La llave es CRON_SECRET, la misma que la limpieza del mercado.
import { proponerNoticiasNuevas } from "@/lib/discord-noticias";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const CRON_SECRET = (process.env.CRON_SECRET ?? "").trim();

export async function GET(req: Request) {
  if (!CRON_SECRET) {
    return Response.json({ error: "Falta CRON_SECRET." }, { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const resultado = await proponerNoticiasNuevas();
  if (resultado.error) console.error("[noticias]", resultado.error);
  console.log(`[noticias] ${resultado.propuestas} borradores de ${resultado.miradas} miradas`);
  return Response.json(resultado);
}

// La limpieza diaria del mercado.
//
// Vercel llama aquí una vez al día (ver vercel.json) y cierra las ofertas que
// ya han pasado de tiempo. Es lo que evita que el foro se llene de cosas que
// se vendieron hace un mes y nadie cerró.
//
// La puerta la guarda CRON_SECRET: Vercel manda esa clave en la cabecera al
// llamar a sus tareas programadas. Sin ella, esto no responde.
import { caducarOfertas } from "@/lib/discord-mercado";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CRON_SECRET = (process.env.CRON_SECRET ?? "").trim();

export async function GET(req: Request) {
  if (!CRON_SECRET) {
    return Response.json({ error: "Falta CRON_SECRET." }, { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const resultado = await caducarOfertas();
  if (resultado.error) console.error("[mercado] caducidad:", resultado.error);
  console.log(
    `[mercado] caducidad: ${resultado.cerradas} cerradas de ${resultado.revisadas} abiertas`
  );
  return Response.json(resultado);
}

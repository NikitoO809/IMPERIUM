// API del buscador. La usa el panel flotante (Ctrl+K) para traer resultados
// mientras escribes. Lee la sesión (cookies) → la RLS aplica igual que en el
// resto del sitio: el público solo ve lo publicado; el admin también borradores.
import { searchContent } from "@/lib/search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // depende de la sesión del usuario

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const limit = Number(searchParams.get("limit")) || 8;

  if (!q) {
    return Response.json({ results: [] });
  }

  const results = await searchContent(q, limit);
  return Response.json(
    { results },
    // El navegador puede cachear brevemente búsquedas idénticas seguidas.
    { headers: { "Cache-Control": "private, max-age=15" } }
  );
}

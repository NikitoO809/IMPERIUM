// El cliente de Claude, en un solo sitio.
//
// Lo usan el asistente de la web y el traductor de noticias del bot, y los dos
// necesitan lo mismo: la clave y, según de qué tipo sea, el espacio de trabajo.
//
// Anthropic tiene dos clases de clave. Las de toda la vida van atadas a un
// espacio de trabajo y no hay que decir nada más. Las nuevas, "ligadas a la
// identidad", pueden actuar en varios espacios, así que la API exige que se
// diga en cuál en cada petición: si no, contesta 400 pidiendo el
// `anthropic-workspace-id`. Por eso la variable de abajo.
import Anthropic from "@anthropic-ai/sdk";

// Solo hace falta con una clave ligada a la identidad. Con las otras se deja
// vacía y no estorba. Se saca de console.anthropic.com → Settings → Workspaces.
const WORKSPACE = (process.env.ANTHROPIC_WORKSPACE_ID ?? "").trim();

export const ANTHROPIC_LISTA = Boolean(process.env.ANTHROPIC_API_KEY);

export function clienteAnthropic(): Anthropic {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    ...(WORKSPACE ? { defaultHeaders: { "anthropic-workspace-id": WORKSPACE } } : {}),
  });
}

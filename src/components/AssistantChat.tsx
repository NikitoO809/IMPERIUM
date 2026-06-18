"use client";

// Chat del asistente IA (cliente). Cuatro estados:
//  - "chat": el usuario puede usarlo de verdad (Tester+ y bot activado).
//  - "waiting": tiene rango pero falta la clave de Anthropic (bot en espera).
//  - "locked-login": sin sesión → escaparate + "Entrar con Discord".
//  - "locked-rank": logueado pero Miembro → escaparate + "Pide rango Tester".
import { useRef, useState, type ReactNode } from "react";
import { Panel } from "@/components/hud";
import { LoginButton } from "@/components/auth/LoginButton";

// ── Render del texto del bot (markdown ligero) ───────────────────────────────
// Soporta: **negrita**, viñetas (-, –, •), enlaces markdown [texto](/ruta),
// URLs http(s) y rutas internas /juegos/... y separación por párrafos.
const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s)]+)|(\/juegos\/[^\s)]+)/g;

// Enlaces clicables dentro de un trozo de texto.
function renderLinks(text: string, kp: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    let label: string;
    let url: string;
    let trailing = "";
    if (m[1] && m[2]) {
      label = m[1];
      url = m[2];
    } else {
      url = (m[3] || m[4]) as string;
      const cut = url.match(/[.,;:!?)\]]+$/);
      if (cut) {
        trailing = cut[0];
        url = url.slice(0, -trailing.length);
      }
      label = url;
    }
    const external = url.startsWith("http");
    nodes.push(
      <a
        key={`${kp}-a${i++}`}
        href={url}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="text-accent underline underline-offset-2 transition hover:text-accent/80"
      >
        {label}
      </a>
    );
    if (trailing) nodes.push(trailing);
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

// Negritas **...** (con enlaces dentro) en una línea.
const BOLD_RE = /\*\*([^*]+)\*\*/g;
function renderInline(text: string, kp: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  BOLD_RE.lastIndex = 0;
  while ((m = BOLD_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(...renderLinks(text.slice(last, m.index), `${kp}-t${i}`));
    nodes.push(
      <strong key={`${kp}-b${i}`} className="font-semibold text-white/90">
        {renderLinks(m[1], `${kp}-bi${i}`)}
      </strong>
    );
    i++;
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(...renderLinks(text.slice(last), `${kp}-t${i}`));
  return nodes;
}

// Markdown ligero por bloques: párrafos, listas con viñetas y espaciado.
function renderMarkdown(text: string): ReactNode {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let k = 0;
  const flush = () => {
    if (!list.length) return;
    const items = list;
    list = [];
    const gi = k++;
    blocks.push(
      <ul key={`u${gi}`} className="my-1 space-y-1">
        {items.map((it, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="mt-[3px] text-accent/60">•</span>
            <span className="min-w-0 flex-1">{renderInline(it, `u${gi}i${idx}`)}</span>
          </li>
        ))}
      </ul>
    );
  };
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    const bm = line.match(/^\s*[-–•]\s+(.*)$/);
    if (bm) {
      list.push(bm[1]);
      continue;
    }
    flush();
    if (line.trim() === "") {
      blocks.push(<div key={`s${k++}`} className="h-1.5" />);
      continue;
    }
    const pi = k++;
    blocks.push(
      <p key={`p${pi}`} className="leading-relaxed">
        {renderInline(line, `p${pi}`)}
      </p>
    );
  }
  flush();
  return <div className="space-y-0.5">{blocks}</div>;
}

type Mode = "chat" | "waiting" | "locked-login" | "locked-rank";
type Msg = { role: "user" | "assistant"; content: string };
type HistoryItem = { q: string; a: string };

// Burbuja de mensaje (definida fuera del render para no recrear el componente).
function Bubble({ role, content, assistantName }: Msg & { assistantName: string }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-lg rounded-br-sm border border-brand/40 bg-brand/15 px-3.5 py-2 text-sm text-white/90">
          {content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className="max-w-[88%]">
        <div className="mb-1 flex items-center gap-1.5">
          <span className="grid h-5 w-5 place-items-center rounded bg-accent/20 text-[10px] text-accent">◆</span>
          <span className="hud-label text-[9px] text-accent/70">{assistantName}</span>
        </div>
        <div className="rounded-lg rounded-tl-sm border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm leading-relaxed text-white/75">
          {content ? renderMarkdown(content) : <span className="text-white/30">escribiendo…</span>}
        </div>
      </div>
    </div>
  );
}

export function AssistantChat({
  gameSlug,
  gameName,
  assistantName,
  mode,
  exampleQuestions,
  sample,
  dailyLimit,
  initialRemaining,
  initialHistory,
  discordInvite,
}: {
  gameSlug: string;
  gameName: string;
  assistantName: string;
  mode: Mode;
  exampleQuestions: string[];
  sample: { q: string; a: string };
  dailyLimit: number;
  initialRemaining: number | null;
  initialHistory: HistoryItem[];
  discordInvite?: string;
}) {
  const locked = mode === "locked-login" || mode === "locked-rank";
  const canChat = mode === "chat";

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(initialRemaining);
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);
  const outOfQuota = remaining !== null && remaining <= 0;
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Qué pregunta del historial estás viendo ahora (null = chat en vivo / nuevo).
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  // Abrir una entrada del historial: muestra la pregunta Y la respuesta guardada.
  function openExchange(item: HistoryItem) {
    setMessages([
      { role: "user", content: item.q },
      { role: "assistant", content: item.a || "(no se guardó la respuesta de esta pregunta)" },
    ]);
    setLoadedKey(item.q);
    scrollToEnd();
  }

  // Empezar de cero: limpia la conversación actual para una pregunta nueva.
  function newChat() {
    if (busy) return;
    setMessages([]);
    setLoadedKey(null);
    setInput("");
    inputRef.current?.focus();
  }

  function scrollToEnd() {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }

  async function send(question: string) {
    const q = question.trim();
    if (!q || busy || !canChat || outOfQuota) return;
    setInput("");
    // Si venías de ver una pregunta guardada, la nueva empieza de cero.
    const base: Msg[] = loadedKey ? [] : messages;
    if (loadedKey) setLoadedKey(null);
    const next: Msg[] = [...base, { role: "user", content: q }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setBusy(true);
    scrollToEnd();

    try {
      const res = await fetch("/api/asistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameSlug, messages: next }),
      });

      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        const err = (j as { error?: string }).error ?? "Algo ha fallado. Prueba otra vez.";
        if (res.status === 429) setRemaining(0);
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: `⚠️ ${err}` };
          return copy;
        });
        return;
      }

      // Actualiza el contador de cupo con lo que diga la cabecera.
      const rem = res.headers.get("X-Assistant-Remaining");
      if (rem !== null && rem !== "") setRemaining(Number(rem));

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
        scrollToEnd();
      }
      // Guarda la conversación (pregunta + respuesta) en el historial local.
      if (acc.trim()) {
        setHistory((h) => [{ q, a: acc }, ...h.filter((x) => x.q.toLowerCase() !== q.toLowerCase())].slice(0, 30));
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "⚠️ No he podido conectar. Revisa tu conexión e inténtalo otra vez." };
        return copy;
      });
    } finally {
      setBusy(false);
      scrollToEnd();
    }
  }

  // Conversación de muestra (se ve en el escaparate y como bienvenida).
  const sampleBubbles = (
    <div className="space-y-3">
      <Bubble role="user" content={sample.q} assistantName={assistantName} />
      <Bubble role="assistant" content={sample.a} assistantName={assistantName} />
    </div>
  );

  return (
    <div className={canChat ? "grid gap-4 lg:grid-cols-[clamp(220px,22vw,280px)_1fr]" : ""}>
      {/* Historial de preguntas (solo para quien puede usar el bot) */}
      {canChat && (
        <aside className="order-2 lg:order-1">
          <div className="flex max-h-[78vh] flex-col overflow-hidden rounded-lg border border-white/10 bg-black/20">
            <div className="border-b border-white/8 px-3 py-2.5">
              <span className="hud-label text-[10px] text-white/45">TUS PREGUNTAS</span>
            </div>
            {history.length === 0 ? (
              <p className="px-3 py-3 text-xs text-white/30">
                Aún no has preguntado nada. ¡Lánzate! Aquí guardaré tus preguntas y respuestas.
              </p>
            ) : (
              <ul className="space-y-0.5 overflow-y-auto p-1.5">
                {history.map((item, i) => {
                  const active = loadedKey !== null && item.q === loadedKey;
                  return (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => openExchange(item)}
                        title="Ver pregunta y respuesta"
                        className={`flex w-full items-start gap-1.5 rounded px-2 py-1.5 text-left text-xs transition ${
                          active
                            ? "bg-brand/20 text-white ring-1 ring-brand/40"
                            : "text-white/55 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className={`mt-0.5 ${active ? "text-accent" : "text-accent/40"}`}>💬</span>
                        <span className="line-clamp-2">{item.q}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>
      )}

      {/* Chat */}
      <Panel corners className={canChat ? "order-1 lg:order-2" : ""}>
      <div className="panel-inner flex h-[74vh] min-h-[560px] flex-col">
        {/* Cabecera */}
        <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
          <span className="grid h-8 w-8 place-items-center rounded bg-accent/15 text-accent">◆</span>
          <div className="min-w-0">
            <p className="font-title text-sm font-bold leading-tight">{assistantName}</p>
            <p className="hud-label text-[9px] text-white/40">Asistente IA · {gameName}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {canChat && (
              <button
                type="button"
                onClick={newChat}
                disabled={busy}
                className="btn-hud bg-white/8 px-2.5 py-1 text-white/70 transition hover:text-white disabled:opacity-50"
              >
                <span className="hud-label text-[9px]">+ Nuevo chat</span>
              </button>
            )}
            <span className="hidden hud-label text-[9px] text-white/30 sm:inline">Haiku 4.5</span>
          </div>
        </div>

        {/* Mensajes */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          {canChat && messages.length === 0 && sampleBubbles}
          {!canChat && sampleBubbles}
          {canChat && messages.map((m, i) => (
            <Bubble key={i} role={m.role} content={m.content} assistantName={assistantName} />
          ))}
        </div>

        {/* Chips de ejemplo (solo cuando aún no se ha escrito nada) */}
        {((canChat && messages.length === 0) || locked) && (
          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {exampleQuestions.map((q) => (
              <button
                key={q}
                type="button"
                disabled={!canChat || busy}
                onClick={() => send(q)}
                className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-xs text-white/55 transition enabled:hover:border-accent/40 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Zona inferior: input / candado / aviso */}
        <div className="border-t border-white/10 p-3">
          {canChat && (
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={busy || outOfQuota}
                  placeholder={
                    outOfQuota
                      ? "Has gastado tus preguntas de hoy. Vuelve mañana 👊"
                      : `Pregúntale a ${assistantName} sobre ${gameName}…`
                  }
                  className="flex-1 rounded-md border border-white/12 bg-black/40 px-3 py-2 text-sm text-white/90 outline-none placeholder:text-white/30 focus:border-accent/50 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim() || outOfQuota}
                  className="btn-hud bg-brand px-4 py-2 text-white disabled:opacity-50"
                >
                  <span className="hud-label text-[11px]">{busy ? "…" : "Enviar"}</span>
                </button>
              </form>
              <p className="mt-1.5 flex items-center justify-between gap-2 hud-label text-[9px] text-white/25">
                <span>{assistantName} responde solo con info de las guías</span>
                {remaining !== null && (
                  <span className={outOfQuota ? "text-amber-300/70" : "text-white/40"}>
                    te quedan {Math.max(remaining, 0)}/{dailyLimit} hoy
                  </span>
                )}
              </p>
            </>
          )}

          {mode === "waiting" && (
            <div className="rounded-md border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-center text-sm text-amber-100/90">
              🔧 El asistente está casi listo: falta activar la clave. ¡Vuelve pronto!
            </div>
          )}

          {mode === "locked-login" && (
            <div className="flex flex-col items-center gap-2 rounded-md border border-accent/25 bg-accent/5 px-4 py-3 text-center">
              <p className="text-sm text-white/70">🔒 Inicia sesión para desbloquear a {assistantName}</p>
              <LoginButton className="btn-hud bg-brand px-4 py-2 text-white">
                <span className="hud-label text-[11px]">Entrar con Discord</span>
              </LoginButton>
            </div>
          )}

          {mode === "locked-rank" && (
            <div className="flex flex-col items-center gap-2 rounded-md border border-sky-400/25 bg-sky-400/5 px-4 py-3 text-center">
              <p className="text-sm text-white/70">
                🔒 Necesitas el rango <span className="font-semibold text-sky-300">Tester</span> o superior para usar a {assistantName}
              </p>
              {discordInvite ? (
                <a
                  href={discordInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hud bg-white/10 px-4 py-2 text-white/80 hover:text-white"
                >
                  <span className="hud-label text-[11px]">Pídelo en Discord</span>
                </a>
              ) : (
                <p className="hud-label text-[9px] text-white/35">Pídeselo a un admin en el Discord</p>
              )}
            </div>
          )}
        </div>
      </div>
      </Panel>
    </div>
  );
}

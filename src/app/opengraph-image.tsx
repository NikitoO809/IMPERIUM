// Imagen que aparece al compartir el link (WhatsApp, Discord, Facebook…).
// Banner 1200×630 estilo HUD: fondo violeta/negro + dragón + texto.
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "IMPERIUM — Tu comunidad de juego";

export default async function OpengraphImage() {
  const dragon = await readFile(join(process.cwd(), "public/brand/dragon-trans.png"));
  const src = `data:image/png;base64,${dragon.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "linear-gradient(135deg,#0d0d14 0%,#1a1230 55%,#0d0d14 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={460} height={172} alt="" style={{ objectFit: "contain", marginBottom: 28 }} />
        <div style={{ display: "flex", fontSize: 92, fontWeight: 800, letterSpacing: 6, color: "#ffffff" }}>
          IMPERIUM
        </div>
        <div style={{ display: "flex", fontSize: 36, color: "#c9b8ff", marginTop: 10 }}>
          Guías, builds y asistente IA para tus juegos
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#7c5cff", marginTop: 26, letterSpacing: 6 }}>
          CALL OF DRAGONS · SWORD X STAFF · Y MÁS
        </div>
      </div>
    ),
    { ...size }
  );
}

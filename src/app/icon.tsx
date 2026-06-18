// Favicon generado: SOLO el dragón de IMPERIUM, fondo transparente (sin recuadro).
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const dragon = await readFile(join(process.cwd(), "public/brand/dragon-violeta.png"));
  const src = `data:image/png;base64,${dragon.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={64} height={47} alt="" style={{ objectFit: "contain" }} />
      </div>
    ),
    { ...size }
  );
}

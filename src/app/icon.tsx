// Favicon generado: las INICIALES "IMP" en violeta de marca, fondo TRANSPARENTE
// (sin recuadro). Se ve bien tanto en pestañas claras como oscuras.
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          fontFamily: "sans-serif",
          fontWeight: 900,
          fontSize: 38,
          lineHeight: 1,
          letterSpacing: -2,
          color: "#7c5cff",
          // Brillo HUD sutil para que las letras "resalten".
          textShadow: "0 0 6px rgba(124,92,255,0.55)",
        }}
      >
        IMP
      </div>
    ),
    { ...size }
  );
}

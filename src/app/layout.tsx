import type { Metadata } from "next";
import { Orbitron, Chakra_Petch, Inter } from "next/font/google";
import "./globals.css";

// Título principal: estilo sci-fi / videojuego
const title = Orbitron({
  variable: "--font-title-imperium",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

// Etiquetas de HUD, botones, números: tecnológica
const hud = Chakra_Petch({
  variable: "--font-hud-imperium",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Texto largo legible
const sans = Inter({
  variable: "--font-sans-imperium",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IMPERIUM — Guías de juego de la comunidad",
  description:
    "La comunidad de IMPERIUM. Guías interactivas, progreso compartido y jugadores en tiempo real. Empezamos por Call of Dragons.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${title.variable} ${hud.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

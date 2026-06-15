import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Display + cuerpo: grotesca premium (sistema neutro tipo Geist/Outfit).
const sans = Outfit({
  variable: "--font-sans-imperium",
  subsets: ["latin"],
});

// Display comparte familia (jerarquia por peso/tracking, no por fuente).
const title = sans;

// Numeros y datos: monoespaciada tecnica.
const mono = JetBrains_Mono({
  variable: "--font-mono-imperium",
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
      className={`${title.variable} ${mono.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

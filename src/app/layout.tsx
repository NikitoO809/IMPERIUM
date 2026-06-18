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

// URL pública del sitio. En Vercel se detecta sola (VERCEL_PROJECT_PRODUCTION_URL);
// si tienes dominio propio, ponlo en NEXT_PUBLIC_SITE_URL.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const SHARE_TITLE = "IMPERIUM — Tu comunidad de juego";
const SHARE_DESC = "Guías, builds y asistente IA para tus juegos. Únete a la comunidad.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "IMPERIUM",
  title: { default: SHARE_TITLE, template: "%s · IMPERIUM" },
  description: SHARE_DESC,
  openGraph: {
    type: "website",
    siteName: "IMPERIUM",
    locale: "es_ES",
    url: "/",
    title: SHARE_TITLE,
    description: SHARE_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: SHARE_DESC,
  },
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

import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "@/compartilhado/estilos/globals.css";
import { Provedores } from "./providers";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Navalha — SaaS para Barbearias",
  description: "Agenda, caixa, comissão e WhatsApp integrados.",
  manifest: "/manifest.json",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0F0D0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-theme="classico" suppressHydrationWarning>
      <body className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
        <Provedores>{children}</Provedores>
      </body>
    </html>
  );
}

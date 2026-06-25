import type { Metadata, Viewport } from "next";
import { AppShell } from "../components/AppShell";
import { BottomNav } from "../components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeoVIa",
  description: "Plataforma unificada de acesso digital ao transporte público.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f3f74",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppShell>{children}</AppShell>
        <BottomNav />
      </body>
    </html>
  );
}

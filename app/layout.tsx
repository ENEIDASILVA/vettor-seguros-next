import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VETTOR SEGUROS",
  description: "Proteção inteligente para você, sua família e seu patrimônio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
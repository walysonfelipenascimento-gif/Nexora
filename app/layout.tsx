import type { Metadata } from "next";
import "./app/globals.css";

export const metadata: Metadata = {
  title: "Nexora — Conectando pessoas, marcas e oportunidades",
  description:
    "Descubra criadores, conecte-se a marcas e encontre novas oportunidades na Nexora.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

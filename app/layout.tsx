import type { Metadata } from "next";
import "./app/globals.css";
import BrandIntro from "./components/BrandIntro";

export const metadata: Metadata = {
  title: "Nexora — Conectando pessoas, marcas e oportunidades",
  icons: { icon: "/nexora-logo.svg" },
  description:
    "Descubra criadores, conecte-se a marcas e encontre novas oportunidades na Nexora.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <BrandIntro />
        {children}
      </body>
    </html>
  );
}

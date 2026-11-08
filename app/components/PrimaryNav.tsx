"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSavedLanguage, translate, type NexoraLanguage } from "../../lib/i18n";

type NavItem = { id: string; label: string; href: string; icon: React.ReactNode };

const items: NavItem[] = [
  { id: "inicio", label: "Início", href: "/", icon: <><path d="m3 10 9-7 9 7"/><path d="M5 9v12h5v-7h4v7h5V9"/></> },
  { id: "reels", label: "Reels", href: "/reels", icon: <><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 8 6 4-6 4z"/><path d="m7 4 3 4M15 4l3 4"/></> },
  { id: "criar", label: "Criar", href: "/?action=create", icon: <path d="M12 5v14M5 12h14"/> },
  { id: "loja", label: "Loja", href: "/loja", icon: <><path d="M3 10h18l-1.4-5H4.4L3 10Z"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></> },
  { id: "perfil", label: "Perfil", href: "/perfil", icon: <><circle cx="12" cy="8" r="3.5"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></> },
];
const moreItems = [
  { id: "nexi", label: "Nexi IA", href: "/nexi", icon: "✦", description: "Assistente inteligente da Nexora" },
  { id: "loja", label: "Loja", href: "/loja", icon: "▣", description: "Vitrines, produtos e oportunidades" },
];

export default function PrimaryNav({ active }: { active: "inicio" | "reels" | "mensagens" | "perfil" | "loja" | "pulse" | "global" | "nexi" }) {
  const [language, setLanguage] = useState<NexoraLanguage>("pt-BR");
  const [moreOpen, setMoreOpen] = useState(false);
  useEffect(() => {
    setLanguage(getSavedLanguage());
    const updateLanguage = () => {
      setLanguage(getSavedLanguage());
    };
    window.addEventListener("nexora-language-change", updateLanguage);
    window.addEventListener("storage", updateLanguage);
    return () => {
      window.removeEventListener("nexora-language-change", updateLanguage);
      window.removeEventListener("storage", updateLanguage);
    };
  }, []);
  const labels: Record<string, string> = { inicio: "home", reels: "reels", criar: "create", loja: "store", perfil: "profile", pulse: "pulse", nexi: "nexi" };
  return <nav className="nexora-primary-nav" aria-label={translate(language, "mainNavigation")}>
    {items.map((item) => {
      const label = translate(language, labels[item.id] || item.id);
      return <Link key={item.id} href={item.href} onClick={() => { if (item.id === "mensagens") window.dispatchEvent(new Event("nexora-open-messages")); if (item.id === "criar") window.dispatchEvent(new Event("nexora-open-composer")); }} className={`nexora-nav-item ${item.id === active ? "active" : ""} ${item.id === "criar" ? "create" : ""}`} aria-current={item.id === active ? "page" : undefined} aria-label={label}>
        <span className="nexora-nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true">{item.icon}</svg></span>
        <span className="nexora-nav-label">{label}</span>
      </Link>;
    })}

  </nav>;
}

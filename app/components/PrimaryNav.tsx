"use client";

import Link from "next/link";

type NavItem = { id: string; label: string; href: string; icon: React.ReactNode };

const items: NavItem[] = [
  { id: "inicio", label: "Início", href: "/", icon: <><path d="m3 10 9-7 9 7"/><path d="M5 9v12h5v-7h4v7h5V9"/></> },
  { id: "reels", label: "Reels", href: "/reels", icon: <><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 8 6 4-6 4z"/><path d="m7 4 3 4M15 4l3 4"/></> },
  { id: "criar", label: "Criar", href: "/?action=create", icon: <path d="M12 5v14M5 12h14"/> },
  { id: "mensagens", label: "Mensagens", href: "/?tab=mensagens", icon: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-2 2v-6A7.5 7.5 0 1 1 20 11.5Z"/><path d="M7.5 11.5h.01M12 11.5h.01M16.5 11.5h.01"/></> },
  { id: "loja", label: "Loja", href: "/loja", icon: <><path d="M3 8h18l-1.4 12H4.4L3 8Z"/><path d="M7 8a5 5 0 0 1 10 0M9 12v.01M15 12v.01"/></> },
  { id: "perfil", label: "Perfil", href: "/perfil", icon: <><circle cx="12" cy="8" r="3.5"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></> },
];

export default function PrimaryNav({ active }: { active: "inicio" | "reels" | "perfil" | "loja" }) {
  return <nav className="nexora-primary-nav" aria-label="Navegação principal">
    {items.map((item) => <Link key={item.id} href={item.href} className={`nexora-nav-item ${item.id === active ? "active" : ""} ${item.id === "criar" ? "create" : ""}`} aria-current={item.id === active ? "page" : undefined} aria-label={item.label}>
      <span className="nexora-nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true">{item.icon}</svg></span>
      <span className="nexora-nav-label">{item.label}</span>
    </Link>)}
  </nav>;
}

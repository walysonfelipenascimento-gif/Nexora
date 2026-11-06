"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PrimaryNav from "../../components/PrimaryNav";

type Listing = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  link?: string;
  image?: string;
  variants?: string;
  sellerName?: string;
};

type StoreData = {
  listings?: Listing[];
  storeProfileName?: string;
  storeLogo?: string;
  storeOfficial?: boolean;
};

const money = (value: number) =>
  Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function PublicStorePreviewPage() {
  const [data, setData] = useState<StoreData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nexora-loja-local-v1");
      if (raw) setData(JSON.parse(raw) as StoreData);
    } catch {
      setData(null);
    }
    setLoaded(true);
  }, []);

  const storeName = data?.storeProfileName?.trim() || "Minha loja Nexora";
  const products = useMemo(
    () => (data?.listings || []).filter((item) => item.sellerName === storeName),
    [data, storeName]
  );

  return (
    <main style={{ minHeight: "100dvh", padding: "24px 16px 110px", color: "#f7f9ff", background: "radial-gradient(ellipse at 10% 0%,#123e6440,transparent 38%),#080b14", fontFamily: "Inter,system-ui,sans-serif" }}>
      <style jsx global>{`
        .public-store-wrap{max-width:960px;margin:0 auto}
        .public-store-card{border:1px solid #ffffff18;border-radius:20px;background:linear-gradient(160deg,#141e30,#0c111d);overflow:hidden}
        .public-store-button{display:inline-flex;align-items:center;justify-content:center;padding:11px 15px;border-radius:12px;border:1px solid #64dfff55;background:#12283b;color:#dffaff;text-decoration:none;font-size:12px;font-weight:750}
        .public-store-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}
        @media(max-width:700px){.public-store-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:430px){.public-store-grid{grid-template-columns:1fr}}
      `}</style>
      <div className="public-store-wrap">
        <Link href="/loja" style={{ color: "#9feaff", textDecoration: "none", fontSize: 12 }}>← Voltar à Nexora Loja</Link>
        {!loaded ? <p style={{ color: "#aebbd0", marginTop: 30 }}>Carregando vitrine…</p> : (
          <>
            <section className="public-store-card" style={{ marginTop: 18, padding: 22, background: "linear-gradient(125deg,#12304a,#17152d 68%,#32163c)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 15, flexWrap: "wrap" }}>
                {data?.storeLogo ? <img src={data.storeLogo} alt={"Logo de " + storeName} style={{ width: 76, height: 76, objectFit: "cover", borderRadius: 20, border: "1px solid #ffffff30" }} /> : <div style={{ width: 76, height: 76, borderRadius: 20, display: "grid", placeItems: "center", background: "linear-gradient(135deg,#4ddfff,#8667ff)", color: "#08111d", fontSize: 30, fontWeight: 900 }}>N</div>}
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ color: "#7deaff", fontSize: 10, letterSpacing: 2, fontWeight: 850 }}>VITRINE NEXORA</div>
                  <h1 style={{ fontSize: "clamp(25px,5vw,38px)", margin: "7px 0" }}>{storeName}</h1>
                  <div style={{ color: "#aebbd0", fontSize: 11 }}>{data?.storeOfficial ? "Loja oficial · aguardando análise" : "Vendedor independente"} · Verificação pendente</div>
                </div>
              </div>
              <p style={{ color: "#bdc9dc", fontSize: 13, lineHeight: 1.7, maxWidth: 650, margin: "18px 0" }}>Conheça os produtos e opções desta loja na comunidade Nexora.</p>
              <span style={{ display: "inline-block", padding: "7px 10px", borderRadius: 999, background: "#ffffff0d", border: "1px solid #ffffff20", color: "#b9d8ed", fontSize: 10 }}>Prévia local · não visível para outros usuários</span>
            </section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, margin: "25px 0 13px" }}>
              <h2 style={{ margin: 0, fontSize: 19 }}>Produtos da loja</h2>
              <span style={{ color: "#91a4bd", fontSize: 11 }}>{products.length} anúncio(s)</span>
            </div>
            {products.length ? <section className="public-store-grid">
              {products.map((item) => <article className="public-store-card" key={item.id}>
                {item.image ? <img src={item.image} alt={item.name} style={{ width: "100%", height: 175, objectFit: "cover" }} /> : <div style={{ height: 145, display: "grid", placeItems: "center", background: "linear-gradient(135deg,#172f48,#33204e)", fontSize: 42 }}>✦</div>}
                <div style={{ padding: 14 }}>
                  <div style={{ color: "#83e4ff", fontSize: 9, textTransform: "uppercase", letterSpacing: 1 }}>{item.category}</div>
                  <h3 style={{ fontSize: 15, margin: "8px 0" }}>{item.name}</h3>
                  <p style={{ minHeight: 42, color: "#aebbd0", fontSize: 11, lineHeight: 1.55 }}>{item.description}</p>
                  {item.variants && <p style={{ color: "#9cecff", fontSize: 10, lineHeight: 1.5 }}>Opções: {item.variants}</p>}
                  <strong style={{ display: "block", fontSize: 18, margin: "10px 0" }}>{money(item.price)}</strong>
                  <a className="public-store-button" href={item.link || "#"} onClick={(event) => { if (!item.link) { event.preventDefault(); window.location.href = "/?tab=mensagens&loja=" + encodeURIComponent(storeName) + "&pedido=" + encodeURIComponent("Olá! Tenho interesse em " + item.name + ".\nOpções: " + (item.variants || "A combinar") + "\nQuantidade: 1. Pode confirmar disponibilidade e entrega?"); } }} target={item.link ? "_blank" : undefined} rel={item.link ? "noreferrer" : undefined}>{item.link ? "Ver produto ↗" : "Consultar pelo chat"}</a>
                </div>
              </article>)}
            </section> : <section className="public-store-card" style={{ padding: 25, textAlign: "center", color: "#aebbd0", fontSize: 12 }}>
              Ainda não há anúncios desta loja nesta prévia. Cadastre o nome da loja e os produtos em <Link href="/loja" style={{ color: "#7deaff" }}>Minha Nexora Loja</Link>.
            </section>}
            <p style={{ color: "#8292a9", fontSize: 10, lineHeight: 1.7, marginTop: 22 }}>Esta vitrine usa os dados salvos neste navegador. Para que outros usuários vejam a loja, será necessário conectar perfis e produtos a um backend compartilhado e aplicar as regras de publicação e moderação.</p>
          </>
        )}
      </div>
      <PrimaryNav active="loja" />
    </main>
  );
}
